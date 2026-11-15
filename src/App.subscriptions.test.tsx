import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { onValue } from 'firebase/database';
import App from './App';

/**
 * Which child-record listeners App attaches on which route.
 *
 * `useDailyLogs` and `useDiary` listen to a whole collection with no query.
 * App used to call both on every route, so a signed-in parent opening the
 * nursing-room map downloaded the child's complete daily log and diary and
 * kept both listeners live on a page that reads neither. This file pins the
 * observable half of that: what `onValue` is attached to.
 *
 * Signed in with one child, because a signed-out visitor or a parent without a
 * child attaches nothing anywhere and every assertion below would pass
 * vacuously.
 */

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_auth, callback) => {
    callback({ uid: 'test-uid', displayName: 'Test Parent', email: 'test@example.com' });
    return vi.fn();
  }),
  getRedirectResult: vi.fn().mockResolvedValue(null),
  signInWithPopup: vi.fn(),
  signInWithRedirect: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  getAuth: vi.fn(() => ({ currentUser: null })),
}));

const CHILD_ID = 'kid-1';
const LOGS_PATH = `childRecords/${CHILD_ID}/dailyLogs`;
const DIARY_PATH = `childRecords/${CHILD_ID}/diaryEntries`;

/** What the database holds: one account with one born child, and no records. */
const DATABASE: Record<string, unknown> = {
  'users/test-uid': { currentChildId: CHILD_ID, childrenIds: { [CHILD_ID]: true } },
  [`children/${CHILD_ID}`]: {
    id: CHILD_ID,
    name: 'Momo',
    birthday: '2025-01-01',
    milestoneProgress: {},
    vaccineProgress: {},
    createdAt: '2025-01-02T00:00:00.000Z',
    createdBy: 'test-uid',
    members: { 'test-uid': true },
  },
};

type Snapshot = { exists: () => boolean; val: () => unknown };
type Reference = { path?: string };

/** Paths with a listener attached and not yet detached. */
const live = new Set<string>();

beforeEach(() => {
  live.clear();
  // The global mock in test/setup.ts answers every path with null, which leaves
  // the account without a child. Answer from DATABASE instead, and track what
  // is attached so a detach is visible too.
  vi.mocked(onValue).mockImplementation(((reference: Reference, next: (s: Snapshot) => void) => {
    const path = reference.path ?? '';
    const value = DATABASE[path] ?? null;
    live.add(path);
    next({ exists: () => value !== null, val: () => value });
    return () => {
      live.delete(path);
    };
  }) as unknown as typeof onValue);
});

const open = (path: string) => {
  window.history.replaceState(null, '', path);
  render(<App />);
};

const heading = (name: RegExp) => screen.findByRole('heading', { name }, { timeout: 5000 });

describe('child-record listeners follow the service on screen', () => {
  it('attaches neither on a public single-page service', async () => {
    open('/babyoasis');
    await heading(/BabyOasis/);

    // The child itself is loaded, so "nothing attached" is not just "no child".
    expect(live).toContain(`children/${CHILD_ID}`);
    expect(live).not.toContain(LOGS_PATH);
    expect(live).not.toContain(DIARY_PATH);
  }, 20000);

  it('attaches the daily logs, and not the diary, inside LittleSteps', async () => {
    open('/littlesteps/dashboard');
    await heading(/成長總覽/);

    expect(live).toContain(LOGS_PATH);
    expect(live).not.toContain(DIARY_PATH);
  }, 20000);

  it('attaches the diary, and not the daily logs, inside LittleExplorer', async () => {
    open('/littleexplorer/diary');
    const tab = await screen.findByRole('button', { name: '日記' }, { timeout: 5000 });
    expect(tab).toHaveAttribute('aria-current', 'page');

    expect(live).toContain(DIARY_PATH);
    expect(live).not.toContain(LOGS_PATH);
  }, 20000);

  it('detaches the daily logs when the parent leaves LittleSteps', async () => {
    open('/littlesteps/dashboard');
    await heading(/成長總覽/);
    expect(live).toContain(LOGS_PATH);

    window.history.replaceState(null, '', '/babyoasis');
    window.dispatchEvent(new PopStateEvent('popstate'));
    await heading(/BabyOasis/);

    expect(live).not.toContain(LOGS_PATH);
  }, 20000);
});
