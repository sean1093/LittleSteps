'use strict';

/**
 * `nextVersion.cjs` 決定每次 merge 打出去的 tag 叫什麼。錯了不會有人發現：版號
 * 印錯照樣是一個合法的 tag，release 照樣建得起來，只是從此對不上實際內容。
 *
 * 所以逐條釘死三件事：標題怎麼對到級距、0.x 的破壞相容性怎麼處理、以及 CLI 的
 * 輸出契約——workflow 直接把 stdout 當成 tag 名字用。
 *
 * CommonJS，跟被測的 `.cjs` 放一起；`describe` / `it` / `expect` 來自
 * `vitest.config.ts` 的 `test.globals: true`。
 */

const { execFileSync } = require('node:child_process');
const path = require('node:path');

const { bumpOfCommit, bumpOf, nextVersion, FIRST_VERSION } = require('./nextVersion.cjs');

const SCRIPT = path.join(__dirname, 'nextVersion.cjs');

/** 照這個 repo 真的 merge 過的 squash 標題取樣。 */
const REAL_SUBJECTS = {
  feat: 'feat: add a share code a family member can join with',
  fix: 'fix: let the repeat buttons size to their labels instead of spilling',
  docs: 'docs: adopt an E2E test plan and case catalogue (#54)',
  test: 'test: cover routing, the auth gate and the crawl boundary (#64)',
  refactor: 'refactor: one vocabulary per enum, one place per derived label (#53)',
  chore: 'chore(e2e): close the gaps Phase 1 left in its own infrastructure (#67)',
};

describe('bumpOfCommit', () => {
  it('treats feat as minor and everything else as patch', () => {
    expect(bumpOfCommit(REAL_SUBJECTS.feat)).toBe('minor');
    expect(bumpOfCommit(REAL_SUBJECTS.fix)).toBe('patch');
    expect(bumpOfCommit(REAL_SUBJECTS.docs)).toBe('patch');
    expect(bumpOfCommit(REAL_SUBJECTS.test)).toBe('patch');
    expect(bumpOfCommit(REAL_SUBJECTS.refactor)).toBe('patch');
    expect(bumpOfCommit(REAL_SUBJECTS.chore)).toBe('patch');
  });

  it('reads the ! before the colon, with or without a scope', () => {
    expect(bumpOfCommit('feat!: drop the LocalStorage guest mode')).toBe('major');
    expect(bumpOfCommit('refactor(auth)!: require sign-in for the care guide')).toBe('major');
  });

  it('does not read a ! that is only in the description', () => {
    // 「終於！」這種標題不是破壞相容性的宣告，而把它當成宣告會讓主版號白跳一版。
    expect(bumpOfCommit('fix: stop the timeline wrapping at 320px!')).toBe('patch');
  });

  it('reads BREAKING CHANGE out of the body, in both spellings', () => {
    expect(bumpOfCommit('feat: move the logs\n\nBREAKING CHANGE: childRecords moved')).toBe('major');
    expect(bumpOfCommit('feat: move the logs\n\nBREAKING-CHANGE: childRecords moved')).toBe('major');
  });

  it('does not read a BREAKING CHANGE that is only quoted mid-line', () => {
    // 規格書要求它自成一行，而 commit 常常在解釋「這不是破壞相容性的改動」。
    expect(bumpOfCommit('docs: explain what BREAKING CHANGE: means here')).toBe('patch');
  });

  it('falls back to patch for a subject that is not conventional at all', () => {
    // 版號寧可少跳一級，也不要因為看不懂就整批停住。
    expect(bumpOfCommit('Merge master into e2e/wiki-rwd-pwa')).toBe('patch');
    expect(bumpOfCommit('')).toBe('patch');
  });
});

describe('bumpOf', () => {
  it('takes the highest bump in the batch, not the last', () => {
    // 一次 merge 通常只有一則，但 tag 漏掉一輪之後就會有好幾則要一起算。
    expect(bumpOf([REAL_SUBJECTS.docs, REAL_SUBJECTS.feat, REAL_SUBJECTS.fix])).toBe('minor');
    expect(bumpOf([REAL_SUBJECTS.feat, 'fix!: rename the share code field'])).toBe('major');
  });

  it('is patch when there is nothing to read', () => {
    expect(bumpOf([])).toBe('patch');
  });
});

describe('nextVersion', () => {
  it('starts at the first version when no tag exists yet', () => {
    expect(nextVersion('', [REAL_SUBJECTS.feat])).toBe(FIRST_VERSION);
    expect(nextVersion(undefined, [REAL_SUBJECTS.fix])).toBe(FIRST_VERSION);
  });

  it('applies each bump to the previous tag', () => {
    expect(nextVersion('v0.4.2', [REAL_SUBJECTS.fix])).toBe('0.4.3');
    expect(nextVersion('v0.4.2', [REAL_SUBJECTS.feat])).toBe('0.5.0');
    expect(nextVersion('v1.4.2', ['feat!: drop guest mode'])).toBe('2.0.0');
  });

  it('resets the lower fields, rather than carrying them', () => {
    expect(nextVersion('v0.4.9', [REAL_SUBJECTS.feat])).toBe('0.5.0');
    expect(nextVersion('v1.4.9', ['feat!: drop guest mode'])).toBe('2.0.0');
  });

  it('keeps a breaking change inside 0.x instead of declaring 1.0.0', () => {
    // 升上 1.0.0 是在宣告穩定。那是產品決定，不是一則 commit 訊息可以代替人做的。
    expect(nextVersion('v0.4.2', ['feat!: drop guest mode'])).toBe('0.5.0');
  });

  it('rejects a tag it cannot parse rather than guessing', () => {
    // 猜的話會從錯誤的地方繼續數下去，而那個錯誤會一直帶著走。
    expect(() => nextVersion('0.4.2', [])).toThrow(/not a version tag/);
    expect(() => nextVersion('v1.2', [])).toThrow(/not a version tag/);
    expect(() => nextVersion('v01.2.3', [])).toThrow(/not a version tag/);
  });
});

describe('the CLI contract the workflow depends on', () => {
  const run = (latestTag, messages) =>
    execFileSync('node', [SCRIPT, latestTag], { input: messages.join('\0'), encoding: 'utf8' });

  it('prints the bare version, with no v and no trailing newline', () => {
    // workflow 直接把它接成 `v$VERSION`，多一個換行就會做出一個帶換行的 tag 名字。
    expect(run('v0.4.2', [REAL_SUBJECTS.feat])).toBe('0.5.0');
  });

  it('splits messages on NUL, so a multi-line body stays one commit', () => {
    const breaking = 'feat: move the logs\n\nBREAKING CHANGE: childRecords moved';
    expect(run('v1.0.0', [REAL_SUBJECTS.docs, breaking])).toBe('2.0.0');
  });

  it('handles an empty stdin as the no-commits case', () => {
    expect(run('v0.4.2', [])).toBe('0.4.3');
  });
});
