"use client";
import { useEffect, useState } from "react";
import { calculateHAZ } from "@/excelData/calculateHAZ";
import { calculateWHZ } from "@/excelData/calculateWHZ";
import { calculateWAZ } from "@/excelData/calculateWAZ";
import { differenceInWeeks } from "date-fns";
import { calculateBMIZ } from "@/excelData/calculateBMIZ";
import { calculateMUACZ } from "@/excelData/calculateMUACZ";
import { useTranslation } from "react-i18next";

const classifyZ = (z: number, type: string) => {
  if (type === "BMI") {
    if (z < -3)
      return {
        label: "Severe underweight",
        color: "text-red-500",
        note: "Urgent nutritional intervention needed.",
      };
    if (z < -2)
      return {
        label: "Moderate underweight",
        color: "text-orange-400",
        note: "May require monitoring.",
      };
    if (z < 1)
      return {
        label: "Normal weight",
        color: "text-emerald-400",
        note: "Healthy BMI range.",
      };
    if (z < 2)
      return {
        label: "Risk of overweight",
        color: "text-yellow-400",
        note: "Lifestyle changes may be needed.",
      };
    if (z < 3)
      return {
        label: "Overweight",
        color: "text-orange-500",
        note: "Potential obesity risk.",
      };
    return {
      label: "Obese",
      color: "text-red-600",
      note: "Intervention needed.",
    };
  }
  if (type === "MUAC") {
    if (z < -3)
      return {
        label: "Severe Acute Malnutrition (SAM)",
        color: "text-red-500",
        note: "Urgent feeding and care needed.",
      };
    if (z < -2)
      return {
        label: "Moderate Acute Malnutrition (MAM)",
        color: "text-orange-400",
        note: "Supplementary feeding required.",
      };
    if (z < 1)
      return {
        label: "Normal Nutrition",
        color: "text-emerald-400",
        note: "Balanced nutrition encouraged.",
      };
    if (z < 2)
      return {
        label: "Risk of Overnutrition",
        color: "text-yellow-400",
        note: "Monitor diet/activity.",
      };
    return {
      label: "Possible Obesity",
      color: "text-red-500",
      note: "Reduce fat intake & assess lifestyle.",
    };
  }
  if (type === "Height") {
    if (z < -3)
      return {
        label: "Severe malnutrition (Wasting)",
        color: "text-red-500",
        note: "Urgent care needed.",
      };
    if (z < -2)
      return {
        label: "Moderate malnutrition",
        color: "text-orange-400",
        note: "Nutrition support recommended.",
      };
    if (z < -1)
      return {
        label: "Mild underweight",
        color: "text-yellow-400",
        note: "Needs balanced nutrition.",
      };
    if (z < 1)
      return {
        label: "Normal",
        color: "text-emerald-400",
        note: "Healthy growth.",
      };
    if (z < 2)
      return {
        label: "Risk of Overweight",
        color: "text-yellow-400",
        note: "Watch weight trends.",
      };
    if (z < 3)
      return {
        label: "Overweight",
        color: "text-orange-500",
        note: "Increased health risks.",
      };
    return {
      label: "Obese",
      color: "text-red-600",
      note: "Immediate intervention advised.",
    };
  }
  // ✅ Default fallback
  return {
    label: "Unknown",
    color: "text-gray-500",
    note: "Unrecognized indicator type or missing data.",
  };
};

interface ChildProfile {
  date_of_birth: any;
  name: string;
  ageMonths: number;
  gender: string;
  weight: number;
  height: number;
  muac: number;
}

const GrowthTrackerHome = ({ childProfile }: { childProfile: any }) => {
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [zScores, setZScores] = useState<any>(null);
  const [expanded, setExpanded] = useState(true);
  const { t } = useTranslation();
  const gender =
    childProfile?.gender.toLowerCase() === "female" ? "girl" : "boy";
  useEffect(() => {
    if (childProfile) {
      setChild(childProfile);
      const hazResult = calculateHAZ(
        85, // heightCm
        29, // ageInWeeks
        7, // ageInMonths
        gender // gender
      );
      console.log("HAZ Z-Score:", hazResult.haz);
      // console.log("HAZ Classification:", hazResult.classification);
      const birthDate = new Date(childProfile.date_of_birth);
      const today = new Date();
      const ageInWeeks = differenceInWeeks(today, birthDate);
      function differenceInMonthsApprox(end: Date, start: Date): number {
        const msPerDay = 1000 * 60 * 60 * 24;
        const diffInMs = end.getTime() - start.getTime();
        const diffInDays = Math.floor(diffInMs / msPerDay);
        const months = Math.floor(diffInDays / 30);
        return months;
      }
      const ageInMonths = differenceInMonthsApprox(today, birthDate);
      const measuredStanding = childProfile.height > 87;
      const bmiResult = calculateBMIZ(
        childProfile.weight,
        childProfile.height,
        ageInWeeks <= 13 ? ageInWeeks : ageInMonths,
        ageInWeeks <= 13 ? "week" : "month",
        gender,
        measuredStanding
      );
      // console.log("ageInMonths", ageInMonths);
      // console.log("BMI Z-Score:", bmiResult);
      // console.log(
      // "Z-Score:",
      // calculateHAZ(childProfile.height, ageInWeeks, ageInMonths, gender)
      // );
      // 2. Normalize gender to "girl" or "boy"
      const calculatedZScores = {
        BMI: bmiResult,
        MUAC: calculateMUACZ(childProfile.muac, ageInMonths, gender).zScore,
        HAZ: calculateHAZ(childProfile.height, ageInWeeks, ageInMonths, gender),
        WHZ: calculateWHZ(
          childProfile.weight,
          childProfile.height,
          childProfile.gender === "Male" ? "boy" : "girl",
          getWHZRange(childProfile.date_of_birth)
        ),
        WAZ: calculateWAZ(
          childProfile.weight,
          getAgeDetails(childProfile.date_of_birth).age,
          getAgeDetails(childProfile.date_of_birth).type,
          childProfile.gender === "Male" ? "boy" : "girl"
        ),
      };
      setZScores(calculatedZScores);
    }
  }, [childProfile]);
  if (!child || !zScores)
    return <div className="text-center text-gray-400 mt-10">Loading...</div>;
  const indicators = [
    {
      key: "HAZ",
      label: "Height for Age",
      value: zScores.HAZ.haz,
      type: "Height",
    },
    {
      key: "WHZ",
      label: "Weight for Height",
      value: zScores.WHZ.zScore,
      type: "Height",
    },
    {
      key: "WAZ",
      label: "Weight for Age",
      value: zScores.WAZ.zScore,
      type: "BMI",
    },
    {
      key: "BMI",
      label: "BMI for Age",
      value: zScores.BMI.zScore,
      type: "BMI",
    },
    {
      key: "MUAC",
      label: "MUAC for Age",
      value: zScores.MUAC,
      type: "MUAC",
    },
  ];
  const visibleIndicators = expanded ? indicators : indicators.slice(0, 3);
  return (
    <div className="max-w-3xl mx-auto font-sans text-white space-y-4 p-4">
      <div className="text-center font-extrabold italic py-1 text-lime-600">
        Child: <span className=" underline">{child.name}</span>{" "}
        {t("Anthropometric")}
      </div>
      <div className="flex flex-row overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent md:grid md:grid-cols-3 md:overflow-x-visible">
        {visibleIndicators.map(({ key, label, value, type }) => {
          const result = classifyZ(value, type);
          const normalizedProgress = Math.max(0, Math.min(1, (value + 3) / 6));
          const dashOffset = 100 * (1 - normalizedProgress);
          return (
            <div
              key={key}
              className="flex-shrink-0 w-64 md:w-auto rounded-xl bg-[#0B8FAC] border border-gray-700 p-4 shadow-sm flex flex-col justify-center items-center"
            >
              <div className="relative size-40 flex flex-col justify-center items-center">
                <svg
                  className="size-full rotate-[-90deg]"
                  viewBox="0 0 36 36"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="text-gray-600"
                    strokeWidth="2"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className={`stroke-current ${result.color}`}
                    strokeWidth="4"
                    strokeDasharray="100 100"
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className={`text-4xl font-bold ${result.color}`}>
                    {value}
                  </span>
                  <span className={`${result.color} block`}>Z Score</span>
                </div>
              </div>
              <div className="mt-1 text-sm flex flex-col justify-center items-center ">
                <h3 className=" text-gray-100 font-bold text-xl"> {label}</h3>
                <p className={`font-medium ${result.color}`}>{result.label}</p>
                <p className="text-gray-200 text-xs">{result.note}</p>
              </div>
            </div>
          );
        })}
      </div>
      {indicators.length > 3 && (
        <div className="text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-teal-400 underline text-sm"
          >
            {expanded ? "View Less" : "View More"}
          </button>
        </div>
      )}
    </div>
  );
};
export default GrowthTrackerHome;

/**
 * Calculate difference in days between two dates
 */
const differenceInDays = (end: Date, start: Date): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((end.getTime() - start.getTime()) / msPerDay);
};
/**
 * Custom month difference assuming 1 month = 30 days
 */
const differenceInMonthsApprox = (end: Date, start: Date): number => {
  return Math.floor(differenceInDays(end, start) / 30);
};
/**
 * Custom week difference assuming 1 week = 7 days
 */
const differenceInWeeksApprox = (end: Date, start: Date): number => {
  return Math.floor(differenceInDays(end, start) / 7);
};
export const getAgeValue = (
  dob: string | Date,
  ageType: "week" | "month"
): number => {
  const birthDate = new Date(dob);
  const now = new Date();
  if (ageType === "week") return differenceInWeeksApprox(now, birthDate);
  return differenceInMonthsApprox(now, birthDate);
};
const getAgeDetails = (
  dob: string
): { age: number; type: "week" | "month" } => {
  const birthDate = new Date(dob);
  const now = new Date();
  const diffInDays = Math.floor((+now - +birthDate) / (1000 * 60 * 60 * 24));
  const ageInWeeks = Math.floor(diffInDays / 7);
  return ageInWeeks <= 13
    ? { age: ageInWeeks, type: "week" }
    : { age: Math.floor(diffInDays / 30), type: "month" };
};
const getWHZRange = (dob: string): "0_2" | "2_5" => {
  const birthDate = new Date(dob);
  const now = new Date();
  const ageInMonths = Math.floor(
    (+now - +birthDate) / (1000 * 60 * 60 * 24 * 30.44)
  );
  return ageInMonths < 24 ? "0_2" : "2_5";
};
