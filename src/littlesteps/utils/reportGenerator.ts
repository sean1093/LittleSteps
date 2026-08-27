import { DailyLog, GrowthRecord, FeedingData, SleepData, DiaperData } from '../../types';
import { filterLogsByDate, calculateSleepDuration } from './logHelpers';
import {
  TrendDirection,
  calculateTrend,
  getRecommendedSleepHours,
  generateSparklineData,
} from './trendCalculator';
import { toLocalDateKey } from '../../common/utils/dateHelpers';

export interface ReportScores {
  feeding: { score: number; label: string };
  sleep: { score: number; label: string };
  poop: { score: number; label: string };
}

export interface WeeklyReport {
  period: { start: string; end: string };
  scores: ReportScores;
  feeding: {
    dailyAmounts: number[];
    avgDailyCount: number;
    avgDailyAmount: number;
    maxDay: { date: string; amount: number };
    minDay: { date: string; amount: number };
  };
  sleep: {
    dailyDurations: number[];
    avgDailyHours: number;
    longestContinuous: number;
    nightWakingsTrend: TrendDirection;
    recommendedHours: number;
  };
  poop: {
    dailyCounts: number[];
    avgDailyCount: number;
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
 * Build feeding section data for a report
 */
function buildFeedingData(logs: DailyLog[], days: number) {
  const dailyAmounts: number[] = [];
  const dailyCounts: number[] = [];
  let maxDay = { date: '', amount: -Infinity };
  let minDay = { date: '', amount: Infinity };

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

    if (dayAmount > maxDay.amount) {
      maxDay = { date, amount: dayAmount };
    }
    if (dayAmount < minDay.amount) {
      minDay = { date, amount: dayAmount };
    }
  }

  // Handle edge case where no data exists
  if (maxDay.amount === -Infinity) maxDay = { date: getDateNDaysAgo(0), amount: 0 };
  if (minDay.amount === Infinity) minDay = { date: getDateNDaysAgo(0), amount: 0 };

  const avgDailyCount = dailyCounts.reduce((sum, v) => sum + v, 0) / days;
  const avgDailyAmount = dailyAmounts.reduce((sum, v) => sum + v, 0) / days;

  return {
    dailyAmounts,
    avgDailyCount: Math.round(avgDailyCount * 10) / 10,
    avgDailyAmount: Math.round(avgDailyAmount),
    maxDay,
    minDay,
  };
}

/**
 * Build sleep section data for a report
 */
function buildSleepData(logs: DailyLog[], days: number, ageMonths: number) {
  const dailyDurations: number[] = [];
  const nightWakingsPerDay: number[] = [];
  let longestContinuous = 0;

  for (let i = days - 1; i >= 0; i--) {
    const date = getDateNDaysAgo(i);
    const dayLogs = filterLogsByDate(logs, date);

    const sleepLogs = dayLogs.filter(log => log.type === 'sleep');
    let dayTotalMinutes = 0;
    let dayNightWakings = 0;

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
    nightWakingsPerDay.push(dayNightWakings);
  }

  const avgDailyHours = dailyDurations.reduce((sum, v) => sum + v, 0) / days;
  const nightWakingsTrend = calculateTrend(nightWakingsPerDay);
  const recommended = getRecommendedSleepHours(ageMonths);

  return {
    dailyDurations,
    avgDailyHours: Math.round(avgDailyHours * 10) / 10,
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

    poopLogs.forEach(log => {
      const data = log.data as DiaperData;
      if (data.consistency) {
        consistencyDistribution[data.consistency] =
          (consistencyDistribution[data.consistency] || 0) + 1;
      }
    });
  }

  const avgDailyCount = dailyCounts.reduce((sum, v) => sum + v, 0) / days;

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

  const latestPercentiles: Record<string, number> = {};
  if (last.percentile.weight != null) latestPercentiles['weight'] = last.percentile.weight;
  if (last.percentile.height != null) latestPercentiles['height'] = last.percentile.height;
  if (last.percentile.headCircumference != null)
    latestPercentiles['headCircumference'] = last.percentile.headCircumference;

  return {
    weightChange,
    heightChange,
    latestPercentiles,
  };
}

/**
 * Calculate scores (0-100) for feeding, sleep, and poop
 */
export function calculateScores(
  logs: DailyLog[],
  days: number,
  ageMonths: number
): ReportScores {
  // --- Feeding Score ---
  // Based on regularity/consistency of daily count and amount
  const feedingAmounts = generateSparklineData(logs, days, 'feeding_amount');
  const feedingCounts = generateSparklineData(logs, days, 'feeding_count');

  // Lower CV = more consistent = higher score
  const amountCV = coefficientOfVariation(feedingAmounts);
  const countCV = coefficientOfVariation(feedingCounts);
  const avgCV = (amountCV + countCV) / 2;
  // Map CV to score: CV=0 -> 100, CV>=1 -> 0
  const feedingScore = clampScore(100 - avgCV * 100);

  // --- Sleep Score ---
  // Based on meeting age recommendations and consistency
  const sleepDurations = generateSparklineData(logs, days, 'sleep_duration');
  const recommended = getRecommendedSleepHours(ageMonths);
  const avgSleep = sleepDurations.reduce((sum, v) => sum + v, 0) / sleepDurations.length;

  // How close to recommended: ratio capped at 1.0
  const meetingRatio = recommended.min > 0 ? Math.min(avgSleep / recommended.min, 1.0) : 1.0;
  const sleepCV = coefficientOfVariation(sleepDurations);
  const consistencyScore = clampScore(100 - sleepCV * 100);
  const sleepScore = clampScore(meetingRatio * 60 + (consistencyScore / 100) * 40);

  // --- Poop Score ---
  // Based on regularity (consistent daily count, no long gaps)
  const poopCounts = generateSparklineData(logs, days, 'poop_count');
  const avgPoopCount = poopCounts.reduce((sum, v) => sum + v, 0) / poopCounts.length;
  const poopCV = coefficientOfVariation(poopCounts);

  // Score components: regularity and having at least some poops
  const hasPoops = avgPoopCount > 0 ? 1 : 0;
  const regularityScore = clampScore(100 - poopCV * 100);
  const poopScore = clampScore(hasPoops * (regularityScore * 0.7 + 30));

  return {
    feeding: { score: feedingScore, label: getScoreLabel(feedingScore) },
    sleep: { score: sleepScore, label: getScoreLabel(sleepScore) },
    poop: { score: poopScore, label: getScoreLabel(poopScore) },
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
