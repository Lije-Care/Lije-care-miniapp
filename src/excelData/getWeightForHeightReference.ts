
import boys0To2y from "@/excelData/Weight-for-height/boys_0_2_years.json";
import boys2mTo5y from "@/excelData/Weight-for-height/boys_2_5_years.json";
import girls0To2y from "@/excelData/Weight-for-height/girls_0_2_years.json";
import girls4mTo5y from "@/excelData/Weight-for-height/girls_2_5_years.json";

interface WeightForHeightRecord {
  cm: string;
  "-3 SD": string;
  "-2SD": string;
  "-1 SD": string;
  "SD(M)": string;
  "1SD": string;
  "2SD": string;
  "3SD": string;
}

export async function getWeightForHeightReference(gender: "boy" | "girl", heightInCm: number): Promise<WeightForHeightRecord | null> {
  const filePath = gender === "boy"
    ? boys0To2y
    : girls0To2y;

  try {
    const response = await fetch(filePath);
    const data: WeightForHeightRecord[] = await response.json();

    // Find closest height
    const closest = data.reduce((prev, curr) =>
      Math.abs(parseFloat(curr.cm) - heightInCm) < Math.abs(parseFloat(prev.cm) - heightInCm) ? curr : prev
    );

    return closest;
  } catch (error) {
    console.error("Error reading data file:", error);
    return null;
  }
}
