import type {
  GrowthRecord,
  MeasurementType,
  Gender,
  PercentileCategory,
  GrowthTrend,
} from '../types';
import { getWHOStandard } from '../data/growthChartData';

/**
 * Calculate z-score for a measurement using WHO LMS method
 *
 * @param measurement - The actual measurement value (kg, cm)
 * @param ageMonths - Age in months
 * @param measurementType - Type of measurement (weight, height, headCircumference)
 * @param gender - Child's gender
 * @returns Z-score (standard deviations from median)
 */
export function calculateZScore(
  measurement: number,
  ageMonths: number,
  measurementType: MeasurementType,
  gender: Gender
): number {
  const standard = getWHOStandard(ageMonths, measurementType, gender);
  const { L, M, S } = standard;

  // LMS formula: Z = ((X/M)^L - 1) / (L * S) when L ≠ 0
  // When L ≈ 0: Z = ln(X/M) / S
  if (Math.abs(L) < 0.0001) {
    return Math.log(measurement / M) / S;
  }

  return (Math.pow(measurement / M, L) - 1) / (L * S);
}

/**
 * Calculate percentile from z-score using cumulative normal distribution
 *
 * @param zScore - Z-score value
 * @returns Percentile (0-100)
 */
export function calculatePercentile(zScore: number): number {
  // Cumulative distribution function for standard normal distribution
  const percentile = normalCDF(zScore) * 100;

  // Cap at reasonable bounds
  return Math.max(0.1, Math.min(99.9, percentile));
}

/**
 * Categorize percentile into low/normal/high
 *
 * @param percentile - Percentile value (0-100)
 * @returns Category: low (<15%), normal (15-85%), high (>85%)
 */
export function getPercentileCategory(
  percentile: number
): PercentileCategory {
  if (percentile < 15) return 'low';
  if (percentile > 85) return 'high';
  return 'normal';
}

/**
 * Analyze growth trend from multiple records
 *
 * @param records - Array of growth records (sorted by date)
 * @param measurementType - Which measurement to analyze
 * @returns Trend: increasing, decreasing, stable, or insufficient-data
 */
export function getGrowthTrend(
  records: GrowthRecord[],
  measurementType: MeasurementType
): GrowthTrend {
  // Filter records with the specified measurement
  const validRecords = records.filter((r) => {
    const value = r[measurementType];
    return value !== undefined && value !== null;
  });

  if (validRecords.length < 2) {
    return 'insufficient-data';
  }

  // Sort by date
  const sorted = [...validRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate average change
  let totalChange = 0;
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1][measurementType]!;
    const curr = sorted[i][measurementType]!;
    totalChange += curr - prev;
  }

  const avgChange = totalChange / (sorted.length - 1);

  // Define thresholds based on measurement type
  const thresholds = {
    weight: 0.1, // 100g
    height: 0.5, // 0.5cm
    headCircumference: 0.2, // 2mm
  };

  const threshold = thresholds[measurementType] || 0.1;

  if (avgChange > threshold) return 'increasing';
  if (avgChange < -threshold) return 'decreasing';
  return 'stable';
}

/**
 * Cumulative distribution function for standard normal distribution
 * Uses error function (erf) approximation
 */
function normalCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

/**
 * Error function approximation (Abramowitz and Stegun)
 * Accurate to about 1.5×10^-7
 */
function erf(x: number): number {
  // Save the sign of x
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  // Constants
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  // Abramowitz and Stegun formula 7.1.26
  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}
