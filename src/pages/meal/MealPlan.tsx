import { useEffect, useState } from "react";
import api from "@/api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Meal } from "@/types/meal";
import fallback from "@/assets/meal.png";
import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";

const MealLibraryComponent = () => {
  const { t } = useTranslation();
  const [meals, setMeals] = useState<any[]>([]);
  console.log({ meals });
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<
    { meal: any; multiplier: number }[]
  >([]);

  const [mealDescription, setMealDescription] = useState(
    t("A healthy and balanced meal plan for the child.")
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(""); // selected meal time tab
  // --- New state for date-time picker ---
  const [selectedDateTime, setSelectedDateTime] = useState<string>("");
  const [dateSelected, setDateSelected] = useState(false);
  const navigate = useNavigate();
  const { data: children } = useSelector((state: RootState) => state.children);
  const { specialists } = useSelector((state: RootState) => state.specialists);
  const { id: paramId } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await api.get("meal/find-all?skip=0&limit=1000");
        const responseData = Array.isArray(res.data)
          ? res.data
          : res.data?.data;
        setMeals(responseData || []);
      } catch (err) {
        console.error("Error fetching meals:", err);
        setError(t("Could not load meals. Please try again."));
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [t]);

  useEffect(() => {
    if (meals.length > 0 && !activeTab) {
      const uniqueTimes = Array.from(
        new Set(meals.flatMap((m) => m.mealTimes || []))
      );
      if (uniqueTimes.length > 0) {
        setActiveTab(uniqueTimes[0]);
      }
    }
  }, [meals, activeTab]);

  const toggleMealExpand = (mealId: string) => {
    setExpandedMealId((prev) => (prev === mealId ? null : mealId));
  };

  const toggleMeal = (meal: Meal) => {
    setSelectedMeals((prev) => {
      const exists = prev.find((m) => m.meal.id === meal.id);
      return exists
        ? prev.filter((m) => m.meal.id !== meal.id)
        : [...prev, { meal, multiplier: 1 }];
    });
  };

  const handleMultiplierChange = (mealId: string, value: number) => {
    setSelectedMeals((prev) =>
      prev.map((m) =>
        m.meal.id === mealId ? { ...m, multiplier: Math.max(1, value) } : m
      )
    );
  };

  // collect all unique meal times for tabs
  const allMealTimess = Array.from(
    new Set(meals?.flatMap((plan) => plan.mealTimes || []))
  );

  // Filter meals based on active tab
  const filteredMeals = activeTab
    ? meals.filter((meal) => meal.mealTimes?.includes(activeTab))
    : meals;

  const sumNutrients = () => {
    const totals: Record<string, { amount: number; unit?: string }> = {};
    let totalVolume = 0;

    selectedMeals.forEach(({ meal, multiplier }) => {
      const mealYieldVolume = calculateYieldVolume(meal);
      totalVolume += mealYieldVolume * multiplier;

      const mealNutrients = calculateMealNutrients(meal);
      for (const [name, { amount, unit }] of Object.entries(mealNutrients)) {
        if (!totals[name]) totals[name] = { amount: 0, unit };
        totals[name].amount += amount * multiplier;
      }
    });

    return { totalVolume, nutrients: totals };
  };

  // Get current date/time formatted for datetime-local input
  const getMinDateTime = () => {
    const now = new Date();
    now.setSeconds(0, 0); // remove seconds & milliseconds for compatibility
    const localISOTime = now.toISOString().slice(0, 16); // e.g., "2025-10-28T14:30"
    return localISOTime;
  };

  const calculateYieldVolume = (meal: any) => {
    return (
      meal?.mealIngredients?.reduce((acc: number, item: any) => {
        const ing = item.ingredient;
        const type = ing?.portionUnit?.type?.toLowerCase();
        const quantity = item.quantity ?? 0;
        const conversion = ing?.portionUnit?.conversionToBase ?? 1;
        let volume = 0;
        if (type === "mass") {
          const mass = quantity * conversion;
          if (ing?.density && ing.density > 0) {
            volume = mass / ing.density;
          }
        } else if (type === "volume") {
          volume = quantity * conversion;
        }
        return acc + volume;
      }, 0) ?? 0
    );
  };

  const calculateMealNutrients = (meal: any) => {
    const nutrientsByType: Record<string, { amount: number; unit?: string }> =
      {};

    meal?.mealIngredients?.forEach((item: any) => {
      const ing = item.ingredient;
      const conversionToBase = ing?.portionUnit?.conversionToBase ?? 1;
      const portionSize = ing?.portionSize ?? 1;
      const quantity = item.quantity ?? 1;

      ing?.nutrientAmounts?.forEach((na: any) => {
        const nutrientType = (na?.nutrient?.name || "other").toLowerCase();
        const unit = na?.nutrient?.unit || "";
        const adjustedAmount =
          na.amount * (quantity / portionSize) * conversionToBase;

        if (!nutrientsByType[nutrientType])
          nutrientsByType[nutrientType] = { amount: 0, unit };
        nutrientsByType[nutrientType].amount += adjustedAmount;
      });
    });

    return nutrientsByType;
  };

  const handleConfirmMealPlan = async () => {
    if (!children.length) return navigate("/children");
    const payload = {
      expertId: specialists[0]?.id + "",
      childId: paramId,
      meal_description: mealDescription,
      calories: sumNutrients().nutrients,
      meal_date: new Date(selectedDateTime), // send selected date-time
      meals: selectedMeals.map(({ meal, multiplier }) => ({
        id: meal.id,
        multiplier,
      })),
    };
    try {
      setSubmitting(true);
      await api.post("/meal-plans/create", payload);
      setSelectedMeals([]);
      navigate(`/mealplansummary/${paramId}`);
    } catch (error) {
      console.error("Submit failed:", error);
      alert(t("Something went wrong. Try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const nutrientTotals = sumNutrients();

  // console.log({ nutrientTotals });

  // --- Render Date-Time Picker First ---
  if (!dateSelected) {
    return (
      <div className="min-h-screen bg-gray-800">
        <div className="bg-[#013222] px-6 pt-6 pb-12 flex justify-center items-center">
          <h2 className="text-2xl font-bold text-emerald-400">
            {t("Select Meal Date & Time")}
          </h2>
        </div>

        <div className="p-6 max-w-md bg-[#0B364F] rounded-lg text-white space-y-12 mx-2 pb-12 pt-12 mt-12">
          <label
            htmlFor="datetime-local"
            className="py-2 text-emerald-400 font-serif"
          >
            {t("Select meal date")}
          </label>

          <input
            type="datetime-local"
            id="datetime-local"
            className="w-full p-2 rounded bg-[#0d778f] text-white"
            placeholder="Select meal date"
            value={selectedDateTime}
            onChange={(e) => setSelectedDateTime(e.target.value)}
            min={getMinDateTime()} // ✅ disables past dates & times
          />

          <button
            disabled={!selectedDateTime}
            onClick={() => setDateSelected(true)}
            className={`w-full py-2 rounded text-white font-semibold transition-all ${
              !selectedDateTime
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {t("Continue")}
          </button>
        </div>
      </div>
    );
  }

  // --- Main Meal Library UI ---
  return (
    <div className="min-h-screen bg-gray-800">
      <div className="bg-[#013222] p-4">
        <h1 className="text-2xl font-bold text-emerald-400">
          🍽️ {t("Create Meal Plan")}
        </h1>
      </div>
      <div className="">
        {/* Meal Time Tabs */}
        <ul className="bg-[#013222] pl-3 pt-4 pb-1.5 flex flex-wrap text-sm font-medium text-center border-b border-gray-200">
          {allMealTimess.map((time) => (
            <li key={time} className="">
              <button
                onClick={() => setActiveTab(time)}
                className={`py-1 px-2 text-[18px] font-normal whitespace-nowrap mx-auto w-full rounded-sm ${
                  activeTab === time
                    ? "bg-[#0B8FAC] text-white" // filled style
                    : " text-gray-200 text-xl font-extrabold" // outline style
                } rounded-lg`}
              >
                {time}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-4 max-w-3xl mx-auto text-white space-y-6 mt-2">
        <textarea
          className="w-full p-2 bg-[#0B364F] text-white rounded"
          rows={2}
          value={mealDescription}
          onChange={(e) => setMealDescription(e.target.value)}
          placeholder={t("Describe the meal plan...")}
        />
        {selectedMeals.length > 0 && (
          <div className="bg-[#0d778f] p-4 rounded">
            <h2 className="text-lg font-bold text-emerald-300 mb-2">
              📊 {t("Total Nutrients")}
            </h2>
            <ul className="text-sm space-y-1">
              <li className="text-gray-100">
                <strong>Total Volume:</strong>{" "}
                {nutrientTotals.totalVolume.toFixed(2)} ml
              </li>
              {Object.entries(nutrientTotals.nutrients).length > 0 ? (
                Object.entries(nutrientTotals.nutrients).map(
                  ([name, { amount }]) => (
                    <li key={name} className="text-gray-100">
                      {name}:{" "}
                      <span className="text-emerald-300">
                        {amount.toFixed(2)}
                      </span>
                    </li>
                  )
                )
              ) : (
                <li className="text-gray-400 italic">No nutrients available</li>
              )}
            </ul>
          </div>
        )}
        {loading ? (
          <p className="text-center text-gray-300">Loading meals...</p>
        ) : error ? (
          <p className="text-center text-red-400">{error}</p>
        ) : filteredMeals.length === 0 ? (
          <p className="text-center text-gray-300">
            No meals available for this tab.
          </p>
        ) : (
          filteredMeals.map((meal) => {
            const selected = selectedMeals.find((m) => m.meal.id === meal.id);
            const expanded = expandedMealId === meal.id;

            // ✅ compute yield volume for this specific meal
            const yieldVolume = calculateYieldVolume(meal);

            const mealTimesDisplay = Array.isArray(meal.mealTimes)
              ? meal.mealTimes.join(", ")
              : meal.mealTimes || "N/A";
            return (
              <div
                key={meal.id}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer border-gray-700 shadow-sm ${
                  selected ? "bg-[#0d778f]" : "bg-[#0B8FAC]"
                }`}
                onClick={() => toggleMealExpand(meal.id)}
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={
                      typeof meal.imageUrl === "string" &&
                      meal.imageUrl.startsWith("http")
                        ? meal.imageUrl
                        : `${fallback}`
                    }
                    alt={meal.name}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-700"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.onerror = null;
                      target.src = `${fallback}`;
                    }}
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-emerald-300">
                      {meal.name}
                    </h2>
                    <p className="text-xs text-white italic">
                      Age: {meal.ageGroup} m+ · {meal.mealType} ·{" "}
                      {mealTimesDisplay}
                    </p>
                    <div className="flex mt-2 items-center">
                      <Eye className="h-4 w-4 text-gray-300 ml-2" />
                      <span className="text-gray-300 ml-1 text-sm underline font-serif">
                        View
                      </span>
                    </div>
                  </div>
                </div>
                {expanded && (
                  <div className="mt-4 space-y-2 text-sm bg-[#D9D9D94D] p-4 rounded-lg">
                    <p className="text-gray-100">
                      <strong>Description:</strong> {meal.description}
                    </p>
                    <p className="text-gray-100">
                      <strong>Meal Type:</strong> {meal.mealType}
                    </p>
                    <p className="text-gray-100">
                      <strong>Meal Time:</strong> {mealTimesDisplay}
                    </p>
                    <p className="text-gray-100">
                      <strong>Prepping Time:</strong> {meal.prepTime ?? "N/A"}
                    </p>
                    <p className="text-gray-100">
                      <strong>Yield Volume:</strong>{" "}
                      {yieldVolume.toFixed(2) ?? "N/A"} ml
                    </p>
                    <p className="text-gray-100">
                      <strong>Allergen Description:</strong>{" "}
                      {meal.allergenDescription}
                    </p>
                    <p className="text-gray-100">
                      <strong>Intolerance Description:</strong>{" "}
                      {meal.intoleranceDescription}
                    </p>
                    <p className="text-gray-100">
                      <strong>Drug Interaction:</strong> {meal.drugInteraction}
                    </p>
                    <p className="text-gray-100">
                      <strong>Direction:</strong> {meal.direction}
                    </p>
                    <p className="text-gray-100">
                      <strong>How to Store:</strong> {meal.howToStore}
                    </p>
                    <p className="text-gray-100">
                      <strong>Ingredients:</strong>
                    </p>
                    <ul className="list-disc list-inside ml-4">
                      {meal?.mealIngredients?.length ? (
                        meal.mealIngredients.map((mi: any) => (
                          <li key={mi.id}>
                            {mi.quantity}{" "}
                            {mi.ingredient?.portionUnit?.abbreviation ?? ""} of{" "}
                            {mi.ingredient?.name ?? "Unknown"}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400 italic">
                          No ingredients available
                        </li>
                      )}
                    </ul>
                    <p className="text-gray-100">
                      <strong>Nutrients:</strong>
                    </p>
                    <ul className="list-disc list-inside ml-4">
                      {(() => {
                        const nutrientsByType = calculateMealNutrients(meal);
                        const entries = Object.entries(nutrientsByType);
                        return entries.length ? (
                          entries.map(([name, { amount }]) => (
                            <li key={name}>
                              {name} –{" "}
                              <span className="text-emerald-300">
                                {amount.toFixed(2)}
                              </span>
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-400 italic">
                            No nutrients available
                          </li>
                        );
                      })()}
                    </ul>

                    <div className="flex gap-2 items-center mt-2">
                      <label className="text-sm text-gray-100">
                        Multiplier:
                      </label>
                      <input
                        type="number"
                        min={1}
                        disabled={!selected}
                        className="w-16 text-black px-2 py-1 bg-gray-300 rounded disabled:bg-gray-600 disabled:cursor-not-allowed"
                        value={selected?.multiplier ?? 1}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleMultiplierChange(
                            meal.id,
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                )}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMeal(meal);
                    }}
                    className={`text-xs px-4 py-1.5 rounded font-semibold transition-all ${
                      selected
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-teal-300 text-black hover:bg-blue-600"
                    }`}
                  >
                    {selected ? "Remove" : "Add"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <button
        onClick={handleConfirmMealPlan}
        disabled={submitting || selectedMeals.length === 0}
        className={`fixed bottom-16 left-4 z-50 w-[320px] mx-3 py-3  rounded-lg text-white text-lg font-semibold transition-all shadow-lg ${
          submitting || selectedMeals.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        {submitting ? t("Submitting...") : `✅ ${t("Confirm Meal Plan")}`}
      </button>
    </div>
  );
};

export default MealLibraryComponent;
