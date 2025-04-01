import React from "react";
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from "react-icons/fa";

// Define styles and icons based on Z-Score
const getResultStyle = (zScore) => {
  if (zScore < -3) return { label: "Severe Stunting", textColor: "text-red-500", bgColor: "bg-gray-800", icon: <FaExclamationTriangle className="text-red-500 text-2xl" /> };
  if (zScore < -2) return { label: "Moderate Stunting", textColor: "text-orange-400", bgColor: "bg-gray-800", icon: <FaExclamationTriangle className="text-orange-400 text-2xl" /> };
  if (zScore < -1) return { label: "Mild Stunting", textColor: "text-yellow-400", bgColor: "bg-gray-800", icon: <FaInfoCircle className="text-yellow-400 text-2xl" /> };
  if (zScore < 1) return { label: "Normal Height", textColor: "text-green-400", bgColor: "bg-gray-800", icon: <FaCheckCircle className="text-green-400 text-2xl" /> };
  if (zScore < 2) return { label: "Above Average Height", textColor: "text-blue-400", bgColor: "bg-gray-800", icon: <FaInfoCircle className="text-blue-400 text-2xl" /> };
  return { label: "Exceptionally Tall", textColor: "text-purple-400", bgColor: "bg-gray-800", icon: <FaInfoCircle className="text-purple-400 text-2xl" /> };
};

const InterpretZScore = ({ zScore }) => {
  if (typeof zScore !== "number" || isNaN(zScore)) {
    return (
      <div className="p-4 mt-4 bg-gray-900 text-white rounded-lg text-center">
        <FaExclamationTriangle className="text-yellow-400 text-2xl mb-2" />
        <h2 className="text-lg font-bold">Invalid Z-Score</h2>
        <p className="text-sm">Please enter a valid numerical value.</p>
      </div>
    );
  }

  const { label, textColor, bgColor, icon } = getResultStyle(zScore);

  return (
    <div className={`p-4 mt-4 rounded-lg ${bgColor} flex items-center transition-all duration-300 shadow-md`}> 
      <div className="mr-3">{icon}</div>
      <div>
        <h2 className={`text-lg font-bold ${textColor}`}>{label}</h2>
        <p className={`text-sm ${textColor}`}>Z-Score: {zScore.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default InterpretZScore;
