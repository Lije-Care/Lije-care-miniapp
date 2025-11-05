import { useEffect, useState } from "react";
import api from "@/api/axios";
import fallback from "@/assets/meal.png";
import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";

const AllMealPage = () => {
  const { t } = useTranslation();
  const [meals, setMeals] = useState<any[]>([]);
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
  const [selectedMeals] = useState<{ meal: any; multiplier: number }[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await api.get(`meal/find-all?skip=${1}&limit=${1000}`);
        const responseData = Array.isArray(res.data)
          ? res.data
          : res.data?.data;
        setMeals(responseData || []);
        const totalCount = res?.data?.meta?.total || 0;
        setTotalCount(totalCount);
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

  const allMealTimess = Array.from(
    new Set(meals?.flatMap((plan) => plan.mealTimes || []))
  );

  const filteredMeals = activeTab
    ? meals.filter((meal) => meal.mealTimes?.includes(activeTab))
    : meals;

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

  // ✅ Nutrient calculator (per meal)
  const calculateMealNutrients = (meal: any) => {
    const nutrientsByType: Record<string, { amount: number; unit?: string }> =
      {};

    meal?.mealIngredients?.forEach((item: any) => {
      const ing = item.ingredient;
      const portionSize = ing?.portionSize ?? 1;
      const quantity = item.quantity ?? 1;

      ing?.nutrientAmounts?.forEach((na: any) => {
        const nutrientType = (na?.nutrient?.name || "other").toLowerCase();
        const unit = na?.nutrient?.unit || "";
        const adjustedAmount = na.amount * (quantity / portionSize);

        if (!nutrientsByType[nutrientType])
          nutrientsByType[nutrientType] = { amount: 0, unit };

        nutrientsByType[nutrientType].amount += adjustedAmount;
      });
    });

    return nutrientsByType;
  };

  return (
    <div className="min-h-screen w-full bg-gray-800">
      {/* Tabs */}
      <div className="bg-[#013222]">
        <div className="flex justify-between items-center px-4 py-3 bg-[#013222] border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{t("All Meals")}</h2>
          <span className="text-gray-300 text-sm">
            {t("Total Meals")}:{" "}
            <span className="font-semibold text-emerald-400">{totalCount}</span>
          </span>
        </div>
        <div className="w-full py-2 flex flex-between rounded-lg bg-[#013222]">
          {allMealTimess.map((time) => (
            <button
              key={time}
              className={`py-1 px-2 text-[15px] font-normal whitespace-nowrap mx-auto w-full ${
                activeTab === time
                  ? "bg-[#0B8FAC] text-white"
                  : "text-gray-200 text-xl font-extrabold"
              } rounded-lg`}
              onClick={() => setActiveTab(time)}
              title={`Filter by ${time}`}
            >
              {time.charAt(0).toUpperCase() + time.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Meal Cards */}
      <div className="px-4 mt-4 text-white space-y-6">
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
            const yieldVolume = calculateYieldVolume(meal);
            const mealTimesDisplay = Array.isArray(meal.mealTimes)
              ? meal.mealTimes.join(", ")
              : meal.mealTimes || "N/A";

            const nutrientsByType = calculateMealNutrients(meal); // ✅ calculate here

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

                    {/* ✅ Ingredients with nutrients */}
                    <div className="mt-3 ">
                      <p className="text-gray-100 font-semibold underline py-2">
                        Ingredients & Nutrients:
                      </p>
                      <ul className="list-disc list-inside ml-4 space-y-5">
                        {meal?.mealIngredients?.length ? (
                          meal.mealIngredients.map((item: any) => {
                            const ing = item.ingredient;

                            return (
                              <li key={item.id}>
                                <span className="font-semibold text-emerald-300 ">
                                  {item.quantity}{" "}
                                  {ing?.portionUnit?.abbreviation ?? ""} of{" "}
                                  {ing?.name ?? "Unknown"}
                                </span>
                                <br />

                                {/* Nutrients per ingredient */}
                                <span className="pt-4 underline text-base font-black">
                                  Nutrients
                                </span>
                                {ing?.nutrientAmounts?.length > 0 && (
                                  <ul className="list-disc ml-5 text-gray-200">
                                    {ing.nutrientAmounts.map((na: any) => {
                                      const adjustedAmount =
                                        na.amount *
                                        ((item.quantity ?? 1) /
                                          (ing.portionSize ?? 1));
                                      return (
                                        <li key={na.id}>
                                          <span className="text-emerald-200">
                                            {na.nutrient.name}:
                                          </span>{" "}
                                          ({na.amount} × {item.quantity}/
                                          {ing.portionSize}) ={" "}
                                          <strong>
                                            {adjustedAmount.toFixed(2)}{" "}
                                          </strong>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}
                              </li>
                            );
                          })
                        ) : (
                          <li className="text-gray-200 italic">
                            No ingredients available
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* ✅ Per Meal Nutritional Summary */}
                    <div className="bg-[#013222] text-white text-sm p-4 mt-4 rounded-lg">
                      <h3 className="text-lg font-bold mb-2">
                        Total Nutritional Summary
                      </h3>
                      <ul className="list-disc list-inside">
                        {Object.entries(nutrientsByType).map(
                          ([name, { amount }]) => (
                            <li key={name}>
                              {name}:{" "}
                              <span className="text-emerald-300">
                                {amount.toFixed(2)}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AllMealPage;
