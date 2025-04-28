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

const fallbackImage = 'https://via.placeholder.com/400x250?text=Meal+Image';

const MealDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const res = await api.get(`/meal-plans/find-one/${id}`);
        setData(res.data);
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
    return <Text className="text-center mt-8">No meals found in this meal plan.</Text>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 text-white space-y-10">
      <Title className="text-2xl font-bold text-emerald-400">🥗 Meal Plan</Title>

      {meals.map((meal: any) => {
        const nutrition = meal.nutritional_info || {};

        const steps = Array.isArray(meal.instructions)
          ? meal.instructions
          : typeof meal.instructions === 'string'
          ? meal.instructions.split(/\d+\./).filter(Boolean)
          : [];

        return (
          <div
            key={meal.id}
            className="bg-[#1f1f2b] border border-gray-700 rounded-xl p-4 shadow-md space-y-5"
          >
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <img
                src={meal.imageUrl ? `http://localhost:4000/uploads/images/meal${meal.imageUrl}` : fallbackImage}
                alt={meal.title}
                onError={(e) => (e.currentTarget.src = fallbackImage)}
                className="w-full md:w-72 h-48 object-cover rounded-lg"
              />
              <div className="flex-1">
                <Title className="text-xl">{meal.title}</Title>
                <Text className="text-gray-300">{meal.description}</Text>
              </div>
            </div>

            <Divider />

            <div>
              <Title className="text-md">📋 Instructions</Title>
              <ul className="list-decimal pl-5 mt-2 space-y-1 text-sm text-gray-200">
                {steps.map((step: string, i: number) => (
                  <li key={i}>{step.trim()}</li>
                ))}
              </ul>
            </div>

            <Divider />

            <div>
              <Title className="text-sm">🧪 Nutritional Info</Title>
              <div className="grid grid-cols-2 md:grid-cols-4 p-0 m-0 text-sm gap-2">
                <div className="flex items-start gap-1 whitespace-normal break-words overflow-visible">
                  <span>🔥</span>
                  <span>Clrs: {nutrition?.calories ?? 'N/A'}</span>
                </div>
                <div className="flex items-start gap-1 whitespace-normal break-words overflow-visible">
                  <span>🥩</span>
                  <span>Prtn: {nutrition?.protein ?? 'N/A'}</span>
                </div>
                <div className="flex items-start gap-1 whitespace-normal break-words overflow-visible">
                  <span>🥑</span>
                  <span>Fat: {nutrition?.fat ?? 'N/A'}</span>
                </div>
                <div className="flex items-start gap-1 whitespace-normal break-words overflow-visible">
                  <span>🍞</span>
                  <span>Carbs: {nutrition?.carbs ?? 'N/A'}</span>
                </div>
              </div>
            </div>

            <Divider />

            <div>
              <Title className="text-md">🧠 General Info</Title>
              <ul className="text-sm mt-2 space-y-1 text-gray-300">
                <li><strong>Age Group:</strong> {meal.age_group}</li>
                <li><strong>Meal Type:</strong> {meal.meal_type}</li>
                <li><strong>Prep Time:</strong> {meal.preparation_time} mins</li>
              </ul>
            </div>
          </div>
        );
      })}

      <Divider />

      {/* Expert Info */}
      <div className="bg-[#1f1f2b] border border-gray-700 rounded-xl p-4">
        <Title className="text-md text-emerald-400">👨‍⚕️ Expert Info</Title>
        <ul className="text-sm mt-2 text-gray-300 space-y-1">
          <li><strong>Name:</strong> {data?.expert?.firstName} {data?.expert?.lastName}</li>
          <li><strong>Phone:</strong> {data?.expert?.phone}</li>
        </ul>
      </div>

      {/* Child Info */}
      {/* <div className="bg-[#1f1f2b] border border-gray-700 rounded-xl p-4">
        <Title className="text-md text-sky-400">👶 Child Info</Title>
        <ul className="text-sm mt-2 text-gray-300 space-y-1">
          <li><strong>Name:</strong> {data?.child?.name}</li>
          <li><strong>Date of Birth:</strong> {new Date(data?.child?.date_of_birth).toLocaleDateString()}</li>
          <li><strong>Gender:</strong> {data?.child?.gender}</li>
          <li><strong>Weight:</strong> {data?.child?.weight} kg</li>
          <li><strong>Height:</strong> {data?.child?.height} cm</li>
          <li><strong>MUAC:</strong> {data?.child?.muac} cm</li>
        </ul>
      </div> */}
    </div>
  );
};

export default MealDetails;
