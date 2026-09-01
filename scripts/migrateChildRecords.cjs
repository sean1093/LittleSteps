/**
 * 一次性搬遷：把授權搬進孩子節點，把無界成長的紀錄搬出孩子節點。
 *
 * 為什麼要這一次搬遷
 *
 *   1. 授權原本記在 users/$uid/childrenIds/$childId，而規則只允許每個人寫自己
 *      那一份。分享代碼一旦給出去就收不回來——對方的權限存在對方的節點裡，
 *      建立者碰不到。唯一的「取消分享」是把整份紀錄刪掉，連自己的一起刪。
 *      成員名單搬進 children/$childId/members 之後，任何一位成員都能移除
 *      另一位。childrenIds 留著，但只當作「這個帳號要訂閱哪些孩子」的索引。
 *
 *   2. dailyLogs／diaryEntries／growthRecords 原本長在 children/$childId 裡面，
 *      而孩子的 listener 訂閱的是整個 children/$childId 節點。於是換一次尿布，
 *      就把這個孩子從出生到今天的全部紀錄重新下載給每一位家人一次，而且只會
 *      越來越大。這三個搬到 childRecords/$childId。留在原地的各種 progress 都
 *      以各服務 data 目錄裡固定長度的清單為界，不會無限長。
 *
 * 這支腳本拒絕做的事
 *
 *   - 不在備份寫不出來的情況下繼續。接下來要刪東西，而這裡面是真實家庭的
 *     健康紀錄，出錯時唯一的退路就是那個檔案。
 *   - 不憑「寫入被接受」就刪來源。每一份都是複製、讀回、逐鍵比對相同，而且
 *     來源在複製期間沒有被改過，才刪。
 *   - 不替沒有任何成員的孩子指定成員。那是搬遷前就存在的孤兒，猜一個使用者
 *     塞進去等於把別人的健康紀錄交給他。回報並跳過，留給人決定。
 *   - 不覆寫既有的 members。搬遷之後 childrenIds 只是訂閱索引，可能留著已經
 *     被移除的人；再從它算一次會把撤銷掉的權限復活。
 *   - 不預設寫入。預設是乾跑，把會做的事全部印出來，要加 --apply 才動手。
 *
 * 中途失敗不需要收拾：每一步都是「先確定新位置有、再刪舊位置」，所以任何一次
 * 中斷都可以直接再跑一次接續完成，已完成的孩子會被認出來並略過。
 *
 * 部署順序很重要，詳見 README 的 Migrating a deployed database：
 * 先部署規則，再跑這支腳本，最後才部署前端。
 *
 * 用法
 *   node scripts/migrateChildRecords.cjs                     乾跑，只讀線上資料庫
 *   node scripts/migrateChildRecords.cjs --apply             真的寫入
 *   node scripts/migrateChildRecords.cjs --snapshot=<檔案>   用本機 JSON 排練，不連線
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const BACKUP_DIR = path.join(ROOT, 'backups');

/** 這三個是搬遷對象，也就是「會一直長」的那些。順序決定輸出的順序。 */
const LEGACY_COLLECTIONS = ['dailyLogs', 'diaryEntries', 'growthRecords'];

const USAGE = `把授權搬進 children/$childId/members，把 ${LEGACY_COLLECTIONS.join('／')}
搬到 childRecords/$childId。一次性，可重複執行，預設不寫入。

  node scripts/migrateChildRecords.cjs                     乾跑：印出會做的每一件事
  node scripts/migrateChildRecords.cjs --apply             真的寫入線上資料庫
  node scripts/migrateChildRecords.cjs --snapshot=<檔案>   用本機 JSON 排練，完全不連線
  node scripts/migrateChildRecords.cjs --help              這段說明

專案代號取自 .firebaserc，資料庫存取走已登入的 firebase CLI。
線上模式一開始會把整棵資料庫寫成 backups/rtdb-<時間>.json；備份寫不出來就不繼續。
--snapshot 只用來驗證轉換結果，不能和 --apply 併用。`;

let projectId = null;
let cli = null;
let tempDir = null;
let tempSeq = 0;
/** 只有真的送出過寫入，中止訊息才需要講「下一次執行會接續」。 */
let mutated = false;

function parseArgs(argv) {
  const options = { help: false, apply: false, snapshot: null };
  argv.forEach((arg) => {
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--apply') options.apply = true;
    else if (arg.startsWith('--snapshot=')) options.snapshot = arg.slice('--snapshot='.length);
    else throw new Error(`不認識的參數 ${arg}，用 --help 看用法`);
  });
  // 計畫是從本機檔案算出來的，寫入的卻會是線上資料庫，兩者可以差很多。
  if (options.apply && options.snapshot) {
    throw new Error('--apply 不能和 --snapshot 併用：不可以照著一份本機檔案去改線上資料庫');
  }
  return options;
}

/** 專案代號只有 .firebaserc 一個來源，複製一份到腳本裡遲早會指向錯的專案。 */
function readProjectId() {
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, '.firebaserc'), 'utf8'));
  const id = config.projects && config.projects.default;
  if (!id) throw new Error('.firebaserc 沒有 projects.default，不知道要對哪個專案動手');
  return id;
}

/**
 * 直接呼叫 node_modules/.bin/firebase。每個孩子要跑十幾次 CLI，繞 npx 每次都要
 * 重新解析套件，慢一個量級；沒安裝時才退回 npx，訊息比 ENOENT 清楚。
 */
function resolveCli() {
  const local = path.join(ROOT, 'node_modules/.bin/firebase');
  return fs.existsSync(local) ? { file: local, prefix: [] } : { file: 'npx', prefix: ['firebase'] };
}

/** 參數一律以陣列傳給 execFileSync，不經過 shell：路徑與資料都來自資料庫內容。 */
function firebase(args) {
  try {
    return execFileSync(
      cli.file,
      [...cli.prefix, ...args, '--project', projectId, '--non-interactive'],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 512 * 1024 * 1024 },
    );
  } catch (error) {
    const detail = `${error.stderr || ''}\n${error.stdout || ''}`
      .trim()
      .split('\n')
      .slice(-5)
      .join('\n');
    throw new Error(`firebase ${args.join(' ')} 失敗（exit code ${error.status}）\n${detail}`);
  }
}

function tempFile(label) {
  tempSeq += 1;
  return path.join(tempDir, `${label}-${tempSeq}.json`);
}

function readJson(file) {
  const text = fs.readFileSync(file, 'utf8');
  return text.trim() === '' ? null : JSON.parse(text);
}

/** 一律用 -o 寫檔再讀，不接 stdout：整棵資料庫塞不進管線緩衝區。 */
function dbGet(dbPath) {
  const file = tempFile('get');
  firebase(['database:get', dbPath, '-o', file]);
  return readJson(file);
}

/** JSON 走暫存檔而不是命令列參數：紀錄動輒幾 MB，遠超過 argv 上限。 */
function dbWrite(command, dbPath, value) {
  const file = tempFile(command);
  fs.writeFileSync(file, JSON.stringify(value));
  mutated = true;
  firebase([`database:${command}`, dbPath, file, '--force']);
}

function dbRemove(dbPath) {
  mutated = true;
  firebase(['database:remove', dbPath, '--force']);
}

function isRecordMap(value) {
  return value !== null && typeof value === 'object';
}

function countKeys(value) {
  return isRecordMap(value) ? Object.keys(value).length : 0;
}

/**
 * 比對用的正規形。Realtime Database 沒有陣列：連號的 key 讀回來是陣列，缺號就是
 * 物件，同一份資料兩種形狀。直接比 JSON 字串會把相同的資料判成不同，於是拒絕
 * 刪除來源，搬遷永遠跑不完。
 */
function canonical(value) {
  if (Array.isArray(value)) {
    const asObject = {};
    // 陣列的洞讀回來是 null，而資料庫裡不存在 null 子節點，兩邊要對齊。
    value.forEach((item, index) => {
      if (item !== null && item !== undefined) asObject[String(index)] = item;
    });
    return canonical(asObject);
  }
  if (isRecordMap(value)) {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value === undefined ? null : value);
}

/**
 * 整棵資料庫讀一次，順手就是備份。CLI 用的是開發者自己的 OAuth 憑證，權限在
 * 規則之上，所以讀得到每一個孩子——這也是為什麼這件事只能在本機由人執行。
 */
function downloadSnapshot() {
  projectId = readProjectId();
  cli = resolveCli();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = path.join(BACKUP_DIR, `rtdb-${stamp}.json`);

  console.log(`讀取 ${projectId} 整棵資料庫…`);
  try {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    firebase(['database:get', '/', '-o', backup]);
  } catch (error) {
    throw new Error(`備份寫不出來，不繼續：${error.message}`);
  }

  let snapshot;
  try {
    snapshot = readJson(backup);
    // 0600：這個檔案是每一個家庭的健康紀錄，就攤在工作目錄裡。
    fs.chmodSync(backup, 0o600);
  } catch (error) {
    throw new Error(`備份 ${backup} 寫出來卻讀不回來，不繼續：${error.message}`);
  }
  if (snapshot === null) throw new Error('讀到的資料庫是空的，先確認 --project 與登入的帳號');

  const size = (fs.statSync(backup).size / 1024).toFixed(0);
  console.log(`  備份 ${path.relative(ROOT, backup)}（${size} KB，權限 600，已在 .gitignore）`);
  return snapshot;
}

function loadSnapshot(file) {
  const resolved = path.resolve(ROOT, file);
  const snapshot = readJson(resolved);
  if (snapshot === null) throw new Error(`${file} 是空的`);
  console.log(`讀取本機快照 ${file}：不連線，也不另外備份（來源本身就是檔案）`);
  return snapshot;
}

/**
 * 算出每個孩子要做什麼。這一段完全不碰網路，所以同一份輸入永遠得到同一份計畫，
 * 乾跑印的就是 --apply 會做的事。
 */
function buildPlan(snapshot) {
  const children = isRecordMap(snapshot.children) ? snapshot.children : {};
  const users = isRecordMap(snapshot.users) ? snapshot.users : {};
  const records = isRecordMap(snapshot.childRecords) ? snapshot.childRecords : {};

  // 舊規則要求 childrenIds/$childId === true。其他值今天就沒有權限，不能藉著
  // 這次搬遷多給。
  const indexedByChild = new Map();
  Object.keys(users).forEach((uid) => {
    const owned = isRecordMap(users[uid]) && isRecordMap(users[uid].childrenIds)
      ? users[uid].childrenIds
      : {};
    Object.keys(owned).forEach((childId) => {
      if (owned[childId] !== true) return;
      if (!indexedByChild.has(childId)) indexedByChild.set(childId, []);
      indexedByChild.get(childId).push(uid);
    });
  });

  const plans = Object.keys(children).map((childId) => {
    const child = children[childId];
    const plan = {
      childId,
      name: '',
      verdict: 'migrate',
      reason: '',
      memberUids: [],
      needsMembers: false,
      needsJoinOpen: false,
      moves: [],
      actions: [],
      warnings: [],
    };

    if (!isRecordMap(child) || Array.isArray(child)) {
      plan.verdict = 'broken';
      plan.reason = 'children 節點不是物件，這不是這支腳本能判斷的東西';
      return plan;
    }
    plan.name = typeof child.name === 'string' ? child.name : '(無名字)';

    const existing = isRecordMap(child.members)
      ? Object.keys(child.members).filter((uid) => child.members[uid] === true)
      : [];
    const indexed = (indexedByChild.get(childId) || []).sort();
    plan.needsMembers = existing.length === 0;
    plan.memberUids = plan.needsMembers ? indexed : existing.sort();
    plan.needsJoinOpen = typeof child.joinOpen !== 'boolean';

    for (const collection of LEGACY_COLLECTIONS) {
      const source = child[collection];
      if (source === undefined || source === null) continue;
      if (!isRecordMap(source)) {
        plan.verdict = 'broken';
        plan.reason = `${collection} 不是物件，搬過去會變成別的東西`;
        return plan;
      }
      plan.moves.push({
        collection,
        sourceCount: countKeys(source),
        destCount: countKeys(isRecordMap(records[childId]) ? records[childId][collection] : null),
      });
    }

    if (plan.needsMembers && indexed.length === 0) {
      plan.verdict = 'orphan';
      plan.reason = '沒有任何帳號的 childrenIds 指向它：這份紀錄現在誰都讀不到';
      return plan;
    }
    if (!plan.needsMembers && !plan.needsJoinOpen && plan.moves.length === 0) {
      plan.verdict = 'done';
      return plan;
    }

    // 新規則的 .validate 要求 name／createdBy／members 三個都在，缺一個的話這個
    // 孩子之後的每一次客戶端寫入都會被擋掉。這裡不猜、也不補，只講出來。
    ['name', 'createdBy'].forEach((field) => {
      if (typeof child[field] !== 'string' || child[field] === '') {
        plan.warnings.push(`缺 ${field}，新規則的 .validate 會擋掉之後所有客戶端寫入，需要人工補`);
      }
    });

    if (plan.needsMembers) {
      plan.actions.push(`members ← ${plan.memberUids.join('、')}（共 ${plan.memberUids.length} 人，來自 childrenIds）`);
    }
    // joinOpen 只擋「新加入」，既有成員不受影響，所以關起來是安全的預設值；
    // 已經是布林值的就不動——那可能是家長自己在新版 App 裡打開的。
    if (plan.needsJoinOpen) plan.actions.push('joinOpen ← false（既有成員不受影響，只擋新加入）');
    plan.moves.forEach((move) => {
      const merge = move.destCount > 0 ? `，目的地已有 ${move.destCount} 筆會保留` : '';
      plan.actions.push(
        `${move.collection} ${move.sourceCount} 筆 → childRecords/${childId}/${move.collection}${merge}`,
      );
    });
    return plan;
  });

  const dangling = [...indexedByChild.keys()].filter((childId) => !(childId in children));
  return { plans, dangling };
}

/**
 * 一份紀錄的搬遷。先複製、讀回逐鍵比對、再確認來源沒被改過，最後才刪來源。
 * 任何一關不過就整個中止，來源留在原地，下一次執行會從這裡接續。
 */
function moveCollection(childId, collection) {
  const source = `/children/${childId}/${collection}`;
  const destination = `/childRecords/${childId}/${collection}`;

  // 重新讀一次來源，不吃開頭那份快照：快照可能是幾分鐘前的，中間若有新紀錄
  // 寫進來，照快照複製再把來源整個刪掉，那幾筆就沒了。
  const before = dbGet(source);
  if (before === null) {
    console.log(`      ${collection}：來源已不在，先前那次執行已經搬完`);
    return 0;
  }
  if (!isRecordMap(before)) throw new Error(`${source} 不是物件，停手`);
  const existingAtDestination = dbGet(destination);

  // 兩邊都有的 key 保留目的地的值（那是較新的位置），來源只補目的地沒有的 key。
  // 不管新舊客戶端誰先寫，都不會有紀錄被覆蓋掉。
  const merged = { ...before, ...(isRecordMap(existingAtDestination) ? existingAtDestination : {}) };
  dbWrite('set', destination, merged);

  const readback = dbGet(destination);
  if (canonical(readback) !== canonical(merged)) {
    throw new Error(
      `${destination} 讀回來的內容與寫入的不一致，沒有刪除來源。查清楚之後再跑一次即可接續。`,
    );
  }
  const after = dbGet(source);
  if (canonical(after) !== canonical(before)) {
    throw new Error(
      `${source} 在搬遷過程中被改動（舊版前端還在寫），沒有刪除來源。再跑一次就會把新的那幾筆一起搬過去。`,
    );
  }
  dbRemove(source);

  const moved = countKeys(before);
  console.log(`      ${collection}：${moved} 筆已複製並驗證，來源已刪`);
  return moved;
}

function applyChild(plan) {
  // 先搬紀錄、後寫 members，順序是刻意的：新規則已經上線，而這個孩子還沒有任何
  // 成員，所以舊版前端此刻寫不進 children/$childId——來源在複製期間不會動。反過
  // 來先寫 members，等於在搬遷進行中把舊路徑重新開放寫入。
  const moved = {};
  plan.moves.forEach((move) => {
    moved[move.collection] = moveCollection(plan.childId, move.collection);
  });

  const patch = {};
  if (plan.needsMembers) {
    patch.members = {};
    plan.memberUids.forEach((uid) => {
      patch.members[uid] = true;
    });
  }
  if (plan.needsJoinOpen) patch.joinOpen = false;
  if (Object.keys(patch).length > 0) {
    dbWrite('update', `/children/${plan.childId}`, patch);
    console.log(`      ${Object.keys(patch).join('、')} 已寫入`);
  }
  return moved;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(USAGE);
    return;
  }

  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'littlesteps-migrate-'));
  try {
    const snapshot = options.snapshot ? loadSnapshot(options.snapshot) : downloadSnapshot();
    const { plans, dangling } = buildPlan(snapshot);
    if (plans.length === 0) {
      console.log('\n資料庫裡沒有 children，沒有東西要搬。');
      return;
    }

    const totals = { migrated: 0, done: 0, orphan: 0, broken: 0, records: {} };
    LEGACY_COLLECTIONS.forEach((collection) => {
      totals.records[collection] = 0;
    });

    const label = options.apply ? '寫入' : '乾跑（不會有任何寫入）';
    console.log(`\n${plans.length} 個孩子，${label}：\n`);

    plans.forEach((plan) => {
      console.log(`  ${plan.childId} ${plan.name}`);
      if (plan.verdict === 'done') {
        totals.done += 1;
        console.log('    已有 members、也沒有舊的紀錄集合，略過');
        return;
      }
      if (plan.verdict === 'orphan') {
        totals.orphan += 1;
        console.log(`    ${plan.reason}`);
        console.log('    搬遷前就已經是孤兒，不會替它指定成員；需要人工決定，略過');
        return;
      }
      if (plan.verdict === 'broken') {
        totals.broken += 1;
        console.log(`    ${plan.reason}，略過`);
        return;
      }

      totals.migrated += 1;
      plan.warnings.forEach((warning) => console.log(`    注意：${warning}`));
      plan.actions.forEach((action) => console.log(`    ${action}`));
      if (options.apply) {
        const moved = applyChild(plan);
        LEGACY_COLLECTIONS.forEach((collection) => {
          totals.records[collection] += moved[collection] || 0;
        });
      } else {
        plan.moves.forEach((move) => {
          totals.records[move.collection] += move.sourceCount;
        });
      }
    });

    console.log('\n彙總');
    console.log(
      `  孩子：搬遷 ${totals.migrated}、已完成略過 ${totals.done}、孤兒 ${totals.orphan}` +
        (totals.broken > 0 ? `、資料損壞 ${totals.broken}` : ''),
    );
    console.log(
      `  紀錄：${LEGACY_COLLECTIONS.map((c) => `${c} ${totals.records[c]} 筆`).join('、')}`,
    );
    if (dangling.length > 0) {
      console.log(
        `  ${dangling.length} 筆 childrenIds 指向不存在的孩子（前端的名單 listener 會自己清掉，本腳本不處理）`,
      );
    }
    if (totals.orphan > 0) {
      console.log('  孤兒的紀錄還在原處，沒有人讀得到也沒有人能刪；要救要刪都得有人先決定誰是成員。');
    }

    if (!options.apply) {
      console.log('\n以上都沒有寫入。確認無誤後：');
      console.log('  node scripts/migrateChildRecords.cjs --apply');
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

try {
  main();
} catch (error) {
  console.error(`\n中止：${error.message}`);
  if (mutated) {
    console.error(
      '已寫入的部分都通過驗證才刪來源，資料庫停在可接續的狀態；修好原因後再跑一次同一個指令即可。',
    );
  }
  process.exit(1);
}
