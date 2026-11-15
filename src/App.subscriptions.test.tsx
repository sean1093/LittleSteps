import { act, cleanup, render, screen } from '@testing-library/react';
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
/** Paths whose first snapshot is withheld until the test releases it. */
const held = new Set<string>();
const release = new Map<string, () => void>();

beforeEach(() => {
  live.clear();
  held.clear();
  release.clear();
  // The global mock in test/setup.ts answers every path with null, which leaves
  // the account without a child. Answer from DATABASE instead, and track what
  // is attached so a detach is visible too.
  vi.mocked(onValue).mockImplementation(((reference: Reference, next: (s: Snapshot) => void) => {
    const path = reference.path ?? '';
    const value = DATABASE[path] ?? null;
    live.add(path);
    const answer = () => next({ exists: () => value !== null, val: () => value });
    if (held.has(path)) {
      release.set(path, answer);
    } else {
      answer();
    }
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

  /**
   * Every page that reads App's copy of a collection, and something that is on
   * screen once that page has rendered: App's header title for the LittleSteps
   * pages, the service's own tab bar for the diary.
   */
  const READERS: { path: string; held: string; chrome: () => Promise<HTMLElement> }[] = [
    { path: '/littlesteps', held: LOGS_PATH, chrome: () => heading(/LittleSteps/) },
    { path: '/littlesteps/dashboard', held: LOGS_PATH, chrome: () => heading(/成長總覽/) },
    { path: '/littlesteps/clinic-summary', held: LOGS_PATH, chrome: () => heading(/看診摘要/) },
    { path: '/littlesteps/report', held: LOGS_PATH, chrome: () => heading(/週報月報/) },
    {
      path: '/littleexplorer/diary',
      held: DIARY_PATH,
      chrome: () => screen.findByRole('button', { name: '日記' }, { timeout: 5000 }),
    },
  ];

  it.each(READERS)(
    '$path shows it is loading, inside its own chrome, until the first snapshot arrives',
    async ({ path, held: heldPath, chrome }) => {
      // Entering a service is a cold listener now, so "no snapshot yet" is the
      // normal first render, and [] at that moment is not "no records".
      //
      // Visit once first so the lazy page chunk is resolved and the page has
      // settled. Otherwise the Suspense fallback supplies a role="status" of
      // its own and the assertions below pass whether or not the page waits.
      open(path);
      await chrome();
      await vi.waitFor(() => expect(screen.queryByRole('status')).toBeNull(), { timeout: 5000 });
      cleanup();

      held.add(heldPath);
      open(path);
      await vi.waitFor(() => expect(release.has(heldPath)).toBe(true));
      // Let any render the page would do with an empty array happen.
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(screen.getByRole('status')).toBeInTheDocument();
      // The page is mounted in its normal chrome, not replaced by a bare bar:
      // a parent can still leave while the snapshot is in flight.
      await chrome();

      act(() => release.get(heldPath)?.());
      await vi.waitFor(() => expect(screen.queryByRole('status')).toBeNull(), { timeout: 5000 });
    },
    20000,
  );
});
