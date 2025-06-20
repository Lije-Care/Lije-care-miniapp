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

export const getGrowthData = (
  gender: "boy" | "girl",
  ageType: "week" | "month"
): GrowthEntry[] => {
  if (gender === "boy" && ageType === "week") return boys0To13Weeks;
  if (gender === "boy" && ageType === "month") return boys4mTo5y;
  if (gender === "girl" && ageType === "week") return girls0To13Weeks;
  if (gender === "girl" && ageType === "month") return girls4mTo5y;
  return [];
};
