'use strict';

/**
 * `diffDiseaseRadar.cjs` 決定排程要不要 commit，判斷錯了有兩種代價：把只有時間
 * 戳變動的檔案 commit 上去（每週一筆空 commit，git log 從此看不出資料哪一週真的
 * 動過），或把真的資料變更當成沒變（線上停在舊資料）。
 *
 * 兩層都逐條釘死：`bodyOf`（比對規則）與 `decide`（退出碼契約）。workflow 的
 * `Commit if data changed` 完全照退出碼分支——0 還原不 commit、1 commit 並 push、
 * 其餘原封不動往外拋成紅燈——所以「比不出來」被判成 0 或 1 都是真的會出事。
 *
 * 這是一支 CommonJS 檔，跟被測的 `.cjs` 放在一起（`scripts/` 不進 tsc 的
 * `include`，也在 eslint 的 ignorePatterns 裡）。`describe` / `it` / `expect`
 * 取自 `vitest.config.ts` 的 `test.globals: true`，因為 CJS 沒辦法 import
 * 純 ESM 的 vitest。
 */

const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const { VOLATILE_FIELDS, bodyOf, decide } = require('./diffDiseaseRadar.cjs');

const REPO_ROOT = path.join(__dirname, '..');
const REL_PATH = 'public/data/diseaseRadar.json';
const REAL_FILE = path.join(REPO_ROOT, REL_PATH);
const SCRIPT = path.join(__dirname, 'diffDiseaseRadar.cjs');

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

/**
 * 把 `decide` 跑在假的 IO 上：字串當成讀到的檔案內容，`Error` 當成讀取失敗
 * （檔案不存在、或 `git show HEAD:…` 抱錯）。因為 IO 是注入的，這些測試不必
 * spawn 子行程、也不必造一個臨時 git repo，就能把三個退出碼逐條釘死。
 */
function run({ working, head }) {
  const out = [];
  const errs = [];
  const reader = (source) => () => {
    if (source instanceof Error) throw source;
    return source;
  };

  const code = decide({
    readWorking: reader(working),
    readHead: reader(head),
    log: (message) => out.push(message),
    logError: (message) => errs.push(message),
  });

  return { code, out, errs };
}

describe('diffDiseaseRadar 的退出碼契約', () => {
  it('資料本體相同（兩個易變欄位都變了）→ 0', () => {
    // 每週重建必然改掉這兩個欄位，所以這是排程最常見的一次。
    const head = text(radar());
    const rebuilt = text(radar({ generatedAt: '2027-01-01T00:00:00Z', verifiedOn: '2027-01-01' }));
    expect(rebuilt).not.toBe(head); // 前提：重建後的檔案真的不一樣，否則這條測試是空的

    const { code, out, errs } = run({ working: rebuilt, head });
    expect(code).toBe(0);
    expect(out.join('\n')).toContain('相同');
    expect(errs).toEqual([]);
  });

  it('某格 rate 改掉 → 1', () => {
    const changed = radar();
    changed.counties.花蓮縣['3~6'].腸病毒.rate = 999.9;

    const { code, out, errs } = run({ working: text(changed), head: text(radar()) });
    expect(code).toBe(1);
    expect(out.join('\n')).toContain('有變更');
    expect(errs).toEqual([]);
  });

  it('0 與 1 各自印出認得出來的訊息', () => {
    // workflow 只看退出碼，人看的是這兩行；兩種情況印一樣的字，log 就沒有用。
    const unchanged = run({ working: text(radar()), head: text(radar()) });
    const changed = run({ working: text(radar({ week: '2026-W35' })), head: text(radar()) });

    expect(unchanged.code).toBe(0);
    expect(changed.code).toBe(1);
    expect(unchanged.out).toHaveLength(1);
    expect(changed.out).toHaveLength(1);
    expect(unchanged.out[0]).not.toBe(changed.out[0]);
    expect(unchanged.out[0]).not.toContain('有變更');
    expect(changed.out[0]).not.toContain('相同');
  });

  it('工作區的檔案是壞掉的 JSON → 2', () => {
    const { code, out, errs } = run({ working: '{"week":', head: text(radar()) });
    expect(code).toBe(2);
    expect(out).toEqual([]); // 不能同時印「相同」或「有變更」誤導讀 log 的人
    expect(errs.join('\n')).toContain('diseaseRadar.json');
    expect(errs.join('\n')).toContain('工作區的檔案不是合法的 JSON');
  });

  it('HEAD 版本是壞掉的 JSON → 2', () => {
    const { code, out, errs } = run({ working: text(radar()), head: '<<<<<<< HEAD' });
    expect(code).toBe(2);
    expect(out).toEqual([]);
    expect(errs.join('\n')).toContain('HEAD 的檔案不是合法的 JSON');
  });

  it('讀不到 HEAD 版本（git show 抱錯）→ 2，不得當成相同也不得當成有變更', () => {
    // 例如該檔還沒進 HEAD。判成 0 的話重建結果會被 `git checkout --` 靜默丟掉，
    // 判成 1 的話一份沒比對過的檔案會被 commit 上去；兩種都是錯的。
    const { code, out, errs } = run({
      working: text(radar()),
      head: new Error("fatal: path 'public/data/diseaseRadar.json' does not exist in 'HEAD'"),
    });
    expect(code).toBe(2);
    expect(out).toEqual([]);
    expect(errs.join('\n')).toContain("does not exist in 'HEAD'");
  });

  it('工作區的檔案讀不到 → 2', () => {
    const { code, out, errs } = run({
      working: new Error(`ENOENT: no such file or directory, open '${REL_PATH}'`),
      head: text(radar()),
    });
    expect(code).toBe(2);
    expect(out).toEqual([]);
    expect(errs.join('\n')).toContain('ENOENT');
  });

  it('CLI 真的把 decide 的回傳值當成退出碼', () => {
    // 上面七條釘的是決策，這一條釘的是接線：真的 fs 與 `git show` 有沒有接對、
    // 回傳值有沒有真的變成 process 的退出碼、訊息有沒有走對 stdout / stderr。
    // 期望值就地用同一支 decide 配真的 reader 算出來，所以工作區是乾淨或已改過
    // 都不影響——比對的是「子行程的行為 == decide 的決定」。
    const expected = { out: [], errs: [] };
    expected.code = decide({
      readWorking: () => fs.readFileSync(REAL_FILE, 'utf8'),
      readHead: () =>
        execFileSync('git', ['show', `HEAD:${REL_PATH}`], {
          cwd: REPO_ROOT,
          encoding: 'utf8',
          maxBuffer: 16 * 1024 * 1024,
        }),
      log: (message) => expected.out.push(message),
      logError: (message) => expected.errs.push(message),
    });

    const ran = spawnSync(process.execPath, [SCRIPT], { cwd: REPO_ROOT, encoding: 'utf8' });
    expect(ran.error).toBeUndefined();
    expect(ran.status).toBe(expected.code);
    expect(ran.stdout.trim()).toBe(expected.out.join('\n'));
    // 比不出來的原因要走 stderr，而且 stdout 不准留下判定訊息。
    if (expected.code === 2) expect(ran.stderr.trim()).not.toBe('');
  });
});
