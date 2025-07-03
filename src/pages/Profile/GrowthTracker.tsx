"use client";

import { useEffect, useState } from "react";
import { calculateHAZ } from "@/excelData/calculateHAZ";
import { calculateWHZ } from "@/excelData/calculateWHZ";
import { calculateWAZ } from "@/excelData/calculateWAZ";
import { differenceInWeeks, differenceInMonths } from "date-fns";
 
const classifyZ = (z: number, type: string) => {
  if (type === "BMI") {
    if (z < -3) return { label: "Severe underweight", color: "text-red-500", note: "Urgent nutritional intervention needed." };
    if (z < -2) return { label: "Moderate underweight", color: "text-orange-400", note: "May require monitoring." };
    if (z < 1) return { label: "Normal weight", color: "text-emerald-400", note: "Healthy BMI range." };
    if (z < 2) return { label: "Risk of overweight", color: "text-yellow-400", note: "Lifestyle changes may be needed." };
    if (z < 3) return { label: "Overweight", color: "text-orange-500", note: "Potential obesity risk." };
    return { label: "Obese", color: "text-red-600", note: "Intervention needed." };
  }

  if (type === "MUAC") {
    if (z < -3) return { label: "Severe Acute Malnutrition (SAM)", color: "text-red-500", note: "Urgent feeding and care needed." };
    if (z < -2) return { label: "Moderate Acute Malnutrition (MAM)", color: "text-orange-400", note: "Supplementary feeding required." };
    if (z < 1) return { label: "Normal Nutrition", color: "text-emerald-400", note: "Balanced nutrition encouraged." };
    if (z < 2) return { label: "Risk of Overnutrition", color: "text-yellow-400", note: "Monitor diet/activity." };
    return { label: "Possible Obesity", color: "text-red-500", note: "Reduce fat intake & assess lifestyle." };
  }

  if (type === "Height") {
    if (z < -3) return { label: "Severe malnutrition (Wasting)", color: "text-red-500", note: "Urgent care needed." };
    if (z < -2) return { label: "Moderate malnutrition", color: "text-orange-400", note: "Nutrition support recommended." };
    if (z < -1) return { label: "Mild underweight", color: "text-yellow-400", note: "Needs balanced nutrition." };
    if (z < 1) return { label: "Normal", color: "text-emerald-400", note: "Healthy growth." };
    if (z < 2) return { label: "Risk of Overweight", color: "text-yellow-400", note: "Watch weight trends." };
    if (z < 3) return { label: "Overweight", color: "text-orange-500", note: "Increased health risks." };
    return { label: "Obese", color: "text-red-600", note: "Immediate intervention advised." };
  }

  // ✅ Default fallback
  return {
    label: "Unknown",
    color: "text-gray-500",
    note: "Unrecognized indicator type or missing data.",
  };
};


const calculateBMIzScore = (weight: number, height: number) => {
  const bmi = weight / ((height / 100) ** 2);
  return (bmi - 15) / 2;
};

const calculateMUACzScore = (muac: number) => (muac - 13) / 2;

interface ChildProfile {
  date_of_birth: any;
  name: string;
  ageMonths: number;
  gender: string;
  weight: number;
  height: number;
  muac: number;
}

const GrowthTracker = ({ childProfile }: { childProfile: any }) => {
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [zScores, setZScores] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (childProfile) {
      setChild(childProfile);
      
       const hazResult = calculateHAZ(
  85,      // heightCm
  29,      // ageInWeeks
  7,       // ageInMonths
  "girl"   // gender
);

console.log("HAZ Z-Score:", hazResult.haz);
console.log("HAZ Classification:", hazResult.classification);


    
   const birthDate = new Date(childProfile.date_of_birth);
const today = new Date();
const ageInWeeks = differenceInWeeks(today, birthDate);
const ageInMonths = differenceInMonths(today, birthDate);

// 2. Normalize gender to "girl" or "boy"
const gender = childProfile.gender.toLowerCase() === "female" ? "girl" : "boy";

      const calculatedZScores = {
        BMI: calculateBMIzScore(childProfile.weight, childProfile.height),
        MUAC: calculateMUACzScore(childProfile.muac),
        HAZ: calculateHAZ(
            childProfile.height,
            ageInWeeks,
            ageInMonths,
            gender
          ),
        WHZ: calculateWHZ(childProfile.weight, childProfile.height, childProfile.gender === "Male" ? "boy" : "girl", getWHZRange(childProfile.date_of_birth)),
        WAZ: calculateWAZ(childProfile.weight, getAgeDetails(childProfile.date_of_birth).age, getAgeDetails(childProfile.date_of_birth).type, childProfile.gender === "Male" ? "boy" : "girl"),
      };
      setZScores(calculatedZScores);
    }
  }, [childProfile]);

  if (!child || !zScores) return <div className="text-center text-gray-400 mt-10">Loading...</div>;

  const indicators = [
    { key: "HAZ", label: "Height for Age", value: zScores.HAZ.haz, result: { label: zScores.HAZ.classification, color: "text-blue-400", note: zScores.HAZ.classification } },
    { key: "WHZ", label: "Weight for Height", value: zScores.WHZ.zScore, result: { label: zScores.WHZ.classification, color: "text-orange-400", note: zScores.WHZ.classification } },
    { key: "WAZ", label: "Weight for Age", value: zScores.WAZ.zScore, result: { label: zScores.WAZ.classification, color: "text-yellow-400", note: zScores.WAZ.classification } },
    { key: "BMI", label: "BMI for Age", value: zScores.BMI, result: classifyZ(zScores.BMI, "BMI") },
    { key: "MUAC", label: "MUAC for Age", value: zScores.MUAC, result: classifyZ(zScores.MUAC, "MUAC") },
  ];

  const visibleIndicators = expanded ? indicators : indicators.slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto font-sans text-white space-y-4 p-4">
      <div className="grid md:grid-cols-3 gap-4">
        {visibleIndicators.map(({ key, label, value, result }) => (
          <div key={key} className="rounded-xl bg-[#1E1E2F] border border-gray-700 p-4 shadow-sm">
            <h3 className="text-md font-semibold text-gray-300">{label}</h3>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-400">Z-Score:</span>
              <span className={`font-bold ${result.color}`}>{value.toFixed(2)}</span>
            </div>
            <div className="mt-1 text-sm">
              <p className={`font-medium ${result.color}`}>{result.label}</p>
              <p className="text-gray-400 text-xs">{result.note}</p>
            </div>
          </div>
        ))}
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

export default GrowthTracker;

export const getAgeValue = (dob: string | Date, ageType: "week" | "month"): number => {
  const birthDate = new Date(dob);
  const now = new Date();
  const diffInMs = now.getTime() - birthDate.getTime();

  if (ageType === "week") return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
  const years = now.getFullYear() - birthDate.getFullYear();
  const months = now.getMonth() - birthDate.getMonth();
  return now.getDate() < birthDate.getDate() ? years * 12 + months - 1 : years * 12 + months;
};

const getAgeDetails = (dob: string): { age: number; type: "week" | "month" } => {
  const birthDate = new Date(dob);
  const now = new Date();
  const diffInDays = Math.floor((+now - +birthDate) / (1000 * 60 * 60 * 24));
  const ageInWeeks = Math.floor(diffInDays / 7);
  return ageInWeeks <= 13 ? { age: ageInWeeks, type: "week" } : { age: Math.floor(diffInDays / 30.44), type: "month" };
};

const getWHZRange = (dob: string): "0_2" | "2_5" => {
  const birthDate = new Date(dob);
  const now = new Date();
  const ageInMonths = Math.floor((+now - +birthDate) / (1000 * 60 * 60 * 24 * 30.44));
  return ageInMonths < 24 ? "0_2" : "2_5";
};
