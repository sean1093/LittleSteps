import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The share link carries a child's id in its fragment: `/join#<code>`.
 *
 * Analytics fills `page_location` from the document's URL for every event it
 * sends, and this app's own page_view helper reads `window.location`. A code
 * left in the address bar would therefore reach Analytics and tie a client id
 * to a child. These tests pin the two halves: the code leaves the URL before
 * the app starts, and nothing the analytics helpers send contains it.
 *
 * The real `lib/firebase` is loaded the way `src/lib/analytics.test.ts` loads
 * it, with `firebase/analytics` mocked to capture what would be sent.
 */

const CODE = '3f9a2c1e-8b7d-4e6f-a1b2-c3d4e5f60718';

const send = vi.fn();
vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({ name: '[DEFAULT]' })) }));
vi.mock('firebase/database', () => ({ getDatabase: vi.fn(() => ({})) }));
vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({})),
  initializeAnalytics: () => ({}),
  isSupported: vi.fn(async () => true),
  logEvent: (_instance: unknown, name: string, params?: Record<string, unknown>) =>
    send(name, params),
}));

type JoinLink = typeof import('./joinLink');

/** A fresh copy of the module, so the code held in memory starts empty. */
async function loadJoinLink(): Promise<JoinLink> {
  vi.resetModules();
  return import('./joinLink');
}

beforeEach(() => {
  send.mockClear();
  window.history.replaceState(null, '', '/');
});

afterEach(() => {
  vi.unstubAllEnvs();
  window.history.replaceState(null, '', '/');
});

describe('captureJoinLink', () => {
  it('takes the code out of the address bar and keeps it in memory', async () => {
    window.history.replaceState(null, '', `/join#${CODE}`);
    const link = await loadJoinLink();

    link.captureJoinLink();

    expect(link.pendingJoinCode()).toBe(CODE);
    expect(window.location.hash).toBe('');
    expect(window.location.href).not.toContain(CODE);
    expect(window.location.pathname).toBe('/join');
  });

  it('strips a fragment that is not a code without keeping it', async () => {
    window.history.replaceState(null, '', '/join#<script>');
    const link = await loadJoinLink();

    link.captureJoinLink();

    expect(link.pendingJoinCode()).toBeNull();
    expect(window.location.hash).toBe('');
  });

  it('leaves the fragment of every other page alone', async () => {
    // On a real path a fragment is an in-page anchor.
    window.history.replaceState(null, '', '/about#sources');
    const link = await loadJoinLink();

    link.captureJoinLink();

    expect(link.pendingJoinCode()).toBeNull();
    expect(window.location.hash).toBe('#sources');
  });

  it('catches a link pasted into a tab that is already on /join', async () => {
    // Same path, new fragment: the browser fires hashchange and does not reload.
    window.history.replaceState(null, '', '/join');
    const link = await loadJoinLink();
    link.installJoinLinkCapture();

    window.history.replaceState(null, '', `/join#${CODE}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    expect(link.pendingJoinCode()).toBe(CODE);
    expect(window.location.href).not.toContain(CODE);
    window.removeEventListener('hashchange', link.captureJoinLink);
  });

  it('builds the share link with the code in the fragment, not the path or query', async () => {
    const link = await loadJoinLink();
    const url = new URL(link.joinLinkFor(CODE, 'https://example.test'));

    expect(url.pathname).toBe('/join');
    expect(url.search).toBe('');
    expect(url.hash).toBe(`#${CODE}`);
  });
});

describe('the code never reaches analytics', () => {
  it('is gone from every field the join visit sends', async () => {
    vi.stubEnv('VITE_FIREBASE_ANALYTICS_DISABLED', '');
    vi.stubEnv('VITE_FIREBASE_APPCHECK_SITE_KEY', '');
    window.history.replaceState(null, '', `/join#${CODE}`);
    const link = await loadJoinLink();
    const fb = (await vi.importActual('../lib/firebase')) as typeof import('../lib/firebase');

    // main.tsx order: capture first, then the app renders and logs the visit.
    link.captureJoinLink();
    fb.logPageView('join');
    fb.logChildProfileAction('join');
    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(2));

    const [, pageView] = send.mock.calls[0] as [string, Record<string, unknown>];
    expect(pageView.page_location).toBe(`${window.location.origin}/join`);
    expect(JSON.stringify(send.mock.calls)).not.toContain(CODE);
    // gtag fills page_location from document.location on events that do not
    // set it; what it would read is the URL without the code.
    expect(document.location.href).not.toContain(CODE);
  });

  it('page_view drops the fragment even if the capture ran late', async () => {
    // A second line of defence, in case the capture ever runs late: the
    // helper builds page_location from origin + pathname, never href.
    vi.stubEnv('VITE_FIREBASE_ANALYTICS_DISABLED', '');
    vi.stubEnv('VITE_FIREBASE_APPCHECK_SITE_KEY', '');
    window.history.replaceState(null, '', `/join#${CODE}`);
    vi.resetModules();
    const fb = (await vi.importActual('../lib/firebase')) as typeof import('../lib/firebase');

    fb.logPageView('join');
    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(1));

    expect(JSON.stringify(send.mock.calls)).not.toContain(CODE);
  });
});
