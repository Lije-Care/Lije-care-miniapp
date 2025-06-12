import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/api/axios';
import {
  Title,
  Text,
  Divider,
  Placeholder,
  Spinner,
  Caption,
} from '@telegram-apps/telegram-ui';

const fallbackImg = 'https://via.placeholder.com/400x250?text=Meal+Image';

const MealDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const res = await api.get(`/meal-plans/find-one/${id}`);
        console.log('Meal Plan Data:', res.data.meals);
        setData(res.data); // <-- Fix: properly set response data
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [id]);

  if (loading) {
    return (
      <Placeholder header="Loading Meal Plan...">
        <Spinner size="l" />
        <Caption>Please wait while we fetch the meal details</Caption>
      </Placeholder>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-400">
        <Title>Error</Title>
        <Text>{error}</Text>
      </div>
    );
  }

  const meals = data?.meals || [];

  if (!meals.length) {
    return (
      <Text className="text-center mt-8">
        No meals found in this meal plan.
      </Text>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 text-white space-y-10">
      <Title className="text-2xl font-bold text-emerald-400">🥗 Meal Plan</Title>

      {meals.map((meal: any) => (
        <div
          key={meal.id}
          className="bg-[#1f1f2b] border border-gray-700 rounded-xl p-4 shadow-md space-y-5"
        >
          {/* Meal Image and Title */}
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <img
              src={
                meal.imageUrl
                  ? `https://lije-care-api-dev.zikollab.com/uploads/images/MEAL/${meal.imageUrl}`
                  : fallbackImg
              }
              alt={meal.name}
              onError={(e) => {
                e.currentTarget.src = fallbackImg;
              }}
              className="w-full h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <Title className="text-xl">{meal.name}</Title>
              <Text className="text-gray-300">{meal.description}</Text>
            </div>
          </div>

          <Divider />

          {/* General Meal Info */}
          <div>
            <Title className="text-md">🧠 General Info</Title>
            <ul className="text-sm mt-2 space-y-1 text-gray-300">
              <li><strong>Meal Time:</strong> {meal.mealTime}</li>
              <li><strong>Meal Type:</strong> {meal.mealType}</li>
              <li><strong>Age Group:</strong> {meal.ageGroup}</li>
              <li><strong>Total Volume:</strong> {meal.totalVolume} ml</li>
            </ul>
          </div>

          {/* Allergens, Intolerance, Choking Info */}
          {(meal.allergen || meal.intolerance || meal.choking) && (
            <>
              <Divider />
              <div>
                <Title className="text-md">⚠️ Sensitivities</Title>
                <ul className="text-sm mt-2 space-y-1 text-gray-300">
                  {meal.allergen && (
                    <li><strong>Allergen:</strong> Yes - {meal.allergenDescription}</li>
                  )}
                  {meal.intolerance && (
                    <li><strong>Intolerance:</strong> Yes - {meal.intoleranceDescription}</li>
                  )}
                  {meal.choking && (
                    <li><strong>Choking Hazard:</strong> Yes</li>
                  )}
                </ul>
              </div>
            </>
          )}

          {/* Directions */}
          {meal.direction && (
            <>
              <Divider />
              <div>
                <Title className="text-md">📋 Directions</Title>
                <Text className="text-sm text-gray-300 mt-2 whitespace-pre-wrap">
                  {meal.direction}
                </Text>
              </div>
            </>
          )}

          {/* Modification Note */}
          {meal.modificationNote && (
            <>
              <Divider />
              <div>
                <Title className="text-md">🛠️ Modification Note</Title>
                <Text className="text-sm text-gray-300 mt-2 whitespace-pre-wrap">
                  {meal.modificationNote}
                </Text>
              </div>
            </>
          )}

          {/* How to Store */}
          {meal.howToStore && (
            <>
              <Divider />
              <div>
                <Title className="text-md">📦 How to Store</Title>
                <Text className="text-sm text-gray-300 mt-2 whitespace-pre-wrap">
                  {meal.howToStore}
                </Text>
              </div>
            </>
          )}

          {/* Drug Interaction */}
          {meal.drugInteraction && (
            <>
              <Divider />
              <div>
                <Title className="text-md">💊 Drug Interaction</Title>
                <Text className="text-sm text-gray-300 mt-2 whitespace-pre-wrap">
                  {meal.drugInteraction}
                </Text>
              </div>
            </>
          )}

          {/* Video URL */}
          {meal.videoUrl && (
            <>
              <Divider />
              <div>
                <Title className="text-md">🎥 Video Tutorial</Title>
                <a
                  href={meal.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-sky-400 underline"
                >
                  Watch Video
                </a>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MealDetails;
