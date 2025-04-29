// 📁 src/components/MealLibraryComponent.tsx
import { useEffect, useState } from "react";
import api from "@/api/axios";
import {
  Button,
  Card,
  
  Placeholder,
  Text,
  Title,
  Input,
  Caption,
  Spinner,
} from "@telegram-apps/telegram-ui";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const fallbackImg = 'https://via.placeholder.com/100x80?text=No+Image';

type Ingredient = {
  id: string;
  name: string;
};

type NutritionalInfo = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  iron: number;
  calcium: number;
  vitaminA: number;
};

type MealLibrary = {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  nutritional_info: NutritionalInfo;
  age_group: string;
  meal_type: string;
  preparation_time: string;
  imageUrl: string;
  ingredients: Ingredient[];
};

const MealLibraryComponent = () => {
  const [meals, setMeals] = useState<MealLibrary[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<MealLibrary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mealDescription, setMealDescription] = useState("A healthy and balanced meal plan for the child.");
  const navigate = useNavigate();

  const expertId = "0188e7a3-29c6-4a33-9071-5c846a9d6c4c";
  const childId = "dba8d146-93a0-4870-80cc-acd5fd2e437a";

  const totalCalories = selectedMeals.reduce((sum, meal) => sum + (meal.nutritional_info?.calories || 0), 0);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await api.get("mealLibrary/findall?skip=0");
        const data = Array.isArray(res.data) ? res.data : res.data?.data;
        setMeals(data || []);
      } catch (err) {
        console.error("Failed to fetch meals:", err);
        setError("Failed to load meals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const toggleMeal = (meal: MealLibrary) => {
    setSelectedMeals((prev) =>
      prev.some((m) => m.id === meal.id)
        ? prev.filter((m) => m.id !== meal.id)
        : [...prev, meal]
    );
  };

  const handleConfirmMealPlan = async () => {
    if (selectedMeals.length === 0) {
      navigate('/mealplansummary');
      return;
    }

    const payload = {
      expertId,
      childId,
      meal_description: mealDescription,
      calories: totalCalories,
      meals: selectedMeals.map((m) => ({ id: m.id })),
    };

    try {
      setSubmitting(true);
      await api.post("/meal-plans/create", payload);
      navigate('/mealplansummary');
      setSelectedMeals([]);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to create meal plan. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Placeholder header="Loading Meals...">
        <Spinner size={"s"} />
        <Caption>Fetching healthy meal options for your child...</Caption>
      </Placeholder>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <Title>Error Loading Meals</Title>
        <Text>{error}</Text>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <Title className="mb-4 text-2xl text-emerald-400">🍽️ Create Meal Plan</Title>

      <Card className="auto w-full bg-[#1E1E2F] border border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 ">
          <Input
            header="Meal Description"
            value={mealDescription}
            onChange={(e) => setMealDescription(e.target.value)}
          />
          <div>
            <Input
              header="Total Calories"
              type="number"
              value={totalCalories}
              disabled
              className="bg-gray-800 text-white"
            />
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <Title className="text-lg text-white">Select Meals from Library</Title>
        {meals.map((meal) => {
          const isSelected = selectedMeals.some((m) => m.id === meal.id);
          return (
            <Card
              key={meal.id}
              className={`flex flex-col sm:flex-row items-center justify-between p-4 border ${
                isSelected ? "border-green-500 bg-green-100/10" : "bg-[#101827]"
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
                <img
                  src={`https://lije-care-api-dev.zikollab.com/uploads/images/meal${meal.imageUrl}`}
                  alt={meal.title}
                  onError={(e) => ((e.currentTarget.src = fallbackImg))}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <Text className="text-xl font-semibold">{meal.title}</Text>
                  <Caption>{meal.age_group} · {meal.meal_type} · Prep: {meal.preparation_time} min</Caption>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                    <div>🔥 {meal.nutritional_info.calories} kcal</div>
                    <div>💪 {meal.nutritional_info.protein} g protein</div>
                    <div>🍞 {meal.nutritional_info.carbs} g carbs</div>
                    <div>🧈 {meal.nutritional_info.fat} g fat</div>
                    <div>🩸 {meal.nutritional_info.iron} mg iron</div>
                    <div>🦴 {meal.nutritional_info.calcium} mg calcium</div>
                    <div>👁️ {meal.nutritional_info.vitaminA} mcg Vitamin A</div>
                  </div>
                </div>
                <Button
                  onClick={() => toggleMeal(meal)}
                  className={`text-white h-10 px-5 ${
                    isSelected ? "bg-red-500" : "bg-blue-500"
                  }`}
                >
                  {isSelected ? "Remove" : "Add"}
                </Button>
              </div>

              {isSelected && (
                <div className="mt-4 w-full">
                  <Caption className="text-sm font-medium text-gray-400">📝 Instructions:</Caption>
                  <ul className="text-sm list-disc list-inside text-gray-300 mt-1">
                    {Array.isArray(meal.instructions) &&
                      meal.instructions.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                  </ul>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Button
  onClick={handleConfirmMealPlan}
  disabled={submitting}
  className={`mt-6 w-full flex flex-row items-center justify-center gap-2 text-white text-lg font-semibold 
    py-3 rounded-lg transition-all duration-200
    ${submitting ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'}
  `}
>
  <FaCheck className="text-white text-xl" />
  <span>{submitting ? "Submitting..." : "Confirm Meal Plan"}</span>
</Button>


    </div>
  );
};

export default MealLibraryComponent;
