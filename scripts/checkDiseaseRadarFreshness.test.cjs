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
const ownIssue = { number: 7, body: `${MARKER}\nold body` };

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

  it('only looks at open issues the workflow itself opened', async () => {
    const github = fakeGithub();
    await run({
      github, context, core, repoRoot: repoWith('2026-08-29'), today: new Date('2026-11-26T08:00:00Z'),
    });
    expect(github.calls[0][1]).toMatchObject({ state: 'open', creator: 'github-actions[bot]' });
  });

  it('rewrites the open issue instead of opening a second one', async () => {
    const someoneElses = { number: 3, body: 'unrelated' };
    const aPullRequest = { number: 4, body: MARKER, pull_request: {} };
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
