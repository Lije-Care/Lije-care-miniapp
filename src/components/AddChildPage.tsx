import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button, Input, Select, Spinner, Headline, Section } from "@telegram-apps/telegram-ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addChild } from "@/redux/slices/childSlice";
import useTelegramUser from "@/hooks/useTelegramUser";
import { useNavigate } from "react-router-dom";

// ----------------------
// Types
// ----------------------
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
// Page Component
// ----------------------
const AddChildPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const telegramUser = useTelegramUser();
  const parentId = telegramUser?.id;

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
      navigate("/"); // Redirect after success
    } catch (error) {
      alert("Failed to add child");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <Section>
        <Headline>Add Your Child</Headline>
      </Section>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 max-h-[80vh] overflow-y-auto px-2"
      >
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

        <Controller
          name="dietary_restrictions"
          control={control}
          render={({ field }) => (
            <Input header="Dietary Restrictions" placeholder="e.g., Lactose Intolerance" {...field} />
          )}
        />

        <Controller
          name="allergies"
          control={control}
          render={({ field }) => (
            <Input header="Allergies" placeholder="e.g., Peanuts" {...field} />
          )}
        />

        <Controller
          name="medications"
          control={control}
          render={({ field }) => (
            <Input header="Medications" placeholder="e.g., Vitamin D Supplements" {...field} />
          )}
        />

        <div className="flex justify-end gap-4 mt-6">
          <Button stretched type="button" onClick={() => navigate("/")}>
            Cancel
          </Button>
          <Button stretched type="submit" disabled={submitting}>
            {submitting ? <Spinner size="s" /> : "Add Child"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddChildPage;
