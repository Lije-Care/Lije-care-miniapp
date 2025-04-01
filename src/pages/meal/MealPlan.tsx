import React, { useState, useEffect } from "react";
import axios from "axios";

// Type definition for meal items from the API
type Meal = {
  id: string;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  nutritional_info: string;
  age_group: string;
  meal_type: string;
  preparation_time: number;
  createdAt: string;
  updatedAt: string;
};

const MealLibraryComponent = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<Meal[]>([]);

  useEffect(() => {
    // Fetch meals from the API
    axios
      .get("http://localhost:4000/api/v1/mealLibrary/findall")
      .then((response) => {
        setMeals(response.data);
      })
      .catch((error) => {
        console.error("Error fetching meals:", error);
      });
  }, []);

  // Handle selecting/deselecting meals
  const handleSelectMeal = (meal: Meal) => {
    setSelectedMeals((prevSelected) =>
      prevSelected.includes(meal)
        ? prevSelected.filter((selectedMeal) => selectedMeal.id !== meal.id)
        : [...prevSelected, meal]
    );
  };

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
        Meal Library
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <div
            key={meal.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{meal.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{meal.description}</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                <strong>Age Group:</strong> {meal.age_group}
              </p>
              <button
                className={`w-full py-2 rounded-lg font-medium ${
                  selectedMeals.includes(meal)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800"
                }`}
                onClick={() => handleSelectMeal(meal)}
              >
                {selectedMeals.includes(meal) ? "Remove from Meal Plan" : "Add to Meal Plan"}
              </button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700">
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                <strong>Ingredients:</strong> {meal.ingredients}
              </p>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                <strong>Preparation Time:</strong> {meal.preparation_time} min
              </p>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                <strong>Instructions:</strong> {meal.instructions}
              </p>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                <strong>Nutritional Info:</strong> {meal.nutritional_info}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Meal Plan Summary */}
      {selectedMeals.length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Selected Meal Plan
          </h3>
          <ul>
            {selectedMeals.map((meal) => (
              <li
                key={meal.id}
                className="text-gray-700 dark:text-gray-200 mb-2 flex justify-between"
              >
                <span>{meal.title}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleSelectMeal(meal)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button className="mt-4 w-full py-2 rounded-lg font-medium bg-green-600 text-white">
            Confirm Meal Plan
          </button>
        </div>
      )}
    </div>
  );
};

export default MealLibraryComponent;
