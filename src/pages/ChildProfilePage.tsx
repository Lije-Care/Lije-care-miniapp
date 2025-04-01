import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Spinner } from '@telegram-apps/telegram-ui';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import InterpretZScore from '@/components/InterpretZScore';
import { calculateZScore, getBMICategory } from '@/utils/calculateZScore';
import { updateChild } from '@/redux/slices/childSlice';

const ChildProfilePage = () => {
  const dispatch = useDispatch();
  const { childId } = useParams<{ childId: string }>();
  const child = useSelector((state) => state.children.data.find((c) => c.id === childId));
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [week, setWeek] = useState(0);
  const [bmi, setBmi] = useState(13.3);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      date_of_birth: "",
      gender: "",
      weight: 0,
      height: 0,
      muac: 0,
      dietary_restrictions: "",
      allergies: "",
      medications: "",
    },
  });

  useEffect(() => {
    setLoading(true)
    if (child) {
      Object.keys(child).forEach((key) => {
        setValue(key, child[key]);
      });
      setLoading(false)
    }
  }, [child, setValue]);

  const onSubmit = (data) => {
    setLoading(true)
    const updatedData = {
      ...data,
      weight: parseFloat(data.weight),
      height: parseFloat(data.height),
      muac: parseFloat(data.muac),
    };

    dispatch(updateChild({ id: childId, ...updatedData })).then((res)=>{
      setLoading(false)
    });
    setIsEditing(false);
  };

  const category = getBMICategory(week, bmi);
  if(loading == true)
    return( <div className="flex justify-center items-center h-20"><Spinner size="l"/></div>)
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Child Profile</h1>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-black rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input {...register("name")} className="w-full p-2 rounded border" disabled={!isEditing} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input type="date" {...register("date_of_birth")} className="w-full p-2 rounded border" disabled={!isEditing} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select {...register("gender")} className="w-full p-2 rounded border" disabled={!isEditing}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {['weight', 'height', 'muac'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input type="number" step="0.1" {...register(field)} className="w-full p-2 rounded border" disabled={!isEditing} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block font-medium text-gray-700">Select Week:</label>
          <input type="number" value={week} onChange={(e) => setWeek(parseInt(e.target.value))} className="w-full p-2 border rounded-md mb-4" min={0} max={5} />

          <label className="block font-medium text-gray-700">Enter BMI:</label>
          <input type="number" value={bmi} onChange={(e) => setBmi(parseFloat(e.target.value))} className="w-full p-2 border rounded-md mb-4" />
        </div>

        <div className={`p-4 rounded-lg text-white text-center ${category.color} transition duration-500`}>
          <h2 className="text-lg font-bold">{category.label}</h2>
          <p className="text-sm">BMI: {bmi.toFixed(2)}</p>
        </div>

        <InterpretZScore zScore={calculateZScore(watch("height"), 100, 10)} />

        <div className="bg-black rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Health Information</h2>
          {['dietary_restrictions', 'allergies', 'medications'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1">
                {field.replace('_', ' ').toUpperCase()}
              </label>
              <input {...register(field)} className="w-full p-2 rounded border" disabled={!isEditing} />
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="flex justify-end gap-4">
            <Button stretched onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button stretched type="submit">Save Changes</Button>
          </div>
        )}
      </form>
      
    </div>
  );
};

export default ChildProfilePage;
