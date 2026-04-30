import { DailyLog, FeedingData, SleepData, DiaperData } from '../types';
import { filterLogsByDate, calculateSleepDuration } from './logHelpers';
import { sleepRequirements } from '../data/sleep';

export type TrendDirection = 'increasing' | 'decreasing' | 'stable';

export interface TrendData {
  direction: TrendDirection;
  changeRate: number; // percentage
  currentValue: number;
  averageValue: number;
  sparklinePoints: number[];
}

/**
 * Get the date string (YYYY-MM-DD) for N days ago from today
 */
function getDateNDaysAgo(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

/**
 * Extract the daily value for a specific metric type from a day's logs
 */
function getDailyValue(
  logs: DailyLog[],
  date: string,
  type: 'feeding_count' | 'feeding_amount' | 'sleep_duration' | 'poop_count'
): number {
  const dayLogs = filterLogsByDate(logs, date);

  switch (type) {
    case 'feeding_count':
      return dayLogs.filter(log => log.type === 'feeding').length;

    case 'feeding_amount':
      return dayLogs
        .filter(log => log.type === 'feeding')
        .reduce((sum, log) => {
          const data = log.data as FeedingData;
          return sum + (data.amount || 0);
        }, 0);

    case 'sleep_duration': {
      return dayLogs
        .filter(log => log.type === 'sleep')
        .reduce((sum, log) => {
          const data = log.data as SleepData;
          const duration = data.duration || calculateSleepDuration(data) || 0;
          return sum + duration / 60; // convert minutes to hours
        }, 0);
    }

    case 'poop_count':
      return dayLogs
        .filter(log => log.type === 'diaper')
        .filter(log => {
          const data = log.data as DiaperData;
          return data.type === 'poop' || data.type === 'both';
        }).length;

    default:
      return 0;
  }
}

/**
 * Calculate daily average of a metric over N days
 */
export function calculateDailyAverage(
  logs: DailyLog[],
  days: number,
  type: 'feeding_count' | 'feeding_amount' | 'sleep_duration' | 'poop_count'
): number {
  if (days <= 0) return 0;

  let total = 0;
  for (let i = 0; i < days; i++) {
    const date = getDateNDaysAgo(i);
    total += getDailyValue(logs, date, type);
  }

  return total / days;
}

/**
 * Calculate trend direction over N days.
 * Compares the average of the second half to the first half.
 * 'increasing' if second half average > first half average by >10%
 * 'decreasing' if < -10%
 * otherwise 'stable'
 */
export function calculateTrend(dailyValues: number[]): TrendDirection {
  if (dailyValues.length < 2) return 'stable';

  const midpoint = Math.floor(dailyValues.length / 2);
  const firstHalf = dailyValues.slice(0, midpoint);
  const secondHalf = dailyValues.slice(midpoint);

  const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;

  if (firstAvg === 0) {
    return secondAvg > 0 ? 'increasing' : 'stable';
  }

  const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;

  if (changePercent > 10) return 'increasing';
  if (changePercent < -10) return 'decreasing';
  return 'stable';
}

/**
 * Calculate change rate between current value and average value (percentage)
 */
export function calculateChangeRate(
  currentValue: number,
  averageValue: number
): number {
  if (averageValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }
  return ((currentValue - averageValue) / averageValue) * 100;
}

/**
 * Generate sparkline data points (one per day, for N days).
 * Returns values ordered from oldest to newest.
 */
export function generateSparklineData(
  logs: DailyLog[],
  days: number,
  type: 'feeding_count' | 'feeding_amount' | 'sleep_duration' | 'poop_count'
): number[] {
  const points: number[] = [];
  // Iterate from oldest day to most recent (i = days-1 is oldest, i = 0 is today)
  for (let i = days - 1; i >= 0; i--) {
    const date = getDateNDaysAgo(i);
    points.push(getDailyValue(logs, date, type));
  }
  return points;
}

/**
 * Parse sleep requirement totalHours string (e.g. "16-17 小時") into { min, max }
 */
function parseSleepHoursRange(totalHours: string): { min: number; max: number } {
  const match = totalHours.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
  if (match) {
    return { min: parseFloat(match[1]), max: parseFloat(match[2]) };
  }
  // Single value like "13 小時"
  const singleMatch = totalHours.match(/(\d+(?:\.\d+)?)/);
  if (singleMatch) {
    const value = parseFloat(singleMatch[1]);
    return { min: value, max: value };
  }
  return { min: 12, max: 16 }; // fallback
}

/**
 * Compare a value with age-recommended sleep hours.
 * Uses sleepRequirements from src/data/sleep.ts
 */
export function getRecommendedSleepHours(ageMonths: number): { min: number; max: number } {
  // Map age in months to the correct sleep requirement entry
  if (ageMonths < 1) {
    return parseSleepHoursRange(sleepRequirements[0].totalHours); // 0-1 months
  } else if (ageMonths < 3) {
    return parseSleepHoursRange(sleepRequirements[1].totalHours); // 1-3 months
  } else if (ageMonths < 6) {
    return parseSleepHoursRange(sleepRequirements[2].totalHours); // 3-6 months
  } else if (ageMonths < 12) {
    return parseSleepHoursRange(sleepRequirements[3].totalHours); // 6-12 months
  } else if (ageMonths < 18) {
    return parseSleepHoursRange(sleepRequirements[4].totalHours); // 12-18 months
  } else {
    return parseSleepHoursRange(sleepRequirements[5].totalHours); // 18-24 months
  }
}

/**
 * Build a TrendData object for a given metric type over N days
 */
function buildTrendData(
  logs: DailyLog[],
  days: number,
  type: 'feeding_count' | 'feeding_amount' | 'sleep_duration' | 'poop_count'
): TrendData {
  const sparklinePoints = generateSparklineData(logs, days, type);
  const todayValue = sparklinePoints[sparklinePoints.length - 1] || 0;
  const averageValue = calculateDailyAverage(logs, days, type);
  const direction = calculateTrend(sparklinePoints);
  const changeRate = calculateChangeRate(todayValue, averageValue);

  return {
    direction,
    changeRate,
    currentValue: todayValue,
    averageValue,
    sparklinePoints,
  };
}

/**
 * Get feeding trend data for the past N days
 */
export function getFeedingTrend(logs: DailyLog[], days: number): TrendData {
  return buildTrendData(logs, days, 'feeding_amount');
}

/**
 * Get sleep trend data for the past N days
 */
export function getSleepTrend(logs: DailyLog[], days: number): TrendData {
  return buildTrendData(logs, days, 'sleep_duration');
}

/**
 * Get poop trend data for the past N days
 */
export function getPoopTrend(logs: DailyLog[], days: number): TrendData {
  return buildTrendData(logs, days, 'poop_count');
}
