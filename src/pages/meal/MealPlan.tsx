import { useEffect, useState } from "react";
import api from "@/api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Meal } from "@/types/meal";
import fallback from "@/assets/meal.png";
import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";

// not correctly identify the correct meal, meal id
const MealLibraryComponent = () => {
  const { t } = useTranslation();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<
    { meal: Meal; multiplier: number }[]
  >([]);
  const [mealDescription, setMealDescription] = useState(
    t("A healthy and balanced meal plan for the child.")
  );
  const [loading, setLoading] = useState(true);
  console.log(loading);
  const [error, setError] = useState<string | null>(null);
  console.log(error);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { data: children } = useSelector((state: RootState) => state.children);
  const { specialists } = useSelector((state: RootState) => state.specialists);
  const { id: paramId } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await api.get("meal/find-all?skip=0&limit=100");
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

  const sumNutrients = () => {
    const result = {
      totalVolume: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      calories: 0,
      iron: 0,
      calcium: 0,
      vitaminA: 0,
      vitaminD: 0,
    };

    selectedMeals.forEach(({ meal, multiplier }) => {
      result.totalVolume += (meal.totalVolume || 0) * multiplier;
      meal.totalNutrients?.forEach((nutrient) => {
        const name = nutrient.name.toLowerCase();
        const amount = nutrient.amount || 0;
        if (name.includes("protein")) result.protein += amount * multiplier;
        else if (name.includes("fat")) result.fat += amount * multiplier;
        else if (name.includes("carb")) result.carbs += amount * multiplier;
        else if (name.includes("calorie"))
          result.calories += amount * multiplier;
        else if (name.includes("iron")) result.iron += amount * multiplier;
        else if (name.includes("calcium"))
          result.calcium += amount * multiplier;
        else if (name.includes("vitamin a"))
          result.vitaminA += amount * multiplier;
        else if (name.includes("vitamin d"))
          result.vitaminD += amount * multiplier;
      });
    });

    return result;
  };

  const handleConfirmMealPlan = async () => {
    if (!children.length) return navigate("/children");

    const payload = {
      expertId: specialists[0]?.id + "",
      childId: paramId, //child id from params
      meal_description: mealDescription,
      calories: sumNutrients().calories,
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

  return (
    <div className="p-4 max-w-3xl mx-auto text-white space-y-6">
      <h1 className="text-2xl font-bold text-emerald-400">
        🍽️ {t("Create Meal Plan")}
      </h1>

      <textarea
        className="w-full p-2 bg-gray-800 text-white rounded"
        rows={2}
        value={mealDescription}
        onChange={(e) => setMealDescription(e.target.value)}
        placeholder={t("Describe the meal plan...")}
      />

      {selectedMeals.length > 0 && (
        <div className="bg-emerald-900/10 p-4 rounded">
          <h2 className="text-lg font-bold text-emerald-300 mb-2">
            📊 Total Nutrients
          </h2>
          <ul className="text-sm space-y-1">
            <li>Total Volume: {nutrientTotals.totalVolume} ml</li>
            <li>Protein: {nutrientTotals.protein.toFixed(2)} g</li>
            <li>Fat: {nutrientTotals.fat.toFixed(2)} g</li>
            <li>Carbohydrates: {nutrientTotals.carbs.toFixed(2)} g</li>
            <li>Calories: {nutrientTotals.calories.toFixed(2)} kcal</li>
            <li>Iron: {nutrientTotals.iron.toFixed(2)} mg</li>
            <li>Calcium: {nutrientTotals.calcium.toFixed(2)} mg</li>
            <li>Vitamin A: {nutrientTotals.vitaminA.toFixed(2)} IU</li>
            <li>Vitamin D: {nutrientTotals.vitaminD.toFixed(2)} IU</li>
          </ul>
        </div>
      )}

      {/* Meals List - Keep rest unchanged */}
      {meals.map((meal) => {
        const selected = selectedMeals.find((m) => m.meal.id === meal.id);
        console.log({ selected });
        const expanded = expandedMealId === meal.id;

        return (
          <div
            key={meal.id}
            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
              selected
                ? "border-emerald-400 bg-emerald-800/10"
                : "border-gray-700 bg-[#111827]"
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
                  target.onerror = null; // prevent infinite loop
                  target.src = `${fallback}`;
                }}
              />

              <div className="flex-1 justify-between">
                <h2 className="text-lg font-bold text-emerald-300">
                  {meal.name}
                </h2>

                <p className="text-xs text-gray-400 italic">
                  Age: {meal.ageGroup} m+ · {meal.mealType} · {meal.mealTime}
                </p>
                <div className=" flex mt-2">
                  <div className="text-green-600 ml-2 text-sm  font-serif">
                    <Eye />
                  </div>

                  <span className=" text-green-600 ml-1 text-sm  underline font-serif">
                    View
                  </span>
                </div>
              </div>
            </div>

            {expanded && (
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <strong>Description:</strong> {meal.description}
                </p>
                <p>
                  <strong>Meal Type:</strong> {meal.mealType}
                </p>
                <p>
                  <strong>Meal Time:</strong> {meal.mealTime}
                </p>
                <p>
                  <strong>Prepping Time:</strong> {meal.prepTime ?? "N/A"}
                </p>
                <p>
                  <strong>Yield Volume:</strong> {meal.totalVolume ?? "N/A"} ml
                </p>
                <p>
                  <strong>Allergen Description:</strong>{" "}
                  {meal.allergenDescription}
                </p>
                <p>
                  <strong>Intolerance Description:</strong>{" "}
                  {meal.intoleranceDescription}
                </p>
                <p>
                  <strong>Drug Interaction:</strong> {meal.drugInteraction}
                </p>
                <p>
                  <strong>Direction:</strong> {meal.direction}
                </p>
                <p>
                  <strong>How to Store:</strong> {meal.howToStore}
                </p>
                <p>
                  <strong>Ingredients:</strong>
                </p>
                <ul className="list-disc list-inside ml-4">
                  {meal?.mealIngredients?.length ? (
                    meal.mealIngredients.map((mi) => (
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
                <p>
                  <strong>Nutrients:</strong>
                </p>
                <ul className="list-disc list-inside ml-4">
                  {meal?.totalNutrients?.length ? (
                    meal.totalNutrients.map((n) => (
                      <li key={n.id}>
                        {n.name ?? "Unknown Nutrient"} ({n.amount ?? 0}{" "}
                        {n.unit ?? ""})
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 italic">
                      No nutrients available
                    </li>
                  )}
                </ul>
                <div className="flex gap-2 items-center mt-2">
                  <label className="text-sm text-gray-300">Multiplier:</label>
                  <input
                    type="number"
                    min={1}
                    className="w-16 text-black px-2 py-1 rounded"
                    value={selected?.multiplier ?? 1}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      handleMultiplierChange(meal.id, parseInt(e.target.value))
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
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {selected ? "Remove" : "Add"}
              </button>
            </div>
          </div>
        );
      })}

      {/* ... */}

      <button
        onClick={handleConfirmMealPlan}
        disabled={submitting || selectedMeals.length === 0}
        className={`w-full py-3 rounded-lg text-white text-lg font-semibold transition-all ${
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
