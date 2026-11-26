import type { Gender, MeasurementType } from '../../types';
import { WHO_MAX_AGE_MONTHS } from '../data/growthChartData';
import { calculatePercentile, calculateZScore } from './growthCalculator';

/**
 * The public growth calculator: one visit's numbers in, WHO percentiles out.
 *
 * Same LMS calculation as the signed-in growth chart. What a single reading
 * cannot give is the thing that matters most — the trend — and the page says
 * so; this module only refuses inputs the standard does not cover instead of
 * returning a confident number for them.
 */
export const GROWTH_TOOL_MAX_MONTHS = WHO_MAX_AGE_MONTHS;

/** Plausible bounds, wide enough for any real child; outside them is a typo. */
const BOUNDS: Record<MeasurementType, { min: number; max: number }> = {
  weight: { min: 0.5, max: 30 },
  height: { min: 30, max: 120 },
  headCircumference: { min: 20, max: 60 },
};

export interface GrowthToolInput {
  gender: Gender;
  ageMonths: number;
  weight?: number;
  height?: number;
  headCircumference?: number;
}

export interface GrowthToolReading {
  type: MeasurementType;
  value: number;
  /** Whole-number percentile, 1 to 99. Beyond that the chart's outer lines are the honest answer. */
  percentile: number;
  /** Below the 3rd or above the 97th: the outermost lines on the handbook's chart. */
  outsideOuterLines: boolean;
}

export type GrowthToolResult =
  | { ok: true; readings: GrowthToolReading[] }
  | { ok: false; reason: 'age' | 'no-measurement' | 'implausible'; field?: MeasurementType };

const ORDER: MeasurementType[] = ['weight', 'height', 'headCircumference'];

export function growthPercentiles(input: GrowthToolInput): GrowthToolResult {
  const { gender, ageMonths } = input;
  if (!Number.isFinite(ageMonths) || ageMonths < 0 || ageMonths > GROWTH_TOOL_MAX_MONTHS) {
    return { ok: false, reason: 'age' };
  }

  const given = ORDER.filter((type) => input[type] !== undefined && !Number.isNaN(input[type]));
  if (given.length === 0) return { ok: false, reason: 'no-measurement' };

  const readings: GrowthToolReading[] = [];
  for (const type of given) {
    const value = input[type] as number;
    if (value < BOUNDS[type].min || value > BOUNDS[type].max) {
      return { ok: false, reason: 'implausible', field: type };
    }
    const exact = calculatePercentile(calculateZScore(value, ageMonths, type, gender));
    readings.push({
      type,
      value,
      percentile: Math.min(99, Math.max(1, Math.round(exact))),
      outsideOuterLines: exact < 3 || exact > 97,
    });
  }
  return { ok: true, readings };
}
