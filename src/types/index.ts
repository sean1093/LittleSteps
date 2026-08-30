import type { ScheduleStatus } from '../common/utils/scheduleStatus';
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
  prenatalProgress?: PrenatalCheckupProgress;
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

/** 產檢與篩檢項目的完成記錄，鍵為 prenatalCheckupSchedule 的 template id。 */
export interface PrenatalCheckupProgress {
  [templateId: string]: {
    completedDate: string; // YYYY-MM-DD
    clinicName?: string;
    notes?: string;
  };
}

export interface DailyLog {
  id: string;
  childId: string;
  type: 'feeding' | 'sleep' | 'diaper';
  timestamp: string; // ISO 8601 format
  data: FeedingData | SleepData | DiaperData;
  createdAt: string; // ISO 8601 format
  updatedAt?: string; // ISO 8601 format
  /**
   * 記錄這一筆的人。餵奶、睡眠、換尿布本來就是兩個人輪流做的事，孩子也可以
   * 用 joinChild 共享——但先前沒有任何一筆紀錄留下是誰做的，「上一餐誰餵的」
   * 在 app 裡問不出答案。
   *
   * 兩個欄位都選填：既有的紀錄沒有這些值，不能因此壞掉。
   */
  createdBy?: string;
  /**
   * 寫入當下的顯示名稱快照。
   *
   * 不能只存 uid：安全規則裡 users/$userId 只有本人讀得到，所以事後沒有任何
   * 辦法把別人的 uid 換成名字。對方改名後這裡會留著舊名字，那是這個限制下
   * 可接受的代價。
   */
  createdByName?: string;
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
// 資料來源：衛福部國健署「依法應設置哺集乳室公共場所名單」。來源只提供名稱、
// 地址、電話、開放時間與注意事項，沒有座標，也沒有設施細目；設施僅在各縣市
// 另行公布細目的場所才有，所以是選填，UI 必須據實呈現「未提供」而非「沒有」。
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
  name: string;                       // 場所名稱
  address: string;                    // 地址
  city: string;                       // 縣市
  district?: string;                  // 鄉鎮市區
  floor?: string;                     // 樓層與室內位置
  latitude: number;                   // 緯度
  longitude: number;                  // 經度
  facilities?: NursingRoomFacilities; // 設施，來源未提供時為 undefined
  openingHours?: string;              // 開放時間
  phone?: string;                     // 聯絡電話
  remarks?: string;                   // 注意事項
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

/**
 * 照護任務的狀態就是共用的排程狀態（common/utils/scheduleStatus）。
 * 別名保留是為了不動既有的匯入點；成員不再各寫一份。
 */
export type CareTaskStatus = ScheduleStatus;

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

/**
 * 幼兒百科文章。
 *
 * `ageRange` 是這篇最相關的月齡區間，含頭不含尾，起始值對齊
 * `TODDLER_AGE_BANDS` 的界線（12/15/18/24/30）。橫跨整個幼兒期的常備知識
 * 用 `[12, 36]`。用途只有排序與標籤——任何年齡都讀得到每一篇。
 */
export interface ToddlerWikiArticle extends WikiArticle<ToddlerWikiCategory> {
  ageRange: [number, number];
}

// ============================================================
// LittleOuting（親子好去處）— 親子館與親子餐廳
// ============================================================

/**
 * 場館類型。
 *
 * 官方名稱極不一致（新北叫「公共托育中心」、臺南叫「親子悠遊館」、屏東只用
 * 「托育資源中心」），所以名稱逐字保留，另外用這個欄位正規化，不從名稱字串
 * 反推——反推會把新北整批算錯。
 *
 * 這裡刻意不含「社區公共托育家園」與「公設民營托嬰中心」：那兩種是把孩子
 * 送去給人照顧的留置型服務，和家長全程陪同的親子館是不同的東西，混在一起
 * 會讓家長帶著孩子跑到一個不能進去玩的地方。
 */
export type VenueKind =
  | 'centre'      // 親子館／托育資源中心（公立，免費，家長陪同）
  | 'restaurant'; // 親子餐廳（私人經營）

/**
 * 可查核的場館標籤。
 *
 * 全部是事實而不是評價——「有沒有尿布台」可以查證，「高 CP 值」不行。形容詞
 * 型標籤會隨業配文膨脹而失真，所以一個都不放。
 */
export type VenueTag =
  // 費用與門檻
  | 'free'            // 免費入場
  | 'needsBooking'    // 需預約
  | 'walkInQueue'     // 可現場排隊／候補
  | 'guardianRequired'// 需家長全程陪同
  // 設施
  | 'diaperTable'     // 尿布台
  | 'nursingRoom'     // 哺乳室
  | 'highChair'       // 兒童餐椅
  | 'kidsTableware'   // 兒童餐具
  | 'playArea'        // 遊戲區
  | 'toyLending'      // 教玩具借閱
  // 到達
  | 'parking'         // 停車場
  | 'nearMetro'       // 鄰近捷運
  | 'strollerAccess'  // 推車可進（無樓梯或有電梯）
  // 環境與服務
  | 'indoor'          // 室內（雨天可去）
  | 'outdoor'         // 有戶外空間
  | 'privateRoom'     // 可包場／包廂（慶生、抓週）
  | 'socksRequired';  // 需穿襪入場

export interface Venue {
  id: string;
  kind: VenueKind;
  /** 官方或店家自己的名稱，逐字保留。 */
  name: string;
  city: string;
  district: string;
  address: string;
  /** 部分場館未提供，維持 undefined 而不是空字串。 */
  phone?: string;
  tags: VenueTag[];
  /**
   * 適合年齡（歲）。場館端只公告到「歲」這個顆粒度（0-2、3-6），所以這裡
   * 也只到歲——硬換算成月齡會製造假精確。
   */
  ageYears?: [number, number];
  /** 低消金額（新台幣）。親子館免費，故不設此欄。 */
  minSpend?: number;
  /** 這一筆的資料來源網址。 */
  sourceUrl: string;
  /** 最後查證日期，YYYY-MM-DD。餐廳會倒店、公休會改，家長要看得到這個。 */
  verifiedOn: string;
  /** 官方預約或訂位頁面。 */
  bookingUrl?: string;
  notes?: string;
}
