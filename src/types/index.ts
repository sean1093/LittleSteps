export type MonthRange = "0-2" | "3-4" | "5-6" | "7-9" | "10-12";

export interface Milestone {
  id: string;
  monthRange: MonthRange;
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
  // 自費疫苗專屬欄位
  priceRange?: string;           // 價格範圍，如 "$1,900~$2,700"
  recommendation?: string;        // 醫師建議等級，如 "必打等級"、"建議施打"
  features?: string;              // 特色說明
  ageLimit?: string;              // 施打年齡上限提醒，如 "須在6個月前完成"
  diseasesPrevented?: string[];   // 預防的疾病
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
  id: string; // Unique UUID for sharing across family members
  name: string;
  birthday: string; // YYYY-MM-DD
  gender?: Gender; // Optional: for growth chart percentiles
  milestoneProgress: MilestoneProgress;
  vaccineProgress: VaccineProgress;
  foodTrackingProgress?: FoodTrackingProgress; // Optional: complementary food tracking
  // LittleExplorer (幼兒期 1-3 歲) fields
  developmentProgress?: DevelopmentCheckProgress;
  careTaskProgress?: CareTaskProgress;
  toothProgress?: ToothProgress;
  // Pregnancy specific fields
  isPregnancy?: boolean;
  pregnancyData?: PregnancyData;
  createdAt: string; // ISO string
  createdBy: string; // User ID who created this child profile
}

// User profile with child references
export interface UserProfile {
  id: string; // User ID (from Firebase Auth)
  email?: string;
  displayName?: string;
  photoURL?: string;
  childrenIds: string[]; // Array of child UUIDs (max 2)
  currentChildId?: string; // Currently selected child
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

export interface PregnancyData {
  childId: string;
  dueDate: string; // YYYY-MM-DD
  lastPeriodDate: string; // YYYY-MM-DD
  status: 'active' | 'archived';
}

export interface PrenatalCheckup {
  id: string;
  childId: string;
  date: string; // YYYY-MM-DD
  clinicName: string;
  notes: string;
  completed: boolean;
}
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

// BabyOasis - Nursing Room Map Types
export interface NursingRoomFacilities {
  privateCurtain?: boolean;          // 獨立/有簾子空間
  nursingChair?: boolean;            // 哺乳椅
  waterDispenser?: boolean;          // 飲水機
  changingTable?: boolean;           // 尿布台
  washBasin?: boolean;               // 洗手台
  refrigerator?: boolean;            // 冰箱
  microwave?: boolean;               // 微波爐
  airConditioning?: boolean;         // 冷氣
  babyBed?: boolean;                 // 嬰兒床
  socket?: boolean;                  // 插座
}

export interface NursingRoom {
  id: string;
  name: string;                      // 場所名稱
  address: string;                   // 地址
  city: string;                      // 縣市
  district?: string;                 // 鄉鎮市區
  floor?: string;                    // 樓層
  locationDescription?: string;      // 位置描述
  latitude: number;                  // 緯度
  longitude: number;                 // 經度
  facilities: NursingRoomFacilities; // 設施
  openingHours?: string;             // 開放時間
  phone?: string;                    // 聯絡電話
  remarks?: string;                  // 備註
  lastUpdated?: string;              // 最後更新時間 (YYYY-MM-DD)
  isVerified?: boolean;              // 是否經過驗證
  rating?: number;                   // 評分 (1-5)
  reviewCount?: number;              // 評論數
}

// For clustering and display
export interface NursingRoomMarker extends NursingRoom {
  isUserLocation?: boolean;
}

// Wiki Types (shared presentational model; each sub-app owns its own category set)
export interface WikiCategoryColors {
  bg: string;
  text: string;
  pill: string;
}

export interface WikiArticle<Category extends string = string> {
  id: string;
  title: string;
  summary: string;
  category: Category;
  causes: string[];
  solutions: { step: string; detail: string }[];
  warningSignals: string[];
  relatedArticleIds: string[];
  icon: string;
}

// Baby Wiki (寶寶百科) — LittleSteps
export type WikiCategory = 'skin' | 'oral' | 'motor' | 'digestive' | 'fever' | 'sleep' | 'daily';
export type BabyWikiArticle = WikiArticle<WikiCategory>;

// Pregnancy Wiki (孕期知識庫) — LittleBloom
export type PregnancyWikiCategory = 'nutrition' | 'health' | 'symptoms' | 'checkup' | 'lifestyle';
export type PregnancyWikiArticle = WikiArticle<PregnancyWikiCategory>;


// ============================================================
// LittleExplorer（幼兒期 1-3 歲）
// ============================================================

export type ToddlerAgeBand = '12-15' | '15-18' | '18-24' | '24-30' | '30-36';

export type DevelopmentDomain =
  | 'gross-motor'   // 粗動作
  | 'fine-motor'    // 細動作
  | 'language'      // 語言溝通
  | 'cognitive'     // 認知
  | 'social';       // 身邊處理與社會性

export interface DevelopmentCheckItem {
  id: string;
  ageBand: ToddlerAgeBand;
  domain: DevelopmentDomain;
  /** 家長可直接判斷的題目 */
  title: string;
  /** 觀察情境與判準 */
  detail: string;
  /** 在家可以怎麼練 */
  tips: string[];
}

export interface DevelopmentWarning {
  ageBand: ToddlerAgeBand;
  /** 以「缺席」描述的警訊，例：「18 個月仍不會獨立行走」 */
  signals: string[];
  /** 轉介建議 */
  action: string;
}

export interface DevelopmentCheckProgress {
  [checkItemId: string]: {
    achieved: boolean;
    achievedDate?: string; // YYYY-MM-DD
  };
}

export type ToddlerTipCategory = 'safety' | 'feeding' | 'behavior' | 'health';

export interface ToddlerCareTip {
  ageBand: ToddlerAgeBand;
  category: ToddlerTipCategory;
  title: string;
  /** 3-4 條具體重點 */
  highlights: string[];
}

export type CareTaskKind =
  | 'health-check'
  | 'dev-screening'
  | 'vaccine'
  | 'dental'
  | 'admin';

export interface CareTaskTemplate {
  id: string;
  kind: CareTaskKind;
  title: string;
  description: string;
  /** 建議施行月齡；到期日 = birthday + dueMonth */
  dueMonth: number;
  /** 可執行區間起（月齡） */
  fromMonth: number;
  /** 可執行區間迄（月齡），逾此即 overdue */
  toMonth: number;
  /** 法源／出處 */
  source: string;
  /**
   * 若完成狀態已由 LittleSteps 的 vaccineProgress 承載，指向該筆記錄。
   * 必須與 vaccineDose 成對出現。
   */
  vaccineId?: string;
  /** 對應 VaccineSchedule.currentDose；單靠 vaccineId 無法分辨劑次 */
  vaccineDose?: number;
}

export interface CareTaskRecord {
  taskId: string;
  completedDate: string; // YYYY-MM-DD
  location?: string;     // 院所
  notes?: string;
}

export interface CareTaskProgress {
  [taskId: string]: CareTaskRecord;
}

export type CareTaskStatus = 'upcoming' | 'due' | 'overdue' | 'done';

export interface ResolvedCareTask {
  template: CareTaskTemplate;
  dueDate: string;   // YYYY-MM-DD
  windowEnd: string; // YYYY-MM-DD
  status: CareTaskStatus;
  /** 距建議日的天數；負數表示已過 */
  daysUntilDue: number;
  completedDate?: string;
}

export type DiaryMood = 'happy' | 'proud' | 'tired' | 'worried' | 'funny';

export interface DiaryEntry {
  id: string;
  childId: string;
  /** YYYY-MM-DD，家長可改，預設今天 */
  date: string;
  content: string;
  mood?: DiaryMood;
  /** 由成長分頁勾選時建立的條目會帶此欄，指向該檢核項目 */
  linkedCheckItemId?: string;
  createdAt: string; // ISO 8601
  updatedAt?: string;
}

export type ToothJaw = 'upper' | 'lower';

export interface PrimaryTooth {
  id: string;
  /** 牙位名稱，例：上正中門齒 */
  name: string;
  jaw: ToothJaw;
  /** 由中線往外的順位 1-5，用於排出牙弓；左右各一顆共用同一個順位 */
  position: number;
  side: 'left' | 'right';
  /** 典型萌發月齡區間（含），僅供參考，個別差異大 */
  eruptFromMonth: number;
  eruptToMonth: number;
}

export interface ToothProgress {
  [toothId: string]: {
    erupted: boolean;
    eruptedDate?: string; // YYYY-MM-DD
  };
}

// Toddler Wiki (幼兒百科) — LittleExplorer
export type ToddlerWikiCategory =
  | 'toilet'      // 如廁訓練
  | 'language'    // 語言發展
  | 'emotion'     // 情緒與行為
  | 'eating'      // 飲食與挑食
  | 'sleep'       // 睡眠轉換
  | 'safety'      // 學步期安全
  | 'health'      // 生病與就醫
  | 'preschool';  // 入園與社交
export type ToddlerWikiArticle = WikiArticle<ToddlerWikiCategory>;
