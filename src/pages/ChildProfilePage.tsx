import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Spinner } from '@telegram-apps/telegram-ui';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

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

const ChildProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { childId } = useParams<{ childId: string }>();
  const child = useSelector((state: RootState) =>
    state.children?.data?.find((c: Child) => c.id === childId)
  );

  const [loadingPage, setLoadingPage] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // const [week] = useState(0);
  // const [bmi] = useState(13.3);

  const {
    register,
    handleSubmit,
    reset,
    formState: { },
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

  const onSubmit = async (data: ChildFormData) => {
    if (!childId) return;
    setSubmitting(true);

    const updatedData = {
      ...data,
      weight: Number(data.weight),
      height: Number(data.height),
      muac: Number(data.muac),
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

  // const category = getBMICategory(week, bmi);

  if (loadingPage) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner size="l" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-400">Child Profile</h1>
        <Button onClick={() => setIsEditing(!isEditing)} className="bg-gray-800 text-white">
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <GrowthTracker />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-[#1E1E2F] border border-gray-700 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  {...register('name')}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
                <input
                  type="date"
                  {...register('date_of_birth')}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                <select
                  {...register('gender')}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                  disabled={!isEditing}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {(['weight', 'height', 'muac'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)} (kg/cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register(field)}
                    className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#1E1E2F] border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-emerald-300">Health Information</h2>
          {(['dietary_restrictions', 'allergies', 'medications'] as const).map((field) => (
            <div key={field} className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </label>
              <input
                {...register(field)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                disabled={!isEditing}
              />
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="flex justify-end gap-4">
            <Button stretched type="button" className="bg-red-600 text-white" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button stretched type="submit" className="bg-emerald-500 text-white" disabled={submitting}>
              {submitting ? <Spinner size="s" /> : 'Save Changes'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChildProfilePage;
