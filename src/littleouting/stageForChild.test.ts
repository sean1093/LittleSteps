import { describe, expect, it } from 'vitest';
import type { ChildProfile } from '../types';
import { stageForChild } from './stageForChild';

const TODAY = new Date('2026-11-23T00:00:00');

/** A child born `months` whole months before TODAY. */
function child(months: number, extra: Partial<ChildProfile> = {}): ChildProfile {
  const birthday = new Date(TODAY);
  birthday.setMonth(birthday.getMonth() - months);
  return {
    id: 'c1',
    name: '小米',
    birthday: birthday.toISOString().slice(0, 10),
    milestoneProgress: {},
    vaccineProgress: {},
    ...extra,
  } as ChildProfile;
}

describe('stageForChild', () => {
  it('has no guess without a child', () => {
    expect(stageForChild(undefined, TODAY)).toBeNull();
  });

  it('has no guess for a pregnancy profile', () => {
    expect(stageForChild(child(0, { isPregnancy: true }), TODAY)).toBeNull();
  });

  it.each([
    [0, 'lying'],
    [5, 'lying'],
    [6, 'crawling'],
    [9, 'crawling'],
    [10, 'cruising'],
    [14, 'cruising'],
    [15, 'walking'],
    [23, 'walking'],
    [24, 'running'],
    [60, 'running'],
  ] as const)('falls back to age: %i months is %s', (months, stage) => {
    expect(stageForChild(child(months), TODAY)).toEqual({ stage, basis: 'age' });
  });

  it("lets the parent's own ticks outrank age", () => {
    // Nine months and already walking alone: the page must not send this
    // family to the crawling mats because of the calendar.
    const early = child(9, {
      milestoneProgress: { 'm11-physical-1': { achieved: true } },
    });
    expect(stageForChild(early, TODAY)).toEqual({ stage: 'cruising', basis: 'records' });
  });

  it('takes the highest stage ticked, from either dataset', () => {
    const toddler = child(20, {
      milestoneProgress: { 'm6-physical-1': { achieved: true } },
      developmentProgress: { 'check-24-30-gross-motor': { achieved: true } },
    });
    expect(stageForChild(toddler, TODAY)).toEqual({ stage: 'running', basis: 'records' });
  });

  it('ignores a marker that was ticked and then unticked', () => {
    const undone = child(7, {
      milestoneProgress: { 'm10-physical-1': { achieved: false } },
    });
    expect(stageForChild(undone, TODAY)).toEqual({ stage: 'crawling', basis: 'age' });
  });

  it('does not let old ticks hold an older child back', () => {
    // Sitting was ticked a year ago and nothing since. Ticks only ever raise
    // the guess above what age gives; they never lower it.
    const stale = child(30, {
      milestoneProgress: { 'm6-physical-1': { achieved: true } },
    });
    expect(stageForChild(stale, TODAY)?.stage).toBe('running');
  });

  it('uses corrected age for a preterm baby', () => {
    // Born at 28 weeks: about three months early. At seven months by the
    // calendar the baby is nearer four, and is not expected to sit yet.
    const preterm = child(7, { gestationalAgeWeeks: 28 });
    expect(stageForChild(preterm, TODAY)).toEqual({ stage: 'lying', basis: 'age' });
  });
});
