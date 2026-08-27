import { describe, it, expect } from 'vitest';
import type { VaccineSchedule } from '../../types';
import { vaccineSchedules } from './vaccines';

/**
 * 明列同一支疫苗的所有劑次記錄。
 * 以顯式清單而非 id 前綴推導，因為 id 命名不規則
 * （例：`pneumococcal-15v-6m` 與 `pneumococcal-12m` 並非同一支疫苗）。
 */
const VACCINE_FAMILIES: Record<string, { idPrefix: string; ids: string[] }> = {
  日本腦炎: { idPrefix: 'je-', ids: ['je-15m', 'je-27m'] },
  A型肝炎: { idPrefix: 'hepa-', ids: ['hepa-12m', 'hepa-18m'] },
};

const byId = (id: string): VaccineSchedule | undefined =>
  vaccineSchedules.find((v) => v.id === id);

describe('vaccineSchedules 時程正確性', () => {
  describe.each(Object.entries(VACCINE_FAMILIES))(
    '%s',
    (_name, { idPrefix, ids }) => {
      it('資料集中恰好只有這些劑次記錄', () => {
        const actual = vaccineSchedules
          .filter((v) => v.id.startsWith(idPrefix))
          .map((v) => v.id)
          .sort();
        expect(actual).toEqual([...ids].sort());
      });

      it('所有劑次宣告相同的 doses 總數，且等於實際劑次數', () => {
        const records = ids.map((id) => byId(id));
        records.forEach((r, i) => expect(r, `缺少 ${ids[i]}`).toBeDefined());
        const declared = new Set(records.map((r) => r!.doses));
        expect(declared.size).toBe(1);
        expect([...declared][0]).toBe(ids.length);
      });

      it('currentDose 為連號 1..N，且 ageInMonths 隨劑次嚴格遞增', () => {
        const records = ids.map((id) => byId(id)!);
        expect(records.map((r) => r.currentDose)).toEqual(
          records.map((_, i) => i + 1),
        );
        const ages = records.map((r) => r.ageInMonths!);
        for (let i = 1; i < ages.length; i++) {
          expect(ages[i]).toBeGreaterThan(ages[i - 1]);
        }
      });
    },
  );

  it('日本腦炎採 15／27 個月的 2 劑活性減毒時程', () => {
    expect(byId('je-15m')!.ageInMonths).toBe(15);
    expect(byId('je-27m')!.ageInMonths).toBe(27);
    expect(byId('je-27m')!.name).toContain('第2劑');
  });

  it('A 型肝炎採 18／27 個月時程（114/1/1 起調整）', () => {
    expect(byId('hepa-12m')!.ageInMonths).toBe(18);
    expect(byId('hepa-12m')!.timing).toBe('出生滿18個月');
    expect(byId('hepa-18m')!.ageInMonths).toBe(27);
    expect(byId('hepa-18m')!.timing).toBe('出生滿27個月');
  });
});
