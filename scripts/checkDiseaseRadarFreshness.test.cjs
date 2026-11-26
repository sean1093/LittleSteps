'use strict';

/**
 * What the scheduled freshness check does to the repo's issues. It runs on a
 * schedule nobody watches, so each branch of `run` is pinned here against a
 * fake `github` client: opening a second issue every week, or never closing
 * the first, would both go unnoticed for a long time.
 *
 * CommonJS beside the script it tests, like diffDiseaseRadar.test.cjs;
 * `describe` / `it` / `expect` come from vitest's `globals: true`.
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { MARKER, ISSUE_TITLE, readWeekEnd, run } = require('./checkDiseaseRadarFreshness.cjs');

function repoWith(weekEnd) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'radar-freshness-'));
  fs.mkdirSync(path.join(root, 'public/data'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'public/data/diseaseRadar.json'),
    JSON.stringify({ weekStart: '2026-08-23', weekEnd, counties: {} }),
  );
  return root;
}

function fakeGithub(openIssues = []) {
  const calls = [];
  const record = (name) => async (params) => {
    calls.push([name, params]);
    return { data: {} };
  };
  return {
    calls,
    paginate: async (_method, params) => {
      calls.push(['list', params]);
      return openIssues;
    },
    rest: {
      issues: {
        listForRepo: () => {},
        create: record('create'),
        update: record('update'),
        createComment: record('comment'),
      },
    },
  };
}

const context = { repo: { owner: 'o', repo: 'r' } };
const core = { info: () => {} };
const ownIssue = { number: 7, state: 'open', body: `${MARKER} weekEnd=2026-08-29 -->\nold body` };

/** The same issue after a maintainer closed it. */
const closed = (stateReason, weekEnd = '2026-08-29') => ({
  number: 7,
  state: 'closed',
  state_reason: stateReason,
  body: `${MARKER} weekEnd=${weekEnd} -->\nold body`,
});

const STALE_DAY = new Date('2026-11-26T08:00:00Z');
const writes = (github) => github.calls.filter(([name]) => name !== 'list');

describe('checkDiseaseRadarFreshness run', () => {
  it('does nothing while the data is fresh and no issue is open', async () => {
    const github = fakeGithub();
    const result = await run({
      github, context, core, repoRoot: repoWith('2026-08-29'), today: new Date('2026-09-12T08:00:00Z'),
    });
    expect(result).toBe('fresh');
    expect(github.calls.map(([name]) => name)).toEqual(['list']);
  });

  it('opens one issue once the data is more than 14 days old', async () => {
    const github = fakeGithub();
    const result = await run({
      github, context, core, repoRoot: repoWith('2026-08-29'), today: new Date('2026-09-13T08:00:00Z'),
    });
    expect(result).toBe('opened');
    const creates = github.calls.filter(([name]) => name === 'create');
    expect(creates).toHaveLength(1);
    expect(creates[0][1].title).toBe(ISSUE_TITLE);
    expect(creates[0][1].body).toContain(MARKER);
    expect(creates[0][1].body).toContain('2026-08-29');
    expect(creates[0][1].body).toContain('15 days');
  });

  it('looks at open and closed issues the workflow itself opened', async () => {
    const github = fakeGithub();
    await run({ github, context, core, repoRoot: repoWith('2026-08-29'), today: STALE_DAY });
    expect(github.calls[0][1]).toMatchObject({ state: 'all', creator: 'github-actions[bot]' });
  });

  it('records the weekEnd it was written for in the hidden marker', async () => {
    const github = fakeGithub();
    await run({ github, context, core, repoRoot: repoWith('2026-08-29'), today: STALE_DAY });
    const [[, created]] = writes(github);
    expect(created.body).toContain(`${MARKER} weekEnd=2026-08-29 -->`);
  });

  it('stays quiet when a maintainer closed it as not planned and the data has not changed', async () => {
    // Otherwise closing it brings a brand-new issue, and a notification, every week.
    const github = fakeGithub([closed('not_planned')]);
    const result = await run({ github, context, core, repoRoot: repoWith('2026-08-29'), today: STALE_DAY });
    expect(result).toBe('suppressed');
    expect(writes(github)).toEqual([]);
  });

  it('reopens the same issue when data closed as not planned has since changed but is stale again', async () => {
    const github = fakeGithub([closed('not_planned', '2026-08-22')]);
    const result = await run({ github, context, core, repoRoot: repoWith('2026-08-29'), today: STALE_DAY });
    expect(result).toBe('reopened');
    expect(writes(github).map(([name]) => name)).toEqual(['update']);
    expect(writes(github)[0][1]).toMatchObject({ issue_number: 7, state: 'open' });
    expect(writes(github)[0][1].body).toContain(`${MARKER} weekEnd=2026-08-29 -->`);
  });

  it('reopens the same issue, rather than opening another, when it was closed as completed', async () => {
    const github = fakeGithub([closed('completed')]);
    const result = await run({ github, context, core, repoRoot: repoWith('2026-08-29'), today: STALE_DAY });
    expect(result).toBe('reopened');
    expect(writes(github).map(([name]) => name)).toEqual(['update']);
    expect(writes(github)[0][1]).toMatchObject({ issue_number: 7, state: 'open' });
  });

  it('judges by the newest of its issues', async () => {
    const older = { ...closed('completed'), number: 2 };
    const github = fakeGithub([older, closed('not_planned')]);
    const result = await run({ github, context, core, repoRoot: repoWith('2026-08-29'), today: STALE_DAY });
    expect(result).toBe('suppressed');
  });

  it('leaves a closed issue alone while the data is fresh', async () => {
    const github = fakeGithub([closed('completed')]);
    const result = await run({
      github, context, core, repoRoot: repoWith('2026-11-21'), today: STALE_DAY,
    });
    expect(result).toBe('fresh');
    expect(writes(github)).toEqual([]);
  });

  it('rewrites the open issue instead of opening a second one', async () => {
    const someoneElses = { number: 3, body: 'unrelated' };
    const aPullRequest = { number: 9, state: 'open', body: MARKER, pull_request: {} };
    const github = fakeGithub([someoneElses, aPullRequest, ownIssue]);
    const result = await run({
      github, context, core, repoRoot: repoWith('2026-08-29'), today: new Date('2026-11-26T08:00:00Z'),
    });
    expect(result).toBe('updated');
    expect(github.calls.filter(([name]) => name === 'create')).toHaveLength(0);
    // An edit, not a comment: a stale week is not a weekly notification.
    expect(github.calls.filter(([name]) => name === 'comment')).toHaveLength(0);
    const [[, update]] = github.calls.filter(([name]) => name === 'update');
    expect(update.issue_number).toBe(7);
    expect(update.body).toContain('89 days');
  });

  it('closes its issue once the committed data is fresh again', async () => {
    const github = fakeGithub([ownIssue]);
    const result = await run({
      github, context, core, repoRoot: repoWith('2026-11-21'), today: new Date('2026-11-26T08:00:00Z'),
    });
    expect(result).toBe('closed');
    const [[, update]] = github.calls.filter(([name]) => name === 'update');
    expect(update).toMatchObject({ issue_number: 7, state: 'closed', state_reason: 'completed' });
  });
});

describe('readWeekEnd', () => {
  it('reads the committed file', () => {
    expect(readWeekEnd(path.join(__dirname, '..'))).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('refuses a file without a usable weekEnd rather than calling it fresh', () => {
    expect(() => readWeekEnd(repoWith(undefined))).toThrow(/no usable weekEnd/);
    expect(() => readWeekEnd(repoWith('29/08/2026'))).toThrow(/no usable weekEnd/);
  });
});
