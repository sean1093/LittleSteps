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

export interface VaccineProgress {
  [vaccineId: string]: {
    doses: {
      [doseNumber: number]: {
        administered: boolean;
        administeredDate?: string; // YYYY-MM-DD
      };
    };
  };
}

export interface ChildProfile {
  id: string;
  name: string;
  birthday: string; // YYYY-MM-DD
  gender?: Gender; // Optional: for growth chart percentiles
  milestoneProgress: MilestoneProgress;
  vaccineProgress: VaccineProgress;
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

// Daily Log Types (快速日誌)
export interface DailyLog {
  id: string;
  childId: string;
  type: 'feeding' | 'sleep' | 'diaper';
  timestamp: string; // ISO 8601 format
  data: FeedingData | SleepData | DiaperData;
  createdAt: string; // ISO 8601 format
  updatedAt?: string; // ISO 8601 format
}

export interface FeedingData {
  feedingType: 'breast_left' | 'breast_right' | 'breast_both' | 'formula' | 'solid';
  amount?: number; // ml
  duration?: number; // minutes
  notes?: string;
}

export interface SleepData {
  startTime: string; // ISO 8601 format
  endTime?: string; // ISO 8601 format, undefined means still sleeping
  duration?: number; // minutes, auto-calculated
  notes?: string;
}

export interface DiaperData {
  type: 'pee' | 'poop' | 'both';
  consistency?: 'normal' | 'soft' | 'hard'; // only for poop
  notes?: string;
}

// Dashboard Summary Types
export interface DailySummary {
  date: string; // YYYY-MM-DD
  feedingCount: number;
  totalFeedingAmount: number; // ml
  sleepCount: number;
  totalSleepDuration: number; // minutes
  diaperCount: number;
  poopCount: number;
  peeCount: number;
}

// Growth Charts Types (生長曲線)
export interface GrowthRecord {
  id: string;
  childId: string;
  date: string; // YYYY-MM-DD
  weight?: number; // kg
  height?: number; // cm
  headCircumference?: number; // cm
  percentile: {
    weight?: number; // 0-100
    height?: number;
    headCircumference?: number;
  };
  notes?: string;
}

export type MeasurementType = 'weight' | 'height' | 'headCircumference';
export type Gender = 'male' | 'female';
export type PercentileCategory = 'low' | 'normal' | 'high';
export type GrowthTrend = 'increasing' | 'decreasing' | 'stable' | 'insufficient-data';

// WHO Growth Chart Standards (LMS method)
export interface WHOStandard {
  ageMonths: number;
  L: number; // Box-Cox transformation
  M: number; // Median
  S: number; // Coefficient of variation
}

