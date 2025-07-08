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
import { useTranslation } from 'react-i18next';

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
  water?: number; // Added water to the result
};

const ChildProfilePage: React.FC = () => {
  const { t } = useTranslation();
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
    const {  weight, height, gender, date_of_birth } = watchFields;
    const months = date_of_birth ? Math.floor((new Date().getTime() - new Date(date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0;

    if (weight && height && gender && months) {
      console.log('Calculating nutrition needs...', months);
      const weightNum = Number(weight);
      const ageNum = months;
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
       let baseWater = 1600;
            if (ageNum <= 6) baseWater = 700;
            else if (ageNum <= 12) baseWater = 900;
            else if (ageNum <= 36) baseWater = 1300;

            const waterMultiplier = condition === "Catch-up Growth" ? 1.2
                                : condition === "Underweight" ? 1.15
                                : 1;

            const water = parseFloat((baseWater * waterMultiplier).toFixed(2));
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
        water
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
          <h1 className="text-2xl font-bold text-emerald-400">{t('Child Profile')}</h1>
          <Button onClick={() => setIsEditing(!isEditing)} className="bg-gray-800 text-white">
            {isEditing ? t('Cancel') : t('Edit')}
          </Button>
        </div>

        {isEditing && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-6">
            <motion.div className="..." initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Text className="...">{t('Basic Information')}</Text>
              <div className="...">
                <div>
                  <label>{t('Name')}</label>
                  <Input {...register('name')} placeholder={t("Enter child’s name")} />
                </div>
                <div>
                  <label>{t('Date of Birth')}</label>
                  <Input type="date" {...register('date_of_birth')} />
                </div>
                <div>
                  <label>{t('Gender')}</label>
                  <select {...register('gender')} className="...">
                    <option value="Male">{t('Male')}</option>
                    <option value="Female">{t('Female')}</option>
                  </select>
                </div>
                <div>
                  <label>{t('Weight (kg)')}</label>
                  <Input type="number" {...register('weight')} placeholder="e.g. 12.5" />
                </div>
                <div>
                  <label>{t('Height (cm)')}</label>
                  <Input type="number" {...register('height')} placeholder="e.g. 85" />
                </div>
                <div>
                  <label>{t('MUAC (cm)')}</label>
                  <Input type="number" {...register('muac')} placeholder="e.g. 13.2" />
                </div>
              </div>
            </motion.div>

            <motion.div className="..." initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Text className="...">{t('Health Details')}</Text>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Text>{t('Dietary Restrictions')}:</Text><Text>{watchFields.dietary_restrictions || '-'}</Text>
                </div>
                <Divider />
                <div className="flex justify-between">
                  <Text>{t('Allergies')}:</Text><Text>{watchFields.allergies || '-'}</Text>
                </div>
                <Divider />
                <div className="flex justify-between">
                  <Text>{t('Medications')}:</Text><Text>{watchFields.medications || '-'}</Text>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-end mt-4">
              <Button type="submit" stretched disabled={submitting}>
                {submitting ? <Spinner size="s" /> : t('Save Changes')}
              </Button>
            </div>
          </form>
        )}

        <GrowthTrackerHome childProfile={child} />

        <div className="...">
          <h3>{t('👶 Child Profile')}</h3>
          <div className="...">
            {child?.name && <div className="flex justify-between"><span>{t('Name')}:</span><span>{child.name}</span></div>}
            {child?.gender && <div className="flex justify-between"><span>{t('Gender')}:</span><span>{child.gender}</span></div>}
            {child?.date_of_birth && <div className="flex justify-between"><span>{t('Date of Birth')}:</span><span>{new Date(child.date_of_birth).toLocaleDateString()}</span></div>}
            {child?.height && <div className="flex justify-between"><span>{t('Height')}:</span><span>{child.height}</span></div>}
            {child?.weight && <div className="flex justify-between"><span>{t('Weight')}:</span><span>{child.weight}</span></div>}
            {child?.muac && <div className="flex justify-between"><span>{t('MUAC')}:</span><span>{child.muac}</span></div>}
          </div>
        </div>

        {result ? (
          <motion.div className="..." initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Text className="...">{t('Daily Nutrition requirement')}</Text>
            <Divider />
            <div className="flex justify-between"><Text>{t('🔥 Calories')}:</Text><Text>{result.calories} kcal</Text></div>
            <div className="flex justify-between"><Text>{t('💪 Protein')}:</Text><Text>{result.protein} g</Text></div>
            <div className="flex justify-between"><Text>{t('🧈 Fat')}:</Text><Text>{result.fat} g</Text></div>
            <div className="flex justify-between"><Text>{t('🍞 Carbs')}:</Text><Text>{result.carbs} g</Text></div>
            <Divider />
            <div className="flex justify-between"><Text>{t('🩸 Iron')}:</Text><Text>{result.iron} mg</Text></div>
            <div className="flex justify-between"><Text>{t('🦴 Calcium')}:</Text><Text>{result.calcium} mg</Text></div>
            <div className="flex justify-between"><Text>{t('👁️ Vitamin A')}:</Text><Text>{result.vitaminA} mcg</Text></div>
            <div className="flex justify-between"><Text>{t('💧 Water')}:</Text><Text>{result.water} ml</Text></div>
          </motion.div>
        ) : (
          <Placeholder header={t('Waiting for input...')} className="mt-6">
            <Caption>{t("Fill all fields above to calculate your child's needs.")}</Caption>
          </Placeholder>
        )}
      </div>
    </Page>
  );
};

export default ChildProfilePage;
