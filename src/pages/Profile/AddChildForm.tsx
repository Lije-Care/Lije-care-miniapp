import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button, Input, Select, Spinner } from "@telegram-apps/telegram-ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addChild } from "@/redux/slices/childSlice";
import { useTranslation } from "react-i18next";

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

const AddChildForm: React.FC<AddChildFormProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [submitting, setSubmitting] = useState(false);
  const telegramUser = JSON.parse(localStorage.getItem("user") || "{}");
  const parentId = telegramUser?.id;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      date_of_birth: "",
      gender: "Male",
      weight: "",
      height: "",
      muac: "",
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
      alert(t("Failed to add child"));
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const formFields = [
    { name: 'name', label: t("Name"), placeholder: t("Enter child's name"), type: 'text' },
    { name: 'date_of_birth', label: t("Date of Birth"), type: 'date' },
    { name: 'gender', label: t("Gender"), type: 'select', options: [
      { value: "Male", label: t("Male") },
      { value: "Female", label: t("Female") }
    ]},
    { name: 'weight', label: t("Weight (kg)"), type: 'number' },
    { name: 'height', label: t("Height (cm)"), type: 'number' },
    { name: 'muac', label: t("MUAC (cm)"), type: 'number' },
    { 
      name: 'dietary_restrictions', 
      label: t("Dietary Restrictions"), 
      placeholder: t("e.g., Lactose Intolerance"),
      type: 'text',
      required: false
    },
    { 
      name: 'allergies', 
      label: t("Allergies"), 
      placeholder: t("e.g., Peanuts"),
      type: 'text',
      required: false 
    },
    { 
      name: 'medications', 
      label: t("Medications"), 
      placeholder: t("e.g., Vitamin D Supplements"),
      type: 'text',
      required: false 
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4 max-h-[80vh] overflow-y-auto px-2">
      {formFields.map((field) => (
        <Controller
          key={field.name}
          name={field.name as keyof FormValues}
          control={control}
          rules={{ 
            required: field.required === false ? false : t("{{field}} is required", { field: field.label })
          }}
          render={({ field: controllerField }) => (
            <div className="flex flex-col">
              <label htmlFor={field.name} className="text-sm font-medium mb-1">
                {field.label}
                {field.required !== false && <span className="text-red-500">*</span>}
              </label>
              
              {field.type === 'select' ? (
                <select
                  {...controllerField}
                  id={field.name}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
                >
                  {field.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...controllerField}
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
                />
              )}
              
              {errors[field.name as keyof FormValues] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[field.name as keyof FormValues]?.message}
                </p>
              )}
            </div>
          )}
        />
      ))}

      <div className="flex justify-end gap-4 mt-6">
        <Button stretched type="button" onClick={onClose}>
          {t("Cancel")}
        </Button>
        <Button stretched type="submit" disabled={submitting}>
          {submitting ? <Spinner size="s" /> : t("Add Child")}
        </Button>
      </div>
    </form>
  );
};

export default AddChildForm;