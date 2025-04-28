import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

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

// MAIN COMPONENT
const GrowthTrackerAll = ({ childProfile }: { childProfile: any }) => {
  const [child, setChild] = useState<any>(null);
  const [zScores, setZScores] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (childProfile) {
      setChild(childProfile);

      // Example: Calculate Z-scores dynamically if needed
      const calculatedZScores = {
        BMI: calculateBMIzScore(childProfile.weight, childProfile.height, childProfile.ageMonths, childProfile.gender),
        MUAC: calculateMUACzScore(childProfile.muac, childProfile.ageMonths, childProfile.gender),
        Height: calculateHeightZScore(childProfile.height, childProfile.ageMonths, childProfile.gender),
      };
      setZScores(calculatedZScores);

      // Example: fetch or prepare BMI history here
      const sampleHistory = [
        { month: "Jan", BMI: 14.6, MUAC: 13.3, Height: 90 },
        { month: "Feb", BMI: 14.9, MUAC: 13.5, Height: 91.5 },
        { month: "Mar", BMI: 15.1, MUAC: 13.7, Height: 93 },
      ];
      setHistory(sampleHistory);
    }
  }, [childProfile]);

  if (!child || !zScores) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  const indicators = [
    { key: "BMI", label: "BMI-for-Age", value: zScores.BMI },
    { key: "MUAC", label: "MUAC-for-Age", value: zScores.MUAC },
    { key: "Height", label: "Height-for-Age", value: zScores.Height },
  ];

  return (
    <div className="p-1 space-y-6 max-w-2xl mx-auto font-sans text-white">
      <h2 className="text-2xl font-bold text-center text-emerald-400">📊 Growth Tracker</h2>

      {indicators.map(({ key, label, value }) => {
        const result = classifyZ(value, key);
        return (
          <div key={key} className="rounded-xl bg-[#1E1E2F] border border-gray-700 p-5 shadow-md">
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

      <div className="bg-[#1E1E2F] border border-gray-700 p-5 rounded-xl shadow-md">
        <h3 className="text-md font-semibold text-center text-gray-300">📈 BMI History</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D3A" />
              <XAxis dataKey="month" stroke="#8884d8" />
              <YAxis stroke="#8884d8" domain={[13, 17]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#2A2A3C', border: 'none' }}
                labelStyle={{ color: '#f3f3f3' }}
                itemStyle={{ color: '#f3f3f3' }}
              />
              <Line type="monotone" dataKey="BMI" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#1E1E2F] border border-gray-700 p-5 rounded-xl shadow-md space-y-1">
        <h3 className="text-md font-semibold text-center text-gray-300">👶 Child Profile</h3>
        {Object.entries(child).map(([k, v]) => (
          <p key={k} className="text-sm text-gray-400">
            <span className="font-medium text-gray-300 capitalize">{k}:</span> {String(v)}
          </p>
        ))}

      </div>
    </div>
  );
};

// Dummy Z-score calculators (replace with your real formula or API call)
const calculateBMIzScore = (weight: number, height: number, ageMonths: number, gender: string) => {
  return -1.5; // placeholder
};

const calculateMUACzScore = (muac: number, ageMonths: number, gender: string) => {
  return -2.0; // placeholder
};

const calculateHeightZScore = (height: number, ageMonths: number, gender: string) => {
  return -1.0; // placeholder
};

export default GrowthTrackerAll;
