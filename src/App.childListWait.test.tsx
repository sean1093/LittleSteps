import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onValue } from 'firebase/database';
import App from './App';
import { pregnancyWikiArticles } from './littlebloom/data/wiki';

/**
 * Which routes wait for a signed-in parent's child list.
 *
 * Realtime Database has no disk cache and calls neither `onValue` callback
 * while disconnected, so offline the list never arrives. App used to swap
 * every route for its loading bar and then "cannot reach the server" in that
 * state, which locked a signed-in parent out of the precached wikis and
 * calculators that a signed-out visitor could still read. Public pages that
 * take no child data now render as soon as auth has resolved; gated pages and
 * the entry page, which needs the list to pick its signed-in variant, still
 * wait.
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

beforeEach(() => {
  // Offline: every listener is attached and none ever answers, so the child
  // list stays loading for the whole test.
  vi.mocked(onValue).mockImplementation((() => () => {}) as unknown as typeof onValue);
  vi.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const open = (path: string) => {
  window.history.replaceState(null, '', path);
  render(<App />);
};

describe('a signed-in parent whose child list never arrives', () => {
  it('can still read the pregnancy wiki', async () => {
    open('/littlebloom/wiki');

    expect(
      await screen.findByRole('heading', { name: /孕期知識庫/ }, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(
      await screen.findAllByText(pregnancyWikiArticles[0].title, undefined, { timeout: 5000 }),
    ).not.toHaveLength(0);
    expect(screen.queryByText('連不上伺服器')).toBeNull();
  }, 20000);

  it('can still use the vaccine schedule calculator', async () => {
    open('/littlesteps/vaccine-schedule');

    expect(await screen.findByLabelText('寶寶生日', undefined, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.queryByText('連不上伺服器')).toBeNull();
  }, 20000);

  it.each(['/littlesteps/daily-log', '/'])(
    '%s still waits, and says why once it knows it is offline',
    async (path) => {
      open(path);

      const notice = await screen.findByRole('alert', undefined, { timeout: 5000 });
      expect(notice).toHaveTextContent('連不上伺服器');
      expect(screen.queryByRole('main')).toBeNull();
    },
    20000,
  );
});
