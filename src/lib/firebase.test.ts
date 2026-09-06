import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Every other test mocks lib/firebase wholesale (see test/setup.ts). What is
 * under test here is the decision the module makes at load time, so each case
 * resets the module cache, changes the environment, and re-imports the real
 * module with importActual.
 */
vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({ name: '[DEFAULT]' })) }));
vi.mock('firebase/database', () => ({ getDatabase: vi.fn(() => ({})) }));

async function loadFirebase() {
  vi.resetModules();
  await vi.importActual('./firebase');
  return vi.mocked(await import('firebase/app-check'));
}

describe('App Check gate', () => {
  beforeEach(() => {
    vi.stubEnv('DEV', false);
    vi.stubEnv('VITE_FIREBASE_APPCHECK_DEBUG', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('does not initialise App Check when no site key is configured', async () => {
    vi.stubEnv('VITE_FIREBASE_APPCHECK_SITE_KEY', '');

    const { initializeAppCheck } = await loadFirebase();

    expect(initializeAppCheck).not.toHaveBeenCalled();
  });

  it('initialises App Check with reCAPTCHA v3 and auto-refresh when a site key is configured', async () => {
    vi.stubEnv('VITE_FIREBASE_APPCHECK_SITE_KEY', 'site-key-under-test');

    const { initializeAppCheck, ReCaptchaV3Provider } = await loadFirebase();

    expect(initializeAppCheck).toHaveBeenCalledTimes(1);
    const [, options] = initializeAppCheck.mock.calls[0];
    expect(options.provider).toBeInstanceOf(ReCaptchaV3Provider);
    expect((options.provider as unknown as { siteKey: string }).siteKey).toBe('site-key-under-test');
    expect(options.isTokenAutoRefreshEnabled).toBe(true);
  });

  it('keeps the app alive when initializeAppCheck throws', async () => {
    vi.stubEnv('VITE_FIREBASE_APPCHECK_SITE_KEY', 'site-key-under-test');
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.doMock('firebase/app-check', () => ({
      initializeAppCheck: vi.fn(() => {
        throw new Error('boom');
      }),
      ReCaptchaV3Provider: class {},
    }));

    await expect(loadFirebase()).resolves.toBeDefined();

    expect(error).toHaveBeenCalledTimes(1);
    vi.doUnmock('firebase/app-check');
  });
});
