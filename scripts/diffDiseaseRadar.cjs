#!/usr/bin/env node
'use strict';

/**
 * 比對工作區的 diseaseRadar.json 與 HEAD 版本，忽略每次重建都會變的時間戳。
 *
 * 為什麼不能直接用 `git diff --quiet`：`buildDiseaseRadar.cjs` 每次執行都會寫入
 * 新的 `generatedAt`（ISO 時間戳）與 `verifiedOn`（執行日），所以即使上游一字
 * 未改，git 也永遠判定有變更。排程照著 commit 的話，每週都會多一筆內容其實沒
 * 動的資料變動，而「這一週的疫情資料真的變了嗎」從 git log 就再也看不出來。
 *
 * 退出碼沿用 `git diff --quiet` 的語意，呼叫端因此讀得懂：
 *
 *   0 = 資料本體相同（完全沒動，或只有那兩個時間戳不同）
 *   1 = 資料本體有變更
 *   2 = 比不出來（檔案不存在、JSON 壞了、git 讀不到 HEAD 版本）
 *
 * 2 與 1 分開是必要的：比不出來時 workflow 必須紅燈停下，而不是當成「有變更」
 * 把一份還沒驗證過的檔案 commit 上去。
 *
 * 比對規則由 `bodyOf`、退出碼由 `decide` 兩支純函式決定，`diffDiseaseRadar.test.cjs`
 * 逐條釘住。`decide` 的 IO 全部由外部注入，所以測試不需要 spawn 子行程、也不需要
 * 造一個臨時 git repo。下面的 CLI 只負責把真的讀檔與 `git show` 包成 reader。
 */

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..');
const REL_PATH = 'public/data/diseaseRadar.json';

/** 每次重建都會變、且與資料內容無關的欄位。 */
const VOLATILE_FIELDS = ['generatedAt', 'verifiedOn'];

/**
 * 遞迴正規化：物件的 key 排序，陣列維持原順序。
 *
 * key 必須排序，因為 `JSON.stringify` 的輸出取決於 key 的插入順序。上游只要
 * 換了欄位的寫入順序（內容一字未改），沒有正規化的比對就會判定有變更，於是
 * 每週產生一筆空 commit——正是這支工具存在的目的要避免的事。
 *
 * 陣列**絕對不能**排序：這份資料裡的陣列順序都是意義的一部分。`spark` 是時間
 * 序（反轉就是趨勢反轉）、`diseases` 與 `ageBands` 是畫面順序、`sourceUrls`
 * 對應六支 CSV。排序陣列會把真的變更判成沒變更，那比空 commit 嚴重得多。
 */
function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value === null || typeof value !== 'object') return value;
  const sorted = {};
  for (const key of Object.keys(value).sort()) sorted[key] = canonicalize(value[key]);
  return sorted;
}

/**
 * 剝掉時間戳並正規化後的資料本體，序列化成可直接比對的字串。
 *
 * 比不出來時一律丟 `Error`：呼叫端必須把「比不出來」與「有變更」分開處理，
 * 不能讓一份讀不懂的檔案被當成有變更 commit 上去。
 */
function bodyOf(json, label = '檔案') {
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch (err) {
    throw new Error(`${label}不是合法的 JSON：${err.message}`);
  }
  if (parsed === null || typeof parsed !== 'object') {
    throw new Error(`${label}不是一個 JSON 物件`);
  }
  for (const field of VOLATILE_FIELDS) delete parsed[field];
  return JSON.stringify(canonicalize(parsed));
}

/**
 * 決定退出碼：0 相同 / 1 有變更 / 2 比不出來。
 *
 * 不碰 `process`、不碰檔案系統、不碰 git——workflow 真正依賴的就是這三個退出碼，
 * 把決策留在這裡才測得動。
 *
 * 讀不到或讀不懂**任何一邊**都是 2，絕不退化成 0 或 1：當成 0 會讓一份沒比對過的
 * 檔案被靜默還原（線上停在上一週卻沒人知道比對失敗），當成 1 會把它 commit 上去。
 *
 * @param {object} io
 * @param {() => string} io.readWorking 工作區檔案的內容；讀不到就丟
 * @param {() => string} io.readHead HEAD 版本的內容；讀不到就丟
 * @param {(message: string) => void} io.log 判定結果（CLI 接 stdout）
 * @param {(message: string) => void} io.logError 比不出來的原因（CLI 接 stderr）
 * @returns {0 | 1 | 2}
 */
function decide({ readWorking, readHead, log, logError }) {
  let working;
  let committed;
  try {
    working = bodyOf(readWorking(), '工作區的檔案');
    committed = bodyOf(readHead(), 'HEAD 的檔案');
  } catch (err) {
    logError(`無法比對 ${REL_PATH}：${err.message}`);
    return 2;
  }

  const changed = working !== committed;
  log(changed ? '資料本體有變更' : `資料本體相同（${VOLATILE_FIELDS.join(' / ')} 以外沒有差異）`);
  return changed ? 1 : 0;
}

function main() {
  process.exit(
    decide({
      readWorking: () => fs.readFileSync(path.join(REPO_ROOT, REL_PATH), 'utf8'),
      readHead: () =>
        execFileSync('git', ['show', `HEAD:${REL_PATH}`], {
          cwd: REPO_ROOT,
          encoding: 'utf8',
          maxBuffer: 16 * 1024 * 1024,
        }),
      log: console.log,
      logError: console.error,
    }),
  );
}

module.exports = { VOLATILE_FIELDS, bodyOf, decide };

if (require.main === module) main();
