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
 */

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..');
const REL_PATH = 'public/data/diseaseRadar.json';

/** 每次重建都會變、且與資料內容無關的欄位。 */
const VOLATILE_FIELDS = ['generatedAt', 'verifiedOn'];

/** 剝掉時間戳後的資料本體，序列化成可直接比對的字串。 */
function bodyOf(json, label) {
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch (err) {
    throw new Error(`${label}不是合法的 JSON：${err.message}`);
  }
  for (const field of VOLATILE_FIELDS) delete parsed[field];
  // 兩邊都出自同一支產生器，鍵序一致，所以直接序列化比對就夠，不需要正規化。
  return JSON.stringify(parsed);
}

try {
  const working = bodyOf(fs.readFileSync(path.join(REPO_ROOT, REL_PATH), 'utf8'), '工作區的檔案');
  const committed = bodyOf(
    execFileSync('git', ['show', `HEAD:${REL_PATH}`], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
    }),
    'HEAD 的檔案',
  );

  const changed = working !== committed;
  console.log(
    changed ? '資料本體有變更' : `資料本體相同（${VOLATILE_FIELDS.join(' / ')} 以外沒有差異）`,
  );
  process.exit(changed ? 1 : 0);
} catch (err) {
  console.error(`無法比對 ${REL_PATH}：${err.message}`);
  process.exit(2);
}
