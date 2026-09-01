import { DailyLog, GrowthRecord, FeedingData, SleepData, DiaperData } from '../../types';
import { filterLogsByDate, calculateSleepDuration } from './logHelpers';
import {
  TrendDirection,
  calculateTrend,
  getRecommendedSleepHours,
  generateDailySeries,
} from './trendCalculator';
import { toLocalDateKey } from '../../common/utils/dateHelpers';

export interface ReportScore {
  /**
   * 樣本太少時沒有分數。
   *
   * 這三個分數量的都是「天與天之間差多少」，兩天的記錄再怎麼算都得不出規律，
   * 只會把偶然講成結論——而 0 分在畫面上是紅色的「需注意」。
   */
  score: number | null;
  label: string;
  /** 這個分數是用幾天的記錄算出來的 */
  loggedDays: number;
}

export interface ReportScores {
  feeding: ReportScore;
  sleep: ReportScore;
  poop: ReportScore;
}

export interface WeeklyReport {
  period: { start: string; end: string };
  scores: ReportScores;
  feeding: {
    dailyAmounts: number[];
    avgDailyCount: number;
    avgDailyAmount: number;
    /** 這幾個平均是用幾天算的。沒記錄的日子不算，否則平均會被稀釋成假數字 */
    loggedDays: number;
    /** 一天餵奶都沒記過就沒有「最高日」可言 */
    maxDay?: { date: string; amount: number };
    minDay?: { date: string; amount: number };
  };
  sleep: {
    dailyDurations: number[];
    avgDailyHours: number;
    /** 這個平均是用幾天算的 */
    loggedDays: number;
    longestContinuous: number;
    nightWakingsTrend: TrendDirection;
    recommendedHours: number;
  };
  poop: {
    dailyCounts: number[];
    avgDailyCount: number;
    /** 這個平均是用幾天算的 */
    loggedDays: number;
    longestGap: number; // hours
    consistencyDistribution: Record<string, number>;
  };
  growth?: {
    weightChange: number;
    heightChange: number;
    latestPercentiles: Record<string, number>;
  };
  summaryText: string;
}

/**
 * Get the date string (YYYY-MM-DD) for N days ago
 */
function getDateNDaysAgo(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return toLocalDateKey(date);
}

/**
 * Compute the standard deviation of an array of numbers
 */
function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const squaredDiffs = values.map(v => (v - mean) ** 2);
  const variance = squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Coefficient of variation (CV): std / mean, returns 0 if mean is 0
 */
function coefficientOfVariation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  if (mean === 0) return 0;
  return standardDeviation(values) / mean;
}

/**
 * Get the score label in Traditional Chinese
 */
function getScoreLabel(score: number): string {
  if (score >= 80) return '很棒！';
  if (score >= 60) return '不錯';
  if (score >= 40) return '尚可';
  return '需注意';
}

/**
 * Clamp a value between 0 and 100
 */
function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * 少於這麼多天有記錄就不給分數。
 *
 * 三個分數量的都是天與天之間的變異，三天以內的樣本量不到規律：兩天的
 * 變異係數只反映那兩天差多少，而報告會把它畫成紅色的 0 分。
 */
const MIN_DAYS_FOR_SCORE = 4;

/** 只留下有記錄的那幾天；沒記錄的那天是 null，不是 0 */
function observedDays(series: Array<number | null>): number[] {
  return series.filter((value): value is number => value !== null);
}

/**
 * 分數少於 MIN_DAYS_FOR_SCORE 天就不給——`score` 是 null，畫面顯示「資料不足」，
 * `label` 給的是下一步而不是評語。`loggedDays` 是分母，讀分數的人要看得到。
 */
function buildScore(loggedDays: number, score: number): ReportScore {
  if (loggedDays < MIN_DAYS_FOR_SCORE) return { score: null, label: '再記幾天', loggedDays };
  return { score, label: getScoreLabel(score), loggedDays };
}

/**
 * Build feeding section data for a report
 */
function buildFeedingData(logs: DailyLog[], days: number) {
  const dailyAmounts: number[] = [];
  const dailyCounts: number[] = [];
  let maxDay = { date: '', amount: -Infinity };
  let minDay = { date: '', amount: Infinity };
  let loggedDays = 0;
  let feedingCountTotal = 0;
  let feedingAmountTotal = 0;

  for (let i = days - 1; i >= 0; i--) {
    const date = getDateNDaysAgo(i);
    const dayLogs = filterLogsByDate(logs, date);

    const feedingLogs = dayLogs.filter(log => log.type === 'feeding');
    const dayAmount = feedingLogs.reduce((sum, log) => {
      const data = log.data as FeedingData;
      return sum + (data.amount || 0);
    }, 0);
    const dayCount = feedingLogs.length;

    dailyAmounts.push(dayAmount);
    dailyCounts.push(dayCount);

    if (feedingLogs.length > 0) {
      loggedDays += 1;
      feedingCountTotal += dayCount;
      feedingAmountTotal += dayAmount;
    }

    // 只有真的記了餵奶的日子才能當「最多／最少的一天」。沒記的那天算進來，
    // 最少的一天永遠是 0 ml，而報告會指名道姓說是哪一天——家長讀到的是
    // 「那天寶寶沒喝奶」，不是「那天沒記」。
    if (feedingLogs.length > 0) {
      if (dayAmount > maxDay.amount) {
        maxDay = { date, amount: dayAmount };
      }
      if (dayAmount < minDay.amount) {
        minDay = { date, amount: dayAmount };
      }
    }
  }

  // 整段期間都沒記過餵奶時，沒有哪一天可以指。回一個隨便挑的日期加 0 ml，
  // 等於憑空生出一個「那天寶寶只喝了 0」的說法。
  const logged = maxDay.amount !== -Infinity;

  // 沒記錄的日子不是「那天喝 0 ml」，是不知道。除以整段天數會把 7 天記錄
  // 稀釋成 30 天的平均——1680 ml 變成每日 56 ml，而一個寶寶一天喝 700-900 ml。
  const avgDailyCount = loggedDays > 0 ? feedingCountTotal / loggedDays : 0;
  const avgDailyAmount = loggedDays > 0 ? feedingAmountTotal / loggedDays : 0;

  return {
    dailyAmounts,
    avgDailyCount: Math.round(avgDailyCount * 10) / 10,
    avgDailyAmount: Math.round(avgDailyAmount),
    loggedDays,
    maxDay: logged ? maxDay : undefined,
    minDay: logged ? minDay : undefined,
  };
}

/**
 * Build sleep section data for a report
 */
function buildSleepData(logs: DailyLog[], days: number, ageMonths: number) {
  const dailyDurations: number[] = [];
  const nightWakingsPerDay: Array<number | null> = [];
  let longestContinuous = 0;
  let loggedDays = 0;
  let sleepMinutesTotal = 0;

  for (let i = days - 1; i >= 0; i--) {
    const date = getDateNDaysAgo(i);
    const dayLogs = filterLogsByDate(logs, date);

    const sleepLogs = dayLogs.filter(log => log.type === 'sleep');
    let dayTotalMinutes = 0;
    let dayNightWakings = 0;
    // 那天完全沒記睡眠，夜醒次數就是不知道，不是 0。當成 0 會讓「太累沒記」
    // 看起來跟「夜醒變少了」一模一樣，而後者是家長最想聽到的消息。
    const logged = sleepLogs.length > 0;

    sleepLogs.forEach(log => {
      const data = log.data as SleepData;
      const duration = data.duration || calculateSleepDuration(data) || 0;
      dayTotalMinutes += duration;

      if (duration > longestContinuous) {
        longestContinuous = duration;
      }

      if (data.nightWakings) {
        dayNightWakings += data.nightWakings;
      }
    });

    dailyDurations.push(Math.round((dayTotalMinutes / 60) * 10) / 10); // hours
    nightWakingsPerDay.push(logged ? dayNightWakings : null);

    if (logged) {
      loggedDays += 1;
      sleepMinutesTotal += dayTotalMinutes;
    }
  }

  // 沒記睡眠的日子不是「那天沒睡」。除以整段天數，會讓漏記幾天的家長看到
  // 一個遠低於實際的時數，然後對照「建議時數」以為孩子睡太少。
  const avgDailyHours = loggedDays > 0 ? sleepMinutesTotal / 60 / loggedDays : 0;
  const nightWakingsTrend = calculateTrend(nightWakingsPerDay);
  const recommended = getRecommendedSleepHours(ageMonths);

  return {
    dailyDurations,
    avgDailyHours: Math.round(avgDailyHours * 10) / 10,
    loggedDays,
    longestContinuous: Math.round(longestContinuous), // minutes
    nightWakingsTrend,
    recommendedHours: recommended.min,
  };
}

/**
 * Build poop section data for a report
 */
function buildPoopData(logs: DailyLog[], days: number) {
  const dailyCounts: number[] = [];
  const consistencyDistribution: Record<string, number> = {};

  // Collect all poop-related logs from the period for gap calculation
  const allPoopLogs: DailyLog[] = [];
  let loggedDays = 0;
  let poopCountTotal = 0;

  for (let i = days - 1; i >= 0; i--) {
    const date = getDateNDaysAgo(i);
    const dayLogs = filterLogsByDate(logs, date);

    const poopLogs = dayLogs.filter(log => {
      if (log.type !== 'diaper') return false;
      const data = log.data as DiaperData;
      return data.type === 'poop' || data.type === 'both';
    });

    dailyCounts.push(poopLogs.length);
    allPoopLogs.push(...poopLogs);

    // 判準是「那天有沒有記尿布」，不是「有沒有大便」：有記但沒大便是真的 0。
    if (dayLogs.some((log) => log.type === 'diaper')) {
      loggedDays += 1;
      poopCountTotal += poopLogs.length;
    }

    poopLogs.forEach(log => {
      const data = log.data as DiaperData;
      if (data.consistency) {
        consistencyDistribution[data.consistency] =
          (consistencyDistribution[data.consistency] || 0) + 1;
      }
    });
  }

  const avgDailyCount = loggedDays > 0 ? poopCountTotal / loggedDays : 0;

  // Calculate longest gap between consecutive poops (in hours)
  let longestGap = 0;
  if (allPoopLogs.length >= 2) {
    const sortedByTime = [...allPoopLogs].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    for (let i = 1; i < sortedByTime.length; i++) {
      const gap =
        (new Date(sortedByTime[i].timestamp).getTime() -
          new Date(sortedByTime[i - 1].timestamp).getTime()) /
        (1000 * 60 * 60);
      if (gap > longestGap) {
        longestGap = gap;
      }
    }
  }

  return {
    dailyCounts,
    avgDailyCount: Math.round(avgDailyCount * 10) / 10,
    loggedDays,
    longestGap: Math.round(longestGap * 10) / 10,
    consistencyDistribution,
  };
}

/**
 * Build optional growth section data
 */
function buildGrowthData(growthRecords: GrowthRecord[], days: number) {
  if (growthRecords.length < 2) return undefined;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffStr = toLocalDateKey(cutoffDate);

  // Filter records within the period
  const periodRecords = growthRecords
    .filter(r => r.date >= cutoffStr)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (periodRecords.length < 2) return undefined;

  const first = periodRecords[0];
  const last = periodRecords[periodRecords.length - 1];

  const weightChange =
    first.weight != null && last.weight != null
      ? Math.round((last.weight - first.weight) * 100) / 100
      : 0;

  const heightChange =
    first.height != null && last.height != null
      ? Math.round((last.height - first.height) * 10) / 10
      : 0;

  // 沒有性別就算不出百分位，percentile 整個物件會不存在——由 LittleBloom
  // 登記出生轉過來的孩子一律如此，recordBirth 不會補 gender。
  const latestPercentiles: Record<string, number> = {};
  if (last.percentile?.weight != null) latestPercentiles['weight'] = last.percentile.weight;
  if (last.percentile?.height != null) latestPercentiles['height'] = last.percentile.height;
  if (last.percentile?.headCircumference != null)
    latestPercentiles['headCircumference'] = last.percentile.headCircumference;

  return {
    weightChange,
    heightChange,
    latestPercentiles,
  };
}

/**
 * 三個 0-100 分數。分母一律是「有記錄的天數」，不是視窗長度。
 *
 * 補 0 的序列會讓 30 天裡只記了 2 天的家長，在正確忽略未記錄日的平均值
 * 旁邊看到滿滿的紅字：22 天的 0 把變異係數推爆，分數歸零，標籤寫「需注意」。
 * 那不是寶寶的狀況，是記錄的密度。
 */
export function calculateScores(
  logs: DailyLog[],
  days: number,
  ageMonths: number
): ReportScores {
  const feedingAmounts = observedDays(generateDailySeries(logs, days, 'feeding_amount'));
  const feedingCounts = observedDays(generateDailySeries(logs, days, 'feeding_count'));
  const sleepHours = observedDays(generateDailySeries(logs, days, 'sleep_duration'));
  const poopCounts = observedDays(generateDailySeries(logs, days, 'poop_count'));

  // 餵奶規律度：奶量與次數的變異係數。CV 0 得 100 分，CV ≥ 1 得 0 分。
  const feedingCV =
    (coefficientOfVariation(feedingAmounts) + coefficientOfVariation(feedingCounts)) / 2;

  // 睡眠品質：達到月齡建議時數佔 60 分，日與日之間的穩定度佔 40 分。
  const recommended = getRecommendedSleepHours(ageMonths);
  const totalSleepHours = sleepHours.reduce((sum, v) => sum + v, 0);
  const avgSleep = sleepHours.length > 0 ? totalSleepHours / sleepHours.length : 0;
  const meetingRatio = recommended.min > 0 ? Math.min(avgSleep / recommended.min, 1) : 1;
  const sleepConsistency = clampScore(100 - coefficientOfVariation(sleepHours) * 100);

  // 排便正常度：有記錄的日子裡一次都沒大便才是 0 分，其餘看每日次數穩不穩。
  const poopTotal = poopCounts.reduce((sum, v) => sum + v, 0);
  const poopRegularity = clampScore(100 - coefficientOfVariation(poopCounts) * 100);

  return {
    feeding: buildScore(feedingAmounts.length, clampScore(100 - feedingCV * 100)),
    sleep: buildScore(
      sleepHours.length,
      clampScore(meetingRatio * 60 + (sleepConsistency / 100) * 40)
    ),
    poop: buildScore(
      poopCounts.length,
      poopTotal > 0 ? clampScore(poopRegularity * 0.7 + 30) : 0
    ),
  };
}

/**
 * Generate summary text in Traditional Chinese
 */
export function generateSummaryText(report: WeeklyReport): string {
  const parts: string[] = [];

  // Feeding summary
  if (report.feeding.avgDailyAmount > 0) {
    parts.push(`餵奶量平均每日 ${report.feeding.avgDailyAmount}ml`);
  } else if (report.feeding.avgDailyCount > 0) {
    parts.push(`平均每日餵奶 ${report.feeding.avgDailyCount} 次`);
  }

  // Sleep summary
  if (report.sleep.avgDailyHours > 0) {
    const sleepComment =
      report.sleep.avgDailyHours < report.sleep.recommendedHours
        ? '，略低於建議值，建議觀察作息'
        : '，符合建議範圍';
    parts.push(`睡眠時數平均 ${report.sleep.avgDailyHours} 小時${sleepComment}`);
  }

  // Poop summary
  if (report.poop.avgDailyCount > 0) {
    if (report.poop.longestGap > 48) {
      parts.push(`排便間隔最長達 ${Math.round(report.poop.longestGap)} 小時，需留意`);
    } else {
      parts.push('排便規律正常');
    }
  }

  if (parts.length === 0) {
    return '尚無足夠資料產生摘要，請持續記錄寶寶的日常。';
  }

  return parts.join('。') + '。';
}

/**
 * Generate a report for a given number of days
 */
function generateReport(
  logs: DailyLog[],
  growthRecords: GrowthRecord[],
  ageMonths: number,
  days: number
): WeeklyReport {
  const periodStart = getDateNDaysAgo(days - 1);
  const periodEnd = getDateNDaysAgo(0);

  const scores = calculateScores(logs, days, ageMonths);
  const feeding = buildFeedingData(logs, days);
  const sleep = buildSleepData(logs, days, ageMonths);
  const poop = buildPoopData(logs, days);
  const growth = buildGrowthData(growthRecords, days);

  const report: WeeklyReport = {
    period: { start: periodStart, end: periodEnd },
    scores,
    feeding,
    sleep,
    poop,
    growth,
    summaryText: '', // will be filled below
  };

  report.summaryText = generateSummaryText(report);

  return report;
}

/**
 * Generate weekly report (7 days)
 */
export function generateWeeklyReport(
  logs: DailyLog[],
  growthRecords: GrowthRecord[],
  ageMonths: number
): WeeklyReport {
  return generateReport(logs, growthRecords, ageMonths, 7);
}

/**
 * Generate monthly report (30 days)
 */
export function generateMonthlyReport(
  logs: DailyLog[],
  growthRecords: GrowthRecord[],
  ageMonths: number
): WeeklyReport {
  return generateReport(logs, growthRecords, ageMonths, 30);
}
