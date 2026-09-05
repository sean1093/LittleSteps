'use strict';

/**
 * 算出下一個版本號。每次 merge 進 master 都會打一個 tag，而 tag 是「線上跑的是
 * 哪一版」唯一的答案——`package.json` 的 version 從來沒有被用到（private 套件，
 * 不會發佈），所以真正的事實來源是 tag，不是那個欄位。
 *
 * 判斷錯了有兩種代價，而且都不會噴錯：版號跳太快，日後看不出哪一版真的有新功能；
 * 或是把一個破壞相容性的改動印成 patch，讓人以為升上去是安全的。
 *
 * 級距由 squash commit 的標題決定，因為這個 repo 一律 squash merge，而標題就是
 * PR 標題、照 conventional commits 寫（見 .claude/skills/english-writing）。
 *
 * 這是一支 CommonJS 檔，跟 diffDiseaseRadar.cjs 同一個模式：`scripts/` 不進 tsc
 * 的 include，也在 eslint 的 ignorePatterns 裡。
 */

/** `type(scope)!: description` 的標題。`!` 只認冒號前的那一個。 */
const SUBJECT = /^(?<type>[a-z]+)(?:\((?<scope>[^)]*)\))?(?<breaking>!)?:/;

/** commit body 裡宣告破壞相容性的兩種寫法，規格書兩種都允許。 */
const BREAKING_BODY = /^BREAKING[ -]CHANGE:/m;

/**
 * 一則 commit 要求的級距。
 *
 * `feat` 是 minor，其餘一律 patch——包含 docs 與 chore。使用者要的是「每次 merge
 * 都有一個新 tag」，所以沒有「這次不發版」這個選項：一次 merge 就是一次部署
 * （firebase-hosting-merge.yml 吃的是 push to master），部署了就該有名字。
 */
function bumpOfCommit(message) {
  const subject = message.split('\n', 1)[0];
  const match = SUBJECT.exec(subject);

  if (match?.groups?.breaking || BREAKING_BODY.test(message)) return 'major';
  if (match?.groups?.type === 'feat') return 'minor';
  return 'patch';
}

const RANK = { patch: 0, minor: 1, major: 2 };

/** 一批 commit 裡最大的那個級距。空陣列當成 patch：有 merge 就有版本。 */
function bumpOf(messages) {
  return messages.reduce(
    (highest, message) => (RANK[bumpOfCommit(message)] > RANK[highest] ? bumpOfCommit(message) : highest),
    'patch',
  );
}

/** 沒有任何 tag 時的第一個版本。0.x 表示「還沒有承諾穩定」，那是現況。 */
const FIRST_VERSION = '0.1.0';

const TAG = /^v(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)$/;

/**
 * 把級距套到上一個 tag 上。
 *
 * 主版號還是 0 的時候，破壞相容性只升 minor 而不是升到 1.0.0——semver 對 0.x 的
 * 規定就是「隨時可能變」，而跳上 1.0.0 是在宣告穩定，那是產品決定，不該由一則
 * commit 訊息代替人做。
 */
function nextVersion(latestTag, messages) {
  if (!latestTag) return FIRST_VERSION;

  const match = TAG.exec(latestTag);
  if (!match) throw new Error(`not a version tag: ${latestTag}`);

  const major = Number(match.groups.major);
  const minor = Number(match.groups.minor);
  const patch = Number(match.groups.patch);

  let bump = bumpOf(messages);
  if (bump === 'major' && major === 0) bump = 'minor';

  if (bump === 'major') return `${major + 1}.0.0`;
  if (bump === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

module.exports = { bumpOfCommit, bumpOf, nextVersion, FIRST_VERSION };

/*
  CLI：`node scripts/nextVersion.cjs <latestTag|""> < messages`
  commit 訊息從 stdin 進來，用 NUL 分隔，因為訊息本身有換行。
*/
if (require.main === module) {
  const latestTag = process.argv[2] || '';
  const stdin = require('node:fs').readFileSync(0, 'utf8');
  const messages = stdin.split('\0').filter((message) => message.trim() !== '');

  process.stdout.write(nextVersion(latestTag, messages));
}
