import { describe, it, expect } from 'vitest';
import type { DailyLog, SleepData } from '../types';
import {
  filterSleepLogs,
  getSleepLogsInRange,
  calculateTotalSleepDuration,
  findLongestSleepSession,
  calculateAverageSleepDuration,
  calculateTotalNightWakings,
  detectSleepingThroughNight,
  calculateSleepQualityScore,
  calculateRoutineScore,
  calculateAverageBedtime,
  calculateAverageWakeTime,
  analyzeSleepPatterns,
  getSleepPatternsByDate
} from './sleepAnalytics';

describe('sleepAnalytics', () => {
  // Helper function to create sleep logs
  const createSleepLog = (
    timestamp: string,
    duration: number,
    quality?: 'good' | 'fair' | 'poor',
    nightWakings?: number
  ): DailyLog => {
    const startTime = new Date(timestamp);
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    return {
      id: `log_${Math.random()}`,
      childId: 'child123',
      type: 'sleep',
      timestamp,
      data: {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration,
        quality,
        nightWakings
      } as SleepData,
      createdAt: timestamp
    };
  };

  const createFeedingLog = (timestamp: string): DailyLog => ({
    id: `log_${Math.random()}`,
    childId: 'child123',
    type: 'feeding',
    timestamp,
    data: {
      feedingType: 'breast_left',
      duration: 15
    },
    createdAt: timestamp
  });

  describe('filterSleepLogs', () => {
    it('should filter only sleep logs', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-06T10:00:00Z', 120),
        createFeedingLog('2026-04-06T12:00:00Z'),
        createSleepLog('2026-04-06T14:00:00Z', 90)
      ];

      const sleepLogs = filterSleepLogs(logs);
      expect(sleepLogs).toHaveLength(2);
      expect(sleepLogs.every(log => log.type === 'sleep')).toBe(true);
    });
  });

  describe('getSleepLogsInRange', () => {
    it('should return logs from today (since midnight)', () => {
      const now = new Date();
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const today = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 hour ago

      const logs: DailyLog[] = [
        createSleepLog(twoDaysAgo.toISOString(), 120),
        createSleepLog(today.toISOString(), 90)
      ];

      const recentLogs = getSleepLogsInRange(logs, 1);
      expect(recentLogs).toHaveLength(1);
      expect(recentLogs[0].timestamp).toBe(today.toISOString());
    });

    it('should return logs from last 7 days', () => {
      const now = new Date();
      const logs: DailyLog[] = [];

      // Create logs for last 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        logs.push(createSleepLog(date.toISOString(), 120));
      }

      // Add a log from 8 days ago
      const oldLog = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
      logs.push(createSleepLog(oldLog.toISOString(), 120));

      const recentLogs = getSleepLogsInRange(logs, 7);
      expect(recentLogs).toHaveLength(7);
    });
  });

  describe('calculateTotalSleepDuration', () => {
    it('should sum up all sleep durations', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-06T10:00:00Z', 120),
        createSleepLog('2026-04-06T14:00:00Z', 90),
        createSleepLog('2026-04-06T18:00:00Z', 150)
      ];

      const total = calculateTotalSleepDuration(logs);
      expect(total).toBe(360); // 120 + 90 + 150
    });

    it('should return 0 for empty logs', () => {
      expect(calculateTotalSleepDuration([])).toBe(0);
    });
  });

  describe('findLongestSleepSession', () => {
    it('should find the longest sleep duration', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-06T10:00:00Z', 120),
        createSleepLog('2026-04-06T14:00:00Z', 180),
        createSleepLog('2026-04-06T18:00:00Z', 90)
      ];

      const longest = findLongestSleepSession(logs);
      expect(longest).toBe(180);
    });

    it('should return 0 for empty logs', () => {
      expect(findLongestSleepSession([])).toBe(0);
    });
  });

  describe('calculateAverageSleepDuration', () => {
    it('should calculate average sleep duration', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-06T10:00:00Z', 120),
        createSleepLog('2026-04-06T14:00:00Z', 180),
        createSleepLog('2026-04-06T18:00:00Z', 90)
      ];

      const avg = calculateAverageSleepDuration(logs);
      expect(avg).toBe(130); // (120 + 180 + 90) / 3 = 130
    });

    it('should return 0 for empty logs', () => {
      expect(calculateAverageSleepDuration([])).toBe(0);
    });
  });

  describe('calculateTotalNightWakings', () => {
    it('should sum up all night wakings', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-06T10:00:00Z', 120, 'good', 0),
        createSleepLog('2026-04-06T14:00:00Z', 180, 'fair', 2),
        createSleepLog('2026-04-06T18:00:00Z', 90, 'poor', 3)
      ];

      const total = calculateTotalNightWakings(logs);
      expect(total).toBe(5); // 0 + 2 + 3
    });

    it('should return 0 when no night wakings recorded', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-06T10:00:00Z', 120)
      ];

      expect(calculateTotalNightWakings(logs)).toBe(0);
    });
  });

  describe('detectSleepingThroughNight', () => {
    it('should return true for sleep >= 6 hours', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-06T10:00:00Z', 360) // 6 hours
      ];

      expect(detectSleepingThroughNight(logs)).toBe(true);
    });

    it('should return true for sleep > 6 hours', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-06T10:00:00Z', 420) // 7 hours
      ];

      expect(detectSleepingThroughNight(logs)).toBe(true);
    });

    it('should return false for sleep < 6 hours', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-06T10:00:00Z', 300) // 5 hours
      ];

      expect(detectSleepingThroughNight(logs)).toBe(false);
    });

    it('should return false for empty logs', () => {
      expect(detectSleepingThroughNight([])).toBe(false);
    });
  });

  describe('calculateSleepQualityScore', () => {
    it('should give high score for good quality sleep with no wakings', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-06T10:00:00Z', 150, 'good', 0)
      ];

      const score = calculateSleepQualityScore(logs);
      expect(score).toBeGreaterThanOrEqual(80);
    });

    it('should give lower score for poor quality sleep with wakings', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-06T10:00:00Z', 60, 'poor', 3)
      ];

      const score = calculateSleepQualityScore(logs);
      expect(score).toBeLessThan(60);
    });

    it('should return 0 for empty logs', () => {
      expect(calculateSleepQualityScore([])).toBe(0);
    });
  });

  describe('calculateRoutineScore', () => {
    it('should give high score for consistent sleep times', () => {
      const logs: DailyLog[] = [];
      const baseDate = new Date('2026-04-01T10:00:00Z');

      // Create 7 days of logs at same time
      for (let i = 0; i < 7; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);
        logs.push(createSleepLog(date.toISOString(), 120));
      }

      const score = calculateRoutineScore(logs, 7);
      expect(score).toBeGreaterThanOrEqual(90);
    });

    it('should give low score for inconsistent sleep times', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-01T08:00:00Z', 120),
        createSleepLog('2026-04-02T12:00:00Z', 120),
        createSleepLog('2026-04-03T16:00:00Z', 120),
        createSleepLog('2026-04-04T20:00:00Z', 120)
      ];

      const score = calculateRoutineScore(logs, 7);
      expect(score).toBeLessThan(50);
    });

    it('should return 0 for insufficient data', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-01T10:00:00Z', 120)
      ];

      expect(calculateRoutineScore(logs, 7)).toBe(0);
    });
  });

  describe('calculateAverageBedtime', () => {
    it('should calculate average bedtime', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-01T22:00:00Z', 120),
        createSleepLog('2026-04-02T22:30:00Z', 120),
        createSleepLog('2026-04-03T22:15:00Z', 120)
      ];

      const avgBedtime = calculateAverageBedtime(logs, 7);
      expect(avgBedtime).toBeDefined();
      expect(avgBedtime).toMatch(/^\d{2}:\d{2}$/); // HH:mm format
    });

    it('should return undefined for empty logs', () => {
      expect(calculateAverageBedtime([], 7)).toBeUndefined();
    });
  });

  describe('calculateAverageWakeTime', () => {
    it('should calculate average wake time', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-01T22:00:00Z', 480), // 8 hours sleep
        createSleepLog('2026-04-02T22:00:00Z', 480),
        createSleepLog('2026-04-03T22:00:00Z', 480)
      ];

      const avgWakeTime = calculateAverageWakeTime(logs, 7);
      expect(avgWakeTime).toBeDefined();
      expect(avgWakeTime).toMatch(/^\d{2}:\d{2}$/); // HH:mm format
    });

    it('should return undefined for empty logs', () => {
      expect(calculateAverageWakeTime([], 7)).toBeUndefined();
    });
  });

  describe('analyzeSleepPatterns', () => {
    it('should generate comprehensive sleep analytics', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-06T10:00:00Z', 360, 'good', 0), // 6 hours
        createSleepLog('2026-04-06T18:00:00Z', 120, 'fair', 1)  // 2 hours
      ];

      const analytics = analyzeSleepPatterns(logs);

      expect(analytics.totalSleepDuration).toBe(480); // 8 hours
      expect(analytics.sleepCount).toBe(2);
      expect(analytics.longestSleepDuration).toBe(360);
      expect(analytics.isSleepingThroughNight).toBe(true);
      expect(analytics.sleepQualityScore).toBeGreaterThan(0);
      expect(analytics.nightWakingsTotal).toBe(1);
      expect(analytics.recommendations).toBeDefined();
      expect(analytics.recommendations.length).toBeGreaterThan(0);
    });

    it('should generate recommendations', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-06T10:00:00Z', 360, 'good', 0)
      ];

      const analytics = analyzeSleepPatterns(logs);

      expect(analytics.recommendations).toBeDefined();
      expect(analytics.recommendations.length).toBeGreaterThan(0);
      expect(analytics.recommendations[0]).toHaveProperty('id');
      expect(analytics.recommendations[0]).toHaveProperty('type');
      expect(analytics.recommendations[0]).toHaveProperty('title');
      expect(analytics.recommendations[0]).toHaveProperty('message');
      expect(analytics.recommendations[0]).toHaveProperty('icon');
    });
  });

  describe('getSleepPatternsByDate', () => {
    it('should group sleep logs by date', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-06T10:00:00Z', 120),
        createSleepLog('2026-04-06T14:00:00Z', 90),
        createSleepLog('2026-04-05T10:00:00Z', 180)
      ];

      const patterns = getSleepPatternsByDate(logs, 7);

      expect(patterns).toHaveLength(2); // 2 different dates
      expect(patterns[0].date).toBe('2026-04-06');
      expect(patterns[0].sleepSessions).toHaveLength(2);
      expect(patterns[0].totalDuration).toBe(210); // 120 + 90
      expect(patterns[1].date).toBe('2026-04-05');
      expect(patterns[1].sleepSessions).toHaveLength(1);
    });

    it('should calculate quality score for each date', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-06T10:00:00Z', 180, 'good', 0)
      ];

      const patterns = getSleepPatternsByDate(logs, 7);

      expect(patterns[0].qualityScore).toBeGreaterThan(0);
    });

    it('should sort patterns newest first', () => {
      const logs: DailyLog[] = [
        createSleepLog('2026-04-05T10:00:00Z', 120),
        createSleepLog('2026-04-06T10:00:00Z', 120),
        createSleepLog('2026-04-04T10:00:00Z', 120)
      ];

      const patterns = getSleepPatternsByDate(logs, 7);

      expect(patterns[0].date).toBe('2026-04-06');
      expect(patterns[1].date).toBe('2026-04-05');
      expect(patterns[2].date).toBe('2026-04-04');
    });
  });
});
