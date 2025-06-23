import { getWeightForHeightData, WeightForHeightEntry } from "./dataselectorWHZ";

export const calculateWHZ = (
  weightKg: number,
  heightCm: number,
  gender: "boy" | "girl",
  ageGroup: "0_2" | "2_5"
): { zScore: number; classification: string } => {
  const data: WeightForHeightEntry[] = getWeightForHeightData(gender, ageGroup);

  if (!data.length) {
    return { zScore: 0, classification: "Unknown (no data)" };
  }

  const closest = data.reduce((prev, curr) =>
    Math.abs(parseFloat(curr.cm) - heightCm) < Math.abs(parseFloat(prev.cm) - heightCm)
      ? curr
      : prev
  );

  const median = parseFloat(closest["SD(M)"]);
  const plus1SD = parseFloat(closest["1SD"]);
  const SD = plus1SD - median;

  if (isNaN(median) || isNaN(plus1SD) || SD === 0 || isNaN(weightKg)) {
    return { zScore: 0, classification: "Invalid data" };
  }

  const zRaw = (weightKg - median) / SD;
  const zScore = parseFloat(zRaw.toFixed(2));
  const classification = classifyWHZ(zScore);

  return { zScore, classification };
};

const classifyWHZ = (z: number): string => {
  if (z < -3) return "Severe malnutrition (Severe wasting)";
  if (z >= -3 && z < -2) return "Moderate malnutrition (Moderate wasting)";
  if (z >= -2 && z < -1) return "Mild underweight";
  if (z >= -1 && z < 1) return "Normal weight";
  if (z >= 1 && z < 2) return "Risk of overweight";
  if (z >= 2 && z < 3) return "Overweight";
  return "Obese";
};
