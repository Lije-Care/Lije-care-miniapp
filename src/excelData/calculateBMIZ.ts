import { getBMIForAgeData } from "./getBMIForAgeData";

export const calculateBMIZ = (
  weightKg: number,
  heightM: number,
  ageValue: number,
  ageType: "week" | "month",
  gender: "boy" | "girl",
  measuredStanding: boolean
): { bmi: number; zScore: number; classification: string } => {
  // Height adjustment
  if (ageType === "week" && ageValue <= 13 && measuredStanding) {
    heightM += 0.007;
  } else if (ageType === "month" && ageValue >= 4 && ageValue <= 60 && !measuredStanding) {
    heightM -= 0.007;
  }

  const bmi = weightKg / (heightM * heightM);

  const data = getBMIForAgeData(gender, ageValue, ageType);

  const row = data.find(entry =>
    ageType === "week"
      ? parseInt(entry.Weeks ?? "") === ageValue
      : parseInt(entry.Months ?? "") === ageValue
  );

  if (!row || !row["SD"] || !row["1 SD"]) {
    return {
      bmi: parseFloat(bmi.toFixed(2)),
      zScore: 0,
      classification: "No matching BMI-for-age reference found."
    };
  }

  const median = parseFloat(row["SD"]);
  const plus1SD = parseFloat(row["1 SD"]);
  const SD = plus1SD - median;

  if (isNaN(SD) || SD === 0) {
    return {
      bmi: parseFloat(bmi.toFixed(2)),
      zScore: 0,
      classification: "Invalid SD or median values."
    };
  }

  const zRaw = (bmi - median) / SD;
  const zScore = parseFloat(zRaw.toFixed(2));
  const classification = classifyBMIZ(zScore);

  return { bmi: parseFloat(bmi.toFixed(2)), zScore, classification };
};

const classifyBMIZ = (z: number): string => {
  if (z < -3) return "Severe underweight – Urgent nutritional intervention needed.";
  if (z >= -3 && z < -2) return "Moderate underweight – Child may require monitoring.";
  if (z >= -2 && z < 1) return "Normal weight – Healthy BMI range.";
  if (z >= 1 && z < 2) return "Risk of overweight – Lifestyle changes may be needed.";
  if (z >= 2 && z < 3) return "Overweight – Higher than normal BMI; potential obesity risk.";
  return "Obese – High risk of obesity-related health issues.";
};
