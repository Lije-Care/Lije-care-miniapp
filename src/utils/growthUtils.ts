export const classifyZ = (z: number, type: string) => {
  if (type === "BMI") {
    if (z < -3)
      return {
        label: "Severe underweight",
        color: "text-red-500",
        note: "Urgent nutritional intervention needed.",
      };
    if (z < -2)
      return {
        label: "Moderate underweight",
        color: "text-orange-400",
        note: "May require monitoring.",
      };
    if (z < 1)
      return {
        label: "Normal weight",
        color: "text-emerald-400",
        note: "Healthy BMI range.",
      };
    if (z < 2)
      return {
        label: "Risk of overweight",
        color: "text-yellow-400",
        note: "Lifestyle changes may be needed.",
      };
    if (z < 3)
      return {
        label: "Overweight",
        color: "text-orange-500",
        note: "Potential obesity risk.",
      };
    return {
      label: "Obese",
      color: "text-red-600",
      note: "Intervention needed.",
    };
  }
  if (type === "MUAC") {
    if (z < -3)
      return {
        label: "Severe Acute Malnutrition (SAM)",
        color: "text-red-500",
        note: "Urgent feeding and care needed.",
      };
    if (z < -2)
      return {
        label: "Moderate Acute Malnutrition (MAM)",
        color: "text-orange-400",
        note: "Supplementary feeding required.",
      };
    if (z < 1)
      return {
        label: "Normal Nutrition",
        color: "text-emerald-400",
        note: "Balanced nutrition encouraged.",
      };
    if (z < 2)
      return {
        label: "Risk of Overnutrition",
        color: "text-yellow-400",
        note: "Monitor diet/activity.",
      };
    return {
      label: "Possible Obesity",
      color: "text-red-500",
      note: "Reduce fat intake & assess lifestyle.",
    };
  }
  if (type === "Height") {
    if (z < -3)
      return {
        label: "Severe malnutrition (Wasting)",
        color: "text-red-500",
        note: "Urgent care needed.",
      };
    if (z < -2)
      return {
        label: "Moderate malnutrition",
        color: "text-orange-400",
        note: "Nutrition support recommended.",
      };
    if (z < -1)
      return {
        label: "Mild underweight",
        color: "text-yellow-400",
        note: "Needs balanced nutrition.",
      };
    if (z < 1)
      return {
        label: "Normal",
        color: "text-emerald-400",
        note: "Healthy growth.",
      };
    if (z < 2)
      return {
        label: "Risk of Overweight",
        color: "text-yellow-400",
        note: "Watch weight trends.",
      };
    if (z < 3)
      return {
        label: "Overweight",
        color: "text-orange-500",
        note: "Increased health risks.",
      };
    return {
      label: "Obese",
      color: "text-red-600",
      note: "Immediate intervention advised.",
    };
  }
  // Default fallback
  return {
    label: "Unknown",
    color: "text-gray-500",
    note: "Unrecognized indicator type or missing data.",
  };
};

/**
 * Calculate difference in days between two dates
 */
const differenceInDays = (end: Date, start: Date): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((end.getTime() - start.getTime()) / msPerDay);
};

/**
 * Custom month difference assuming 1 month = 30 days
 */
const differenceInMonthsApprox = (end: Date, start: Date): number => {
  return Math.floor(differenceInDays(end, start) / 30);
};

/**
 * Custom week difference assuming 1 week = 7 days
 */
const differenceInWeeksApprox = (end: Date, start: Date): number => {
  return Math.floor(differenceInDays(end, start) / 7);
};

/**
 * Get age value based on type (week or month) using approximations.
 */
export const getAgeValue = (
  dob: string | Date,
  ageType: "week" | "month"
): number => {
  const birthDate = new Date(dob);
  const now = new Date();
  if (ageType === "week") return differenceInWeeksApprox(now, birthDate);
  return differenceInMonthsApprox(now, birthDate);
};

/**
 * Get age details with type (week or month) based on child's age.
 * Uses weeks if <=13 weeks, else months.
 */
export const getAgeDetails = (
  dob: string
): { age: number; type: "week" | "month" } => {
  const birthDate = new Date(dob);
  const now = new Date();
  const diffInDays = Math.floor((+now - +birthDate) / (1000 * 60 * 60 * 24));
  const ageInWeeks = Math.floor(diffInDays / 7);
  return ageInWeeks <= 13
    ? { age: ageInWeeks, type: "week" }
    : { age: Math.floor(diffInDays / 30), type: "month" };
};

/**
 * Get WHZ range based on age in months (<24: "0_2", else "2_5").
 */
export const getWHZRange = (dob: string): "0_2" | "2_5" => {
  const birthDate = new Date(dob);
  const now = new Date();
  const ageInMonths = Math.floor(
    (+now - +birthDate) / (1000 * 60 * 60 * 24 * 30.44)
  );
  return ageInMonths < 24 ? "0_2" : "2_5";
};
