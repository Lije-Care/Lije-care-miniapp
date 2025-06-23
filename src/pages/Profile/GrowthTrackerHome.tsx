"use client";

import { useEffect, useState } from "react";
import { calculateHAZ } from "@/excelData/calculateHAZ";

import { calculateWHZ } from "@/excelData/calculateWHZ";
import { calculateWAZ } from "@/excelData/calculateWAZ";

// Helper to classify Z-score result
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

  return { label: "Unknown", color: "text-gray-500", note: "Data missing." };
};

// Dummy calculators - you should replace with real calculations or API results
const calculateBMIzScore = (weight: number, height: number, _ageMonths: number, _gender: string) => {
  const bmi = weight / ((height / 100) ** 2);
  return (bmi - 15) / 2; // Approximation
};

const calculateMUACzScore = (muac: number, _ageMonths: number, _gender: string) => {
  return (muac - 13) / 2; // Approximation
};

const calculateHeightZScore = (height: number, _ageMonths: number, _gender: string) => {
  return (height - 90) / 5; // Approximation
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
  const [history, setHistory] = useState<any[]>([]);
  const [hforAge, setHforAge] = useState<any>(null);
  const [wforAge, setWforAge] = useState<any>(null);
  const [waz, setWaz] = useState<any>(null);
  
  useEffect(() => {
    if (childProfile) {
      setChild(childProfile);

      const calculatedZScores = {
        BMI: calculateBMIzScore(childProfile.weight, childProfile.height, childProfile.ageMonths, childProfile.gender),
        MUAC: calculateMUACzScore(childProfile.muac, childProfile.ageMonths, childProfile.gender),
        // Height: calculateHAZ(76.5, 1, "week", "boy"),
      
      };
      
      setZScores(calculatedZScores);
     
    
        
      const result = calculateWHZ(8.1, 65, "girl", "0_2");
      console.log("WHZ Z-Score:", result.zScore, "| Classification:", result.classification);

      const wazresult = calculateWAZ(7.2, 12, "week", "girl");
      console.log("here is the waz",wazresult);
        setWaz(wazresult);
      setWforAge(result)
      setHforAge(calculateHAZ(childProfile.height, getAgeValue(childProfile?.date_of_birth, "month") > 13 
                            ? getAgeValue(childProfile?.date_of_birth, "month") : 
                            getAgeValue(childProfile?.date_of_birth, "week"), "week", "boy"));
      console.log(" for age:", 
                              getAgeValue(childProfile?.date_of_birth, "month") > 13 
                            ? getAgeValue(childProfile?.date_of_birth, "month") : 
                            getAgeValue(childProfile?.date_of_birth, "week"));
      // Dynamic history mock (simulate monthly growth)
      const sampleHistory = [
        { month: "Jan", BMI: 14.6, MUAC: 13.3, Height: 90 },
        { month: "Feb", BMI: 14.9, MUAC: 13.5, Height: 91.5 },
        { month: "Mar", BMI: 15.1, MUAC: 13.7, Height: 93 },
        { month: "Apr", BMI: 15.3, MUAC: 13.9, Height: 94.2 },
        { month: "May", BMI: 15.4, MUAC: 14.1, Height: 95.5 },
      ];
      setHistory(sampleHistory);
    }
  }, [childProfile]);

  if (!child || !zScores) {
    return <div className="text-center text-gray-400 mt-10">Loading child data...</div>;
  }

  const indicators = [
    { key: "BMI", label: "BMI-for-Age", value: zScores.BMI },
    { key: "MUAC", label: "MUAC-for-Age", value: zScores.MUAC },
    
  ];

  return (
    <div className=" max-w-3xl mx-auto font-sans text-white space-y-2">
     
      {/* Current Z-scores */}
      <div className="grid md:grid-cols-3 gap-4">
         <div key='haz' className="rounded-xl bg-[#1E1E2F] border border-gray-700 p-2 m-2 shadow-sm">
          <h3 className="text-md font-semibold text-gray-300">Height for age</h3>
              <h3 className="text-md font-semibold text-gray-300">{hforAge.la}</h3>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-400">Z-Score:</span>
                <span className={`font-bold`}>{hforAge.haz}</span>
              </div>
              <div className="mt-1 text-sm">
                <p className={`font-medium`}>{hforAge.classification}</p>
                <p className="text-gray-400 text-xs">{hforAge.classification}</p>
              </div>
            </div>

             <div key='haz' className="rounded-xl bg-[#1E1E2F] border border-gray-700 p-2 m-2 shadow-sm">
          <h3 className="text-md font-semibold text-gray-300">Weight for Height</h3>
         
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-400">Z-Score:</span>
                <span className={`font-bold`}>{wforAge.zScore}</span>
              </div>
              <div className="mt-1 text-sm">
                <p className={`font-medium`}>{wforAge.classification}</p>

              </div>
            </div>

             <div key='haz' className="rounded-xl bg-[#1E1E2F] border border-gray-700 p-2 m-2 shadow-sm">
          <h3 className="text-md font-semibold text-gray-300">Weight for Age</h3>
         
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-400">Z-Score:</span>
                <span className={`font-bold`}>{waz.zScore}</span>
              </div>
              <div className="mt-1 text-sm">
                <p className={`font-medium`}>{waz.classification}</p>

              </div>
            </div>

        {indicators.map(({ key, label, value }) => {
          const result = classifyZ(value, key);
          return (
            <div key={key} className="rounded-xl bg-[#1E1E2F] border border-gray-700 p-2 m-2 shadow-sm">
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
          );
        })}
      </div>

  
     

    </div>
  );
};

export default GrowthTrackerHome;

export const getAgeValue = (
  dob: string | Date,
  ageType: "week" | "month"
): number => {
  const birthDate = new Date(dob);
  const now = new Date();

  const diffInMs = now.getTime() - birthDate.getTime();

  if (ageType === "week") {
    const diffInWeeks = diffInMs / (1000 * 60 * 60 * 24 * 7);
    return Math.floor(diffInWeeks);
  } else if (ageType === "month") {
    const years = now.getFullYear() - birthDate.getFullYear();
    const months = now.getMonth() - birthDate.getMonth();
    const totalMonths = years * 12 + months;

    // Adjust for day of month
    if (now.getDate() < birthDate.getDate()) {
      return totalMonths - 1;
    }

    return totalMonths;
  }

  throw new Error("Invalid age type. Use 'week' or 'month'.");
};
