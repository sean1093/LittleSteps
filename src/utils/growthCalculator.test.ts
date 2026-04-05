import { describe, it, expect } from 'vitest';
import {
  calculatePercentile,
  calculateZScore,
  getPercentileCategory,
  getGrowthTrend,
  type GrowthRecord,
  type PercentileCategory,
} from './growthCalculator';

describe('growthCalculator', () => {
  describe('calculateZScore', () => {
    it('should calculate z-score correctly for weight', () => {
      // Boy, 6 months, 8kg (median is ~7.9kg for WHO standards)
      const zScore = calculateZScore(8, 6, 'weight', 'male');
      expect(zScore).toBeCloseTo(0, 1); // Close to median (z=0)
    });

    it('should return positive z-score for above average measurements', () => {
      // Boy, 6 months, 10kg (well above median)
      const zScore = calculateZScore(10, 6, 'weight', 'male');
      expect(zScore).toBeGreaterThan(1);
    });

    it('should return negative z-score for below average measurements', () => {
      // Boy, 6 months, 6kg (below median)
      const zScore = calculateZScore(6, 6, 'weight', 'male');
      expect(zScore).toBeLessThan(-1);
    });

    it('should handle female gender correctly', () => {
      // Girl, 12 months, 9kg (median is ~9kg for WHO standards)
      const zScore = calculateZScore(9, 12, 'weight', 'female');
      expect(zScore).toBeCloseTo(0, 1);
    });

    it('should calculate for height measurements', () => {
      // Boy, 12 months, 76cm (median is ~75.7cm)
      const zScore = calculateZScore(76, 12, 'height', 'male');
      expect(zScore).toBeCloseTo(0, 1);
    });

    it('should calculate for head circumference', () => {
      // Boy, 6 months, 43.5cm (median is ~43.3cm)
      const zScore = calculateZScore(43.5, 6, 'headCircumference', 'male');
      expect(zScore).toBeCloseTo(0, 1);
    });
  });

  describe('calculatePercentile', () => {
    it('should calculate percentile from z-score', () => {
      // z-score of 0 should be 50th percentile
      const percentile = calculatePercentile(0);
      expect(percentile).toBeCloseTo(50, 0);
    });

    it('should return high percentile for positive z-score', () => {
      // z-score of 1 should be ~84th percentile
      const percentile = calculatePercentile(1);
      expect(percentile).toBeGreaterThan(80);
      expect(percentile).toBeLessThan(90);
    });

    it('should return low percentile for negative z-score', () => {
      // z-score of -1 should be ~16th percentile
      const percentile = calculatePercentile(-1);
      expect(percentile).toBeGreaterThan(10);
      expect(percentile).toBeLessThan(20);
    });

    it('should cap at 99.9 for very high z-scores', () => {
      const percentile = calculatePercentile(5);
      expect(percentile).toBeLessThanOrEqual(99.9);
    });

    it('should cap at 0.1 for very low z-scores', () => {
      const percentile = calculatePercentile(-5);
      expect(percentile).toBeGreaterThanOrEqual(0.1);
    });
  });

  describe('getPercentileCategory', () => {
    it('should categorize low percentile correctly', () => {
      const category = getPercentileCategory(10);
      expect(category).toBe('low'); // <15%
    });

    it('should categorize normal percentile correctly', () => {
      const category = getPercentileCategory(50);
      expect(category).toBe('normal'); // 15-85%
    });

    it('should categorize high percentile correctly', () => {
      const category = getPercentileCategory(90);
      expect(category).toBe('high'); // >85%
    });

    it('should handle edge cases at boundaries', () => {
      expect(getPercentileCategory(15)).toBe('normal');
      expect(getPercentileCategory(14.9)).toBe('low');
      expect(getPercentileCategory(85)).toBe('normal');
      expect(getPercentileCategory(85.1)).toBe('high');
    });
  });

  describe('getGrowthTrend', () => {
    const baseRecord: GrowthRecord = {
      id: '1',
      childId: 'child1',
      date: '2026-01-01',
      weight: 8,
      height: 70,
      headCircumference: 43,
      percentile: {
        weight: 50,
        height: 50,
        headCircumference: 50,
      },
    };

    it('should detect increasing trend when measurements go up', () => {
      const records: GrowthRecord[] = [
        { ...baseRecord, id: '1', date: '2026-01-01', weight: 8, height: 70 },
        { ...baseRecord, id: '2', date: '2026-02-01', weight: 8.5, height: 72 },
        { ...baseRecord, id: '3', date: '2026-03-01', weight: 9, height: 74 },
      ];

      const trend = getGrowthTrend(records, 'weight');
      expect(trend).toBe('increasing');
    });

    it('should detect decreasing trend when measurements go down', () => {
      const records: GrowthRecord[] = [
        { ...baseRecord, id: '1', date: '2026-01-01', weight: 9 },
        { ...baseRecord, id: '2', date: '2026-02-01', weight: 8.5 },
        { ...baseRecord, id: '3', date: '2026-03-01', weight: 8 },
      ];

      const trend = getGrowthTrend(records, 'weight');
      expect(trend).toBe('decreasing');
    });

    it('should detect stable trend when measurements stay similar', () => {
      const records: GrowthRecord[] = [
        { ...baseRecord, id: '1', date: '2026-01-01', weight: 8 },
        { ...baseRecord, id: '2', date: '2026-02-01', weight: 8.1 },
        { ...baseRecord, id: '3', date: '2026-03-01', weight: 8.05 },
      ];

      const trend = getGrowthTrend(records, 'weight');
      expect(trend).toBe('stable');
    });

    it('should return insufficient data when less than 2 records', () => {
      const records: GrowthRecord[] = [
        { ...baseRecord, id: '1', date: '2026-01-01', weight: 8 },
      ];

      const trend = getGrowthTrend(records, 'weight');
      expect(trend).toBe('insufficient-data');
    });

    it('should handle missing measurements in records', () => {
      const records: GrowthRecord[] = [
        { ...baseRecord, id: '1', date: '2026-01-01', weight: 8, height: undefined },
        { ...baseRecord, id: '2', date: '2026-02-01', weight: 8.5, height: undefined },
      ];

      const trend = getGrowthTrend(records, 'height');
      expect(trend).toBe('insufficient-data');
    });

    it('should detect no growth warning when measurements dont increase over 2 months', () => {
      const records: GrowthRecord[] = [
        { ...baseRecord, id: '1', date: '2026-01-01', weight: 8 },
        { ...baseRecord, id: '2', date: '2026-02-01', weight: 8 },
        { ...baseRecord, id: '3', date: '2026-03-01', weight: 8 },
      ];

      const trend = getGrowthTrend(records, 'weight');
      expect(trend).toBe('stable'); // Should be flagged as concerning if no growth
    });
  });
});
