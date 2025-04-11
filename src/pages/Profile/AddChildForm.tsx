import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, Select, Spinner } from '@telegram-apps/telegram-ui';
import { useDispatch } from 'react-redux';
import { addChild } from '@/redux/slices/childSlice';

const AddChildForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const parentId = "ce10dd72-07d0-48f0-a774-295f8e36fdc0";
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log('Form Data:', data); // ✅ You’ll now see correct values
    setSubmitting(true);
    data = {...data , parentId: parentId,  weight: parseFloat(data.weight),
        height: parseFloat(data.height),
        muac: parseFloat(data.muac)}
    try {
      await dispatch(addChild(data)).unwrap();
      reset();
      onClose(); // close modal
    } catch (error) {
      alert('Failed to add child');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <Input label="Name" {...field} />}
      />

      <Controller
        name="date_of_birth"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <Input header="Date of Birth" type="date" {...field} />}
      />

      <Controller
        name="gender"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select header="Gender" {...field}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
        )}
      />

     
        <Controller
          name="weight"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <Input header="Weight (kg)" type="number" step="0.1" {...field} />}
        />
        <Controller
          name="height"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <Input header="Height (cm)" type="number" step="0.1" {...field} />}
        />
        <Controller
          name="muac"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <Input header="MUAC (cm)" type="number" step="0.1" {...field} />}
        />
      

      <div className="flex justify-end gap-4 mt-6">
        <Button stretched type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button stretched type="submit" disabled={submitting}>
          {submitting ? <Spinner size="s" /> : 'Add Child'}
        </Button>
      </div>
    </form>
  );
};

export default AddChildForm;
