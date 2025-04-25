'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Select, Spinner, Text, Caption, Divider, Placeholder } from '@telegram-apps/telegram-ui';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import { updateChild, Child } from '@/redux/slices/childSlice';
import type { RootState, AppDispatch } from '@/redux/store';
import GrowthTracker from './Profile/GrowthTracker';

type ChildFormData = {
  name: string;
  date_of_birth: string;
  gender: string;
  weight: number;
  height: number;
  muac: number;
  dietary_restrictions: string;
  allergies: string;
  medications: string;
};

type NutritionFormState = {
  age: string;
  sex: string;
  weight: string;
  height: string;
  activity: string;
  condition: string;
};

type Result = {
  bmi: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  iron: number;
  calcium: number;
  vitaminA: number;
  status: string;
  error?: string;
};

const ChildProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { childId } = useParams<{ childId: string }>();
  const child = useSelector((state: RootState) =>
    state.children?.data?.find((c: Child) => c.id === childId)
  );

  const [loadingPage, setLoadingPage] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm<ChildFormData>({
    defaultValues: {
      name: '',
      date_of_birth: '',
      gender: 'Male',
      weight: 0,
      height: 0,
      muac: 0,
      dietary_restrictions: '',
      allergies: '',
      medications: '',
    },
  });

  const watchFields = watch();

  useEffect(() => {
    if (child) {
      reset({
        ...child,
        muac: child.muac ?? 0,
        dietary_restrictions: child.dietary_restrictions ?? '',
        allergies: child.allergies ?? '',
        medications: child.medications ?? '',
      });
      setLoadingPage(false);
    }
  }, [child, reset]);

  useEffect(() => {
    const { weight, height, gender, date_of_birth } = watchFields;
    const months = date_of_birth ? Math.floor((new Date().getTime() - new Date(date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0;

    if (weight && height && gender && months) {
      const weightNum = Number(weight);
      const heightNum = Number(height);
      const bmi = weightNum / ((heightNum / 100) ** 2);
      const roundedBMI = parseFloat(bmi.toFixed(2));

      let caloriePerKg = months <= 6 ? 108 : months <= 12 ? 98 : months <= 36 ? 102 : 90;
      let calories = weightNum * caloriePerKg;

      enum Activity {
        Active = 'Active',
        Moderate = 'Moderate',
        Sedentary = 'Sedentary',
      }
      
      enum Condition {
        CatchUpGrowth = 'Catch-up Growth',
        Underweight = 'Underweight',
        Overweight = 'Overweight',
        Normal = 'Normal',
      }
      
      // Usage:
      const activity: Activity = Activity.Moderate;
      const condition: Condition = Condition.Normal;
      
      const ActivityFactors: Record<Activity, number> = {
        [Activity.Active]: 1.26,
        [Activity.Moderate]: 1.13,
        [Activity.Sedentary]: 1,
      };
      
      const HealthFactors: Record<Condition, number> = {
        [Condition.CatchUpGrowth]: 1.2,
        [Condition.Underweight]: 1.15,
        [Condition.Overweight]: 0.9,
        [Condition.Normal]: 1,
      };
      
      const activityFactor = ActivityFactors[activity];
      const healthFactor = HealthFactors[condition];
      
      
      calories *= activityFactor * healthFactor;

      const protein = parseFloat((calories * 0.12 / 4).toFixed(2));
      const fat = parseFloat((calories * 0.35 / 9).toFixed(2));
      const carbs = parseFloat((calories * 0.53 / 4).toFixed(2));

      let calcium = months <= 6 ? 200 : months <= 12 ? 260 : months <= 36 ? 700 : 1000;
      let iron = months <= 6 ? 0.27 : months <= 12 ? 11 : months <= 36 ? 7 : 10;
      let vitaminA = months <= 6 ? 400 : months <= 12 ? 500 : months <= 36 ? 300 : 400;

      let status = 'Normal';
      if (bmi < 14) status = 'Underweight';
      else if (bmi > 17) status = 'Overweight';

      setResult({
        bmi: roundedBMI.toString(),
        calories: parseInt(calories.toFixed(0)),
        protein,
        fat,
        carbs,
        iron: parseFloat(iron.toFixed(1)),
        calcium,
        vitaminA,
        status,
      });
    } else {
      setResult(null);
    }
  }, [watchFields]);

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const updatedData = {
      ...data,
      weight: parseFloat(data.weight),
      height: parseFloat(data.height),
      muac: parseFloat(data.muac),
    };
    try {
      await dispatch(updateChild({ id: childId, ...updatedData })).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPage) {
    return <div className="flex justify-center items-center h-32"><Spinner size="l" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-400">Child Profile</h1>
        <Button onClick={() => setIsEditing(!isEditing)} className="bg-gray-800 text-white">
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      <GrowthTracker />
     
      {result ? (
            <motion.div
             className="bg-[#1E1E2F] border border-gray-700 p-5 rounded-xl shadow-md"
            
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            >
                <div >
            <Text className="text-emerald-400 text-lg font-semibold text-center">Nutrition Summary</Text>
            <div className="flex justify-between"><Text>BMI:</Text><Text>{result.bmi}</Text></div>
            <div className="flex justify-between"><Text>Status:</Text><Text>{result.status}</Text></div>
            <Divider />
            <div className="flex justify-between"><Text>🔥 Calories:</Text><Text>{result.calories} kcal</Text></div>
            <div className="flex justify-between"><Text>💪 Protein:</Text><Text>{result.protein} g</Text></div>
            <div className="flex justify-between"><Text>🧈 Fat:</Text><Text>{result.fat} g</Text></div>
            <div className="flex justify-between"><Text>🍞 Carbs:</Text><Text>{result.carbs} g</Text></div>
            <Divider />
            <div className="flex justify-between"><Text>🩸 Iron:</Text><Text>{result.iron} mg</Text></div>
            <div className="flex justify-between"><Text>🦴 Calcium:</Text><Text>{result.calcium} mg</Text></div>
            <div className="flex justify-between"><Text>👁️ Vitamin A:</Text><Text>{result.vitaminA} mcg</Text></div>
            </div>
            </motion.div>
        ) : (
            <Placeholder header="Waiting for input...">
            <Caption>Fill all fields above to calculate your child's needs.</Caption>
            </Placeholder>
        )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-[#1E1E2F] border border-gray-700 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input {...register('name')} placeholder="Name" disabled={!isEditing} />
              <Input type="date" {...register('date_of_birth')} disabled={!isEditing} />
              <Select {...register('gender')} disabled={!isEditing}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </div>
            <div className="space-y-4">
              <Input type="number" step="0.1" {...register('weight')} placeholder="Weight (kg)" disabled={!isEditing} />
              <Input type="number" step="0.1" {...register('height')} placeholder="Height (cm)" disabled={!isEditing} />
              <Input type="number" step="0.1" {...register('muac')} placeholder="MUAC (cm)" disabled={!isEditing} />
            </div>
          </div>
        </div>

        <div className="bg-[#1E1E2F] border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-emerald-300">Health Information</h2>
          <Input {...register('dietary_restrictions')} placeholder="Dietary Restrictions" disabled={!isEditing} />
          <Input {...register('allergies')} placeholder="Allergies" disabled={!isEditing} />
          <Input {...register('medications')} placeholder="Medications" disabled={!isEditing} />
        </div>

       
        

        {isEditing && (
          <div className="flex justify-end gap-4">
            <Button type="submit" stretched disabled={submitting} className="bg-emerald-600">
              {submitting ? <Spinner size="s" /> : 'Save Changes'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChildProfilePage;
