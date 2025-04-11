import React, { useState, useEffect } from "react";
import api from "@/api/axios";

import { FaCheck, FaUtensils, FaTrash } from "react-icons/fa";
import { Button, Card, List, Text, Title } from "@telegram-apps/telegram-ui";

// Type definition for meal items from the API
type Ingredient = {
  id: string;
  name: string;
  category: string;
  nutritional_breakdown: string;
  allergen_info: string;
  createdAt: string;
  updatedAt: string;
};

type MealLibrary = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  nutritional_info: string;
  age_group: string;
  meal_type: string;
  preparation_time: number;
  createdAt: string;
  updatedAt: string;
  ingredients: Ingredient[];
};

const MealLibraryComponent = () => {
  const [meals, setMeals] = useState<MealLibrary[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<MealLibrary[]>([]);

  useEffect(() => {
    api
      .get("mealLibrary/findall")
      .then((response) => setMeals(response.data))
      .catch((error) => console.error("Error fetching meals:", error));
  }, []);

  const handleSelectMeal = (meal: MealLibrary) => {
    setSelectedMeals((prevSelected) =>
      prevSelected.some((selectedMeal) => selectedMeal.id === meal.id)
        ? prevSelected.filter((selectedMeal) => selectedMeal.id !== meal.id)
        : [...prevSelected, meal]
    );
  };

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <Title className="text-center">Meal Library</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <Card key={meal.id} className="p-4 bg-white dark:bg-gray-800">
            <Text className="text-lg font-bold flex items-center gap-2">
              <FaUtensils /> {meal.title}
            </Text>
            <Text className="text-gray-600 dark:text-gray-300">{meal.description}</Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Age Group:</strong> {meal.age_group}
            </Text>
            <Button
              className={`w-full mt-3 flex items-center justify-center gap-2 rounded-lg text-white ${
                selectedMeals.some((m) => m.id === meal.id) ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"
              }`}
              onClick={() => handleSelectMeal(meal)}
            >
              {selectedMeals.some((m) => m.id === meal.id) ? <FaCheck /> : <FaUtensils />}
              {selectedMeals.some((m) => m.id === meal.id) ? "Remove from Meal Plan" : "Add to Meal Plan"}
            </Button>
          </Card>
        ))}
      </div>

      {selectedMeals.length > 0 && (
        <Card className="mt-6 p-4 bg-gray-100 dark:bg-gray-800">
          <Title>Selected Meal Plan</Title>
          <List>
            {selectedMeals.map((meal) => (
              <ul key={meal.id} className="flex justify-between items-center">
                <Text>{meal.title}</Text>
                <Button onClick={() => handleSelectMeal(meal)}>
                  <FaTrash className="text-red-500" />
                </Button>
              </ul>
            ))}
          </List>
          <Button className="mt-4 w-full bg-green-600 text-white flex items-center justify-center gap-2">
            <FaCheck /> Confirm Meal Plan
          </Button>
        </Card>
      )}
    </div>
  );
};

export default MealLibraryComponent;
