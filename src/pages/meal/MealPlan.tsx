// 📁 src/components/MealLibraryComponent.tsx
import { useEffect, useState } from "react";
import api from "@/api/axios";
import {
  Button,
  Card,
  List,
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

type MealLibrary = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  nutritional_info: string;
  age_group: string;
  meal_type: string;
  preparation_time: number;
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
  const [calories, setCalories] = useState<number>(1500);

  const expertId = "ffb1c872-f128-4218-91d6-a1e8256dadd0";
  const childId = "e2c6b15f-8061-46cb-81e3-e1aa19d64b15";
  const navigate = useNavigate(); 
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await api.get("mealLibrary/findall?skip=0");
        const data = Array.isArray(res.data) ? res.data : res.data?.data;
        setMeals(data || []);
        console.log(data);
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
      // alert("Please select at least one meal.");
      navigate('/mealplansummary');
      return;
    }

    const payload = {
      expertId,
      childId,
      meal_description: mealDescription,
      calories,
      meals: selectedMeals.map((m) => ({ id: m.id })),
    };

    try {
      setSubmitting(true);
      await api.post("/meal-plans/create", payload);
      // alert("Meal plan created successfully!");
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
        <Spinner size={"s"}/>
        <Caption>Fetching healthy meal options for your child...</Caption>
      </Placeholder>
    );
  }

  if (error) {
    return (
       <div>
        <Title>Error Loading Meals</Title>
        <Text>{error}</Text>
        </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Title className="mb-4">Create Meal Plan</Title>

      <Card className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            header="Meal Description"
            value={mealDescription}
            onChange={(e) => setMealDescription(e.target.value)}
          />
          <Input
            type="number"
            header="Calories"
            value={calories}
            onChange={(e) => setCalories(parseInt(e.target.value, 10))}
          />
        </div>
      </Card>

      <Card>
        <Title className="text-lg mb-3">Select Meals from Library</Title>
        <List>
          {meals.map((meal) => {
            const isSelected = selectedMeals.some((m) => m.id === meal.id);
            return (
              <li
                key={meal.id}
                className={`flex items-center gap-4 p-2 border rounded mb-2 transition duration-300 ${
                  isSelected ? "bg-green-100 border-green-500" : " hover:bg-gray-100"
                }`}
              >
                <img
                  // src={meal.imageUrl || fallbackImg}
                  src={`http://localhost:4000/uploads/images/meal${meal.imageUrl}`}
                  alt={meal.title}
                  className="w-20 h-20 rounded object-cover"
                  onError={(e) => ((e.currentTarget.src = fallbackImg))}
                />
                <div className="flex-1">
                  <Text className="font-semibold">{meal.title}</Text>
                  <Caption className="text-sm text-gray-600">{meal.age_group} · {meal.meal_type}</Caption>
                  <Caption className="text-sm">Prep Time: {meal.preparation_time} min</Caption>
                  <Caption className="text-xs text-gray-500 italic">{meal.nutritional_info}</Caption>
                </div>
                <Button
                  onClick={() => toggleMeal(meal)}
                  className={`text-white ${isSelected ? "bg-red-500" : "bg-blue-500"}`}
                >
                  {isSelected ? "Remove" : "Add"}
                </Button>
              </li>
            );
          })}
        </List>
      </Card>

      <Button
        onClick={handleConfirmMealPlan}
        disabled={submitting}
        className="mt-6 w-full bg-green-600 text-white text-lg flex items-center justify-center gap-2"
      >
        <FaCheck />
        {submitting ? "Submitting..." : "Confirm Meal Plan"}
      </Button>
    </div>
  );
};

export default MealLibraryComponent;
