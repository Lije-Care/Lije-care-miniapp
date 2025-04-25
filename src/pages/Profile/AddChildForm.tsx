import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button, Input, Select, Spinner } from "@telegram-apps/telegram-ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addChild } from "@/redux/slices/childSlice";

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
}

// ----------------------
// Component
// ----------------------
const AddChildForm: React.FC<AddChildFormProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [submitting, setSubmitting] = useState(false);

  const parentId = "dc8e1deb-a6bc-41a2-8518-e3e85b83b38d";

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
      muac: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setSubmitting(true);

    const childData = {
      ...data,
      parentId,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        rules={{ required: "Name is required" }}
        render={({ field }) => <Input header="Name" {...field} />}
      />

      <Controller
        name="date_of_birth"
        control={control}
        rules={{ required: "Date of birth is required" }}
        render={({ field }) => (
          <Input header="Date of Birth" type="date" {...field} />
        )}
      />

      <Controller
        name="gender"
        control={control}
        rules={{ required: "Gender is required" }}
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
        rules={{ required: "Weight is required" }}
        render={({ field }) => (
          <Input header="Weight (kg)" type="number" step="0.1" {...field} />
        )}
      />

      <Controller
        name="height"
        control={control}
        rules={{ required: "Height is required" }}
        render={({ field }) => (
          <Input header="Height (cm)" type="number" step="0.1" {...field} />
        )}
      />

      <Controller
        name="muac"
        control={control}
        rules={{ required: "MUAC is required" }}
        render={({ field }) => (
          <Input header="MUAC (cm)" type="number" step="0.1" {...field} />
        )}
      />

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
