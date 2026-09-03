#!/usr/bin/env node
'use strict';

/**
 * 疾管署「健保門診及住院就診人次統計」→ LittleGuard 疫情雷達的預聚合 JSON。
 *
 * 六支 CSV 合計約 47 MB，聚合後 67 KB（gzip 14 KB），所以這份產出可以進 PWA
 * precache（`vite.config.ts` 的 globPatterns 已含 json，globIgnores 只排除
 * 1.1 MB 的 nursingRooms.json），板因此離線可用。
 *
 * 兩件事情不要「順手簡化」：
 *
 * 1. `od.cdc.gov.tw` 送出的憑證鏈是斷的——leaf 由 TWCA SSL Certification
 *    Authority（上層 TWCA CYBER Root CA）簽發，伺服器卻送另一條線的 TWCA
 *    Secure SSL Certification Authority（上層 TWCA Global Root CA）。Node 的
 *    預設信任庫與 --use-openssl-ca 都會得到 UNABLE_TO_VERIFY_LEAF_SIGNATURE。
 *    只把中介放進 `ca` 也不行：`ca` 會「取代」整個信任庫，於是變成
 *    UNABLE_TO_GET_ISSUER_CERT。這裡自帶中介＋根兩張，信任錨點寫死，行為與
 *    runtime 的內建信任庫版本無關（CI 用 Node 20，本機可能是 24）。
 *    絕對不要改成 rejectUnauthorized: false。
 *
 * 2. 週次是「疫情週」（MMWR 式，週日起算），不是 ISO 週。疾管署新聞稿寫
 *    「第 34 週（8 月 23 日至 29 日）」，而 2026 的 ISO W34 是 8/17–8/23。
 */

const fs = require('node:fs');
const https = require('node:https');
const path = require('node:path');
const tls = require('node:tls');

const CERT_DIR = path.join(__dirname, 'data');
const OUT_FILE = path.join(__dirname, '..', 'public', 'data', 'diseaseRadar.json');

const SOURCE_NAME = '衛生福利部疾病管制署 健保門診及住院就診人次統計';
const LICENSE = '政府資料開放授權條款-第1版';
const BASE = 'https://od.cdc.gov.tw/eic/';

/** 板上的六種病，順序就是畫面順序，不依狀態重排。 */
const DISEASES = [
  { name: '腸病毒', file: 'NHI_EnteroviralInfection.csv' },
  { name: '手足口病', file: 'NHI_HandFootMouthDisease.csv' },
  { name: '疱疹性咽峽炎', file: 'NHI_Herpangina.csv' },
  { name: '類流感', file: 'NHI_Influenza_like_illness.csv' },
  { name: '腹瀉', file: 'NHI_Diarrhea.csv' },
  { name: '水痘', file: 'NHI_Varicella.csv' },
];

const AGE_BANDS = ['0~2', '3~6', '7~12'];
const SPARK_WEEKS = 8;
const TREND_WEEKS = 8;
const TREND_MIN_POINTS = 6;
const DENOM_OK = 1000;
const DENOM_SMALL = 300;
const CALIBRATION_YEARS = 3;
const CALIBRATION_MIN_DENOM = 300;

const agent = new https.Agent({
  ca: [
    ...tls.rootCertificates,
    fs.readFileSync(path.join(CERT_DIR, 'twca-ssl-ca.pem'), 'utf8'),
    fs.readFileSync(path.join(CERT_DIR, 'twca-cyber-root.pem'), 'utf8'),
  ],
});

function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { agent }, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`${url} → HTTP ${res.statusCode}`));
          return;
        }
        // 200 之後才斷線的情況走這裡。'aborted' 與「宣告長度 vs 實收長度」各擋
        // 一種截斷：少了它們，一份「短但格式正確」的 CSV 會照樣解析成功，只是
        // 少了幾週或幾個縣市，而 parseDisease 只擋得住空檔與表頭不符。
        //
        // 刻意不加「列數至少要有多少」這種檢查：那個門檻是憑空訂的，疾管署一次
        // 合理改版就會讓排程每週紅燈——比它要防的問題更糟。真的截斷時下游本來
        // 就失效安全：六支共同的最新週會往前退一週，湊不齊的格子分母是 0、
        // 標成「資料不足」，不會生出一個看起來令人安心的數字。
        const declared = Number(res.headers['content-length']);
        const chunks = [];
        let received = 0;
        res.on('data', (c) => {
          chunks.push(c);
          received += c.length;
        });
        res.on('aborted', () => reject(new Error(`${url} → 回應在收完前中斷`)));
        res.on('end', () => {
          if (Number.isFinite(declared) && received !== declared) {
            reject(new Error(`${url} → 只收到 ${received} / ${declared} bytes`));
            return;
          }
          resolve(Buffer.concat(chunks));
        });
      })
      .on('error', reject);
  });
}

/** 引號感知的切欄：上游多數列沒有引號，但病名欄位出現過含逗號的引號字串。 */
function splitCsvLine(line) {
  const out = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      out.push(field);
      field = '';
    } else {
      field += ch;
    }
  }
  out.push(field);
  return out;
}

/**
 * 一支 CSV → Map<`${year}|${week}|${county}|${age}`, [numerator, denominator]>。
 *
 * 病名欄位每支檔案不同（「腸病毒健保就診人次」「水痘健保就診人次」…），所以
 * 用「含『就診人次』且不含『總』」找欄位，而不是寫死欄名。
 */
function parseDisease(buffer) {
  const text = buffer.toString('utf8').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) throw new Error('CSV 只有表頭或空檔');

  const header = splitCsvLine(lines[0]);
  const col = {
    year: header.indexOf('年'),
    week: header.indexOf('週'),
    kind: header.indexOf('就診類別'),
    age: header.indexOf('年齡別'),
    county: header.indexOf('縣市'),
    denom: header.indexOf('健保就診總人次'),
  };
  const numIdx = header.findIndex((h) => h.includes('就診人次') && !h.includes('總'));
  if (Object.values(col).some((i) => i < 0) || numIdx < 0) {
    throw new Error(`表頭不符預期：${lines[0]}`);
  }

  const index = new Map();
  const weeks = new Set();
  for (let i = 1; i < lines.length; i += 1) {
    const f = splitCsvLine(lines[i]);
    if (f[col.kind] !== '門診') continue;
    if (!AGE_BANDS.includes(f[col.age])) continue;
    const year = Number(f[col.year]);
    const week = Number(f[col.week]);
    const num = Number(f[numIdx]);
    const den = Number(f[col.denom]);
    if (!Number.isFinite(year) || !Number.isFinite(week)) continue;
    if (!Number.isFinite(num) || !Number.isFinite(den)) continue;
    const key = `${year}|${week}|${f[col.county]}|${f[col.age]}`;
    const cell = index.get(key) || [0, 0];
    cell[0] += num;
    cell[1] += den;
    index.set(key, cell);
    weeks.add(year * 100 + week);
  }
  if (index.size === 0) throw new Error('解析後 0 列');
  return { index, weeks };
}

const rateOf = (index, year, week, county, age) => {
  const cell = index.get(`${year}|${week}|${county}|${age}`);
  if (!cell || cell[1] === 0) return null;
  return (cell[0] / cell[1]) * 10000;
};

const cellOf = (index, year, week, county, age) =>
  index.get(`${year}|${week}|${county}|${age}`) || [0, 0];

function median(values) {
  const xs = [...values].sort((a, b) => a - b);
  const mid = Math.floor(xs.length / 2);
  return xs.length % 2 ? xs[mid] : (xs[mid - 1] + xs[mid]) / 2;
}

function percentile(sortedValues, p) {
  if (sortedValues.length === 0) return null;
  const i = Math.min(sortedValues.length - 1, Math.floor(sortedValues.length * p));
  return sortedValues[i];
}

/**
 * 疫情週第 1 週的起始週日。
 *
 * 規則：取 1 月 1 日當週的週日；若該週落在新年度的天數不足 4 天，第 1 週改從
 * 下一個週日起算。2026-01-01 是週四（該週只有 3 天在 2026），所以 2026 W1 是
 * 1/4–1/10，W34 因此是 8/23–8/29 —— 與疾管署新聞稿一致。
 */
function epiYearStart(year) {
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const sunday = new Date(jan1);
  sunday.setUTCDate(jan1.getUTCDate() - jan1.getUTCDay());
  const daysInNewYear = 7 - jan1.getUTCDay();
  if (daysInNewYear < 4) sunday.setUTCDate(sunday.getUTCDate() + 7);
  return sunday;
}

function epiWeekRange(year, week) {
  const start = epiYearStart(year);
  start.setUTCDate(start.getUTCDate() + (week - 1) * 7);
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);
  const iso = (d) => d.toISOString().slice(0, 10);
  return { weekStart: iso(start), weekEnd: iso(end) };
}

/**
 * 往前推 n 週，跨年時回到前一年的最後一週。
 *
 * 跨年退回 W53 而不是 W52：疫情年可能有 53 週，寫死 52 會整段跳過前一年的
 * W53。查不到的週次一律回 null，而 trendBase 只要求 8 週裡至少 6 週有值，
 * 所以多問一週不會扭曲基線。
 */
function weeksBefore(year, week, n) {
  const out = [];
  let y = year;
  let w = week;
  for (let i = 0; i < n; i += 1) {
    w -= 1;
    if (w < 1) {
      y -= 1;
      w = 53;
    }
    out.push([y, w]);
  }
  return out;
}

const round1 = (x) => (x === null ? null : Math.round(x * 10) / 10);
const round2 = (x) => (x === null ? null : Math.round(x * 100) / 100);

function reliabilityOf(denom) {
  if (denom >= DENOM_OK) return 'ok';
  if (denom >= DENOM_SMALL) return 'small';
  return 'insufficient';
}

function trendBaseOf(index, year, week, county, age) {
  const rates = weeksBefore(year, week, TREND_WEEKS)
    .map(([y, w]) => rateOf(index, y, w, county, age))
    .filter((r) => r !== null);
  if (rates.length < TREND_MIN_POINTS) return null;
  return median(rates);
}

function nationalRate(index, year, week, age, counties) {
  let num = 0;
  let den = 0;
  for (const county of counties) {
    const [n, d] = cellOf(index, year, week, county, age);
    num += n;
    den += d;
  }
  return den === 0 ? null : (num / den) * 10000;
}

/** 近 3 年、分母足夠的 (縣市 × 年齡 × 病種 × 週) 的 ratio 分布，用來定門檻。 */
function calibrate(parsed, counties, latestYear) {
  const ratios = [];
  for (const { index } of parsed) {
    for (const county of counties) {
      for (const age of AGE_BANDS) {
        for (let year = latestYear - CALIBRATION_YEARS + 1; year <= latestYear; year += 1) {
          for (let week = 1; week <= 53; week += 1) {
            const [, denom] = cellOf(index, year, week, county, age);
            if (denom < CALIBRATION_MIN_DENOM) continue;
            const rate = rateOf(index, year, week, county, age);
            const base = trendBaseOf(index, year, week, county, age);
            if (rate === null || base === null || base <= 0) continue;
            ratios.push(rate / base);
          }
        }
      }
    }
  }
  ratios.sort((a, b) => a - b);
  return {
    trendP25: round2(percentile(ratios, 0.25)),
    trendP75: round2(percentile(ratios, 0.75)),
    trendP90: round2(percentile(ratios, 0.9)),
    sampleSize: ratios.length,
  };
}

async function main() {
  const buffers = await Promise.all(DISEASES.map((d) => download(BASE + d.file)));
  const parsed = buffers.map((b, i) => ({ ...DISEASES[i], ...parseDisease(b) }));

  // 六支共同存在的最新一週：任一支缺該週就退一週，否則六張卡會來自不同週。
  const common = [...parsed[0].weeks].filter((w) => parsed.every((p) => p.weeks.has(w)));
  if (common.length === 0) throw new Error('六支資料沒有共同的週次');
  const latest = Math.max(...common);
  const year = Math.floor(latest / 100);
  const week = latest % 100;
  const { weekStart, weekEnd } = epiWeekRange(year, week);

  const counties = [
    ...new Set(
      parsed.flatMap(({ index }) => [...index.keys()].map((k) => k.split('|')[2])),
    ),
  ].sort();

  const national = {};
  for (const age of AGE_BANDS) {
    national[age] = {};
    for (const { name, index } of parsed) {
      national[age][name] = { rate: round1(nationalRate(index, year, week, age, counties)) };
    }
  }

  const out = {
    week: `${year}-W${String(week).padStart(2, '0')}`,
    weekStart,
    weekEnd,
    generatedAt: new Date().toISOString(),
    // 查證日期：本檔由腳本產生，日期即為執行日。
    verifiedOn: new Date().toISOString().slice(0, 10),
    source: SOURCE_NAME,
    sourceUrls: DISEASES.map((d) => BASE + d.file),
    license: LICENSE,
    diseases: DISEASES.map((d) => d.name),
    ageBands: AGE_BANDS,
    calibration: calibrate(parsed, counties, year),
    national,
    counties: {},
  };

  for (const county of counties) {
    out.counties[county] = {};
    for (const age of AGE_BANDS) {
      out.counties[county][age] = {};
      for (const { name, index } of parsed) {
        const [visits, denom] = cellOf(index, year, week, county, age);
        const reliability = reliabilityOf(denom);
        if (reliability === 'insufficient') {
          out.counties[county][age][name] = {
            rate: null,
            trendBase: null,
            ratio: null,
            geoRatio: null,
            visits,
            denom,
            reliability,
            spark: new Array(SPARK_WEEKS).fill(null),
          };
          continue;
        }
        const rate = round1(rateOf(index, year, week, county, age));
        const base = round1(trendBaseOf(index, year, week, county, age));
        const nat = national[age][name].rate;
        const spark = [
          ...weeksBefore(year, week, SPARK_WEEKS - 1)
            .reverse()
            .map(([y, w]) => round1(rateOf(index, y, w, county, age))),
          rate,
        ];
        // 比值一律用「已發布的」rate 與 trendBase 相除，而不是未四捨五入的原值：
        // 卡片上會同時出現這三個數字，若比值來自更精確的中間值，家長看到的
        // 3.6 ÷ 1.5 就不等於 2.46。水痘這類低率病種（率只有個位數）差得最明顯。
        out.counties[county][age][name] = {
          rate,
          trendBase: base,
          ratio: base && base > 0 && rate !== null ? round2(rate / base) : null,
          geoRatio: nat && nat > 0 && rate !== null ? round2(rate / nat) : null,
          visits,
          denom,
          reliability,
          spark,
        };
      }
    }
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(out)}\n`);
  const bytes = fs.statSync(OUT_FILE).size;
  console.log(
    `${out.week} (${weekStart}~${weekEnd})  ${counties.length} 縣市 × ${AGE_BANDS.length} 年齡層 × ${DISEASES.length} 病種  ${bytes.toLocaleString()} bytes`,
  );
  console.log(`門檻校準：P25 ${out.calibration.trendP25} / P75 ${out.calibration.trendP75} / P90 ${out.calibration.trendP90}（n=${out.calibration.sampleSize}）`);
}

main().catch((err) => {
  // 非零退出 → 排程 workflow 不會 commit，線上維持上一週而不是變成空板。
  console.error(`buildDiseaseRadar 失敗：${err.message}`);
  process.exit(1);
});
