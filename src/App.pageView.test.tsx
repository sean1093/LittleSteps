import { act, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Page } from './types/routes';
import { goTo } from './common/navigate';
import { metaFor } from './common/seo/pageMeta';
import { logPageView } from './lib/firebase';
import App from './App';

/**
 * One page view per page shown, whatever caused the page to change.
 *
 * There are two ways to navigate: `navigateToPage`, reached through the
 * `onNavigate` prop, and everything else — a component calling `goTo()`
 * itself, browser back/forward, and the initial load. Only the first used to
 * log, and it logged before `useDocumentMeta` had set the new title. The log
 * now hangs off the page App is showing, so these tests drive each cause and
 * count calls.
 *
 * `logPageView` is the global mock from test/setup.ts. What the real one sends
 * is pinned in lib/analytics.test.ts; here the observable is when it is called,
 * with which page, and what `document.title` is at that moment — the real
 * function reads the title synchronously, so that moment is the title it would
 * send.
 */

// Signed in, as in App.routing.test.tsx: signed out, every gated page renders
// the same intro and the sidebar that drives `onNavigate` is not on screen.
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

const logged = vi.mocked(logPageView);

/** `document.title` at the moment of each call, in call order. */
let titlesWhenLogged: string[] = [];

const visit = (path: string) => window.history.replaceState(null, '', path);
const heading = (name: RegExp) => screen.findByRole('heading', { name }, { timeout: 5000 });
const pagesLogged = () => logged.mock.calls.map(([page]) => page);

beforeEach(() => {
  titlesWhenLogged = [];
  logged.mockReset();
  logged.mockImplementation(() => {
    titlesWhenLogged.push(document.title);
  });
  // A title no route uses, so "the title was set before the call" cannot pass
  // on a value left behind by the previous test.
  document.title = 'stale title from before this page';
  visit('/');
});

describe('page views', () => {
  it('logs the page a visit lands on', async () => {
    visit('/littlesteps/milestones');
    render(<App />);
    await heading(/里程碑追蹤/);

    expect(pagesLogged()).toEqual(['littlesteps/milestones']);
  }, 20000);

  it("strips LINE's openExternalBrowser before the first page view, keeping the rest", async () => {
    // LINE reopens a link in the phone's browser when the URL carries
    // openExternalBrowser=1 (the in-app-browser sign-in sheet adds it). By the
    // time the page is in that browser the parameter is spent and must not be
    // in the URL the first page view sees.
    const searchWhenLogged: string[] = [];
    logged.mockImplementation(() => {
      searchWhenLogged.push(window.location.search);
    });
    visit('/littlesteps/milestones?openExternalBrowser=1&tab=x#top');
    render(<App />);
    await heading(/里程碑追蹤/);

    expect(searchWhenLogged).toEqual(['?tab=x']);
    expect(window.location.pathname).toBe('/littlesteps/milestones');
    expect(window.location.hash).toBe('#top');
  }, 20000);

  it('logs once for a navigation through onNavigate', async () => {
    visit('/littlesteps/dashboard');
    render(<App />);
    await heading(/成長總覽/);
    logged.mockClear();

    (await screen.findByRole('button', { name: '開啟選單' })).click();
    (await screen.findByRole('button', { name: /里程碑追蹤/ })).click();
    await heading(/里程碑追蹤/);

    expect(pagesLogged()).toEqual(['littlesteps/milestones']);
  }, 20000);

  it('logs once for a direct goTo that bypasses onNavigate', async () => {
    visit('/littlesteps/dashboard');
    render(<App />);
    await heading(/成長總覽/);
    logged.mockClear();

    act(() => goTo('littlesteps/vaccine-tracking'));
    await heading(/疫苗追蹤/);

    expect(pagesLogged()).toEqual(['littlesteps/vaccine-tracking']);
  }, 20000);

  it('logs once for browser back/forward', async () => {
    visit('/littlesteps/milestones');
    render(<App />);
    await heading(/里程碑追蹤/);
    logged.mockClear();

    // Back and forward change the URL and fire popstate; App is not remounted.
    visit('/littlesteps/report');
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await heading(/週報月報/);

    expect(pagesLogged()).toEqual(['littlesteps/report']);
  }, 20000);

  it('does not log again when App re-renders on the same page', async () => {
    visit('/littlesteps/dashboard');
    const { rerender } = render(<App />);
    await heading(/成長總覽/);
    expect(pagesLogged()).toEqual(['littlesteps/dashboard']);

    rerender(<App />);
    // Opening the sidebar is a state change inside AppContent itself.
    (await screen.findByRole('button', { name: '開啟選單' })).click();
    await screen.findByRole('button', { name: /里程碑追蹤/ });
    // A navigation event for the page already shown changes nothing either.
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(pagesLogged()).toEqual(['littlesteps/dashboard']);
  }, 20000);

  it('logs each page with its own title already in place, not the previous one', async () => {
    const titleOf = (page: Page) => metaFor(page).title;

    visit('/littlesteps/dashboard');
    render(<App />);
    await heading(/成長總覽/);

    (await screen.findByRole('button', { name: '開啟選單' })).click();
    (await screen.findByRole('button', { name: /里程碑追蹤/ })).click();
    await heading(/里程碑追蹤/);

    act(() => goTo('littlesteps/vaccine-tracking'));
    await heading(/疫苗追蹤/);

    const pages: Page[] = [
      'littlesteps/dashboard',
      'littlesteps/milestones',
      'littlesteps/vaccine-tracking',
    ];
    await waitFor(() => expect(pagesLogged()).toEqual(pages));
    expect(titlesWhenLogged).toEqual(pages.map(titleOf));
    // The three titles differ, so a title one page behind cannot match.
    expect(new Set(pages.map(titleOf)).size).toBe(pages.length);
  }, 20000);
});
