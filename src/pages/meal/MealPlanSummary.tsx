import React, { useState, useEffect } from "react";
import axios from "axios";
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
  meals: Meal[];
};

const MealPlanSummary = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/v1/meal-Plans/find-all")
      .then((response) => {
        setMealPlans(response.data);
      })
      .catch((error) => {
        console.error("Error fetching meal plans:", error);
      });
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-center">📋 Your Meal Plans</h2>

      {mealPlans.length > 0 ? (
        mealPlans.map((mealPlan) => (
          <Card
            key={mealPlan.id}
            className="p-4 shadow-md bg-white dark:bg-gray-800 rounded-lg w-full"
          >
            <p className="text-gray-700 dark:text-gray-300">
              {mealPlan.meal_description}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              🔥 {mealPlan.calories} kcal | 🕒 {new Date(mealPlan.createdAt).toDateString()}
            </p>

            <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">👨‍⚕️ Expert</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {mealPlan.expert.firstName} {mealPlan.expert.lastName} ({mealPlan.expert.role})
            </p>

            <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">👶 Child</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {mealPlan.child.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Dietary Restrictions: {mealPlan.child.dietary_restrictions || "None"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Allergies: {mealPlan.child.allergies || "None"}
            </p>

            <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">🍽️ Meals</h3>
            <div className="mt-2 space-y-2">
              {mealPlan.meals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between">
                  <span className="text-gray-800 dark:text-gray-200">{meal.title}</span>
                  <Badge type="dot">{meal.meal_type}</Badge>
                </div>
              ))}
            </div>

            <Button onClick={() => navigate(`/meal-plans/edit/${mealPlan.id}`)} className="mt-4 w-full bg-blue-500 text-white">Edit Meal Plan</Button>
          </Card>
        ))
      ) : (
        <>
        <Placeholder/>
          </>
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
