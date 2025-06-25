import boys0To13Weeks from "@/excelData/Height-for-age/boys_0_to_13_weeks.json";
import boys4mTo5y from "@/excelData/Height-for-age/boys_4m_to_5y.json";
import girls0To13Weeks from "@/excelData/Height-for-age/girls_0_to_13_weeks.json";
import girls4mTo5y from "@/excelData/Height-for-age/girls_4m_to_5y.json";

export interface GrowthEntry {
  week?: number;
  month?: number;
  median: number;
  plus1SD: number;
  minus1SD?: number;
}

type Gender = "boy" | "girl";
type AgeType = "week" | "month";

const growthDataMap: Record<Gender, Record<AgeType, GrowthEntry[]>> = {
  boy: {
    week: boys0To13Weeks,
    month: boys4mTo5y,
  },
  girl: {
    week: girls0To13Weeks,
    month: girls4mTo5y,
  },
};

export const getGrowthData = (
  gender: Gender,
  ageType: AgeType
): GrowthEntry[] => {
  const data = growthDataMap[gender]?.[ageType];
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn(`No growth data available for gender: ${gender}, ageType: ${ageType}`);
    return [];
  }
  return data;
};
