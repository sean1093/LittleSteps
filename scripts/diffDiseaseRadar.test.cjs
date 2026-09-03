'use strict';

/**
 * `diffDiseaseRadar.cjs` 決定排程要不要 commit，判斷錯了有兩種代價：把只有時間
 * 戳變動的檔案 commit 上去（每週一筆空 commit，git log 從此看不出資料哪一週真的
 * 動過），或把真的資料變更當成沒變（線上停在舊資料）。所以比對規則逐條釘死。
 *
 * 這是一支 CommonJS 檔，跟被測的 `.cjs` 放在一起（`scripts/` 不進 tsc 的
 * `include`，也在 eslint 的 ignorePatterns 裡）。`describe` / `it` / `expect`
 * 取自 `vitest.config.ts` 的 `test.globals: true`，因為 CJS 沒辦法 import
 * 純 ESM 的 vitest。
 */

const fs = require('node:fs');
const path = require('node:path');

const { VOLATILE_FIELDS, bodyOf } = require('./diffDiseaseRadar.cjs');

const REAL_FILE = path.join(__dirname, '..', 'public', 'data', 'diseaseRadar.json');

/** 形狀比照 diseaseRadar.json 的最小樣本：巢狀物件、時間序陣列、畫面順序陣列都有。 */
function radar(overrides = {}) {
  return {
    week: '2026-W34',
    generatedAt: '2026-09-03T03:51:16.527Z',
    verifiedOn: '2026-09-03',
    diseases: ['腸病毒', '水痘'],
    ageBands: ['0~2', '3~6'],
    calibration: { trendP25: 0.78, trendP75: 1.26, trendP90: 1.77, sampleSize: 48725 },
    counties: {
      花蓮縣: {
        '3~6': {
          腸病毒: {
            rate: 169,
            ratio: 2.13,
            spark: [63.7, 84.3, 38.1, 113.4, 91.8, 74.5, 119.1, 169],
          },
        },
      },
    },
    ...overrides,
  };
}

const text = (value) => JSON.stringify(value);

/** 被測的比對本身：兩份 JSON 文字的資料本體是否相同。 */
const same = (a, b) => bodyOf(a) === bodyOf(b);

/** 遞迴把物件的 key 反序，陣列不動——模擬上游改了欄位寫入順序但內容不變。 */
function reverseKeys(value) {
  if (Array.isArray(value)) return value.map(reverseKeys);
  if (value === null || typeof value !== 'object') return value;
  const out = {};
  for (const key of Object.keys(value).reverse()) out[key] = reverseKeys(value[key]);
  return out;
}

describe('diffDiseaseRadar 的資料本體比對', () => {
  it('可以忽略的欄位就是那兩個，不能多', () => {
    // 名單每多一個欄位，就多一種「資料變了但我們對外說沒變」的可能。
    expect(VOLATILE_FIELDS).toEqual(['generatedAt', 'verifiedOn']);
  });

  it('完全相同 → 相同', () => {
    expect(same(text(radar()), text(radar()))).toBe(true);
  });

  it('只有 generatedAt 不同 → 相同', () => {
    const before = text(radar());
    const after = text(radar({ generatedAt: '2027-01-01T00:00:00Z' }));
    expect(before).not.toBe(after);
    expect(same(before, after)).toBe(true);
  });

  it('只有 verifiedOn 不同 → 相同', () => {
    const before = text(radar());
    const after = text(radar({ verifiedOn: '2027-01-01' }));
    expect(before).not.toBe(after);
    expect(same(before, after)).toBe(true);
  });

  it('兩個易變欄位都不同 → 相同', () => {
    const before = text(radar());
    const after = text(radar({ generatedAt: '2027-01-01T00:00:00Z', verifiedOn: '2027-01-01' }));
    expect(before).not.toBe(after);
    expect(same(before, after)).toBe(true);
  });

  it('物件 key 順序不同但內容相同 → 相同', () => {
    // 上游換了欄位的寫入順序而內容沒動時，不該產生一筆空 commit。
    const before = text(radar());
    const after = text(reverseKeys(radar()));
    expect(before).not.toBe(after); // 前提：文字真的不一樣，否則這條測試是空的
    expect(same(before, after)).toBe(true);
  });

  it('剝掉的欄位不會留在比對字串裡', () => {
    const body = bodyOf(text(radar()));
    for (const field of VOLATILE_FIELDS) expect(body).not.toContain(field);
  });

  it('改掉一個格子的 rate → 不同', () => {
    const changed = radar();
    changed.counties.花蓮縣['3~6'].腸病毒.rate = 999.9;
    expect(same(text(radar()), text(changed))).toBe(false);
  });

  it('spark 陣列反轉 → 不同', () => {
    // 陣列順序是資料的一部分（spark 是時間序），所以正規化不准排序陣列。
    const reordered = radar();
    reordered.counties.花蓮縣['3~6'].腸病毒.spark.reverse();
    expect(same(text(radar()), text(reordered))).toBe(false);
  });

  it('畫面順序的陣列重排 → 不同', () => {
    expect(same(text(radar()), text(radar({ diseases: ['水痘', '腸病毒'] })))).toBe(false);
    expect(same(text(radar()), text(radar({ ageBands: ['3~6', '0~2'] })))).toBe(false);
  });

  it('JSON 壞掉 → 丟出可辨識的錯誤，不是回「有變更」', () => {
    expect(() => bodyOf('{"week":', 'HEAD 的檔案')).toThrowError(
      /^HEAD 的檔案不是合法的 JSON：/,
    );
  });

  it('合法 JSON 但不是物件 → 同樣丟出', () => {
    // `delete null['generatedAt']` 會是 TypeError；錯誤訊息要說得出人話。
    expect(() => bodyOf('null', '工作區的檔案')).toThrowError('工作區的檔案不是一個 JSON 物件');
    expect(() => bodyOf('42')).toThrowError('檔案不是一個 JSON 物件');
  });

  it('真的 diseaseRadar.json 比得動，且兩個易變欄位都在裡面', () => {
    // 樣本形狀對、真檔形狀不對就沒有意義：真檔必須真的含那兩個欄位，
    // 否則「剝掉時間戳」是在剝空氣。
    const real = fs.readFileSync(REAL_FILE, 'utf8');
    const parsed = JSON.parse(real);
    for (const field of VOLATILE_FIELDS) expect(parsed).toHaveProperty(field);

    const body = bodyOf(real, '真的資料檔');
    expect(body.length).toBeGreaterThan(1000);
    expect(same(real, real)).toBe(true);
  });
});
