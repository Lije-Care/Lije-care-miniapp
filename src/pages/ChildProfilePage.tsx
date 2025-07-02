'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Select, Spinner, Text, Caption, Divider, Placeholder } from '@telegram-apps/telegram-ui';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import { updateChild, Child } from '@/redux/slices/childSlice';
import type { RootState, AppDispatch } from '@/redux/store';
// import GrowthTracker from './Profile/GrowthTracker';
import GrowthTrackerAll from './Profile/GrowthTracker';
import { Page } from '@/components/Page';
import GrowthTrackerHome from './Profile/GrowthTrackerHome';

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

  function formatDateToYYYYMMDD(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // returns "YYYY-MM-DD"
}


useEffect(() => {
  if (child) {
    reset({
      ...child,
      date_of_birth: formatDateToYYYYMMDD(child.date_of_birth),
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
  <Page back={true}>
    <div className="max-w-4xl mx-auto p-4 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-400">Child Profile</h1>
        <Button onClick={() => setIsEditing(!isEditing)} className="bg-gray-800 text-white">
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-6">
          {/* Basic Info */}
          <motion.div
            className="bg-[#1E1E2F] border border-gray-700 rounded-xl p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Text className="text-xl font-semibold text-emerald-300 mb-4">Basic Information</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Name</label>
                <Input {...register('name')} placeholder="Enter child’s name" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Date of Birth</label>
                <Input type="date" {...register('date_of_birth')} />
              </div>
              <div>   
                <label className="text-sm text-gray-400 mb-1 block">Gender</label>
                <select
                  {...register('gender')}
                  className="w-full border border-gray-300 rounded-md px-6 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-[#1E1E2F] text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Weight (kg)</label>
                <Input type="number" step="0.1" {...register('weight')} placeholder="e.g. 12.5" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Height (cm)</label>
                <Input type="number" step="0.1" {...register('height')} placeholder="e.g. 85" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">MUAC (cm)</label>
                <Input type="number" step="0.1" {...register('muac')} placeholder="e.g. 13.2" />
              </div>
            </div>
          </motion.div>

          {/* Health Details - Styled like Nutrition Summary */}
          <motion.div
            className="bg-[#1E1E2F] border border-gray-700 p-5 rounded-xl shadow-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Text className="text-emerald-400 text-lg font-semibold text-center mb-4">Health Details</Text>
            <div className="space-y-4">
              <div className="flex justify-between"><Text>Dietary Restrictions:</Text><Text>{watchFields.dietary_restrictions || '-'}</Text></div>
              <Divider />
              <div className="flex justify-between"><Text>Allergies:</Text><Text>{watchFields.allergies || '-'}</Text></div>
              <Divider />
              <div className="flex justify-between"><Text>Medications:</Text><Text>{watchFields.medications || '-'}</Text></div>
            </div>
          </motion.div>

          <div className="flex justify-end mt-4">
            <Button type="submit" stretched disabled={submitting} className="bg-emerald-600 text-white">
              {submitting ? <Spinner size="s" /> : 'Save Changes'}
            </Button>
          </div>
        </form>
      )}

      {/* Growth and Nutrition Tracker (Always visible) */}
      {/* <GrowthTrackerAll childProfile={child} /> */}
      <GrowthTrackerHome childProfile={child} />
       <div className="bg-[#1E1E2F] border border-gray-700 rounded-xl mt-4 p-5 space-y-2 mb-5">
        <h3 className="text-lg font-semibold text-center text-gray-300 mb-2">👶 Child Profile</h3>
         <div className="text-sm text-gray-400 space-y-1">
            {child?.name && (
              <div className="flex justify-between">
                <span className="font-semibold">Name:</span>
                <span>{child?.name}</span>
              </div>
            )}
            {child?.gender && (
              <div className="flex justify-between">
                <span className="font-semibold">Gender:</span>
                <span>{child.gender}</span>
              </div>
            )}
            {child?.date_of_birth && (
                    <div className="flex justify-between">
                      <span className="font-semibold">Date of Birth:</span>
                      <span>{new Date(child.date_of_birth).toLocaleDateString()}</span>
                    </div>
             )}

            {child?.height && (
            <div className="flex justify-between">
              <span className="font-semibold">Height:</span>
              <span>{child.height}</span>
            </div>
          )}
            {child?.weight && (
              <div className="flex justify-between">
                <span className="font-semibold">weight:</span>
                <span>{child.weight}</span>
              </div>
            )}
         {child?.muac && (
            <div className="flex justify-between"> 
                 <span className="font-semibold">MUAC:</span>
                <span>{child.muac}</span>
              </div>
            )}
          </div>
      </div>

      {/* Nutrition Summary (always shown if data available) */}
      {result ? (
        <motion.div
          className="bg-[#1E1E2F] border border-gray-700 p-5 rounded-xl shadow-md mt-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Text className="text-emerald-400 text-lg font-semibold text-center mb-2">Nutrition Summary</Text>
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
        </motion.div>
      ) : (
        <Placeholder header="Waiting for input..." className="mt-6">
          <Caption>Fill all fields above to calculate your child's needs.</Caption>
        </Placeholder>
      )}
    </div>
  </Page>
);
};

export default ChildProfilePage;
