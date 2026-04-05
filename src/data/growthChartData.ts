import type { WHOStandard, MeasurementType, Gender } from '../types';

/**
 * WHO Child Growth Standards (0-24 months)
 * Using LMS method: L (Box-Cox transformation), M (Median), S (Coefficient of variation)
 *
 * Data source: WHO Child Growth Standards (2006)
 * https://www.who.int/tools/child-growth-standards
 */

// Male Weight Standards (kg)
const maleWeightStandards: WHOStandard[] = [
  { ageMonths: 0, L: 0.3487, M: 3.3464, S: 0.14602 },
  { ageMonths: 1, L: 0.2297, M: 4.4709, S: 0.13395 },
  { ageMonths: 2, L: 0.1970, M: 5.5675, S: 0.12385 },
  { ageMonths: 3, L: 0.1738, M: 6.3762, S: 0.11727 },
  { ageMonths: 4, L: 0.1553, M: 7.0023, S: 0.11316 },
  { ageMonths: 5, L: 0.1395, M: 7.5105, S: 0.11080 },
  { ageMonths: 6, L: 0.1257, M: 7.9341, S: 0.10958 },
  { ageMonths: 7, L: 0.1134, M: 8.2970, S: 0.10902 },
  { ageMonths: 8, L: 0.1021, M: 8.6151, S: 0.10882 },
  { ageMonths: 9, L: 0.0917, M: 8.9014, S: 0.10881 },
  { ageMonths: 10, L: 0.0820, M: 9.1649, S: 0.10891 },
  { ageMonths: 11, L: 0.0730, M: 9.4122, S: 0.10906 },
  { ageMonths: 12, L: 0.0644, M: 9.6479, S: 0.10925 },
  { ageMonths: 15, L: 0.0425, M: 10.3002, S: 0.10987 },
  { ageMonths: 18, L: 0.0215, M: 10.8852, S: 0.11066 },
  { ageMonths: 21, L: 0.0011, M: 11.4183, S: 0.11160 },
  { ageMonths: 24, L: -0.0187, M: 11.9045, S: 0.11268 },
];

// Female Weight Standards (kg)
const femaleWeightStandards: WHOStandard[] = [
  { ageMonths: 0, L: 0.3809, M: 3.2322, S: 0.14171 },
  { ageMonths: 1, L: 0.1714, M: 4.1873, S: 0.13724 },
  { ageMonths: 2, L: 0.0962, M: 5.1282, S: 0.13000 },
  { ageMonths: 3, L: 0.0402, M: 5.8458, S: 0.12619 },
  { ageMonths: 4, L: -0.0050, M: 6.4237, S: 0.12402 },
  { ageMonths: 5, L: -0.0430, M: 6.8985, S: 0.12274 },
  { ageMonths: 6, L: -0.0756, M: 7.2970, S: 0.12204 },
  { ageMonths: 7, L: -0.1039, M: 7.6422, S: 0.12178 },
  { ageMonths: 8, L: -0.1288, M: 7.9487, S: 0.12181 },
  { ageMonths: 9, L: -0.1507, M: 8.2254, S: 0.12199 },
  { ageMonths: 10, L: -0.1700, M: 8.4800, S: 0.12223 },
  { ageMonths: 11, L: -0.1872, M: 8.7192, S: 0.12247 },
  { ageMonths: 12, L: -0.2024, M: 8.9481, S: 0.12268 },
  { ageMonths: 15, L: -0.2438, M: 9.6004, S: 0.12342 },
  { ageMonths: 18, L: -0.2812, M: 10.1851, S: 0.12422 },
  { ageMonths: 21, L: -0.3154, M: 10.7142, S: 0.12511 },
  { ageMonths: 24, L: -0.3469, M: 11.1990, S: 0.12607 },
];

// Male Height Standards (cm)
const maleHeightStandards: WHOStandard[] = [
  { ageMonths: 0, L: 1, M: 49.8842, S: 0.03795 },
  { ageMonths: 1, L: 1, M: 54.7244, S: 0.03557 },
  { ageMonths: 2, L: 1, M: 58.4249, S: 0.03424 },
  { ageMonths: 3, L: 1, M: 61.4292, S: 0.03328 },
  { ageMonths: 4, L: 1, M: 63.8861, S: 0.03257 },
  { ageMonths: 5, L: 1, M: 65.9026, S: 0.03204 },
  { ageMonths: 6, L: 1, M: 67.6236, S: 0.03165 },
  { ageMonths: 7, L: 1, M: 69.1645, S: 0.03139 },
  { ageMonths: 8, L: 1, M: 70.5994, S: 0.03124 },
  { ageMonths: 9, L: 1, M: 71.9687, S: 0.03117 },
  { ageMonths: 10, L: 1, M: 73.2812, S: 0.03118 },
  { ageMonths: 11, L: 1, M: 74.5388, S: 0.03125 },
  { ageMonths: 12, L: 1, M: 75.7488, S: 0.03137 },
  { ageMonths: 15, L: 1, M: 79.1711, S: 0.03182 },
  { ageMonths: 18, L: 1, M: 82.2857, S: 0.03241 },
  { ageMonths: 21, L: 1, M: 85.1133, S: 0.03306 },
  { ageMonths: 24, L: 1, M: 87.7647, S: 0.03370 },
];

// Female Height Standards (cm)
const femaleHeightStandards: WHOStandard[] = [
  { ageMonths: 0, L: 1, M: 49.1477, S: 0.03790 },
  { ageMonths: 1, L: 1, M: 53.6872, S: 0.03486 },
  { ageMonths: 2, L: 1, M: 57.0673, S: 0.03344 },
  { ageMonths: 3, L: 1, M: 59.8029, S: 0.03276 },
  { ageMonths: 4, L: 1, M: 62.0899, S: 0.03246 },
  { ageMonths: 5, L: 1, M: 64.0301, S: 0.03238 },
  { ageMonths: 6, L: 1, M: 65.7311, S: 0.03244 },
  { ageMonths: 7, L: 1, M: 67.2873, S: 0.03260 },
  { ageMonths: 8, L: 1, M: 68.7498, S: 0.03283 },
  { ageMonths: 9, L: 1, M: 70.1435, S: 0.03311 },
  { ageMonths: 10, L: 1, M: 71.4818, S: 0.03342 },
  { ageMonths: 11, L: 1, M: 72.7713, S: 0.03375 },
  { ageMonths: 12, L: 1, M: 74.0151, S: 0.03410 },
  { ageMonths: 15, L: 1, M: 77.4760, S: 0.03517 },
  { ageMonths: 18, L: 1, M: 80.7244, S: 0.03632 },
  { ageMonths: 21, L: 1, M: 83.7788, S: 0.03749 },
  { ageMonths: 24, L: 1, M: 86.6901, S: 0.03864 },
];

// Male Head Circumference Standards (cm)
const maleHeadCircumferenceStandards: WHOStandard[] = [
  { ageMonths: 0, L: 1, M: 34.4618, S: 0.03496 },
  { ageMonths: 1, L: 1, M: 37.2759, S: 0.03270 },
  { ageMonths: 2, L: 1, M: 39.1285, S: 0.03139 },
  { ageMonths: 3, L: 1, M: 40.5135, S: 0.03058 },
  { ageMonths: 4, L: 1, M: 41.6317, S: 0.03007 },
  { ageMonths: 5, L: 1, M: 42.5576, S: 0.02975 },
  { ageMonths: 6, L: 1, M: 43.3306, S: 0.02955 },
  { ageMonths: 7, L: 1, M: 43.9803, S: 0.02945 },
  { ageMonths: 8, L: 1, M: 44.5302, S: 0.02941 },
  { ageMonths: 9, L: 1, M: 44.9983, S: 0.02942 },
  { ageMonths: 10, L: 1, M: 45.4000, S: 0.02946 },
  { ageMonths: 11, L: 1, M: 45.7486, S: 0.02953 },
  { ageMonths: 12, L: 1, M: 46.0551, S: 0.02962 },
  { ageMonths: 15, L: 1, M: 46.8197, S: 0.02993 },
  { ageMonths: 18, L: 1, M: 47.4668, S: 0.03031 },
  { ageMonths: 21, L: 1, M: 48.0253, S: 0.03073 },
  { ageMonths: 24, L: 1, M: 48.5158, S: 0.03117 },
];

// Female Head Circumference Standards (cm)
const femaleHeadCircumferenceStandards: WHOStandard[] = [
  { ageMonths: 0, L: 1, M: 33.8787, S: 0.03496 },
  { ageMonths: 1, L: 1, M: 36.5463, S: 0.03234 },
  { ageMonths: 2, L: 1, M: 38.2998, S: 0.03105 },
  { ageMonths: 3, L: 1, M: 39.5328, S: 0.03033 },
  { ageMonths: 4, L: 1, M: 40.5817, S: 0.02989 },
  { ageMonths: 5, L: 1, M: 41.4598, S: 0.02962 },
  { ageMonths: 6, L: 1, M: 42.2040, S: 0.02946 },
  { ageMonths: 7, L: 1, M: 42.8403, S: 0.02938 },
  { ageMonths: 8, L: 1, M: 43.3923, S: 0.02935 },
  { ageMonths: 9, L: 1, M: 43.8758, S: 0.02936 },
  { ageMonths: 10, L: 1, M: 44.3034, S: 0.02940 },
  { ageMonths: 11, L: 1, M: 44.6841, S: 0.02946 },
  { ageMonths: 12, L: 1, M: 45.0253, S: 0.02954 },
  { ageMonths: 15, L: 1, M: 45.8162, S: 0.02983 },
  { ageMonths: 18, L: 1, M: 46.4849, S: 0.03017 },
  { ageMonths: 21, L: 1, M: 47.0589, S: 0.03055 },
  { ageMonths: 24, L: 1, M: 47.5656, S: 0.03095 },
];

// Mapping for easy access
const standardsMap = {
  male: {
    weight: maleWeightStandards,
    height: maleHeightStandards,
    headCircumference: maleHeadCircumferenceStandards,
  },
  female: {
    weight: femaleWeightStandards,
    height: femaleHeightStandards,
    headCircumference: femaleHeadCircumferenceStandards,
  },
};

/**
 * Get WHO standard for specific age, measurement type, and gender
 * Supports interpolation for non-exact ages
 */
export function getWHOStandard(
  ageMonths: number,
  measurementType: MeasurementType,
  gender: Gender
): WHOStandard {
  if (ageMonths < 0 || ageMonths > 24) {
    throw new Error('Age out of range: WHO standards support 0-24 months');
  }

  const standards = standardsMap[gender][measurementType];

  // Find exact match
  const exact = standards.find((s) => s.ageMonths === ageMonths);
  if (exact) return exact;

  // Interpolate between two closest values
  const before = standards.filter((s) => s.ageMonths < ageMonths).pop();
  const after = standards.find((s) => s.ageMonths > ageMonths);

  if (!before || !after) {
    // Return closest available
    return standards.reduce((prev, curr) =>
      Math.abs(curr.ageMonths - ageMonths) < Math.abs(prev.ageMonths - ageMonths)
        ? curr
        : prev
    );
  }

  // Linear interpolation
  const ratio =
    (ageMonths - before.ageMonths) / (after.ageMonths - before.ageMonths);

  return {
    ageMonths,
    L: before.L + (after.L - before.L) * ratio,
    M: before.M + (after.M - before.M) * ratio,
    S: before.S + (after.S - before.S) * ratio,
  };
}

/**
 * Calculate percentile value for a given standard and percentile
 * Uses LMS method inverse calculation
 */
export function getPercentileValue(
  standard: WHOStandard,
  percentile: number
): number {
  const { L, M, S } = standard;

  // Convert percentile to z-score using inverse normal distribution
  // Approximation of probit function (inverse of cumulative normal distribution)
  const p = percentile / 100;
  const z = probitApproximation(p);

  // LMS inverse formula: X = M * (1 + L * S * Z)^(1/L) when L ≠ 0
  if (Math.abs(L) < 0.0001) {
    // When L ≈ 0, use: X = M * exp(S * Z)
    return M * Math.exp(S * z);
  }

  return M * Math.pow(1 + L * S * z, 1 / L);
}

/**
 * Approximation of the probit function (inverse normal CDF)
 * Converts percentile (0-1) to z-score
 */
function probitApproximation(p: number): number {
  if (p <= 0 || p >= 1) {
    throw new Error('Percentile must be between 0 and 1 (exclusive)');
  }

  // Use symmetry for p > 0.5
  if (p > 0.5) {
    return -probitApproximation(1 - p);
  }

  // Rational approximation (Acklam's algorithm)
  const q = Math.sqrt(-2 * Math.log(p));
  const c0 = 2.515517;
  const c1 = 0.802853;
  const c2 = 0.010328;
  const d1 = 1.432788;
  const d2 = 0.189269;
  const d3 = 0.001308;

  return -(q - (c0 + c1 * q + c2 * q * q) / (1 + d1 * q + d2 * q * q + d3 * q * q * q));
}
