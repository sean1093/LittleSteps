import { describe, expect, it } from 'vitest';
import { GROWTH_TOOL_MAX_MONTHS, growthPercentiles } from './growthTool';

/**
 * The public growth calculator. A parent types what the clinic measured and
 * reads a percentile; a wrong one, or a confident one for an input the
 * standard does not cover, is worse than none.
 */
describe('growthPercentiles', () => {
  it('puts a child at the WHO median on the 50th percentile', () => {
    // WHO Child Growth Standards: a 6-month-old girl's median weight is 7.3 kg
    // and median length 65.7 cm.
    const result = growthPercentiles({ gender: 'female', ageMonths: 6, weight: 7.3, height: 65.7 });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.readings.map((reading) => reading.type)).toEqual(['weight', 'height']);
    for (const reading of result.readings) {
      expect(reading.percentile, reading.type).toBeGreaterThanOrEqual(48);
      expect(reading.percentile, reading.type).toBeLessThanOrEqual(52);
      expect(reading.outsideOuterLines).toBe(false);
    }
  });

  it('ranks a heavier child above a lighter one of the same age and sex', () => {
    const at = (weight: number) => {
      const result = growthPercentiles({ gender: 'male', ageMonths: 12, weight });
      if (!result.ok) throw new Error('expected a reading');
      return result.readings[0].percentile;
    };
    expect(at(11)).toBeGreaterThan(at(9));
  });

  it('never reports a 0th or 100th percentile, and says when a value is beyond the outer lines', () => {
    const result = growthPercentiles({ gender: 'male', ageMonths: 12, weight: 6 });
    if (!result.ok) throw new Error('expected a reading');

    expect(result.readings[0].percentile).toBe(1);
    expect(result.readings[0].outsideOuterLines).toBe(true);
  });

  it('only answers for the measurements that were given', () => {
    const result = growthPercentiles({ gender: 'female', ageMonths: 3, headCircumference: 39.5 });
    if (!result.ok) throw new Error('expected a reading');
    expect(result.readings.map((reading) => reading.type)).toEqual(['headCircumference']);
  });

  it('refuses an age the standard does not cover instead of extrapolating', () => {
    expect(growthPercentiles({ gender: 'female', ageMonths: -1, weight: 5 })).toEqual({
      ok: false,
      reason: 'age',
    });
    expect(
      growthPercentiles({ gender: 'female', ageMonths: GROWTH_TOOL_MAX_MONTHS + 1, weight: 14 }),
    ).toEqual({ ok: false, reason: 'age' });
    expect(growthPercentiles({ gender: 'female', ageMonths: Number.NaN, weight: 5 })).toEqual({
      ok: false,
      reason: 'age',
    });
    expect(growthPercentiles({ gender: 'female', ageMonths: GROWTH_TOOL_MAX_MONTHS, weight: 14 }).ok).toBe(
      true,
    );
  });

  it('asks for at least one measurement', () => {
    expect(growthPercentiles({ gender: 'male', ageMonths: 4 })).toEqual({
      ok: false,
      reason: 'no-measurement',
    });
  });

  it('treats a value in the wrong unit as a typo, not as a very small child', () => {
    // 7300 is grams typed into a kilogram field; 0.65 is metres typed into centimetres.
    expect(growthPercentiles({ gender: 'female', ageMonths: 6, weight: 7300 })).toEqual({
      ok: false,
      reason: 'implausible',
      field: 'weight',
    });
    expect(growthPercentiles({ gender: 'female', ageMonths: 6, height: 0.65 })).toEqual({
      ok: false,
      reason: 'implausible',
      field: 'height',
    });
  });

  describe('preterm birth', () => {
    const reading = (input: Parameters<typeof growthPercentiles>[0]) => {
      const result = growthPercentiles(input);
      if (!result.ok) throw new Error(`expected a reading, got ${result.reason}`);
      return result;
    };

    it('reads a 32-weeker at 7 months at about 5 corrected months', () => {
      const result = reading({ gender: 'male', ageMonths: 7, gestationalWeeks: 32, weight: 7 });

      expect(result.corrected).toBe(true);
      expect(result.givenMonths).toBe(7);
      expect(result.ageMonths).toBeGreaterThan(5);
      expect(result.ageMonths).toBeLessThan(5.5);
      // The same weight scores higher against younger peers than against same-age ones.
      const uncorrected = reading({ gender: 'male', ageMonths: 7, weight: 7 });
      expect(result.readings[0].percentile).toBeGreaterThan(uncorrected.readings[0].percentile);
    });

    it('changes nothing for a baby born at term', () => {
      const plain = reading({ gender: 'female', ageMonths: 7, weight: 7.5, height: 66 });
      const at38 = reading({ gender: 'female', ageMonths: 7, gestationalWeeks: 38, weight: 7.5, height: 66 });

      expect(at38).toEqual(plain);
      expect(at38.corrected).toBe(false);
    });

    it('stops correcting past 24 corrected months, as the signed-in chart does', () => {
      const result = reading({ gender: 'female', ageMonths: 30, gestationalWeeks: 32, weight: 12 });
      expect(result.corrected).toBe(false);
      expect(result.ageMonths).toBe(30);
    });

    it('refuses a baby not yet at its due date instead of reading it at month zero', () => {
      expect(growthPercentiles({ gender: 'male', ageMonths: 1, gestationalWeeks: 28, weight: 3 })).toEqual({
        ok: false,
        reason: 'before-term',
      });
    });

    it('refuses gestational weeks outside 20 to 42', () => {
      for (const weeks of [12, 45, 32.5]) {
        expect(growthPercentiles({ gender: 'male', ageMonths: 6, gestationalWeeks: weeks, weight: 7 })).toEqual({
          ok: false,
          reason: 'weeks',
        });
      }
    });
  });
});
