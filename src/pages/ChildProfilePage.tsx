"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Input,
  Spinner,
  Text,
  Divider,
} from "@telegram-apps/telegram-ui";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { updateChild, Child } from "@/redux/slices/childSlice";
import type { RootState, AppDispatch } from "@/redux/store";

import GrowthTracker from "./Profile/GrowthTracker";

import { Page } from "@/components/Page";
import { useTranslation } from "react-i18next";

type ChildFormData = {
  name: string;
  date_of_birth: string;
  gender: string;
  weight: number;
  height: number;
  muac: number;
  dietary_restrictions: string;
  allergies: string;
  activity_level: "Active" | "Moderate" | "Sedentary";
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
  water: number;
  zinc: number;
  status: string;
  error?: string;
};

const ChildProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { childId } = useParams<{ childId: string }>();
  const child = useSelector((state: RootState) =>
    state.children?.data?.find((c: Child) => c.id === childId)
  );
  // console.log(child?.activity_level);

  const [loadingPage, setLoadingPage] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const { register, handleSubmit, reset, watch } = useForm<ChildFormData>({
    defaultValues: {
      name: "",
      date_of_birth: "",
      gender: "Male",
      weight: 0,
      height: 0,
      muac: 0,
      dietary_restrictions: "",
      allergies: "",
      medications: "",
      activity_level: "Moderate",
    },
  });

  const formatDateToYYYYMMDD = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (child) {
      reset({
        ...child,
        date_of_birth: formatDateToYYYYMMDD(child.date_of_birth),
        muac: child.muac ?? 0,
        dietary_restrictions: child.dietary_restrictions ?? "",
        allergies: child.allergies ?? "",
        medications: child.medications ?? "",
      });
      setLoadingPage(false);
    }
  }, [child, reset]);

  const weight = watch("weight");
  const height = watch("height");
  const gender = watch("gender");
  const date_of_birth = watch("date_of_birth");

  useEffect(() => {
    const calculateAgeInMonths = (birthDate: string): number => {
      if (!birthDate) return 0;
      const today = new Date();
      const birth = new Date(birthDate);

      let years = today.getFullYear() - birth.getFullYear();
      let months = today.getMonth() - birth.getMonth();

      if (today.getDate() < birth.getDate()) {
        months -= 1;
      }

      if (months < 0) {
        years -= 1;
        months += 12;
      }

      return years * 12 + months;
    };

    const months = calculateAgeInMonths(date_of_birth);

    if (weight && height && gender && months >= 0) {
      const weightNum = Number(weight);
      const heightNum = Number(height);
      const bmi = weightNum / (heightNum / 100) ** 2;
      const roundedBMI = parseFloat(bmi.toFixed(2));

      let status = "Normal";
      if (bmi < 14) status = "Underweight";
      else if (bmi > 17) status = "Overweight";

      // Calculate calories based on age
      let value1: number;
      if (months <= 6) {
        value1 = weightNum * 108;
      } else if (months <= 36) {
        value1 = weightNum * 102;
      } else {
        value1 = weightNum * 90;
      }

      // Activity level multiplier
      const activityLevel = child?.activity_level;
      let value2: number;
      if (activityLevel === "Moderate") {
        value2 = 1.13;
      } else if (activityLevel === "Active") {
        value2 = 1.26;
      } else {
        value2 = 1;
      }

      // Health condition multiplier
      let value3: number;
      if (status === "Overweight") {
        value3 = 0.9;
      } else if (status === "Underweight") {
        value3 = 1.15;
      } else {
        value3 = 1;
      }

      // Calculate total calories
      const calories = value1 * value2 * value3;

      // Calculate macronutrients
      const protein = parseFloat(((calories * 0.12) / 4).toFixed(2));
      const fat = parseFloat(((calories * 0.35) / 9).toFixed(2));
      const carbs = parseFloat(((calories * 0.5) / 4).toFixed(2));

      // Calculate micronutrients
      let iron: number;
      if (months <= 6) {
        iron = 0.27;
      } else if (months <= 12) {
        iron = 11;
      } else if (months <= 36) {
        iron = 7;
      } else {
        iron = 10;
      }

      let calcium: number;
      let vitaminA: number;
      let water: number;
      let zinc: number;
      if (months <= 6) {
        calcium = 200;
        vitaminA = 400;
        water = 700;
        zinc = 2;
      } else if (months <= 12) {
        calcium = 260;
        vitaminA = 500;
        water = 900;
        zinc = 3;
      } else if (months <= 36) {
        calcium = 700;
        vitaminA = 300;
        water = 1300;
        zinc = 3;
      } else {
        calcium = 1000;
        vitaminA = 400;
        water = 1600;
        zinc = 5;
      }

      setResult({
        bmi: roundedBMI.toString(),
        calories: parseInt(calories.toFixed(0)),
        protein,
        fat,
        carbs,
        iron: parseFloat(iron.toFixed(2)),
        calcium,
        vitaminA,
        water,
        zinc,
        status,
      });
    } else {
      setResult(null);
    }
  }, [weight, height, gender, date_of_birth]);

  useEffect(() => {
    if (result) {
      // console.log("Child Profile:", result);
    }
  }, [result]);

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
      console.error("Update failed", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPage) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner size="l" />
      </div>
    );
  }

  return (
    <Page back={true}>
      <div className="max-w-4xl mx-auto p-4 text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-400">
            {t("Child Profile")}
          </h1>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-gray-800 text-white"
          >
            {isEditing ? t("Cancel") : t("Edit")}
          </Button>
        </div>
        <h2 className=" ml-6 text-gray-300 font-semibold text-xl">
          Anthropometric Assessment
        </h2>

        {isEditing && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Text>{t("Basic Information")}</Text>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label>{t("Name")}</label>
                  <Input {...register("name")} />
                </div>
                <div>
                  <label>{t("Date of Birth")}</label>
                  <Input type="date" {...register("date_of_birth")} />
                </div>
                <div>
                  <label>{t("Gender")}</label>
                  <select
                    {...register("gender")}
                    className="w-full p-2 bg-black text-white border rounded"
                  >
                    <option value="Male">{t("Male")}</option>
                    <option value="Female">{t("Female")}</option>
                  </select>
                </div>
                <div>
                  <label>{t("Weight (kg)")}</label>
                  <Input type="number" {...register("weight")} />
                </div>
                <div>
                  <label>{t("Height (cm)")}</label>
                  <Input type="number" {...register("height")} />
                </div>

                <div>
                  <label>{t("Activity Level")}</label>
                  <select
                    {...register("activity_level")}
                    className="w-full p-2 bg-black text-white border rounded"
                  >
                    <option value="Active">{t("Active")}</option>
                    <option value="Moderate">{t("Moderate")}</option>
                    <option value="Sedentary">{t("Sedentary")}</option>
                  </select>
                </div>
                <div>
                  <label>{t("MUAC (cm)")}</label>
                  <Input type="number" {...register("muac")} />
                </div>
              </div>
            </motion.div>

            <div className="flex justify-end mt-4">
              <Button type="submit" stretched disabled={submitting}>
                {submitting ? <Spinner size="s" /> : t("Save Changes")}
              </Button>
            </div>
          </form>
        )}

        {!isEditing && (
          <div>
            <GrowthTracker childProfile={child} />
            <div className="bg-[#1E1E2F] border border-gray-700 rounded-xl mt-4 p-5 space-y-2 mb-5">
              <h3 className="text-lg font-semibold text-center text-gray-300 mb-2">
                👶 General Profile
              </h3>
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
                {child?.activity_level && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Active Level:</span>
                    <span>{child.activity_level}</span>
                  </div>
                )}
                {child?.date_of_birth && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Date of Birth:</span>
                    <span>
                      {new Date(child.date_of_birth).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {child?.height && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Height (cm):</span>
                    <span>{child.height}</span>
                  </div>
                )}
                {child?.weight && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Weight (kg):</span>
                    <span>{child.weight}</span>
                  </div>
                )}
                {child?.muac && (
                  <div className="flex justify-between">
                    <span className="font-semibold">MUAC (cm):</span>
                    <span>{child.muac}</span>
                  </div>
                )}

                <Divider />
                {child?.dietary_restrictions && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Dietary Restrictions:</span>
                    <span>{child.dietary_restrictions || "-"}</span>
                  </div>
                )}
                {child?.allergies && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Allergies:</span>
                    <span>{child.allergies || "-"}</span>
                  </div>
                )}
                {child?.medications && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Medications:</span>
                    <span>{child.medications || "-"}</span>
                  </div>
                )}
              </div>
            </div>
            {result && (
              <div className="bg-[#1E1E2F] border border-gray-700 rounded-xl mt-4 p-5 space-y-2 mb-5">
                <h3 className="text-lg font-semibold text-center text-gray-300 mb-2">
                  📊 Daily Nutrient Requirements
                </h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold">Calories:</span>
                    <span>{result.calories} kcal/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Protein:</span>
                    <span>{result.protein} g/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Fat:</span>
                    <span>{result.fat} g/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Carbohydrates:</span>
                    <span>{result.carbs} g/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Iron:</span>
                    <span>{result.iron} mg/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Calcium:</span>
                    <span>{result.calcium} mg/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Vitamin A:</span>
                    <span>{result.vitaminA} mcg/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Water:</span>
                    <span>{result.water} ml/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Zinc:</span>
                    <span>{result.zinc} mg/day</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Page>
  );
};

export default ChildProfilePage;
