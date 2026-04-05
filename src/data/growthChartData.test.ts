import { describe, it, expect } from 'vitest';
import {
  getWHOStandard,
  getPercentileValue,
  type WHOStandard,
  type MeasurementType,
} from './growthChartData';

describe('growthChartData', () => {
  describe('getWHOStandard', () => {
    it('should return weight standards for male at 6 months', () => {
      const standard = getWHOStandard(6, 'weight', 'male');

      expect(standard).toBeDefined();
      expect(standard.ageMonths).toBe(6);
      expect(standard.L).toBeDefined();
      expect(standard.M).toBeDefined(); // Median (50th percentile)
      expect(standard.S).toBeDefined(); // Standard deviation
    });

    it('should return different values for male vs female', () => {
      const maleStandard = getWHOStandard(6, 'weight', 'male');
      const femaleStandard = getWHOStandard(6, 'weight', 'female');

      // Males typically have slightly higher median weight
      expect(maleStandard.M).toBeGreaterThan(femaleStandard.M);
    });

    it('should return height standards', () => {
      const standard = getWHOStandard(12, 'height', 'male');

      expect(standard).toBeDefined();
      expect(standard.M).toBeGreaterThan(70); // 12-month-old should be >70cm
      expect(standard.M).toBeLessThan(80); // But <80cm
    });

    it('should return head circumference standards', () => {
      const standard = getWHOStandard(6, 'headCircumference', 'male');

      expect(standard).toBeDefined();
      expect(standard.M).toBeGreaterThan(40); // 6-month-old head >40cm
      expect(standard.M).toBeLessThan(50); // But <50cm
    });

    it('should interpolate for non-exact months', () => {
      // WHO data might be monthly, test interpolation for 6.5 months
      const standard = getWHOStandard(6.5, 'weight', 'male');
      const standard6 = getWHOStandard(6, 'weight', 'male');
      const standard7 = getWHOStandard(7, 'weight', 'male');

      // Interpolated value should be between 6 and 7 months
      expect(standard.M).toBeGreaterThanOrEqual(standard6.M);
      expect(standard.M).toBeLessThanOrEqual(standard7.M);
    });

    it('should handle age 0 (birth)', () => {
      const standard = getWHOStandard(0, 'weight', 'male');

      expect(standard).toBeDefined();
      expect(standard.M).toBeGreaterThan(3); // Birth weight typically >3kg
      expect(standard.M).toBeLessThan(4); // But <4kg median
    });

    it('should handle age 24 months (2 years)', () => {
      const standard = getWHOStandard(24, 'height', 'male');

      expect(standard).toBeDefined();
      expect(standard.M).toBeGreaterThan(85); // 2-year-old >85cm
      expect(standard.M).toBeLessThan(90); // But <90cm
    });

    it('should throw error for unsupported age range', () => {
      // WHO standards typically 0-24 months for infants
      expect(() => {
        getWHOStandard(36, 'weight', 'male');
      }).toThrow('Age out of range');
    });
  });

  describe('getPercentileValue', () => {
    it('should return correct value for 50th percentile (median)', () => {
      const standard = getWHOStandard(6, 'weight', 'male');
      const p50 = getPercentileValue(standard, 50);

      // 50th percentile should equal the median (M)
      expect(p50).toBeCloseTo(standard.M, 1);
    });

    it('should return values for 3rd percentile', () => {
      const standard = getWHOStandard(6, 'weight', 'male');
      const p3 = getPercentileValue(standard, 3);

      // 3rd percentile should be significantly lower than median
      expect(p3).toBeLessThan(standard.M);
      expect(p3).toBeGreaterThan(standard.M * 0.8); // Sanity check
    });

    it('should return values for 97th percentile', () => {
      const standard = getWHOStandard(6, 'weight', 'male');
      const p97 = getPercentileValue(standard, 97);

      // 97th percentile should be significantly higher than median
      expect(p97).toBeGreaterThan(standard.M);
      expect(p97).toBeLessThan(standard.M * 1.3); // Sanity check
    });

    it('should return ordered values across percentiles', () => {
      const standard = getWHOStandard(12, 'weight', 'male');

      const p3 = getPercentileValue(standard, 3);
      const p15 = getPercentileValue(standard, 15);
      const p50 = getPercentileValue(standard, 50);
      const p85 = getPercentileValue(standard, 85);
      const p97 = getPercentileValue(standard, 97);

      // Should be in ascending order
      expect(p3).toBeLessThan(p15);
      expect(p15).toBeLessThan(p50);
      expect(p50).toBeLessThan(p85);
      expect(p85).toBeLessThan(p97);
    });

    it('should handle edge percentiles (1st and 99th)', () => {
      const standard = getWHOStandard(6, 'weight', 'male');

      const p1 = getPercentileValue(standard, 1);
      const p99 = getPercentileValue(standard, 99);

      expect(p1).toBeGreaterThan(0);
      expect(p99).toBeGreaterThan(p1);
    });
  });

  describe('Data Integrity', () => {
    it('should have complete data for all months 0-24', () => {
      const measurementTypes: MeasurementType[] = ['weight', 'height', 'headCircumference'];
      const genders: Array<'male' | 'female'> = ['male', 'female'];

      for (let age = 0; age <= 24; age++) {
        for (const type of measurementTypes) {
          for (const gender of genders) {
            expect(() => {
              const standard = getWHOStandard(age, type, gender);
              expect(standard).toBeDefined();
              expect(standard.M).toBeGreaterThan(0);
            }).not.toThrow();
          }
        }
      }
    });

    it('should have realistic median values', () => {
      // Birth weight (0 months)
      const birthWeight = getWHOStandard(0, 'weight', 'male');
      expect(birthWeight.M).toBeGreaterThan(3.0);
      expect(birthWeight.M).toBeLessThan(3.7);

      // 12-month weight
      const weight12mo = getWHOStandard(12, 'weight', 'male');
      expect(weight12mo.M).toBeGreaterThan(9);
      expect(weight12mo.M).toBeLessThan(10.5);

      // Birth length
      const birthLength = getWHOStandard(0, 'height', 'male');
      expect(birthLength.M).toBeGreaterThan(48);
      expect(birthLength.M).toBeLessThan(52);

      // 12-month height
      const height12mo = getWHOStandard(12, 'height', 'male');
      expect(height12mo.M).toBeGreaterThan(74);
      expect(height12mo.M).toBeLessThan(77);
    });

    it('should show growth over time', () => {
      // Weight should increase from 0 to 24 months
      const weight0 = getWHOStandard(0, 'weight', 'male');
      const weight6 = getWHOStandard(6, 'weight', 'male');
      const weight12 = getWHOStandard(12, 'weight', 'male');
      const weight24 = getWHOStandard(24, 'weight', 'male');

      expect(weight6.M).toBeGreaterThan(weight0.M);
      expect(weight12.M).toBeGreaterThan(weight6.M);
      expect(weight24.M).toBeGreaterThan(weight12.M);

      // Height should also increase
      const height0 = getWHOStandard(0, 'height', 'male');
      const height24 = getWHOStandard(24, 'height', 'male');

      expect(height24.M).toBeGreaterThan(height0.M);
      expect(height24.M - height0.M).toBeGreaterThan(30); // At least 30cm growth in 2 years
    });
  });

  describe('LMS Method Validation', () => {
    it('should have valid L, M, S parameters', () => {
      const standard = getWHOStandard(6, 'weight', 'male');

      // L (Box-Cox transformation): typically between -2 and 2
      expect(standard.L).toBeGreaterThan(-3);
      expect(standard.L).toBeLessThan(3);

      // M (Median): should be positive
      expect(standard.M).toBeGreaterThan(0);

      // S (Coefficient of variation): typically between 0.05 and 0.20
      expect(standard.S).toBeGreaterThan(0);
      expect(standard.S).toBeLessThan(0.3);
    });

    it('should produce consistent z-scores using LMS method', () => {
      const standard = getWHOStandard(6, 'weight', 'male');

      // Calculate z-score for median value (should be ~0)
      const { L, M, S } = standard;
      const measurement = M;

      // LMS formula: Z = ((X/M)^L - 1) / (L * S) when L ≠ 0
      let zScore: number;
      if (Math.abs(L) < 0.0001) {
        zScore = Math.log(measurement / M) / S;
      } else {
        zScore = (Math.pow(measurement / M, L) - 1) / (L * S);
      }

      expect(zScore).toBeCloseTo(0, 1);
    });
  });
});
