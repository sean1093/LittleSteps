import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ROUTE_PATH, type Page } from '../types/routes';
import { serviceOf } from '../common/routePolicy';

/**
 * What the analytics events are allowed to carry.
 *
 * The about page promises that usage statistics never contain a child's name,
 * birthday or the content of any record. Nothing enforced that: `logEvent` is
 * exported to any caller, and two helpers used to send a milestone id and a
 * vaccine id plus dose number, which tied to an Analytics client id is a
 * per-device trace of which milestones a child reached and which doses were
 * given. This file pins every helper's payload to a closed key set, so a field
 * added to any event has to be added here on purpose.
 *
 * The real module is loaded with importActual because test/setup.ts mocks
 * lib/firebase wholesale for every other test. `firebase/analytics` is mocked
 * to capture what would have been sent.
 */

const send = vi.fn();
/** The settings Analytics was initialised with, one entry per initialisation. */
const initialised = vi.fn();

vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({ name: '[DEFAULT]' })) }));
vi.mock('firebase/database', () => ({ getDatabase: vi.fn(() => ({})) }));
vi.mock('firebase/analytics', () => ({
  // Both entry points are mocked so that going back to getAnalytics() fails on
  // the send_page_view assertion below, not on a missing export.
  getAnalytics: vi.fn(() => ({})),
  initializeAnalytics: (_app: unknown, settings?: unknown) => {
    initialised(settings);
    return {};
  },
  isSupported: vi.fn(async () => true),
  logEvent: (_instance: unknown, name: string, params?: Record<string, unknown>) =>
    send(name, params),
}));

type Analytics = typeof import('./firebase');

async function loadRealFirebase(): Promise<Analytics> {
  vi.resetModules();
  return (await vi.importActual('./firebase')) as Analytics;
}

/** Every event a helper can emit, and the only keys each may carry. */
const ALLOWED: Record<string, string[]> = {
  page_view: [
    'page_name',
    'page_path',
    'page_location',
    'page_title',
    'app_name',
    'app_section',
    'app_feature',
  ],
  milestone_toggle: ['achieved'],
  vaccine_toggle: ['administered'],
  child_profile_action: ['action'],
  auth_action: ['action'],
};

/**
 * A key that would name something about a child. `name` on its own is not in
 * the list because `page_name` and `app_name` are legitimate page dimensions;
 * the closed allowlist above is what stops a `child_name` from arriving.
 */
const CHILD_SHAPED = /child|birth|gender|member|uid|milestone_id|vaccine_id|dose|record|diary/i;

const sent = () => send.mock.calls as [string, Record<string, unknown> | undefined][];

describe('analytics payloads', () => {
  beforeEach(() => {
    send.mockClear();
    initialised.mockClear();
    vi.stubEnv('VITE_FIREBASE_APPCHECK_SITE_KEY', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('every helper sends only the keys on its allowlist', async () => {
    const fb = await loadRealFirebase();

    fb.logPageView('littlesteps/dashboard');
    fb.logMilestoneToggle(true);
    fb.logVaccineToggle(false);
    fb.logChildProfileAction('create');
    fb.logAuthEvent('login');

    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(5));

    for (const [name, params] of sent()) {
      expect(Object.keys(ALLOWED), `unexpected event ${name}`).toContain(name);
      expect(Object.keys(params ?? {}).sort(), name).toEqual([...ALLOWED[name]].sort());
    }
  });

  it('carries no key that could name something about a child', async () => {
    const fb = await loadRealFirebase();

    fb.logPageView('littlesteps/vaccine-tracking');
    fb.logMilestoneToggle(false);
    fb.logVaccineToggle(true);

    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(3));

    for (const [name, params] of sent()) {
      for (const key of Object.keys(params ?? {})) {
        expect(key, `${name}.${key}`).not.toMatch(CHILD_SHAPED);
      }
    }
  });

  it('the toggle events say what happened, never to which item', async () => {
    // The mutation this exists for: putting the id back. A test on the
    // allowlist alone would also catch it, but this one names the reason.
    const fb = await loadRealFirebase();

    fb.logMilestoneToggle(true);
    fb.logVaccineToggle(true);

    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(2));

    expect(sent()).toEqual([
      ['milestone_toggle', { achieved: true }],
      ['vaccine_toggle', { administered: true }],
    ]);
  });

  it('page_title is the static title of the route, for every route', async () => {
    // page_view sends document.title. It is safe today only because
    // useDocumentMeta sets a title from the static meta table; a title that
    // named the current child would ride out in every page view.
    const fb = await loadRealFirebase();
    const { metaFor } = await import('../common/seo/pageMeta');
    const pages = Object.keys(ROUTE_PATH) as Page[];

    for (const page of pages) {
      document.title = metaFor(page).title;
      fb.logPageView(page);
    }

    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(pages.length));

    for (const [, params] of sent()) {
      const title = params?.page_title as string;
      expect(pages.map((page) => metaFor(page).title)).toContain(title);
    }
  });

  it('app_name is the service the page belongs to, for every route', async () => {
    // logPageView used to keep its own prefix list, and it drifted from
    // serviceOf(): three services and the about page were reported as 'main'.
    // Derived from ROUTE_PATH so a new route cannot be missed here.
    const fb = await loadRealFirebase();
    const pages = Object.keys(ROUTE_PATH) as Page[];

    for (const page of pages) fb.logPageView(page);

    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(pages.length));

    const reported = sent().map(([, params]) => [params?.page_name, params?.app_name]);
    expect(reported).toEqual(pages.map((page) => [page, serviceOf(page) ?? 'main']));
    // Not vacuous: both sides of the `?? 'main'` are exercised.
    expect(reported.some(([, app]) => app === 'main')).toBe(true);
    expect(reported.some(([, app]) => app !== 'main')).toBe(true);
  });

  it('the pages that had no branch report a section of their own', async () => {
    const fb = await loadRealFirebase();
    const expected: [Page, string][] = [
      ['littleouting', 'public'],
      ['babyoasis', 'public'],
      ['littleguard', 'public'],
      ['about', 'about'],
    ];

    for (const [page] of expected) fb.logPageView(page);

    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(expected.length));

    expect(sent().map(([, params]) => [params?.page_name, params?.app_section])).toEqual(expected);
  });

  it('turns off the automatic page_view when Analytics is initialised', async () => {
    // gtag's `config` sends a page_view of its own unless told not to. App
    // sends one explicitly for every page, so the automatic one counted the
    // first page of a visit twice.
    const fb = await loadRealFirebase();

    fb.logPageView('home');
    fb.logPageView('about');

    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(2));

    expect(initialised).toHaveBeenCalledTimes(1);
    expect(initialised).toHaveBeenCalledWith({ config: { send_page_view: false } });
  });

  it('still sends events when Analytics was already initialised for the app', async () => {
    // A second initializeAnalytics() for the same app throws. The module only
    // runs once in production, but HMR re-runs it in development, and the
    // throw used to be swallowed, leaving Analytics dead until a reload.
    initialised.mockImplementationOnce(() => {
      throw Object.assign(new Error('already initialised'), {
        code: 'analytics/already-initialized',
      });
    });
    const fb = await loadRealFirebase();

    fb.logPageView('home');

    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(1));
  });

  it('sends nothing and never initialises Analytics when the build disables it', async () => {
    // The E2E build sets this: its dummy credentials fail the installation
    // request, and with a page view on every first load that failure would
    // reach the console on every route.
    vi.stubEnv('VITE_FIREBASE_ANALYTICS_DISABLED', 'true');
    const fb = await loadRealFirebase();

    fb.logPageView('home');
    fb.logAuthEvent('login');
    // Enabled, both events arrive within a few microtasks; give them longer.
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(initialised).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });
});
