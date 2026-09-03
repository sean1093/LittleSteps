# LittleGuard 疫情雷達 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 LittleSteps 加入第六個服務 LittleGuard，把疾管署每週更新的六種兒童傳染病門診就診統計，變成一個「我這個縣市、我小孩這個年齡，這週有什麼可以多留意」的板。

**Architecture:** 建置期把 49 MB 的 CSV 聚合成 47 KB 的 JSON commit 進 repo，前端只讀那份 JSON。純公開、零 Firebase、零新依賴。狀態判定是可注入時間的純函式，先寫測試再寫實作。

**Tech Stack:** React 18 + TypeScript 5.2（strict）、Vite 5、Tailwind 3.4、Framer Motion 10、Vitest 4.1、lucide-react、Node 20（CI）

**Spec:** `docs/superpowers/specs/2026-09-03-littleguard-disease-radar-design.md`

**實作後更正（Task 6 回填）：** 這份計畫是已執行完的歷史文件，下方各 Task 的程式碼區塊、數字與測試斷言一律**保留當時的寫法**作為紀錄，不改成符合成品；與成品不符處以 spec 為準（`docs/superpowers/specs/2026-09-03-littleguard-disease-radar-design.md`）。三處已知落差：

- **產出大小是 68,511 bytes / gzip 14,667**，不是計畫寫的 47 KB / gzip 12 KB。估值時的格子只有 5 個欄位，定稿是 8 個。
- **門檻是 P25 0.78 / P75 1.26 / P90 1.77（n = 48,725）**，不是 0.77 / 1.33 / 1.88（n = 40,040）。校準視窗依規格從第 1 週起算並跳年取值（原型只算第 9–52 週、不跳年），樣本變大、三個百分位隨之下移。見 spec §4.3。
- **狀態是九個，不是八個**：新增 `noBaseline`（「還不夠資料比較」，用於 `trendBase === null`）——「前 8 週算不出基線」與「基線真的是零」不是同一件事，只有後者能說「這週開始出現」。連帶 `noBaseline` / `none` / `smallSample` / `insufficient` 四個弱狀態的色階由 `text-ink-faint` 改為 `text-ink-muted`。見 spec §4.5。

## Global Constraints

- 語言：所有使用者可見字串為繁體中文；程式碼、註解與 commit message 依 repo 現況（註解中文、識別字英文）。
- **語氣（優先於任何視覺或資訊密度考量）**：這個服務要讓家長「多留意」，不是讓家長緊張。
  - 狀態文案只能是這六句：`最近變多，多留意` / `稍微變多` / `跟平常差不多` / `比平常少` / `最近沒有個案` / `這週開始出現`，加上兩個資料品質狀態 `樣本偏小，僅供參考` / `資料不足`。
  - 禁用詞：警戒、升溫、爆發、危險、疫情嚴峻、拉警報、慎防。
  - 顏色最強只到 `butter-dark`。**不得**使用 `primary-dark`。
  - 不用箭頭符號、不用警示三角、不用紅點 badge、不加驚嘆號、數字不放大字級。
  - 卡片順序固定，**不得**依狀態重排。
  - 抽屜內容順序：先給「可以做什麼」，再給數字。
- 純公開：`littleguard` 進 `PUBLIC_PAGES`。**不得**讀取任何孩子資料、不得 import `useChildStore`、不得動 `database.rules.json`。
- 不新增任何 npm 依賴。
- **不得**用 `NODE_TLS_REJECT_UNAUTHORIZED=0` 或 `rejectUnauthorized: false`。`od.cdc.gov.tw` 憑證鏈不完整，解法是自帶兩張憑證（見 Task 1）。
- 設計系統：pastel 只能當填色，文字用 `-dark` / `-ink`；`.card-tap` / `.panel` / `.chip` / `AppBar` / `EmptyState` / `motion.ts` 一律沿用，不自造。className 內**不得**出現 hex literal。
- 手機優先：390px 為基準（chip 列另在 320px 檢查），可點區域 ≥ 44px（`min-h-tap`）。SVG 用 `viewBox` + `w-full`，不寫死像素。
- 圖示要自己掙到位置：只有定位鈕可以有圖示。狀態、標題旁一律不放。
- husky pre-commit 會執行 `npm run build`（`tsc && vite build`），所以每個 commit 都必須能編譯。
- `npm run lint` 零警告；`npx vitest run` 全綠。
- `npm run test:rules` 不需要執行（本案不動 RTDB 規則）。

## 規格粒度

Task 1–3 以完整可貼上的程式碼指定，因為它們產出的是介面契約與數值門檻，任何偏差都會在下游斷掉。Task 5 的六筆衛教文字（`meaning` / `actions` / `seeDoctor`）必須逐筆對照 spec 附錄 A 已查證的疾管署頁面後撰寫，本計畫釘死欄位、id 與出處網址，只留文字本身待填——那受 Global Constraints 的語氣約束，不得由本計畫代填。

## 任務依賴

```
Task 1 (資料管線) ─┐
Task 2 (純函式)   ─┼─▶ Task 4 (板 UI) ─▶ Task 5 (抽屜與病種說明) ─▶ Task 6 (排程與文件)
Task 3 (服務骨架) ─┘
```

Task 1、2、3 互不相依，可並行。

---

### Task 1: 資料管線

**Files:**
- Create: `scripts/data/twca-ssl-ca.pem`
- Create: `scripts/data/twca-cyber-root.pem`
- Create: `scripts/buildDiseaseRadar.cjs`
- Create: `public/data/diseaseRadar.json`（由腳本產生並 commit）
- Test: `src/littleguard/data/diseaseRadar.contract.test.ts`

**Interfaces:**
- Consumes: 無。
- Produces: `public/data/diseaseRadar.json`，形狀如下（Task 2 的 `RadarData` 型別必須與它一致）：

```
{
  week: "2026-W34", weekStart: "2026-08-23", weekEnd: "2026-08-29",
  generatedAt: ISO8601, verifiedOn: "YYYY-MM-DD",
  source: string, sourceUrls: string[6], license: string,
  diseases: string[6], ageBands: ["0~2","3~6","7~12"],
  calibration: { trendP25: number, trendP75: number, trendP90: number, sampleSize: number },
  national: { [ageBand]: { [disease]: { rate: number | null } } },
  counties: { [county]: { [ageBand]: { [disease]: {
    rate: number|null, trendBase: number|null, ratio: number|null, geoRatio: number|null,
    visits: number, denom: number,
    reliability: "ok"|"small"|"insufficient",
    spark: (number|null)[8]
  } } } }
}
```

- [ ] **Step 1: 取得兩張憑證並驗證指紋**

```bash
mkdir -p scripts/data
curl -sS -o /tmp/twca-inter.crt http://sslserver.twca.com.tw/cacert/Cyber_SSL_2023.crt
curl -sS -o /tmp/twca-root.crt  http://sslserver.twca.com.tw/cacert/cyber_root_2022.crt
openssl x509 -inform DER -in /tmp/twca-inter.crt -out scripts/data/twca-ssl-ca.pem
openssl x509 -inform DER -in /tmp/twca-root.crt  -out scripts/data/twca-cyber-root.pem
openssl x509 -in scripts/data/twca-ssl-ca.pem     -noout -subject -fingerprint -sha256
openssl x509 -in scripts/data/twca-cyber-root.pem -noout -subject -fingerprint -sha256
```

Expected（不符就停下來，不要繼續）：

```
subject= C=TW, O=TAIWAN-CA, OU=SSL Sub-CA, CN=TWCA SSL Certification Authority
sha256 Fingerprint=01:AF:23:24:D0:98:09:8F:5E:0C:DF:6F:AA:BA:DA:43:0B:21:CC:E7:77:F4:7E:AC:B2:62:48:B2:FD:A3:E5:31
subject= C=TW, O=TAIWAN-CA, OU=Root CA, CN=TWCA CYBER Root CA
sha256 Fingerprint=3F:63:BB:28:14:BE:17:4E:C8:B6:43:9C:F0:8D:6D:56:F0:B7:C4:05:88:3A:56:48:A3:34:42:4D:6B:3E:C5:58
```

若 `-inform DER` 失敗（上游改送 PEM），改用 `openssl x509 -in /tmp/twca-inter.crt -out scripts/data/twca-ssl-ca.pem`，指紋仍須相同。

- [ ] **Step 2: 寫建置腳本**

Create `scripts/buildDiseaseRadar.cjs`:

```js
#!/usr/bin/env node
'use strict';

/**
 * 疾管署「健保門診及住院就診人次統計」→ LittleGuard 疫情雷達的預聚合 JSON。
 *
 * 六支 CSV 合計約 49 MB，聚合後 47 KB（gzip 12 KB），所以這份產出可以進 PWA
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
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
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

/** 往前推 n 週，跨年時回到前一年的最後一週。 */
function weeksBefore(year, week, n) {
  const out = [];
  let y = year;
  let w = week;
  for (let i = 0; i < n; i += 1) {
    w -= 1;
    if (w < 1) {
      y -= 1;
      w = 52;
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
        const rate = rateOf(index, year, week, county, age);
        const base = trendBaseOf(index, year, week, county, age);
        const nat = national[age][name].rate;
        const spark = [
          ...weeksBefore(year, week, SPARK_WEEKS - 1)
            .reverse()
            .map(([y, w]) => round1(rateOf(index, y, w, county, age))),
          round1(rate),
        ];
        out.counties[county][age][name] = {
          rate: round1(rate),
          trendBase: round1(base),
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
```

- [ ] **Step 3: 跑腳本，確認產出**

Run: `node scripts/buildDiseaseRadar.cjs`

Expected（週次會隨執行時間前進，其餘應相符）：

```
2026-W34 (2026-08-23~2026-08-29)  22 縣市 × 3 年齡層 × 6 病種  47,xxx bytes
門檻校準：P25 0.77 / P75 1.33 / P90 1.88（n=40xxx）
```

若出現 `UNABLE_TO_VERIFY_LEAF_SIGNATURE` 或 `UNABLE_TO_GET_ISSUER_CERT`，是 Step 1 的憑證沒放好——回去檢查指紋，**不要**關閉 TLS 驗證。

- [ ] **Step 4: 寫資料契約測試**

Create `src/littleguard/data/diseaseRadar.contract.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

/**
 * public/data/diseaseRadar.json 由 scripts/buildDiseaseRadar.cjs 從疾管署的
 * 六支健保門診就診人次 CSV 聚合而來。這些測試守的是「重跑管線後資料仍然可用」
 * ——上游改欄位、改端點或回傳殘缺資料時要在這裡爆掉，而不是等家長打開板才
 * 看到一片空白或一個算錯的狀態。
 */
const HERE = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(
  readFileSync(join(HERE, '../../../public/data/diseaseRadar.json'), 'utf8'),
);

const AGE_BANDS = ['0~2', '3~6', '7~12'];
const DISEASES = ['腸病毒', '手足口病', '疱疹性咽峽炎', '類流感', '腹瀉', '水痘'];

describe('diseaseRadar.json 檔頭', () => {
  it('週次格式與疫情週日期區間對得上', () => {
    expect(data.week).toMatch(/^\d{4}-W\d{2}$/);
    const start = new Date(`${data.weekStart}T00:00:00Z`);
    const end = new Date(`${data.weekEnd}T00:00:00Z`);
    // 疫情週週日起算，不是 ISO 週的週一。
    expect(start.getUTCDay()).toBe(0);
    expect((end.getTime() - start.getTime()) / 86400000).toBe(6);
  });

  it('查證日期存在且不是未來', () => {
    expect(data.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(data.verifiedOn <= new Date().toISOString().slice(0, 10)).toBe(true);
  });

  it('六支來源網址與授權都留著', () => {
    expect(data.sourceUrls).toHaveLength(6);
    data.sourceUrls.forEach((url: string) =>
      expect(url).toMatch(/^https:\/\/od\.cdc\.gov\.tw\/eic\/NHI_.+\.csv$/),
    );
    expect(data.license).toBe('政府資料開放授權條款-第1版');
  });

  it('門檻校準有樣本，且百分位單調遞增', () => {
    expect(data.calibration.sampleSize).toBeGreaterThan(10000);
    expect(data.calibration.trendP25).toBeLessThan(data.calibration.trendP75);
    expect(data.calibration.trendP75).toBeLessThan(data.calibration.trendP90);
  });
});

describe('diseaseRadar.json 格子', () => {
  const counties = Object.keys(data.counties);

  it('22 縣市 × 3 年齡層 × 6 病種齊全', () => {
    expect(counties).toHaveLength(22);
    for (const county of counties) {
      expect(Object.keys(data.counties[county]).sort()).toEqual([...AGE_BANDS].sort());
      for (const age of AGE_BANDS) {
        expect(Object.keys(data.counties[county][age]).sort()).toEqual([...DISEASES].sort());
      }
    }
  });

  it('reliability 與分母門檻一致', () => {
    for (const county of counties) {
      for (const age of AGE_BANDS) {
        for (const disease of DISEASES) {
          const cell = data.counties[county][age][disease];
          const expected =
            cell.denom >= 1000 ? 'ok' : cell.denom >= 300 ? 'small' : 'insufficient';
          expect(cell.reliability).toBe(expected);
        }
      }
    }
  });

  it('ratio 就是 rate ÷ trendBase；基線為零或資料不足時是 null', () => {
    for (const county of counties) {
      for (const age of AGE_BANDS) {
        for (const disease of DISEASES) {
          const { rate, trendBase, ratio, reliability } = data.counties[county][age][disease];
          if (reliability === 'insufficient') {
            expect(rate).toBeNull();
            expect(ratio).toBeNull();
          } else if (trendBase === null || trendBase === 0) {
            expect(ratio).toBeNull();
          } else {
            expect(ratio).toBeCloseTo(rate / trendBase, 1);
          }
        }
      }
    }
  });

  it('spark 固定 8 格，且最後一格是本週的率', () => {
    for (const county of counties) {
      for (const age of AGE_BANDS) {
        for (const disease of DISEASES) {
          const cell = data.counties[county][age][disease];
          expect(cell.spark).toHaveLength(8);
          expect(cell.spark[7]).toBe(cell.rate);
        }
      }
    }
  });
});
```

- [ ] **Step 5: 跑測試**

Run: `npx vitest run src/littleguard/data/diseaseRadar.contract.test.ts`
Expected: PASS，9 個測試。

- [ ] **Step 6: Commit**

```bash
git add scripts/buildDiseaseRadar.cjs scripts/data public/data/diseaseRadar.json src/littleguard/data/diseaseRadar.contract.test.ts
git commit -m "feat: 疫情雷達資料管線與資料契約測試"
```

---

### Task 2: 狀態判定純函式

**Files:**
- Modify: `src/types/index.ts`（檔案末端新增 LittleGuard 區塊，比照既有 LittleExplorer 區塊的做法）
- Create: `src/littleguard/utils/radar.ts`
- Test: `src/littleguard/utils/radar.test.ts`

**Interfaces:**
- Consumes: Task 1 產出的 JSON 形狀。
- Produces:
  - `RadarStatus = 'risingStrong' | 'rising' | 'steady' | 'falling' | 'none' | 'emerged' | 'smallSample' | 'insufficient'`
  - `RadarFreshness = 'fresh' | 'stale' | 'expired'`
  - `RadarCell`, `RadarData`, `RadarReliability` 型別
  - `RADAR_THRESHOLDS = { p25: 0.77, p75: 1.33, p90: 1.88 }`
  - `STATUS_COPY: Record<RadarStatus, { label: string; tone: string }>`
  - `FORBIDDEN_WORDS: readonly string[]`
  - `statusOf(cell: RadarCell): RadarStatus`
  - `freshnessOf(weekEnd: string, today?: Date): RadarFreshness`
  - `formatRate(rate: number | null): string`
  - `formatWeekRange(weekStart: string, weekEnd: string): string`

- [ ] **Step 1: 新增型別**

Append to `src/types/index.ts`:

```ts
// ============================================================
// LittleGuard（疫情雷達）
// ============================================================

/** 樣本可靠度。分母門檻見 spec §4.6：1,000 與 300。 */
export type RadarReliability = 'ok' | 'small' | 'insufficient';

export interface RadarCell {
  /** 每萬健保門診就診人次中的該病就診數。 */
  rate: number | null;
  /** 本週之前 8 週（不含本週）的 rate 中位數。 */
  trendBase: number | null;
  ratio: number | null;
  /** 本週該縣市 ÷ 全國同週。 */
  geoRatio: number | null;
  visits: number;
  denom: number;
  reliability: RadarReliability;
  /** 含本週在內的最近 8 週 rate。 */
  spark: (number | null)[];
}

export interface RadarData {
  week: string;
  weekStart: string;
  weekEnd: string;
  generatedAt: string;
  verifiedOn: string;
  source: string;
  sourceUrls: string[];
  license: string;
  diseases: string[];
  ageBands: string[];
  calibration: {
    trendP25: number;
    trendP75: number;
    trendP90: number;
    sampleSize: number;
  };
  national: Record<string, Record<string, { rate: number | null }>>;
  counties: Record<string, Record<string, Record<string, RadarCell>>>;
}
```

- [ ] **Step 2: 寫失敗的測試**

Create `src/littleguard/utils/radar.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import type { RadarCell } from '../../types';
import {
  RADAR_THRESHOLDS,
  STATUS_COPY,
  FORBIDDEN_WORDS,
  statusOf,
  freshnessOf,
  formatRate,
} from './radar';

/** 只覆寫關心的欄位，其餘給一組「分母夠大、算得出比值」的預設。 */
function cell(overrides: Partial<RadarCell>): RadarCell {
  return {
    rate: 100,
    trendBase: 100,
    ratio: 1,
    geoRatio: 1,
    visits: 20,
    denom: 2000,
    reliability: 'ok',
    spark: [null, null, null, null, null, null, null, 100],
    ...overrides,
  };
}

describe('statusOf 的邊界', () => {
  it('P90 是「最近變多，多留意」的下界，且下界本身算在內', () => {
    expect(statusOf(cell({ ratio: 1.88 }))).toBe('risingStrong');
    expect(statusOf(cell({ ratio: 1.879 }))).toBe('rising');
  });

  it('P75 是「稍微變多」的下界', () => {
    expect(statusOf(cell({ ratio: 1.33 }))).toBe('rising');
    expect(statusOf(cell({ ratio: 1.329 }))).toBe('steady');
  });

  it('P25 是「跟平常差不多」的下界', () => {
    expect(statusOf(cell({ ratio: 0.77 }))).toBe('steady');
    expect(statusOf(cell({ ratio: 0.769 }))).toBe('falling');
  });
});

describe('statusOf 的基線為零', () => {
  it('前 8 週與本週都沒有個案 → 最近沒有個案', () => {
    expect(statusOf(cell({ rate: 0, trendBase: 0, ratio: null, visits: 0 }))).toBe('none');
  });

  it('前 8 週沒有、本週開始有 → 這週開始出現，而不是無限倍', () => {
    expect(statusOf(cell({ rate: 12, trendBase: 0, ratio: null, visits: 3 }))).toBe('emerged');
  });
});

describe('statusOf 的樣本品質優先於比值', () => {
  it('分母 300–999 只標樣本偏小，不給狀態', () => {
    expect(statusOf(cell({ reliability: 'small', ratio: 3 }))).toBe('smallSample');
  });

  it('分母不足 300 是資料不足', () => {
    expect(
      statusOf(cell({ reliability: 'insufficient', rate: null, ratio: null, denom: 29 })),
    ).toBe('insufficient');
  });
});

describe('freshnessOf', () => {
  const weekEnd = '2026-08-29';

  it('14 天內是新的', () => {
    expect(freshnessOf(weekEnd, new Date('2026-09-12T00:00:00Z'))).toBe('fresh');
  });

  it('超過 14 天但不到 35 天是有點舊', () => {
    expect(freshnessOf(weekEnd, new Date('2026-09-13T00:00:00Z'))).toBe('stale');
    expect(freshnessOf(weekEnd, new Date('2026-10-03T00:00:00Z'))).toBe('stale');
  });

  it('超過 35 天要收起狀態', () => {
    expect(freshnessOf(weekEnd, new Date('2026-10-04T00:00:00Z'))).toBe('expired');
  });
});

describe('語氣', () => {
  it('八個狀態的文案都不含禁用詞', () => {
    for (const { label } of Object.values(STATUS_COPY)) {
      for (const word of FORBIDDEN_WORDS) {
        expect(label).not.toContain(word);
      }
    }
  });

  it('沒有任何狀態用到 primary-dark——那是全 app 最強的文字色', () => {
    for (const { tone } of Object.values(STATUS_COPY)) {
      expect(tone).not.toContain('primary-dark');
    }
  });

  it('狀態文案不含箭頭與驚嘆號', () => {
    for (const { label } of Object.values(STATUS_COPY)) {
      expect(label).not.toMatch(/[↑↓→!！]/);
    }
  });
});

describe('formatRate', () => {
  it('沒有率的時候給破折號，不給 0', () => {
    expect(formatRate(null)).toBe('—');
  });

  it('保留一位小數並帶單位', () => {
    expect(formatRate(169)).toBe('169.0/萬');
  });
});

describe('門檻常數', () => {
  it('與 spec §4.5 的百分位一致', () => {
    expect(RADAR_THRESHOLDS).toEqual({ p25: 0.77, p75: 1.33, p90: 1.88 });
  });
});
```

- [ ] **Step 3: 跑測試確認失敗**

Run: `npx vitest run src/littleguard/utils/radar.test.ts`
Expected: FAIL，`Failed to resolve import "./radar"`。

- [ ] **Step 4: 寫實作**

Create `src/littleguard/utils/radar.ts`:

```ts
import type { RadarCell } from '../../types';

/**
 * 疫情雷達的狀態判定。
 *
 * 這個服務的用途是提醒家長多留意，不是製造焦慮，所以這裡有兩條硬規則：
 *
 * 1. 文案用「跟平常比」的日常說法。禁用詞見 FORBIDDEN_WORDS，radar.test.ts
 *    會逐條檢查。
 * 2. 顏色最強只到 butter-dark。不用 primary-dark——那是全 app 最強的文字色，
 *    用在「比平常多一點」上會讀成急診警報。
 *
 * 門檻不是手感，是實測分布的百分位：以「本週 ÷ 前 8 週中位數」為基準，近 3 年
 * 40,040 個樣本的 P25/P75/P90 分別是 0.77 / 1.33 / 1.88（中位數 1.01）。
 * 曾經考慮過的「前 5 年同週中位數」被否決，因為 2020-2022 的防疫措施讓腸病毒
 * 幾乎消失，那個基線下 ratio 的中位數是 1.63，門檻怎麼訂都會全年亮燈。
 */

export type RadarStatus =
  | 'risingStrong'
  | 'rising'
  | 'steady'
  | 'falling'
  | 'none'
  | 'emerged'
  | 'smallSample'
  | 'insufficient';

export type RadarFreshness = 'fresh' | 'stale' | 'expired';

export const RADAR_THRESHOLDS = { p25: 0.77, p75: 1.33, p90: 1.88 } as const;

/** 資料超過兩個更新週期沒進來就標註，超過五週就收起狀態。 */
export const FRESHNESS_DAYS = { stale: 14, expired: 35 } as const;

export const FORBIDDEN_WORDS = [
  '警戒',
  '升溫',
  '爆發',
  '危險',
  '疫情嚴峻',
  '拉警報',
  '慎防',
] as const;

export const STATUS_COPY: Record<RadarStatus, { label: string; tone: string }> = {
  risingStrong: { label: '最近變多，多留意', tone: 'text-butter-dark' },
  rising: { label: '稍微變多', tone: 'text-ink' },
  steady: { label: '跟平常差不多', tone: 'text-ink-muted' },
  falling: { label: '比平常少', tone: 'text-mint-dark' },
  none: { label: '最近沒有個案', tone: 'text-ink-faint' },
  emerged: { label: '這週開始出現', tone: 'text-ink' },
  smallSample: { label: '樣本偏小，僅供參考', tone: 'text-ink-faint' },
  insufficient: { label: '資料不足', tone: 'text-ink-faint' },
};

/**
 * 樣本品質先於比值：分母不到 1,000 時，ratio 的離散度（P90−P10）從 1.20 跳到
 * 2.75 以上，而分母低於 1,000 有超過十分之一的週是零例，比值沒有意義。
 */
export function statusOf(cell: RadarCell): RadarStatus {
  if (cell.reliability === 'insufficient') return 'insufficient';
  if (cell.reliability === 'small') return 'smallSample';
  if (cell.trendBase === null || cell.trendBase === 0) {
    return (cell.rate ?? 0) > 0 ? 'emerged' : 'none';
  }
  const ratio = cell.ratio;
  if (ratio === null) return 'steady';
  if (ratio >= RADAR_THRESHOLDS.p90) return 'risingStrong';
  if (ratio >= RADAR_THRESHOLDS.p75) return 'rising';
  if (ratio >= RADAR_THRESHOLDS.p25) return 'steady';
  return 'falling';
}

export function freshnessOf(weekEnd: string, today: Date = new Date()): RadarFreshness {
  const end = new Date(`${weekEnd}T00:00:00Z`);
  const days = Math.floor(
    (Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) - end.getTime()) /
      86400000,
  );
  if (days > FRESHNESS_DAYS.expired) return 'expired';
  if (days > FRESHNESS_DAYS.stale) return 'stale';
  return 'fresh';
}

export function formatRate(rate: number | null): string {
  return rate === null ? '—' : `${rate.toFixed(1)}/萬`;
}

/** 「8/23–8/29」：家長看得懂日期，看不懂「第 34 週」。 */
export function formatWeekRange(weekStart: string, weekEnd: string): string {
  const short = (iso: string) => {
    const [, m, d] = iso.split('-');
    return `${Number(m)}/${Number(d)}`;
  };
  return `${short(weekStart)}–${short(weekEnd)}`;
}
```

- [ ] **Step 5: 跑測試確認通過**

Run: `npx vitest run src/littleguard/utils/radar.test.ts`
Expected: PASS，16 個測試。

- [ ] **Step 6: 加校準測試**

Append to `src/littleguard/utils/radar.test.ts`:

```ts
describe('門檻與 shipped 資料的校準', () => {
  it('程式碼常數沒有跟資料分布漂開', () => {
    // 動態 import 避開 vitest 的 happy-dom 環境對 node:fs 的限制順序問題。
    const data = JSON.parse(
      readFileSync(join(HERE, '../../../public/data/diseaseRadar.json'), 'utf8'),
    );
    expect(Math.abs(data.calibration.trendP25 - RADAR_THRESHOLDS.p25)).toBeLessThanOrEqual(0.05);
    expect(Math.abs(data.calibration.trendP75 - RADAR_THRESHOLDS.p75)).toBeLessThanOrEqual(0.05);
    expect(Math.abs(data.calibration.trendP90 - RADAR_THRESHOLDS.p90)).toBeLessThanOrEqual(0.05);
  });
});
```

並在該檔最上方補上這三行 import：

```ts
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
```

- [ ] **Step 7: 跑測試並 commit**

Run: `npx vitest run src/littleguard/utils/radar.test.ts`
Expected: PASS，17 個測試。

```bash
git add src/types/index.ts src/littleguard/utils/radar.ts src/littleguard/utils/radar.test.ts
git commit -m "feat: 疫情雷達狀態判定與語氣約束"
```

---

### Task 3: 服務骨架

**Files:**
- Modify: `src/types/routes.ts:43`（`babyoasis` 之後新增一筆）
- Modify: `src/common/ui/serviceTheme.ts:2`（icon import）、`:20-25`（`ServiceId`）、`:59-132`（`SERVICE_THEME`）、`:138-144`（`SERVICE_ORDER`）
- Modify: `src/common/routePolicy.ts:1-3`（改為 import `ServiceId`）、`:23-33`（`PUBLIC_PAGES`）、`:40-47`（`serviceOf`）、`:50-56`（`SERVICE_HOME`）
- Modify: `tailwind.config.js`（`outing` ramp 之後新增 `guard`）
- Modify: `src/common/landing/HubLanding.tsx:46-60`（`SERVICE_FEATURES`）
- Modify: `src/common/seo/pageMeta.ts:120-124` 之後（新增 `littleguard`）
- Modify: `src/App.tsx:37` 附近（lazy import）、`:185-187`（`isStandaloneSubApp`）、`:483-484`（route）
- Test: `src/common/routePolicy.test.ts`、`src/App.routing.test.tsx`、`src/common/landing/HubLanding.test.tsx`（各補一筆）

**Interfaces:**
- Consumes: 無。
- Produces: 路由 `/littleguard`、`ServiceId` 多一個 `'littleguard'`、`SERVICE_THEME.littleguard`、Tailwind 的 `guard-*` token。Task 4 消費全部。

- [ ] **Step 1: 加 Tailwind ramp**

In `tailwind.config.js`, after the `outing` ramp:

```js
        // LittleGuard（疫情雷達）。靖藍：不撞 secondary 的天藍（BabyOasis）
        // 也不撞 outing 的青綠。對比值對 warm-white #FDFBF7 實算：
        // DEFAULT 2.10:1（與 outing DEFAULT 同級，只當填色永不承載文字）、
        // ink 5.48:1（白字在其上 5.66:1，可當按鈕與 active chip 的實色底）、
        // deep 7.68:1（hover 與邊框）。
        guard: {
          DEFAULT: '#A8ADDB',
          light: '#E4E6F5',
          soft: '#F3F4FB',
          ink: '#5A61A8',
          deep: '#474C86',
        },
```

- [ ] **Step 2: 加路由**

In `src/types/routes.ts`, after line 43 (`babyoasis: '/babyoasis',`):

```ts
  littleguard: '/littleguard',
```

- [ ] **Step 3: 加服務主題**

In `src/common/ui/serviceTheme.ts` line 2, extend the icon import:

```ts
import { Baby, Flower2, MapPin, ShieldAlert, Sun, Trees } from 'lucide-react';
```

Extend `ServiceId`:

```ts
export type ServiceId =
  | 'littlesteps'
  | 'littlebloom'
  | 'littleexplorer'
  | 'babyoasis'
  | 'littleouting'
  | 'littleguard';
```

Add to `SERVICE_THEME`, after `littleouting`:

```ts
  littleguard: {
    id: 'littleguard',
    name: 'LittleGuard',
    role: '疫情雷達',
    icon: ShieldAlert,
    pageBg: 'bg-warm-white',
    tint: 'bg-guard-soft',
    accent: 'bg-guard',
    ink: 'text-guard-ink',
    fill: 'bg-guard-ink',
    fillText: 'text-white',
    body: 'text-ink',
    muted: 'text-ink-muted',
  },
```

Add to `SERVICE_ORDER`, last（兩個「能去哪」的服務之後，因為它跟階段無關而是隨時可查）：

```ts
export const SERVICE_ORDER: ServiceId[] = [
  'littlebloom',
  'littlesteps',
  'littleexplorer',
  'littleouting',
  'babyoasis',
  'littleguard',
];
```

- [ ] **Step 4: 改 routePolicy，並刪掉第二份 ServiceId**

Replace `src/common/routePolicy.ts` lines 1-3 with:

```ts
import type { Page } from '../types/routes';
// ServiceId 原本在這裡另寫一份，於是加一個服務要改兩處且必須手動同步。
// 主題那份是真正被 UI 讀的，這裡改成引用它。
export type { ServiceId } from './ui/serviceTheme';
import type { ServiceId } from './ui/serviceTheme';
```

Add to `PUBLIC_PAGES`, after `babyoasis: true,`:

```ts
  // 就診統計是政府公開資料的整理，不讀任何孩子的資料。
  littleguard: true,
```

Add to `serviceOf`, **before** the final `return 'babyoasis'`:

```ts
  if (page === 'littleguard') return 'littleguard';
```

Add to `SERVICE_HOME`:

```ts
  littleguard: 'littleguard',
```

- [ ] **Step 5: 加首頁文案與 SEO**

In `src/common/landing/HubLanding.tsx`, add to `SERVICE_FEATURES`:

```ts
  littleguard: [
    '六種兒童常見傳染病，看你所在縣市',
    '跟前 8 週比，這週有沒有變多',
    '資料來自疾管署健保門診統計，每週更新',
  ],
```

In `src/common/seo/pageMeta.ts`, after the `babyoasis` entry:

```ts
  littleguard: {
    title: '兒童傳染病這週多不多｜疫情雷達｜LittleGuard',
    description:
      '腸病毒、手足口病、疱疹性咽峽炎、類流感、腹瀉、水痘的每週門診就診情況，可依縣市與孩子年齡查看，資料來自衛福部疾管署開放資料。',
  },
```

- [ ] **Step 6: 接進 App.tsx**

Add the lazy import beside the other standalone sub-apps (near line 37):

```tsx
const RadarPage = lazy(() => import('./littleguard/pages/RadarPage'));
```

Extend `isStandaloneSubApp` (line 185-187):

```tsx
    currentPage === 'littleouting' ||
    currentPage === 'babyoasis' ||
    currentPage === 'littleguard';
```

Add the route beside the others (line 483-484):

```tsx
        {currentPage === 'littleguard' && <RadarPage />}
```

- [ ] **Step 7: 補既有測試**

`src/common/routePolicy.test.ts` — add to whichever `it` enumerates public pages:

```ts
    expect(requiresAuth('littleguard')).toBe(false);
    expect(serviceOf('littleguard')).toBe('littleguard');
```

`src/App.routing.test.tsx` — add to the path round-trip table:

```ts
    expect(pageFromPath('/littleguard')).toBe('littleguard');
    expect(pageFromPath('/littleguard/')).toBe('littleguard');
```

`src/common/landing/HubLanding.test.tsx` — add:

```ts
    expect(screen.getByText('LittleGuard')).toBeInTheDocument();
    expect(screen.getByText('疫情雷達')).toBeInTheDocument();
```

- [ ] **Step 8: 建一個最小的 RadarPage 讓它編得過**

Create `src/littleguard/pages/RadarPage.tsx`:

```tsx
import AppBar from '../../common/ui/AppBar';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';

/** Task 4 會把板長出來；這一步只讓路由與骨架編得過並可實際打開。 */
export default function RadarPage() {
  const theme = SERVICE_THEME.littleguard;
  return (
    <div className={`screen ${theme.pageBg}`}>
      <AppBar theme={theme} title={theme.name} subtitle={theme.role} />
      <div className="screen-body" />
    </div>
  );
}
```

`AppBar` 的簽章已確認（`src/common/ui/AppBar.tsx:27-33`）：`{ theme: ServiceTheme; title: string; subtitle?: string; backTo?: Page }`，**`theme` 是必填**。它是這個 repo 唯一的頁面標頭，不要自造第二個。

- [ ] **Step 9: 驗證並 commit**

Run:
```bash
npm run build
npm run lint
npx vitest run
```
Expected: 全部通過。`/littleguard` 在 `npm run dev` 下可直接輸入網址進入，未登入也看得到。

```bash
git add src/types/routes.ts src/common/ui/serviceTheme.ts src/common/routePolicy.ts tailwind.config.js src/common/landing/HubLanding.tsx src/common/seo/pageMeta.ts src/App.tsx src/littleguard/pages/RadarPage.tsx src/common/routePolicy.test.ts src/App.routing.test.tsx src/common/landing/HubLanding.test.tsx
git commit -m "feat: 加入第六個服務 LittleGuard 的骨架與靖藍配色"
```

---

### Task 4: 板與縣市／年齡層選擇

**Files:**
- Create: `src/littleguard/data/countyCentroids.ts`
- Create: `src/littleguard/components/DiseaseRow.tsx`
- Create: `src/littleguard/components/CountyPicker.tsx`
- Modify: `src/littleguard/pages/RadarPage.tsx`（改寫 Task 3 的最小版）
- Test: `src/littleguard/pages/RadarPage.test.tsx`

**Interfaces:**
- Consumes: `RadarData` / `RadarCell` from `src/types`；`statusOf` / `STATUS_COPY` / `formatRate` / `formatWeekRange` / `freshnessOf` from `../utils/radar`；`SERVICE_THEME.littleguard`。
- Produces: `COUNTY_CENTROIDS: { name: string; lat: number; lon: number }[]`、`nearestCounty(lat, lon): string`、`DiseaseRow`、`CountyPicker`、`RadarPage`（default export）。

- [ ] **Step 1: 縣市中心點**

Create `src/littleguard/data/countyCentroids.ts`:

```ts
/**
 * 22 縣市的代表座標，只用來把 geolocation 的一個點對到一個縣市名。
 *
 * 刻意不做 geocoding：本 repo 已經測試並否決過台灣地址的 geocoding（見
 * README 的 LittleOuting 段），而這裡需要的精度只有「哪一縣市」。座標取各縣
 * 市政府所在地，誤差不影響最近縣市的判斷。
 *
 * 縣市名必須與 diseaseRadar.json 的 key 完全一致（上游用「台北市」而非
 * 「臺北市」），contract 測試會比對。
 */
export const COUNTY_CENTROIDS: { name: string; lat: number; lon: number }[] = [
  { name: '基隆市', lat: 25.1276, lon: 121.7392 },
  { name: '台北市', lat: 25.0375, lon: 121.5637 },
  { name: '新北市', lat: 25.0169, lon: 121.4627 },
  { name: '桃園市', lat: 24.9937, lon: 121.297 },
  { name: '新竹市', lat: 24.8039, lon: 120.9647 },
  { name: '新竹縣', lat: 24.8387, lon: 121.0177 },
  { name: '苗栗縣', lat: 24.5602, lon: 120.8214 },
  { name: '台中市', lat: 24.1477, lon: 120.6736 },
  { name: '彰化縣', lat: 24.0752, lon: 120.5443 },
  { name: '南投縣', lat: 23.9609, lon: 120.9718 },
  { name: '雲林縣', lat: 23.7092, lon: 120.4313 },
  { name: '嘉義市', lat: 23.4801, lon: 120.4491 },
  { name: '嘉義縣', lat: 23.4518, lon: 120.2555 },
  { name: '台南市', lat: 22.9999, lon: 120.2269 },
  { name: '高雄市', lat: 22.6273, lon: 120.3014 },
  { name: '屏東縣', lat: 22.5519, lon: 120.5487 },
  { name: '台東縣', lat: 22.7583, lon: 121.1444 },
  { name: '花蓮縣', lat: 23.9872, lon: 121.6015 },
  { name: '宜蘭縣', lat: 24.7021, lon: 121.7378 },
  { name: '澎湖縣', lat: 23.5711, lon: 119.5793 },
  { name: '金門縣', lat: 24.4321, lon: 118.3171 },
  { name: '連江縣', lat: 26.1608, lon: 119.9494 },
];

/** 平面近似就夠：縣市尺度下不需要大圓距離。 */
export function nearestCounty(lat: number, lon: number): string {
  let best = COUNTY_CENTROIDS[0];
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const county of COUNTY_CENTROIDS) {
    const dLat = county.lat - lat;
    const dLon = (county.lon - lon) * Math.cos((lat * Math.PI) / 180);
    const distance = dLat * dLat + dLon * dLon;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = county;
    }
  }
  return best.name;
}
```

- [ ] **Step 2: 一列疾病**

Create `src/littleguard/components/DiseaseRow.tsx`:

```tsx
import { motion } from 'framer-motion';
import type { RadarCell } from '../../types';
import { listItem } from '../../common/ui/motion';
import { STATUS_COPY, formatRate, statusOf } from '../utils/radar';

interface Props {
  disease: string;
  cell: RadarCell;
  /** 資料過期時只留數字，不顯示可能已經錯的狀態。 */
  showStatus: boolean;
  onOpen: () => void;
}

/**
 * 一種病一列。狀態是文字不是圖示：文案本身已經帶方向（變多／差不多／比平常
 * 少），再加一個箭頭只是把同一件事說兩次，而並排的上升箭頭本身就是警報視覺。
 */
export default function DiseaseRow({ disease, cell, showStatus, onOpen }: Props) {
  const status = statusOf(cell);
  const copy = STATUS_COPY[status];
  return (
    <motion.button
      type="button"
      variants={listItem}
      onClick={onOpen}
      className="card-tap w-full min-h-tap flex items-center justify-between gap-3 text-left"
    >
      <span className="text-ink font-medium">{disease}</span>
      <span className="flex items-baseline gap-3">
        {showStatus && <span className={`text-sm ${copy.tone}`}>{copy.label}</span>}
        <span className="text-ink tabular-nums">{formatRate(cell.rate)}</span>
        <span className="text-ink-faint text-sm tabular-nums">{cell.visits} 人次</span>
      </span>
    </motion.button>
  );
}
```

- [ ] **Step 3: 縣市與年齡層選擇**

Create `src/littleguard/components/CountyPicker.tsx`:

```tsx
import { LocateFixed } from 'lucide-react';
import { useCentreSelectedChip } from '../../common/ui/useCentreSelectedChip';
import { useToast } from '../../common/ui/toast';
import { nearestCounty } from '../data/countyCentroids';

interface Props {
  counties: string[];
  selected: string;
  onSelect: (county: string) => void;
}

/**
 * 22 顆縣市 chip 加一顆定位。全 repo 沒有偏好持久化機制，所以每次進來都要選
 * 一次——定位鈕把它縮成一次點擊。失敗一律出 toast，不靜默（比照 BabyOasis）。
 */
export default function CountyPicker({ counties, selected, onSelect }: Props) {
  const { scrollerRef, selectedRef } = useCentreSelectedChip(selected);
  // toast 是 hook 而不是 module 級別的物件（src/common/ui/toast.tsx:102）。
  const toast = useToast();

  const locate = () => {
    if (!('geolocation' in navigator)) {
      toast.show('您的瀏覽器不支援定位功能');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const county = nearestCounty(position.coords.latitude, position.coords.longitude);
        if (counties.includes(county)) onSelect(county);
        else toast.show('找不到你所在縣市的資料');
      },
      () => toast.show('沒辦法取得位置，請直接選縣市'),
    );
  };

  return (
    <div className="flex items-center gap-2">
      <div ref={scrollerRef} className="flex gap-2 overflow-x-auto scrollbar-hide row-bleed">
        {counties.map((county) => (
          <button
            key={county}
            ref={county === selected ? selectedRef : undefined}
            type="button"
            onClick={() => onSelect(county)}
            className={`chip ${county === selected ? 'chip-on' : ''}`}
          >
            {county}
          </button>
        ))}
      </div>
      <button type="button" onClick={locate} aria-label="用目前位置選縣市" className="btn-icon">
        <LocateFixed className="w-5 h-5" aria-hidden />
      </button>
    </div>
  );
}
```

`LocateFixed` 若不在 `src/common/lucideIcons.ts` 的白名單裡不必補——那份白名單是給「以字串指名圖示」的資料檔用的，直接 import 的元件不受它管（`BabyOasisPage.tsx` 就是直接 import）。

- [ ] **Step 4: 寫頁面測試**

Create `src/littleguard/pages/RadarPage.test.tsx`:

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RadarCell, RadarData } from '../../types';
import RadarPage from './RadarPage';

function cell(overrides: Partial<RadarCell> = {}): RadarCell {
  return {
    rate: 100,
    trendBase: 100,
    ratio: 1,
    geoRatio: 1,
    visits: 20,
    denom: 2000,
    reliability: 'ok',
    spark: [10, 20, 30, 40, 50, 60, 70, 100],
    ...overrides,
  };
}

const DISEASES = ['腸病毒', '手足口病', '疱疹性咽峽炎', '類流感', '腹瀉', '水痘'];

function fixture(weekEnd = '2026-08-29'): RadarData {
  const perDisease = (factory: (name: string) => RadarCell) =>
    Object.fromEntries(DISEASES.map((name) => [name, factory(name)]));
  return {
    week: '2026-W34',
    weekStart: '2026-08-23',
    weekEnd,
    generatedAt: '2026-09-03T01:00:00.000Z',
    verifiedOn: '2026-09-03',
    source: '衛生福利部疾病管制署 健保門診及住院就診人次統計',
    sourceUrls: DISEASES.map((_, i) => `https://od.cdc.gov.tw/eic/NHI_${i}.csv`),
    license: '政府資料開放授權條款-第1版',
    diseases: DISEASES,
    ageBands: ['0~2', '3~6', '7~12'],
    calibration: { trendP25: 0.77, trendP75: 1.33, trendP90: 1.88, sampleSize: 40040 },
    national: {
      '0~2': perDisease(() => ({ rate: 100 })) as never,
      '3~6': perDisease(() => ({ rate: 100 })) as never,
      '7~12': perDisease(() => ({ rate: 100 })) as never,
    },
    counties: {
      花蓮縣: {
        '0~2': perDisease(() => cell()),
        // 腸病毒 ratio 2.13 → 最近變多；水痘基線為零 → 最近沒有個案
        '3~6': perDisease((name) =>
          name === '腸病毒'
            ? cell({ rate: 169, trendBase: 79.4, ratio: 2.13, visits: 35 })
            : name === '水痘'
              ? cell({ rate: 0, trendBase: 0, ratio: null, visits: 0 })
              : cell(),
        ),
        '7~12': perDisease(() => cell()),
      },
      連江縣: {
        '0~2': perDisease(() =>
          cell({ rate: null, trendBase: null, ratio: null, visits: 0, denom: 11, reliability: 'insufficient' }),
        ),
        '3~6': perDisease(() => cell({ denom: 500, reliability: 'small' })),
        '7~12': perDisease(() => cell()),
      },
    },
  };
}

function mockFetch(data: RadarData | null) {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      data
        ? Promise.resolve({ ok: true, json: () => Promise.resolve(data) })
        : Promise.resolve({ ok: false, status: 404 }),
    ),
  );
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(new Date('2026-09-03T00:00:00Z'));
});

describe('疫情雷達板', () => {
  it('六種病都在，順序固定不隨狀態重排', async () => {
    mockFetch(fixture());
    render(<RadarPage />);
    await waitFor(() => expect(screen.getByText('腸病毒')).toBeInTheDocument());
    const rows = screen.getAllByRole('button').map((b) => b.textContent ?? '');
    const order = DISEASES.map((d) => rows.findIndex((t) => t.startsWith(d)));
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it('顯示疫情週的日期區間而不是週號', async () => {
    mockFetch(fixture());
    render(<RadarPage />);
    await waitFor(() => expect(screen.getByText(/8\/23–8\/29/)).toBeInTheDocument());
    expect(screen.queryByText(/第 ?34 ?週/)).not.toBeInTheDocument();
  });

  it('切換年齡層會換掉狀態文案', async () => {
    mockFetch(fixture());
    render(<RadarPage />);
    await waitFor(() => expect(screen.getByText('腸病毒')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: '3-6 歲' }));
    expect(screen.getByText('最近變多，多留意')).toBeInTheDocument();
    expect(screen.getByText('最近沒有個案')).toBeInTheDocument();
  });

  it('樣本偏小與資料不足都據實顯示', async () => {
    mockFetch(fixture());
    render(<RadarPage />);
    await waitFor(() => expect(screen.getByText('腸病毒')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: '連江縣' }));
    expect(screen.getAllByText('資料不足').length).toBe(6);
    await userEvent.click(screen.getByRole('button', { name: '3-6 歲' }));
    expect(screen.getAllByText('樣本偏小，僅供參考').length).toBe(6);
  });

  it('資料超過一個月就收起狀態，只留數字', async () => {
    mockFetch(fixture('2026-07-01'));
    render(<RadarPage />);
    await waitFor(() => expect(screen.getByText('腸病毒')).toBeInTheDocument());
    expect(screen.getByText(/超過一個月沒更新/)).toBeInTheDocument();
    expect(screen.queryByText('跟平常差不多')).not.toBeInTheDocument();
  });

  it('抓不到資料時給得出下一步，不是空白', async () => {
    mockFetch(null);
    render(<RadarPage />);
    await waitFor(() => expect(screen.getByText(/現在抓不到資料/)).toBeInTheDocument());
  });

  it('畫面上沒有箭頭或驚嘆號', async () => {
    mockFetch(fixture());
    const { container } = render(<RadarPage />);
    await waitFor(() => expect(screen.getByText('腸病毒')).toBeInTheDocument());
    expect(container.textContent ?? '').not.toMatch(/[↑↓→!！]/);
  });
});
```

- [ ] **Step 5: 跑測試確認失敗**

Run: `npx vitest run src/littleguard/pages/RadarPage.test.tsx`
Expected: FAIL（Task 3 的最小 RadarPage 沒有任何內容）。

- [ ] **Step 6: 改寫 RadarPage**

Replace `src/littleguard/pages/RadarPage.tsx`:

```tsx
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import AppBar from '../../common/ui/AppBar';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { stagger } from '../../common/ui/motion';
import { useCentreSelectedChip } from '../../common/ui/useCentreSelectedChip';
import type { RadarData } from '../../types';
import CountyPicker from '../components/CountyPicker';
import DiseaseRow from '../components/DiseaseRow';
import { formatWeekRange, freshnessOf } from '../utils/radar';

const AGE_LABEL: Record<string, string> = {
  '0~2': '0-2 歲',
  '3~6': '3-6 歲',
  '7~12': '7-12 歲',
};

const NIDSS = 'https://nidss.cdc.gov.tw/';

/**
 * 疫情雷達：一頁、板優先、免打字。
 *
 * 語氣是這一頁最重要的約束——它要讓家長多留意，不是讓家長緊張。所以：卡片順
 * 序固定（不把「變多」排到最前面，那會讓每次打開都像在看壞消息排行榜）、狀態
 * 是文字不是箭頭、顏色最強只到 butter-dark、資料過期就收起狀態而不是顯示一個
 * 可能已經錯的判斷。
 */
export default function RadarPage() {
  const theme = SERVICE_THEME.littleguard;
  const [data, setData] = useState<RadarData | null>(null);
  const [failed, setFailed] = useState(false);
  const [county, setCounty] = useState('台北市');
  const [age, setAge] = useState('0~2');
  const [open, setOpen] = useState<string | null>(null);
  const { scrollerRef, selectedRef } = useCentreSelectedChip(age);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/diseaseRadar.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<RadarData>;
      })
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  const counties = useMemo(() => (data ? Object.keys(data.counties) : []), [data]);
  const freshness = data ? freshnessOf(data.weekEnd) : 'fresh';
  const cells = data?.counties[county]?.[age];

  if (failed || (data && !cells)) {
    return (
      <div className={`screen ${theme.pageBg}`}>
        <AppBar theme={theme} title={theme.name} subtitle={theme.role} />
        <div className="screen-body">
          <EmptyState
            theme={theme}
            title="現在抓不到資料"
            description="可以先看疾管署的傳染病統計查詢系統。"
            action={{
              label: '前往疾管署',
              onClick: () => window.open(NIDSS, '_blank', 'noreferrer'),
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`screen ${theme.pageBg}`}>
      <AppBar theme={theme} title={theme.name} subtitle={theme.role} />
      <div className="screen-body space-y-4">
        <p className="text-sm text-ink-muted">
          {data ? `${formatWeekRange(data.weekStart, data.weekEnd)} · 疾管署健保門診就診統計` : '載入中'}
        </p>

        {freshness === 'stale' && data && (
          <p className={`panel text-sm ${theme.body}`}>
            這份資料有點舊了，最新一週是 {formatWeekRange(data.weekStart, data.weekEnd)}。
          </p>
        )}
        {freshness === 'expired' && (
          <p className={`panel text-sm ${theme.body}`}>
            這份資料超過一個月沒更新，最新情況請看{' '}
            <a href={NIDSS} className={theme.ink} target="_blank" rel="noreferrer">
              疾管署
            </a>
            。
          </p>
        )}

        {data && (
          <>
            <CountyPicker counties={counties} selected={county} onSelect={setCounty} />
            <div ref={scrollerRef} className="flex gap-2 overflow-x-auto scrollbar-hide row-bleed">
              {data.ageBands.map((band) => (
                <button
                  key={band}
                  ref={band === age ? selectedRef : undefined}
                  type="button"
                  onClick={() => setAge(band)}
                  className={`chip ${band === age ? 'chip-on' : ''}`}
                >
                  {AGE_LABEL[band] ?? band}
                </button>
              ))}
            </div>

            <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-2">
              {data.diseases.map((disease) => (
                <DiseaseRow
                  key={disease}
                  disease={disease}
                  cell={cells![disease]}
                  showStatus={freshness !== 'expired'}
                  onOpen={() => setOpen(disease)}
                />
              ))}
            </motion.div>

            <p className="text-sm text-ink-faint">
              這是健保門診的就診人次，用來提醒你多留意；它不是確診數，也不代表你的孩子會生病。身體不舒服請看醫生。
            </p>
          </>
        )}
      </div>
      {/* 抽屜在 Task 5 接上；open 先保留狀態，避免那一步又動這支檔案的結構。 */}
      {open && null}
    </div>
  );
}
```

`EmptyState` 的簽章已確認（`src/common/ui/EmptyState.tsx:19-26`）：`{ theme: ServiceTheme; title: string; description?: string; action?: { label: string; onClick: () => void }; icon?: LucideIcon }`。**`action` 只吃 `onClick`，沒有 `href`**，所以外連要用 `window.open`；`icon` 留空（這個空狀態不值得慶祝，不畫圖示）。

- [ ] **Step 7: 跑測試並在 390px 實際看過**

Run: `npx vitest run src/littleguard/pages/RadarPage.test.tsx`
Expected: PASS，7 個測試。

Run `npm run dev`，在 390px 寬度打開 `/littleguard`，確認：六張卡、兩排 chip 可橫向滑、定位鈕 ≥ 44px、畫面上沒有紅色系文字與箭頭。

- [ ] **Step 8: Commit**

```bash
git add src/littleguard
git commit -m "feat: 疫情雷達的板、縣市與年齡層選擇"
```

---

### Task 5: 抽屜與病種說明

**Files:**
- Create: `src/littleguard/data/diseases.ts`
- Create: `src/littleguard/components/DiseaseDrawer.tsx`
- Create: `src/littleguard/components/Sparkline.tsx`
- Modify: `src/littleguard/pages/RadarPage.tsx`（把 `{open && null}` 換成抽屜）
- Test: `src/littleguard/data/diseases.test.ts`

**Interfaces:**
- Consumes: `RadarCell`、`RadarData`、`statusOf`、`STATUS_COPY`、`formatRate`。
- Produces: `DISEASE_INFO: Record<string, DiseaseInfo>`、`DiseaseInfo` 型別、`DiseaseDrawer`、`Sparkline`。

- [ ] **Step 1: 病種說明資料**

Create `src/littleguard/data/diseases.ts`。六筆的 `meaning` / `actions` / `seeDoctor` 必須逐筆對照下列已查證的疾管署頁面後撰寫（2026-09-03 查證，七個網址皆回 200），**不得憑記憶**：

```ts
export interface DiseaseInfo {
  /** 這個病名在上游資料裡指的是什麼——名稱落差要說清楚，不能讓人以為是確診數。 */
  meaning: string;
  /** 平常做得到的事，至少兩條。這是「提醒而不是製造焦慮」的資料層保證。 */
  actions: string[];
  /** 什麼情況要看醫生。不寫治療方式。 */
  seeDoctor: string;
  sourceUrl: string;
  /** 補充 Q&A，沒有就省略。 */
  qaUrl?: string;
  verifiedOn: string;
}

/**
 * 六種病的家長向說明。
 *
 * 上游 dataset 名稱與疾管署的疾病介紹並不是一對一，這裡的 `meaning` 就是用來
 * 說清楚落差的：
 *
 * - 板上的「腸病毒」是所有腸病毒門診就診，而疾管署的疾病介紹是法定傳染病
 *   「腸病毒感染併發重症」，只涵蓋重症。
 * - 「手足口病」與「疱疹性咽峽炎」在疾管署傳染病介紹索引裡沒有獨立條目，它們
 *   是腸病毒的臨床表現，所以引用頁同腸病毒。
 * - 「類流感」是症候群定義（發燒加呼吸道症狀），不等於流感確診。
 * - 「腹瀉」的病因不限病毒，病毒性腸胃炎只是主要病因之一。
 * - 「水痘」板上是所有水痘門診，引用頁是法定傳染病「水痘併發症」。
 */
export const DISEASE_INFO: Record<string, DiseaseInfo> = {
  腸病毒: {
    meaning: '', // 待填
    actions: [], // 待填，至少兩條
    seeDoctor: '', // 待填
    sourceUrl: 'https://www.cdc.gov.tw/Disease/SubIndex/m3zdUk3u9GJVvddeSnhkiA',
    qaUrl: 'https://www.cdc.gov.tw/Category/QAPage/uWGc1UXjKbX7uC1uTG5_2Q',
    verifiedOn: '2026-09-03',
  },
  手足口病: {
    meaning: '',
    actions: [],
    seeDoctor: '',
    sourceUrl: 'https://www.cdc.gov.tw/Disease/SubIndex/m3zdUk3u9GJVvddeSnhkiA',
    qaUrl: 'https://www.cdc.gov.tw/Category/QAPage/uWGc1UXjKbX7uC1uTG5_2Q',
    verifiedOn: '2026-09-03',
  },
  疱疹性咽峽炎: {
    meaning: '',
    actions: [],
    seeDoctor: '',
    sourceUrl: 'https://www.cdc.gov.tw/Disease/SubIndex/m3zdUk3u9GJVvddeSnhkiA',
    qaUrl: 'https://www.cdc.gov.tw/Category/QAPage/uWGc1UXjKbX7uC1uTG5_2Q',
    verifiedOn: '2026-09-03',
  },
  類流感: {
    meaning: '',
    actions: [],
    seeDoctor: '',
    sourceUrl: 'https://www.cdc.gov.tw/Disease/SubIndex/x7jzGIMMuIeuLM5izvwg_g',
    qaUrl: 'https://www.cdc.gov.tw/Category/QAPage/DQWXG19u2cXMH1jwGKXHug',
    verifiedOn: '2026-09-03',
  },
  腹瀉: {
    meaning: '',
    actions: [],
    seeDoctor: '',
    sourceUrl: 'https://www.cdc.gov.tw/Disease/SubIndex/j1rqZjBCeR9vtCRUHefN3g',
    qaUrl: 'https://www.cdc.gov.tw/Category/QAPage/h5jfdG8vi3tGUDO8fNAoFQ',
    verifiedOn: '2026-09-03',
  },
  水痘: {
    meaning: '',
    actions: [],
    seeDoctor: '',
    sourceUrl: 'https://www.cdc.gov.tw/Disease/SubIndex/ipoIA74yjikLAewcRSjXjw',
    verifiedOn: '2026-09-03',
  },
};
```

撰寫時的語氣約束（違反就是這個服務的失敗）：`actions` 是家長今天就做得到的事（例如洗手時機、玩具與餐具怎麼清、生病時不上學不上課），不是醫療處置；`seeDoctor` 只列可觀察的徵象，不寫治療；全部不得出現禁用詞。

- [ ] **Step 2: 資料測試**

Create `src/littleguard/data/diseases.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { DISEASE_INFO } from './diseases';
import { FORBIDDEN_WORDS } from '../utils/radar';

const DISEASES = ['腸病毒', '手足口病', '疱疹性咽峽炎', '類流感', '腹瀉', '水痘'];

describe('六種病的說明', () => {
  it('板上的六種病都有說明', () => {
    expect(Object.keys(DISEASE_INFO).sort()).toEqual([...DISEASES].sort());
  });

  it.each(DISEASES)('%s 的六個欄位都不是空的', (disease) => {
    const info = DISEASE_INFO[disease];
    expect(info.meaning.length).toBeGreaterThan(0);
    expect(info.seeDoctor.length).toBeGreaterThan(0);
    expect(info.sourceUrl).toMatch(/^https:\/\/www\.cdc\.gov\.tw\//);
    expect(info.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it.each(DISEASES)('%s 至少給得出兩件可以做的事', (disease) => {
    // 每一個「變多」都必須同時給得出可以做什麼；只講風險不講行動就是製造焦慮。
    expect(DISEASE_INFO[disease].actions.length).toBeGreaterThanOrEqual(2);
    DISEASE_INFO[disease].actions.forEach((action) => expect(action.length).toBeGreaterThan(0));
  });

  it('沒有任何一段文字用到禁用詞', () => {
    for (const info of Object.values(DISEASE_INFO)) {
      const text = [info.meaning, info.seeDoctor, ...info.actions].join('');
      for (const word of FORBIDDEN_WORDS) {
        expect(text).not.toContain(word);
      }
    }
  });
});
```

- [ ] **Step 3: 跑測試確認失敗**

Run: `npx vitest run src/littleguard/data/diseases.test.ts`
Expected: FAIL — 六筆 `meaning` / `actions` / `seeDoctor` 都還是空的。這是刻意的：測試逼著文字被真的寫出來。

- [ ] **Step 4: 依 Step 1 的出處把六筆文字填完，再跑一次**

Run: `npx vitest run src/littleguard/data/diseases.test.ts`
Expected: PASS，14 個測試。

- [ ] **Step 5: sparkline**

Create `src/littleguard/components/Sparkline.tsx`:

```tsx
interface Props {
  /** 含本週在內的最近 8 週就診率，缺值為 null。 */
  values: (number | null)[];
  label: string;
}

/**
 * 8 週折線。viewBox + w-full，不寫死像素——手機上固定寬高的圖表會溢出。
 * 不畫座標軸、不上色塊：它的工作是讓人看出「在升還是在降」，不是精讀數值。
 */
export default function Sparkline({ values, label }: Props) {
  const points = values
    .map((value, i) => ({ value, i }))
    .filter((p): p is { value: number; i: number } => p.value !== null);
  if (points.length < 2) return null;

  const max = Math.max(...points.map((p) => p.value));
  const min = Math.min(...points.map((p) => p.value));
  const span = max - min || 1;
  const x = (i: number) => (i / (values.length - 1)) * 100;
  const y = (value: number) => 28 - ((value - min) / span) * 24;
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.i)},${y(p.value)}`).join(' ');

  return (
    <svg viewBox="0 0 100 32" className="w-full h-8" role="img" aria-label={label}>
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-guard-ink" />
    </svg>
  );
}
```

- [ ] **Step 6: 抽屜**

Create `src/littleguard/components/DiseaseDrawer.tsx`:

```tsx
import ModalFrame from '../../common/components/ModalFrame';
import type { RadarCell, RadarData } from '../../types';
import { DISEASE_INFO } from '../data/diseases';
import { STATUS_COPY, formatRate, statusOf } from '../utils/radar';
import Sparkline from './Sparkline';

interface Props {
  disease: string;
  cell: RadarCell;
  data: RadarData;
  age: string;
  onClose: () => void;
}

/**
 * 順序是刻意的：先說這個名字在資料裡是什麼、再給可以做的事，數字放後面。
 * 反過來的話家長會先被數字嚇一跳，才知道自己能做什麼。
 */
export default function DiseaseDrawer({ disease, cell, data, age, onClose }: Props) {
  const info = DISEASE_INFO[disease];
  const status = statusOf(cell);
  const national = data.national[age]?.[disease]?.rate ?? null;

  return (
    <ModalFrame isOpen onClose={onClose} title={disease}>
      <div className="space-y-5">
        <p className="text-sm text-ink-muted">{info.meaning}</p>

        <section>
          <h3 className="text-ink font-medium mb-2">可以做什麼</h3>
          <ul className="space-y-1 text-ink">
            {info.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-ink font-medium mb-2">什麼情況要看醫生</h3>
          <p className="text-ink">{info.seeDoctor}</p>
        </section>

        <section>
          <h3 className="text-ink font-medium mb-2">最近 8 週</h3>
          <Sparkline values={cell.spark} label={`${disease}最近 8 週的就診率變化`} />
          <p className={`text-sm ${STATUS_COPY[status].tone}`}>{STATUS_COPY[status].label}</p>
        </section>

        <dl className="text-sm text-ink-muted space-y-1">
          <div className="flex justify-between">
            <dt>這一週</dt>
            <dd className="tabular-nums">
              {formatRate(cell.rate)}（{cell.visits} 人次）
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>前 8 週中位數</dt>
            <dd className="tabular-nums">{formatRate(cell.trendBase)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>全國同一週</dt>
            <dd className="tabular-nums">{formatRate(national)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>統計基數</dt>
            <dd className="tabular-nums">{cell.denom.toLocaleString()} 次門診</dd>
          </div>
        </dl>

        {cell.reliability !== 'ok' && (
          <p className="text-sm text-ink-faint">
            這個縣市的這個年齡層每週就診人數偏少，數字容易上下跳動，看趨勢就好。
          </p>
        )}

        <a href={info.sourceUrl} target="_blank" rel="noreferrer" className="btn-secondary w-full">
          疾管署的{disease}說明
        </a>
      </div>
    </ModalFrame>
  );
}
```

`ModalFrame` 的簽章已確認（`src/common/components/ModalFrame.tsx:7-14`）：`{ isOpen: boolean; onClose: () => void; title: string; closeDisabled?: boolean; children: ReactNode }`。**`isOpen` 是必填**，且它自己就是 `AnimatePresence` + `role="dialog"` + `aria-modal="true"` + `max-h-[85vh] overflow-y-auto`（`:34-50`），所以外層不要再包一次捲動容器。

- [ ] **Step 7: 接上 RadarPage**

In `src/littleguard/pages/RadarPage.tsx`, replace the placeholder line:

```tsx
      {open && cells && data && (
        <DiseaseDrawer
          disease={open}
          cell={cells[open]}
          data={data}
          age={age}
          onClose={() => setOpen(null)}
        />
      )}
```

並加上 import：

```tsx
import DiseaseDrawer from '../components/DiseaseDrawer';
```

- [ ] **Step 8: 補頁面測試**

Append to `src/littleguard/pages/RadarPage.test.tsx`:

```tsx
describe('抽屜', () => {
  it('先給可以做什麼，再給數字', async () => {
    mockFetch(fixture());
    render(<RadarPage />);
    await waitFor(() => expect(screen.getByText('腸病毒')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: /腸病毒/ }));
    const body = screen.getByRole('dialog').textContent ?? '';
    expect(body.indexOf('可以做什麼')).toBeGreaterThan(-1);
    expect(body.indexOf('可以做什麼')).toBeLessThan(body.indexOf('這一週'));
  });

  it('連得出疾管署', async () => {
    mockFetch(fixture());
    render(<RadarPage />);
    await waitFor(() => expect(screen.getByText('腸病毒')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: /腸病毒/ }));
    expect(screen.getByRole('link', { name: /疾管署的腸病毒說明/ })).toHaveAttribute(
      'href',
      'https://www.cdc.gov.tw/Disease/SubIndex/m3zdUk3u9GJVvddeSnhkiA',
    );
  });
});
```

`ModalFrame` 已經有 `role="dialog"`（`ModalFrame.tsx:46`），所以 `getByRole('dialog')` 直接可用。

- [ ] **Step 9: 跑全部測試，並在 390px 實際開過抽屜**

Run:
```bash
npx vitest run src/littleguard
npm run build
npm run lint
```
Expected: 全綠、零警告。

在 390px 下開三個抽屜，確認「可以做什麼」在數字之前、sparkline 沒有溢出、連結可點。

- [ ] **Step 10: Commit**

```bash
git add src/littleguard
git commit -m "feat: 疫情雷達抽屜與六種病的家長向說明"
```

---

### Task 6: 排程更新與文件

**Files:**
- Create: `.github/workflows/refresh-disease-radar.yml`
- Modify: `README.md`（「五個服務」→ 六個、服務表、資料檔說明）
- Modify: `.claude/CLAUDE.md`（架構圖加 `littleguard/`、服務數量）

**Interfaces:**
- Consumes: `scripts/buildDiseaseRadar.cjs`。
- Produces: 每週三自動更新的 `public/data/diseaseRadar.json`。

- [ ] **Step 1: 排程 workflow**

Create `.github/workflows/refresh-disease-radar.yml`:

```yaml
name: Refresh disease radar data

# 疾管署每週一、二清晨更新上一週的健保次級統計，所以排在週三。
on:
  schedule:
    - cron: '0 1 * * 3'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Rebuild diseaseRadar.json
        run: node scripts/buildDiseaseRadar.cjs

      # 只有內容真的變了才 commit：抓取失敗時腳本會非零退出，這一步不會執行，
      # 線上因此維持上一週而不是變成空板。
      - name: Commit if changed
        run: |
          if git diff --quiet public/data/diseaseRadar.json; then
            echo "資料沒有變化，不 commit"
            exit 0
          fi
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add public/data/diseaseRadar.json
          git commit -m "chore: 更新疫情雷達資料"
          git push
```

push 到 `master` 會觸發既有的 `firebase-hosting-merge.yml`（它的 trigger 是 `push: branches: [master]`），所以不需要在這裡另外部署。

- [ ] **Step 2: 手動跑一次 workflow 確認權限與產出**

在 GitHub 的 Actions 頁對 `Refresh disease radar data` 按 `Run workflow`。
Expected: 綠燈；若資料與 repo 內相同會印「資料沒有變化，不 commit」，否則產生一筆 `chore: 更新疫情雷達資料` 並連帶觸發部署。

若失敗於 `Commit if changed` 的 `git push`，是 repo 的 Actions 權限被設成 read-only：到 Settings → Actions → General → Workflow permissions 改成 Read and write。

- [ ] **Step 3: 更新 README**

在 `README.md`：

1. 開頭引言的「五個服務」改成「六個服務」，並把 LittleGuard 一句話加進去。
2. `## The five services` 標題改為 `## The six services`，表格加一列：

```markdown
| 🛡️ | **LittleGuard** | any | single board + drawer |
```

3. 表格之後加一節：

```markdown
### LittleGuard — 疫情雷達
- **六種兒童常見傳染病**（腸病毒、手足口病、疱疹性咽峽炎、類流感、腹瀉、水痘）的每週門診就診情況，依 22 縣市與三個年齡層（0-2 / 3-6 / 7-12）切分
- 狀態是「跟自己前 8 週比」而不是跟往年同期比：2020-2022 的防疫措施讓腸病毒幾乎消失，以前 5 年同週為基線會讓每一週都看起來異常
- 門檻取實測分布的百分位（P25 0.77 / P75 1.33 / P90 1.88，n=40,040），並在每次重建時重算寫入 JSON，程式碼常數漂掉時測試會紅
- 分母不足的格子據實顯示「樣本偏小」或「資料不足」——連江縣與金門 0-2 歲每週就診數只有兩位數，不替它編一個狀態
- 語氣刻意收斂：提醒多留意而不是製造焦慮，每個「變多」都同時給得出可以做的事，顏色最強只到 `butter-dark`
```

4. 在 `nursingRooms.json` / `familyCentres.json` 的說明段落加上：

```markdown
疫情雷達的資料在 `public/data/diseaseRadar.json`，由 `scripts/buildDiseaseRadar.cjs`
從疾管署六支 CSV（約 49 MB）聚合成 47 KB，並由
`.github/workflows/refresh-disease-radar.yml` 每週三自動重建。它只有 12 KB（gzip）
所以留在 PWA precache 內，板可以離線打開。`od.cdc.gov.tw` 的憑證鏈不完整，腳本
自帶 `scripts/data/` 下的兩張 TWCA 憑證，不要改成關閉 TLS 驗證。
```

- [ ] **Step 4: 更新 CLAUDE.md**

在 `.claude/CLAUDE.md` 的架構圖裡，`babyoasis/` 之後加一行：

```
├── littleguard/     疫情雷達：板 + 抽屜，純公開、無 Firebase
```

並把「Five services share one shell」改成 six。

- [ ] **Step 5: 驗證並 commit**

Run:
```bash
npm run build
npm run lint
npx vitest run
```
Expected: 全綠。

```bash
git add .github/workflows/refresh-disease-radar.yml README.md .claude/CLAUDE.md
git commit -m "chore: 疫情雷達每週自動更新與文件"
```

---

## 自審紀錄

**Spec 覆蓋度**：spec 的 §2.1（六支資料集）→ Task 1 Step 2；§2.3（憑證）→ Task 1 Step 1；§3.1（純公開）→ Task 3 Step 4；§3.2（導覽形狀）→ Task 4 Step 6；§3.3（管線）→ Task 1 + Task 6；§3.4（識別與 ramp）→ Task 3 Step 1、3；§4.1–4.6（指標與門檻）→ Task 1 Step 2 + Task 2 Step 4；§5（資料契約）→ Task 1 Step 2、4；§6.1（語氣）→ Global Constraints + Task 2 Step 2 的語氣測試 + Task 5 Step 2；§6.2（版面）→ Task 4；§7（新鮮度）→ Task 2 `freshnessOf` + Task 4 Step 6；§8.1/8.2（檔案清單）→ Task 3、4、5、6；§8.3（`ServiceId` 去重）→ Task 3 Step 4；§9（測試）→ 各 Task 的測試步驟；附錄 A（引用頁與名稱落差）→ Task 5 Step 1。

**與 spec 的兩處增補**（spec §8.2 沒列到，實作必須動）：`src/types/index.ts`（新增 LittleGuard 型別區塊，比照 LittleExplorer 的既有做法）與 `src/common/landing/HubLanding.tsx` 的 `SERVICE_FEATURES`（`Record<ServiceId, string[]>`，少一筆就編譯不過）。

**三個既有簽章已全部釘死**（不再留給實作者猜）：`AppBar` 需要 `theme`；`EmptyState` 需要 `theme` 且 `action` 只有 `onClick` 沒有 `href`；`ModalFrame` 需要 `isOpen` 且自帶 `role="dialog"` 與 `max-h-[85vh] overflow-y-auto`。`toast` 是 `useToast()` hook 而不是模組級物件。
