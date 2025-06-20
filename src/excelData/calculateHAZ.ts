import { getGrowthData } from "./growthData";

export const calculateHAZ = (
  observedHeight: number,
  ageValue: number, // week or month
  ageType: "week" | "month",
  gender: "boy" | "girl"
): { haz: number; classification: string } => {
  const data = getGrowthData(gender, ageType);

  // Fallback to last available row if no exact match
  let row = data.find(entry =>
    ageType === "week" ? entry.week === ageValue : entry.month === ageValue
  );

  if (!row) {
    console.warn("No exact growth data found, using last available data.");
    row = data[data.length - 1]; // use last available row
  }

  if (
    !row ||
    typeof row.median !== "number" ||
    typeof row.plus1SD !== "number"
  ) {
    console.warn("Invalid growth data. Returning default values.");
    return { haz: 0, classification: "Data unavailable" };
  }

  const SD = row.plus1SD - row.median;

  if (typeof SD !== "number" || isNaN(SD) || SD === 0) {
    console.warn("Invalid SD value. Returning default values.");
    return { haz: 0, classification: "Data unavailable" };
  }

  const hazRaw = (observedHeight - row.median) / SD;
  const haz = parseFloat(hazRaw.toFixed(2));
  const classification = classifyHAZ(haz);

  console.log("Calculated HAZ:", haz, "Classification:", classification);

  return { haz, classification };
};

const classifyHAZ = (z: number): string => {
  if (z < -3) return "Severe stunting";
  if (z >= -3 && z < -2) return "Moderate stunting";
  if (z >= -2 && z < -1) return "Mild stunting";
  if (z >= -1 && z < 1) return "Normal height";
  if (z >= 1 && z < 2) return "Above average height";
  if (z >= 2 && z < 3) return "Tall for age";
  return "Exceptionally tall";
};
