import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import type { VaccineSchedule } from '../../types';
import { vaccineSchedules } from './vaccines';

/**
 * 明列同一支疫苗的所有劑次記錄。
 *
 * 成員用述詞而不是 id 前綴：前綴一樣不代表同一支疫苗。
 * `pneumococcal-15v-6m` 是另一支自費疫苗，不是 13 價的其中一劑。述詞說得出
 * 「哪些不算」，清單才不會被一列同前綴的新資料默默吸收。
 */
const VACCINE_FAMILIES: Record<
  string,
  { belongs: (id: string) => boolean; ids: string[] }
> = {
  日本腦炎: { belongs: (id) => id.startsWith('je-'), ids: ['je-15m', 'je-27m'] },
  A型肝炎: { belongs: (id) => id.startsWith('hepa-'), ids: ['hepa-12m', 'hepa-18m'] },
  '13價肺炎鏈球菌（公費常規時程）': {
    belongs: (id) => id.startsWith('pneumococcal-') && id !== 'pneumococcal-15v-6m',
    ids: ['pneumococcal-2m', 'pneumococcal-4m', 'pneumococcal-12m'],
  },
};

const byId = (id: string): VaccineSchedule | undefined =>
  vaccineSchedules.find((v) => v.id === id);

describe('vaccineSchedules 時程正確性', () => {
  describe.each(Object.entries(VACCINE_FAMILIES))(
    '%s',
    (_name, { belongs, ids }) => {
      it('資料集中恰好只有這些劑次記錄', () => {
        const actual = vaccineSchedules
          .filter((v) => belongs(v.id))
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

  it('13 價肺炎鏈球菌的公費時程就是來源寫的 3 劑：2、4、12-15 個月', () => {
    // 疾管署：「全面推動嬰幼兒接種3劑PCV13，接種時程依序為出生滿2個月、
    // 4個月及12-15個月，如為高危險群對象，出生滿6個月時可增加接種1劑」。
    //
    // 這一條比對的是來源，不是資料自己前後一致：曾經有一列 24 個月的「第 4
    // 劑」標成公費，而且四列都寫 doses: 4——內部完全自洽，只是和官方時程不
    // 一樣。15 價是另一支自費疫苗，不屬於這個時程。
    const pcv13 = vaccineSchedules.filter(
      (v) => v.id.startsWith('pneumococcal-') && v.id !== 'pneumococcal-15v-6m',
    );

    expect(pcv13.map((v) => v.ageInMonths).sort((a, b) => a! - b!)).toEqual([2, 4, 12]);
    expect([...new Set(pcv13.map((v) => v.doses))]).toEqual([3]);
    expect([...new Set(pcv13.map((v) => v.funding))]).toEqual(['national']);
  });
});

/**
 * 出處與查證日期。
 *
 * 這一份是疾管署的公費時程，會隨政策改，而且改了不會有人通知——檔案自己就
 * 記過 hepa 兩劑的時程從 12/18 個月改成 18/27 個月。沒有出處的一劑，下一個
 * 人沒有辦法判斷它是查過的還是抄來的；下面這幾條就是不讓那種劑次進來。
 */
describe('vaccineSchedules 的出處', () => {
  it('每一劑都有 https 的出處', () => {
    const missing = vaccineSchedules
      .filter((v) => !/^https:\/\/\S+$/.test(v.sourceUrl))
      .map((v) => `${v.id} ${v.name}`);

    expect(missing, '新增劑次請一併標出處，不要留空也不要編一個').toEqual([]);
  });

  it('有條件的劑次一定寫得出條件', () => {
    // nhi-conditional 與 local-varies 沒有條件就等於沒有意義：家長讀到
    // 「有條件給付」卻不知道是什麼條件，比直接寫自費更糟。
    const conditional = vaccineSchedules.filter(
      (v) => v.funding === 'nhi-conditional' || v.funding === 'local-varies',
    );

    expect(conditional.length).toBeGreaterThan(0);
    conditional.forEach((v) => {
      expect(v.eligibility?.trim(), `${v.id} 缺少 eligibility`).toBeTruthy();
    });
  });

  it('沒有一劑宣稱的劑次大於自己的總劑數', () => {
    // 「第 4 劑／共 3 劑」這種列一定有一邊是編的。這一條是回歸防護：
    // 它擋的是下一次，不是這一次。
    const impossible = vaccineSchedules
      .filter((v) => (v.currentDose ?? 1) > v.doses)
      .map((v) => `${v.id} 第 ${v.currentDose} 劑／共 ${v.doses} 劑`);

    expect(impossible).toEqual([]);
  });

  it('檔頭的查證日期不是未來', () => {
    const source = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), 'vaccines.ts'),
      'utf8',
    );
    const verifiedOn = source.match(/(\d{4}-\d{2}-\d{2})\s*查證/)?.[1];

    expect(verifiedOn, '檔頭要有「YYYY-MM-DD 查證」').toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(verifiedOn! <= new Date().toISOString().slice(0, 10)).toBe(true);
  });
});

describe('RSV 單株抗體的兩種產品', () => {
  const rsv = vaccineSchedules.filter((v) => v.id.startsWith('rsv-'));

  it('是兩列而不是一列，付費方式各自標明', () => {
    // 壓成一列「自費」時，早產兒的家長讀到的是兩萬多元的自付額，
    // 而其中一種對他們的孩子是有健保給付條件的。
    expect(rsv.map((v) => v.funding).sort()).toEqual(['nhi-conditional', 'self-paid']);
  });

  it('有健保給付條件的那一列，把高風險條件講出來', () => {
    const reimbursed = rsv.find((v) => v.funding === 'nhi-conditional');

    expect(reimbursed).toBeDefined();
    for (const condition of ['1歲以下', '早產', '先天性心臟病', '慢性肺病']) {
      expect(reimbursed!.eligibility).toContain(condition);
    }
  });
});
