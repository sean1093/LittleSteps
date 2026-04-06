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
  foodTrackingProgress?: FoodTrackingProgress; // Optional: complementary food tracking
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
  quality?: 'good' | 'fair' | 'poor'; // sleep quality assessment
  nightWakings?: number; // number of times woke up during sleep
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

// Sleep Analytics Types (睡眠深度分析)
export interface SleepAnalytics {
  // Basic metrics
  totalSleepDuration: number; // minutes, last 24h
  longestSleepDuration: number; // minutes, last 24h
  averageSleepDuration: number; // minutes, per sleep session
  sleepCount: number; // number of sleep sessions

  // Sleep quality
  sleepQualityScore: number; // 0-100
  nightWakingsTotal: number; // total night wakings in last 24h

  // Sleeping through the night detection
  isSleepingThroughNight: boolean; // >= 6 hours continuous
  longestContinuousSleep: number; // minutes

  // Routine analysis
  routineScore: number; // 0-100, consistency of sleep times
  averageBedtime?: string; // HH:mm format
  averageWakeTime?: string; // HH:mm format

  // Recommendations
  recommendations: SleepRecommendation[];
}

export interface SleepRecommendation {
  id: string;
  type: 'positive' | 'suggestion' | 'warning';
  title: string;
  message: string;
  icon: string; // lucide-react icon name
}

export interface SleepPattern {
  date: string; // YYYY-MM-DD
  sleepSessions: {
    startTime: string; // ISO 8601
    endTime?: string; // ISO 8601
    duration: number; // minutes
    quality?: 'good' | 'fair' | 'poor';
    nightWakings?: number;
  }[];
  totalDuration: number; // minutes
  longestSession: number; // minutes
  qualityScore: number; // 0-100
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

// Complementary Food Tracking Types (副食品追蹤)
export type AllergyReactionType = 'rash' | 'diarrhea' | 'vomiting' | 'constipation' | 'runny_nose' | 'cough' | 'eczema' | 'other';
export type FoodPreference = 'love' | 'like' | 'neutral' | 'dislike' | 'refuse';
export type AllergySeverity = 'mild' | 'moderate' | 'severe';

export interface AllergyReaction {
  type: AllergyReactionType;
  severity: AllergySeverity;
  description?: string; // Additional notes about the reaction
  date: string; // YYYY-MM-DD
}

export interface FoodTrialRecord {
  id: string;
  foodName: string;
  category?: string; // 蔬菜、水果、穀類、蛋白質等
  firstTriedDate: string; // YYYY-MM-DD, first time trying this food
  trialDates: string[]; // Array of YYYY-MM-DD, for 4x3 rule tracking
  hasAllergy: boolean;
  allergyReactions?: AllergyReaction[]; // Details if hasAllergy is true
  preference?: FoodPreference; // Baby's preference for this food
  notes?: string;
  createdAt: string; // ISO 8601
  updatedAt?: string; // ISO 8601
}

export interface FoodTrackingProgress {
  [foodId: string]: FoodTrialRecord;
}

// Meal Plan Types (菜單計劃)
export interface MealPlanDay {
  date: string; // YYYY-MM-DD
  meals: {
    breakfast?: string[];
    lunch?: string[];
    dinner?: string[];
    snacks?: string[];
  };
}

export interface WeeklyMealPlan {
  id: string;
  childId: string;
  weekStartDate: string; // YYYY-MM-DD (Monday)
  childAgeMonths: number; // For age-appropriate menu generation
  days: MealPlanDay[];
  shoppingList?: string[]; // Generated shopping list
  createdAt: string;
  updatedAt?: string;
}

