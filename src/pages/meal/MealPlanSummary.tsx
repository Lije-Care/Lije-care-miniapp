import { useState, useEffect } from "react";
import api from "@/api/axios";
import { Badge, Button, Card, Placeholder } from "@telegram-apps/telegram-ui";
import { useNavigate } from "react-router-dom";

// Define TypeScript interfaces based on API response
type Meal = {
  id: string;
  title: string;
  meal_type: string;
};

type MealPlan = {
  id: string;
  meal_description: string;
  calories: number;
  createdAt: string;
  expert: {
    firstName: string;
    lastName: string;
    role: string;
  };
  child: {
    name: string;
    dietary_restrictions: string;
    allergies: string;
  };
  meals?: Meal[];
};

const MealPlanSummary = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("meal-Plans/find-all")
      .then((response) => {
        const data = response.data?.data ?? [];
        setMealPlans(data);
      })
      .catch((error) => {
        console.error("Error fetching meal plans:", error);
        setError("Failed to fetch meal plans. Please try again later.");
        setMealPlans([]);
      });
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-center">📋 Your Meal Recommendations</h2>

      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}

      {mealPlans === null ? (
        <Placeholder />
      ) : mealPlans.length > 0 ? (
        mealPlans.map((mealPlan) => (
          <Card
            key={mealPlan.id}
            className="p-4 shadow-md bg-white dark:bg-gray-800 rounded-lg w-full"
            onClick={() => navigate(`/mealplansummary/${mealPlan.id}`)}
          >
            <p className="text-gray-700 dark:text-gray-300">
              {mealPlan.meal_description || "No description available."}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              🔥 {mealPlan.calories} kcal | 🕒{" "}
              {new Date(mealPlan.createdAt).toDateString()}
            </p>

            <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">👶 Child</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {mealPlan.child?.name || "No name provided"}
            </p>

            <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">🍽️ Meals</h3>
            {Array.isArray(mealPlan.meals) && mealPlan.meals.length > 0 ? (
              <div className="mt-2 space-y-2">
                {mealPlan.meals.map((meal) => (
                  <div key={meal.id} className="flex items-center justify-between">
                    <span className="text-gray-800 dark:text-gray-200">
                      {meal.title || "Untitled"}
                    </span>
                    <Badge type="dot">{meal.meal_type || "Unknown"}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">No meals listed.</p>
            )}
          </Card>
        ))
      ) : (
        <div className="text-center text-gray-500">
          No meal plans found. You can create one below!
        </div>
      )}

      <div className="text-center">
        <Button
          className="mt-4 w-full bg-green-500 text-white"
          onClick={() => navigate("/meal")}
        >
          Create a Meal Plan
        </Button>
      </div>
    </div>
  );
};

export default MealPlanSummary;
