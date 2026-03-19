export interface Milestone {
  id: string;
  monthRange: "0-2" | "3-4" | "5-6" | "7-9" | "10-12" | "12+";
  category: "physical" | "motor" | "cognitive" | "feeding";
  title: string;
  summary: string;
  details: string;
  tips: string[];
}

export interface MilestoneProgress {
  [milestoneId: string]: {
    achieved: boolean;
    achievedDate?: string; // Optional: date in 'YYYY-MM-DD' format
  };
}

export type MonthRange = "0-2" | "3-4" | "5-6" | "7-9" | "10-12" | "12+";
export type Category = "physical" | "motor" | "cognitive" | "feeding" | "all";

// Care Guidelines Types
export interface GeneralSafetyItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface MonthlyCareGuide {
  month: number;
  title: string;
  category: "physiological" | "feeding" | "safety";
  highlights: string[];
}

// Vaccine Types
export interface VaccineSchedule {
  id: string;
  name: string;
  timing: string;
  fundingType: "public" | "private";
  ageInMonths?: number;
  ageLabel: string;
  doses: number;
  currentDose?: number;
  sideEffects: string[];
  notes?: string;
}

export interface VaccineSideEffect {
  category: string;
  icon: string;
  reactions: {
    symptom: string;
    severity: "mild" | "moderate" | "severe";
    response: string;
  }[];
}

export interface VaccineEmergency {
  id: string;
  symptom: string;
  icon: string;
  action: string;
}

// Complementary Food Types
export interface FoodStage {
  level: number;
  name: string;
  ageRange: string;
  milkRatio: string;
  foodRatio: string;
  mealsPerDay: string;
  texture: string;
  keyPoints: string[];
  warnings?: string[];
}

export interface FoodProgressionByAge {
  ageRange: string;
  texture: string;
  frequency: string;
  purpose: string;
}

export interface FoodAllergyLevel {
  level: "low" | "medium" | "high";
  ageRange: string;
  foods: string[];
}

export interface MonthlyFoodMenu {
  month: string;
  focus: string;
  foods: string[];
}

export interface FingerFoodGuideline {
  category: string;
  examples: string[];
}

export interface FoodPrinciple {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FoodWarning {
  id: string;
  title: string;
  description: string;
  icon: string;
  severity: "danger" | "warning" | "info";
}

export interface ChildProfile {
  id: string;
  name: string;
  birthday: string; // YYYY-MM-DD
  milestoneProgress: MilestoneProgress;
  createdAt: string; // ISO string
}

// Complementary Food Additional Types
export interface FeedingPrinciple {
  title: string;
  description: string;
}

export interface CookingTip {
  title: string;
  description: string;
}

export interface CookingTipCategory {
  category: string;
  tips: CookingTip[];
}

export interface FoodHandlingItem {
  food: string;
  canEat: boolean;
  note: string;
}

export interface FoodHandlingCategory {
  category: string;
  items: FoodHandlingItem[];
}

export interface FoodRestrictionItem {
  food: string;
  ageLimit: string;
  reason: string;
}

export interface FoodRestrictionCategory {
  category: string;
  items: FoodRestrictionItem[];
}

export interface FoodQAItem {
  question: string;
  answer: string;
}

