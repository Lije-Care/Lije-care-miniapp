import { useEffect, useState } from "react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Meal } from "@/types/meal";
import { useTranslation } from "react-i18next";

const MealLibraryComponent = () => {
  const { t } = useTranslation();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [expandedMealId, setExpandedMealId] = useState<string | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<{ meal: Meal; multiplier: number }[]>([]);
  const [mealDescription, setMealDescription] = useState(t("A healthy and balanced meal plan for the child."));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { data: children } = useSelector((state: RootState) => state.children);
  const { specialists } = useSelector((state: RootState) => state.specialists);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await api.get("meal/find-all?skip=0");
        const responseData = Array.isArray(res.data) ? res.data : res.data?.data;
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
      prev.map((m) => (m.meal.id === mealId ? { ...m, multiplier: Math.max(1, value) } : m))
    );
  };

  const total = (field: keyof Meal) =>
    selectedMeals.reduce((sum, sm) => {
      const val = (sm.meal[field] as unknown as number) || 0;
      return sum + val * sm.multiplier;
    }, 0);

  const handleConfirmMealPlan = async () => {
    if (!children.length) return navigate("/children");

    const payload = {
      expertId: specialists[0]?.id,
      childId: children[0]?.id,
      meal_description: mealDescription,
      calories: total("totalVolume"),
      meals: selectedMeals.map(({ meal, multiplier }) => ({ id: meal.id, multiplier })),
    };

    try {
      setSubmitting(true);
      await api.post("/meal-plans/create", payload);
      setSelectedMeals([]);
      navigate("/mealplansummary");
    } catch (error) {
      console.error("Submit failed:", error);
      alert(t("Something went wrong. Try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto text-white space-y-6">
      <h1 className="text-2xl font-bold text-emerald-400">🍽️ {t("Create Meal Plan")}</h1>

      <textarea
        className="w-full p-2 bg-gray-800 text-white rounded"
        rows={2}
        value={mealDescription}
        onChange={(e) => setMealDescription(e.target.value)}
        placeholder={t("Describe the meal plan...")}
      />

      {meals.map((meal) => {
        const selected = selectedMeals.find((m) => m.meal.id === meal.id);
        const expanded = expandedMealId === meal.id;

        return (
          <div
            key={meal.id}
            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
              selected ? "border-emerald-400 bg-emerald-800/10" : "border-gray-700 bg-[#111827]"
            }`}
            onClick={() => toggleMealExpand(meal.id)}
          >
            <div className="flex gap-4 items-center">
              <img
                src={`https://lije-care-api-dev.zikollab.com/uploads/images/MEAL/${meal.imageUrl}`}
                alt={meal.name}
                className="w-20 h-20 rounded-lg object-cover border border-gray-700"
              />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-emerald-300">{meal.name}</h2>
                <p className="text-xs text-gray-400 italic">
                  {t("Age")}: {meal.ageGroup}+m · {t(meal.mealType)} · {t(meal.mealTime)}
                </p>
                <div className="flex gap-2 text-xs mt-1">
                  {meal.prepTime && <span>⏱️ {meal.prepTime}</span>}
                  {meal.cost && <span>💰 {meal.cost}</span>}
                </div>
              </div>
            </div>

            {expanded && (
              <div className="mt-4 space-y-2 text-sm">
                <p><strong>{t("Meal Type")}:</strong> {t(meal.mealType)}</p>
                <p><strong>{t("Meal Time")}:</strong> {t(meal.mealTime)}</p>
                <p><strong>{t("Prepping Time")}:</strong> {meal.prepTime}</p>
                <p><strong>{t("Yield Volume")}:</strong> {meal.totalVolume} ml</p>
                <p><strong>{t("Description")}:</strong> {meal.description}</p>
                <p><strong>{t("Allergen Description")}:</strong> {meal.allergenDescription}</p>
                <p><strong>{t("Intolerance Description")}:</strong> {meal.intoleranceDescription}</p>
                <p><strong>{t("Drug Interaction")}:</strong> {meal.drugInteraction}</p>
                <p><strong>{t("Direction")}:</strong> {meal.direction}</p>
                <p><strong>{t("How to Store")}:</strong> {meal.howToStore}</p>
                <p><strong>{t("Ingredients")}:</strong></p>
                <ul className="list-disc list-inside ml-4">
                  {meal?.mealIngredients?.length ? (
                    meal.mealIngredients.map((mi) => (
                      <li key={mi.id}>
                        {mi.quantity} {mi.ingredient?.portionUnit?.abbreviation ?? ''} {t("of")} {mi.ingredient?.name ?? t('Unknown Ingredient')}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 italic">{t("No ingredients available")}</li>
                  )}
                </ul>
                <p><strong>{t("Nutrients")}:</strong></p>
                <ul className="list-disc list-inside ml-4">
                  {meal?.totalNutrients?.length ? (
                    meal.totalNutrients.map((n) => (
                      <li key={n.id}>
                        {n.name ?? t('Unknown Nutrient')} ({n.amount ?? 0} {n.unit ?? ''})
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 italic">{t("No nutrients available")}</li>
                  )}
                </ul>
              </div>
            )}

            <div className="mt-3 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMeal(meal);
                }}
                className={`text-xs px-4 py-1.5 rounded font-semibold transition-all ${
                  selected ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {selected ? t("Remove") : t("Add")}
              </button>
            </div>
          </div>
        );
      })}

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