'use strict';

/**
 * Says so, on one GitHub issue, when the committed disease radar data has gone
 * stale.
 *
 * The data refresh is manual (see refresh-disease-radar.yml for why), and a
 * manual weekly job is one that gets forgotten. The board degrades safely, but
 * nobody was told: the data sat at one week for three months before a user test
 * found it.
 *
 * This reads only `weekEnd` from the committed `public/data/diseaseRadar.json`.
 * It never contacts Taiwan CDC, which refuses GitHub-hosted runners anyway.
 *
 * Run from `.github/workflows/disease-radar-freshness.yml` through
 * actions/github-script, which passes in `github`, `context` and `core`.
 * `scripts/checkDiseaseRadarFreshness.test.cjs` pins the threshold to the
 * board's own `freshnessOf`, so the issue and the stale banner agree on the day.
 */

const fs = require('node:fs');
const path = require('node:path');

/** `FRESHNESS_DAYS.stale` in src/littleguard/utils/radar.ts. */
const STALE_DAYS = 14;

const DATA_PATH = 'public/data/diseaseRadar.json';

const ISSUE_TITLE = 'LittleGuard: disease radar data is stale';

/** Hidden marker that identifies the one issue this script owns. */
const MARKER = '<!-- disease-radar-freshness -->';

const BOT_LOGIN = 'github-actions[bot]';

/** Whole UTC calendar days from `weekEnd` to `today`, as the board counts them. */
function daysOld(weekEnd, today) {
  const end = Date.parse(`${weekEnd}T00:00:00Z`);
  const day = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.floor((day - end) / 86400000);
}

function isStale(weekEnd, today) {
  return daysOld(weekEnd, today) > STALE_DAYS;
}

function readWeekEnd(repoRoot) {
  const raw = fs.readFileSync(path.join(repoRoot, DATA_PATH), 'utf8');
  const weekEnd = JSON.parse(raw).weekEnd;
  if (typeof weekEnd !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(weekEnd)) {
    throw new Error(`${DATA_PATH} has no usable weekEnd: ${JSON.stringify(weekEnd)}`);
  }
  return weekEnd;
}

function issueBody(weekEnd, today) {
  const days = daysOld(weekEnd, today);
  return [
    MARKER,
    `The committed \`${DATA_PATH}\` ends on **${weekEnd}**, ${days} days before`,
    `${today.toISOString().slice(0, 10)}. The board calls data stale after ${STALE_DAYS} days`,
    'and stops describing it after 35, showing only the numbers.',
    '',
    'GitHub-hosted runners cannot reach `od.cdc.gov.tw`, so refresh it from a',
    'machine on a Taiwan network, as the disease radar part of the data section',
    'in README.md describes:',
    '',
    '```bash',
    'node scripts/buildDiseaseRadar.cjs',
    'node scripts/diffDiseaseRadar.cjs   # 0 same / 1 changed / 2 cannot compare',
    '```',
    '',
    'Commit the file only on exit 1. This issue is updated by',
    '`.github/workflows/disease-radar-freshness.yml` on each run and closed by it',
    'once the committed data is fresh again.',
  ].join('\n');
}

/** The open issue this script opened earlier, if there is one. */
async function findOwnIssue(github, context) {
  const issues = await github.paginate(github.rest.issues.listForRepo, {
    ...context.repo,
    state: 'open',
    creator: BOT_LOGIN,
    per_page: 100,
  });
  return (
    issues.find(
      (issue) => !issue.pull_request && typeof issue.body === 'string' && issue.body.includes(MARKER),
    ) ?? null
  );
}

/**
 * Opens the issue when the data is stale and none is open, rewrites its body
 * when one is (an edit, not a comment, so a stale week is not a weekly
 * notification), and closes it once the data is fresh again.
 *
 * Returns what it did, for the job log and the tests.
 */
async function run({ github, context, core, repoRoot = process.cwd(), today = new Date() }) {
  const weekEnd = readWeekEnd(repoRoot);
  const days = daysOld(weekEnd, today);
  const existing = await findOwnIssue(github, context);
  core.info(`weekEnd ${weekEnd} is ${days} days old; stale after ${STALE_DAYS}.`);

  if (!isStale(weekEnd, today)) {
    if (!existing) return 'fresh';
    await github.rest.issues.createComment({
      ...context.repo,
      issue_number: existing.number,
      body: `The committed data now ends on ${weekEnd}, ${days} days old. Closing.`,
    });
    await github.rest.issues.update({
      ...context.repo,
      issue_number: existing.number,
      state: 'closed',
      state_reason: 'completed',
    });
    return 'closed';
  }

  const body = issueBody(weekEnd, today);
  if (existing) {
    await github.rest.issues.update({ ...context.repo, issue_number: existing.number, body });
    return 'updated';
  }
  await github.rest.issues.create({ ...context.repo, title: ISSUE_TITLE, body });
  return 'opened';
}

module.exports = { STALE_DAYS, DATA_PATH, ISSUE_TITLE, MARKER, daysOld, isStale, readWeekEnd, run };
