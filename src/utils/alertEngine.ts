import { DailyLog, FeedingData, SleepData, DiaperData } from '../types';
import { filterLogsByDate, calculateSleepDuration } from './logHelpers';
import { calculateDailyAverage, getRecommendedSleepHours } from './trendCalculator';
import { toLocalDateKey } from './dateHelpers';

export type AlertSeverity = 'warning' | 'danger';
export type AlertCategory = 'feeding' | 'sleep' | 'poop';

export interface Alert {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  message: string;
  icon: string; // lucide-react icon name
}

/**
 * Detect feeding alerts
 *
 * Rules:
 * - warning: today's feeding amount < 70% of 7-day average
 * - warning: last feeding was >6 hours ago
 */
export function detectFeedingAlerts(logs: DailyLog[], _ageMonths: number): Alert[] {
  const alerts: Alert[] = [];
  const today = toLocalDateKey();
  const todayLogs = filterLogsByDate(logs, today);

  // Rule 1: today's feeding amount < 70% of 7-day average
  const avgDailyAmount = calculateDailyAverage(logs, 7, 'feeding_amount');
  const todayFeedingAmount = todayLogs
    .filter(log => log.type === 'feeding')
    .reduce((sum, log) => {
      const data = log.data as FeedingData;
      return sum + (data.amount || 0);
    }, 0);

  if (avgDailyAmount > 0 && todayFeedingAmount < avgDailyAmount * 0.7) {
    alerts.push({
      id: 'feeding-low-amount',
      category: 'feeding',
      severity: 'warning',
      title: '今日餵奶量偏低',
      message: `今日餵奶量 ${Math.round(todayFeedingAmount)}ml，低於近 7 天平均 ${Math.round(avgDailyAmount)}ml 的 70%，請留意寶寶食慾。`,
      icon: 'AlertTriangle',
    });
  }

  // Rule 2: last feeding was >6 hours ago
  const feedingLogs = logs
    .filter(log => log.type === 'feeding')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (feedingLogs.length > 0) {
    const lastFeedingTime = new Date(feedingLogs[0].timestamp).getTime();
    const now = Date.now();
    const hoursSinceLastFeeding = (now - lastFeedingTime) / (1000 * 60 * 60);

    if (hoursSinceLastFeeding > 6) {
      alerts.push({
        id: 'feeding-long-gap',
        category: 'feeding',
        severity: 'warning',
        title: '距離上次餵奶已超過 6 小時',
        message: `距離上次餵奶已經 ${Math.round(hoursSinceLastFeeding)} 小時，請確認寶寶是否需要餵食。`,
        icon: 'Clock',
      });
    }
  }

  return alerts;
}

/**
 * Detect poop alerts
 *
 * Rules:
 * - warning: no poop in >48 hours
 * - danger: no poop in >72 hours
 */
export function detectPoopAlerts(logs: DailyLog[]): Alert[] {
  const alerts: Alert[] = [];

  // Find the most recent diaper log with type poop or both
  const poopLogs = logs
    .filter(log => log.type === 'diaper')
    .filter(log => {
      const data = log.data as DiaperData;
      return data.type === 'poop' || data.type === 'both';
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (poopLogs.length === 0) {
    // No poop logs at all - can't determine, skip alerts
    return alerts;
  }

  const lastPoopTime = new Date(poopLogs[0].timestamp).getTime();
  const now = Date.now();
  const hoursSinceLastPoop = (now - lastPoopTime) / (1000 * 60 * 60);

  if (hoursSinceLastPoop > 72) {
    alerts.push({
      id: 'poop-no-poop-72h',
      category: 'poop',
      severity: 'danger',
      title: '超過 72 小時未排便',
      message: `寶寶已超過 ${Math.round(hoursSinceLastPoop)} 小時未排便，建議諮詢醫師是否需要處理。`,
      icon: 'AlertOctagon',
    });
  } else if (hoursSinceLastPoop > 48) {
    alerts.push({
      id: 'poop-no-poop-48h',
      category: 'poop',
      severity: 'warning',
      title: '超過 48 小時未排便',
      message: `寶寶已超過 ${Math.round(hoursSinceLastPoop)} 小時未排便，請持續觀察。`,
      icon: 'AlertTriangle',
    });
  }

  return alerts;
}

/**
 * Detect sleep alerts
 *
 * Rules:
 * - warning: today's total sleep < 70% of age-recommended minimum
 */
export function detectSleepAlerts(logs: DailyLog[], ageMonths: number): Alert[] {
  const alerts: Alert[] = [];
  const today = toLocalDateKey();
  const todayLogs = filterLogsByDate(logs, today);

  const recommended = getRecommendedSleepHours(ageMonths);

  // Calculate today's total sleep in hours
  const todaySleepMinutes = todayLogs
    .filter(log => log.type === 'sleep')
    .reduce((sum, log) => {
      const data = log.data as SleepData;
      const duration = data.duration || calculateSleepDuration(data) || 0;
      return sum + duration;
    }, 0);
  const todaySleepHours = todaySleepMinutes / 60;

  const threshold = recommended.min * 0.7;

  if (todaySleepHours < threshold && todaySleepHours > 0) {
    alerts.push({
      id: 'sleep-below-recommended',
      category: 'sleep',
      severity: 'warning',
      title: '今日睡眠時數偏低',
      message: `今日睡眠 ${todaySleepHours.toFixed(1)} 小時，低於建議最低 ${recommended.min} 小時的 70%，請注意寶寶作息。`,
      icon: 'Moon',
    });
  }

  return alerts;
}

/**
 * Get all active alerts, sorted by severity (danger first)
 */
export function getActiveAlerts(logs: DailyLog[], ageMonths: number): Alert[] {
  const feedingAlerts = detectFeedingAlerts(logs, ageMonths);
  const poopAlerts = detectPoopAlerts(logs);
  const sleepAlerts = detectSleepAlerts(logs, ageMonths);

  const allAlerts = [...feedingAlerts, ...poopAlerts, ...sleepAlerts];

  // Sort by severity: danger first, then warning
  allAlerts.sort((a, b) => {
    const severityOrder: Record<AlertSeverity, number> = { danger: 0, warning: 1 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return allAlerts;
}
