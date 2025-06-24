import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button, Input, Select, Spinner } from "@telegram-apps/telegram-ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addChild } from "@/redux/slices/childSlice";
import useTelegramUser from "@/hooks/useTelegramUser";

// ----------------------
// Types
// ----------------------
interface AddChildFormProps {
  onClose: () => void;
}

interface FormValues {
  name: string;
  date_of_birth: string;
  gender: "Male" | "Female";
  weight: number | string;
  height: number | string;
  muac: number | string;
  dietary_restrictions: string;
  allergies: string;
  medications: string;
}

// ----------------------
// Component
// ----------------------
const AddChildForm: React.FC<AddChildFormProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [submitting, setSubmitting] = useState(false);
  const telegramUser = JSON.parse(localStorage.getItem("user") || "{}");
  const parentId = telegramUser?.id;// ✅ Corrected your parentId (you had typo)

  const {
    handleSubmit,
    control,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      date_of_birth: "",
      gender: "Male",
      weight: "",
      height: "",
      muac: 0,
      dietary_restrictions: "",
      allergies: "",
      medications: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setSubmitting(true);

    const childData = {
      ...data,
      parentId: parentId ?? '',
      weight: parseFloat(data.weight.toString()),
      height: parseFloat(data.height.toString()),
      muac: parseFloat(data.muac.toString()),
    };

    try {
      await dispatch(addChild(childData)).unwrap();
      reset();
      onClose();
    } catch (error) {
      alert("Failed to add child");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
   <form
  onSubmit={handleSubmit(onSubmit)}
  className="flex flex-col space-y-4 max-h-[80vh] overflow-y-auto px-2"
>
   <Controller
    name="name"
    control={control}
    rules={{ required: "Name is required" }}
    render={({ field }) => (
      <div className="flex flex-col">
        <label htmlFor="name" className="text-sm font-medium mb-1">Name</label>
        <input
          {...field}
          id="name"
          type="text"
          placeholder="Full Name"
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
        />
      </div>
    )}
  />

  {/* Date of Birth and Gender Side-by-Side */}
  <div className="flex gap-4">
    {/* Date of Birth */}
    <Controller
      name="date_of_birth"
      control={control}
      rules={{ required: "Date of Birth is required" }}
      render={({ field }) => (
        <div className="flex flex-col flex-1">
          <label htmlFor="date_of_birth" className="text-sm font-medium mb-1">Date of Birth</label>
          <input
            {...field}
            id="date_of_birth"
            type="date"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
          />
        </div>
      )}
    />

    {/* Gender Select */}
    <Controller
      name="gender"
      control={control}
      rules={{ required: "Gender is required" }}
      render={({ field }) => (
        <div className="flex flex-col flex-1">
          <label htmlFor="gender" className="text-sm font-medium mb-1">Gender</label>
          <select
            {...field}
            id="gender"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      )}
    />
  </div>
  {[
    { name: 'name', label: 'Name', type: 'text' },

    { name: 'weight', label: 'Weight (kg)', type: 'number' },
    { name: 'height', label: 'Height (cm)', type: 'number' },
    { name: 'muac', label: 'MUAC (cm)', type: 'number' },
    { name: 'dietary_restrictions', label: 'Dietary Restrictions', placeholder: 'e.g., Lactose Intolerance' },
    { name: 'allergies', label: 'Allergies', placeholder: 'e.g., Peanuts' },
    { name: 'medications', label: 'Medications', placeholder: 'e.g., Vitamin D Supplements' },
  ].map(({ name, label, type = 'text', placeholder }) => (
    <Controller
      key={name}
      name={name as keyof FormValues}
      control={control}
      rules={{ required: `${label} is required` }}
      render={({ field }) => (
        <div className="flex flex-col">
          <label htmlFor={name} className="text-sm font-medium  mb-1">{label}</label>
          <input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
          />
        </div>
      )}
    />
  ))}

  

  {/* Submit and Cancel Buttons */}
  <div className="flex justify-end gap-4 mt-6">
    <Button stretched type="button" onClick={onClose}>
      Cancel
    </Button>
    <Button stretched type="submit" disabled={submitting}>
      {submitting ? <Spinner size="s" /> : "Add Child"}
    </Button>
  </div>
</form>

  );
};

export default AddChildForm;
