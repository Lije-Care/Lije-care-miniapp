import { useEffect, useState } from "react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Meal } from "@/types/meal";



type SelectedMeal = {
  meal: Meal;
  multiplier: number;
};

const MealLibraryComponent = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<SelectedMeal[]>([]);
  const [mealDescription, setMealDescription] = useState("A healthy and balanced meal plan for the child.");
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
        setError("Could not load meals. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

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
      alert("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 text-white">
        <p className="text-lg font-semibold mb-2">Loading Meals...</p>
        <p className="text-sm text-gray-400">Fetching healthy meal options for your child...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  if (!children.length) {
    return (
     <div className="flex flex-col items-center justify-center min-h-screen text-center text-white p-6 bg-gray-900">
  <p className="text-xl font-semibold mb-2">No child profile found</p>
  <p className="text-sm mb-6 text-gray-400">Add a child to create a meal plan</p>

  <button
    onClick={() => navigate("/children")}
    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-5 py-2 rounded-md font-semibold text-white transition-all"
  >
    <span className="text-lg">➕</span>
    <span>Add Chld</span>
  </button>
</div>

    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto text-white space-y-6">
      <h1 className="text-2xl font-bold text-emerald-400">🍽️ Create Meal Plan</h1>

      {/* Description & Totals */}
      <div className="bg-[#1E1E2F] p-4 rounded-lg shadow space-y-3">
        <textarea
          className="w-full p-2 bg-gray-800 text-white rounded"
          rows={2}
          value={mealDescription}
          onChange={(e) => setMealDescription(e.target.value)}
          placeholder="Describe the meal plan..."
        />
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>📊 Total Volume: <strong>{total("totalVolume")} ml</strong></div>
          <div>📆 Meals Selected: <strong>{selectedMeals.length}</strong></div>
        </div>
      </div>

     {/* Meal Cards */}
<div className="space-y-4">
  {meals.map((meal) => {
    const selected = selectedMeals.find((m) => m.meal.id === meal.id);

    return (
      <div
        key={meal.id}
        className={`p-4 rounded-xl border transition-all text-white duration-200 ${
          selected
            ? "border-emerald-400 bg-emerald-800/10"
            : "border-gray-700 bg-[#111827]"
        }`}
      >
        <div className="flex gap-4">
          {/* Meal Image */}
          <img
            src={`https://lije-care-api-dev.zikollab.com/uploads/images/MEAL/${meal.imageUrl}`}
            alt={meal.name}
            className="w-20 h-20 rounded-lg object-cover border border-gray-700"
          />

          <div className="flex-1 space-y-1 text-sm">
            {/* Meal Title */}
            <h2 className="text-base font-bold text-emerald-300">{meal.name}</h2>
            <p className="text-gray-400 text-xs italic">
              {meal.ageGroup}m+ · {meal.mealType} · {meal.mealTime}
            </p>

            {/* Description */}
            <p className="text-gray-300 text-xs line-clamp-2">{meal.description}</p>

            {/* Meta Tags */}
            <div className="flex gap-2 flex-wrap mt-1 text-[11px]">
              {meal.prepTime && (
                <span className="bg-gray-700 px-2 py-0.5 rounded text-gray-300">
                  ⏱️ {meal.prepTime}
                </span>
              )}
              {meal.cost && (
                <span className="bg-gray-700 px-2 py-0.5 rounded text-gray-300">
                  💰 {meal.cost.charAt(0).toUpperCase() + meal.cost.slice(1)}
                </span>
              )}
              {meal.allergen && (
                <span className="bg-red-600/70 px-2 py-0.5 rounded text-white">⚠️ Allergen</span>
              )}
              {meal.intolerance && (
                <span className="bg-yellow-600/70 px-2 py-0.5 rounded text-white">⚠️ Intolerance</span>
              )}
            </div>

            {/* Multiplier (if selected) */}
            {selected && (
              <div className="mt-2 flex items-center gap-2">
                <label className="text-xs text-gray-400">Qty:</label>
                <input
                  type="number"
                  min={1}
                  value={selected.multiplier}
                  onChange={(e) =>
                    handleMultiplierChange(meal.id, parseInt(e.target.value) || 1)
                  }
                  className="w-14 px-2 py-1 bg-gray-800 text-white rounded border border-gray-600 text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Add/Remove Button */}
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => toggleMeal(meal)}
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
</div>


      <button
        onClick={handleConfirmMealPlan}
        disabled={submitting}
        className={`w-full py-3 rounded-lg text-white text-lg font-semibold transition-all ${
          submitting
            ? "bg-emerald-400 cursor-not-allowed"
            : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        {submitting ? "Submitting..." : "✅ Confirm Meal Plan"}
      </button>
    </div>
  );
};

export default MealLibraryComponent;
