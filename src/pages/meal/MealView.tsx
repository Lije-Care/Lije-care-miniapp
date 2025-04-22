// 📁 src/pages/MealDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/api/axios';
import {
  Cell,
  Divider,
  List,
  Text,
  Title,
  Spinner,
  Placeholder,
  
  Caption,
} from '@telegram-apps/telegram-ui';

const fallbackImage = 'https://via.placeholder.com/400x250?text=Meal+Image';

const MealDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/meal-plans/find-one/${id}`);
        setData(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id]);

  if (loading) {
    return (
      <Placeholder header="Loading Meal Plan...">
        <Spinner size={"l"} />
        <Caption>Please wait while we fetch the details</Caption>
      </Placeholder>
    );
  }

  if (error) {
    return (
      // <Alert status="error">
      <> 
      <Title>Error</Title>
        <Text>{error}</Text>
        </>
      // </Alert>
    );
  }

  const meal = data?.meals?.[0];
  if (!meal) {
    return <Text className="text-center mt-6">No meal details found.</Text>;
  }

  return (
    <div className="max-w-2xl mx-auto shadow rounded-xl p-4 space-y-6">
      <Title className="text-lg">{meal.title}</Title>
      <img
         src={`http://localhost:4000/uploads/images/meal${meal.imageUrl}`}
        alt={meal.title}
        onError={(e) => ((e.currentTarget.src = fallbackImage))}
        className="w-full h-60 object-cover rounded-md"
      />

      <Text className="text-sm ">{meal.description}</Text>

      <Divider />

      <div>
        <Title className="text-md">Instructions</Title>
        <List>
          {meal.instructions?.split(/\d+\./).filter(Boolean).map((step: string, index: number) => (
            <li key={index} className="text-sm text-gray-100">
              {index + 1}. {step.trim()}
            </li>
          ))}
        </List>
      </div>

      <Divider />

      <div>
        <Title className="text-md">Nutritional Info</Title>
        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
          <Cell before="🔥">Calories: {meal.nutritional_info?.calories || 'N/A'}</Cell>
          <Cell before="🥩">Protein: {meal.nutritional_info?.protein || 'N/A'}</Cell>
          <Cell before="🥑">Fat: {meal.nutritional_info?.fat || 'N/A'}</Cell>
          <Cell before="🍞">Carbs: {meal.nutritional_info?.carbs || 'N/A'}</Cell>
        </div>
      </div>

      <Divider />

      <div>
        <Title className="text-md">General Info</Title>
        <ul className="text-sm space-y-1 mt-2 text-gray-100">
          <li><strong>Age Group:</strong> {meal.age_group}</li>
          <li><strong>Meal Type:</strong> {meal.meal_type}</li>
          <li><strong>Prep Time:</strong> {meal.preparation_time} mins</li>
        </ul>
      </div>

      <Divider />

      <div>
        <Title className="text-md">Expert Info</Title>
        <ul className="text-sm space-y-1 mt-2 text-gray-100">
          <li><strong>Name:</strong> {data?.expert?.firstName} {data?.expert?.lastName}</li>
          <li><strong>Phone:</strong> {data?.expert?.phone}</li>
        </ul>
      </div>

      <Divider />

      <div>
        <Title className="text-md">Child Info</Title>
        <ul className="text-sm space-y-1 mt-2 text-gray-300">
          <li><strong>Name:</strong> {data?.child?.name}</li>
          <li><strong>Gender:</strong> {data?.child?.gender}</li>
          <li><strong>Weight:</strong> {data?.child?.weight} kg</li>
          <li><strong>Height:</strong> {data?.child?.height} cm</li>
        </ul>
      </div>
    </div>
  );
};

export default MealDetails;