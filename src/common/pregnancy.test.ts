import { describe, it, expect } from 'vitest';
import type { ChildProfile } from '../types';
import { isPregnancyProfile } from './pregnancy';

const profile = (overrides: Partial<ChildProfile> = {}): ChildProfile => ({
  id: 'c1',
  name: '小花',
  birthday: '2027-01-11',
  milestoneProgress: {},
  vaccineProgress: {},
  createdAt: '2026-04-06T00:00:00.000Z',
  createdBy: 'u1',
  ...overrides,
});

describe('isPregnancyProfile', () => {
  it('孕期中的檔案為真', () => {
    expect(
      isPregnancyProfile(
        profile({
          isPregnancy: true,
          pregnancyData: {
            childId: 'c1',
            dueDate: '2027-01-11',
            lastPeriodDate: '2026-04-06',
            status: 'active',
          },
        }),
      ),
    ).toBe(true);
  });

  it('出生後封存的檔案為假，即使 pregnancyData 還留著', () => {
    // 出生後刻意保留孕期紀錄，所以不能只看 pregnancyData 是否存在。
    expect(
      isPregnancyProfile(
        profile({
          isPregnancy: false,
          birthday: '2026-12-28',
          pregnancyData: {
            childId: 'c1',
            dueDate: '2027-01-11',
            lastPeriodDate: '2026-04-06',
            status: 'archived',
          },
        }),
      ),
    ).toBe(false);
  });

  it('一般寶寶檔案為假', () => {
    expect(isPregnancyProfile(profile())).toBe(false);
  });

  it('沒有選擇檔案時為假，不拋錯', () => {
    expect(isPregnancyProfile(null)).toBe(false);
    expect(isPregnancyProfile(undefined)).toBe(false);
  });
});
