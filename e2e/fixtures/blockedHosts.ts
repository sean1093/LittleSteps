import type { Page } from '@playwright/test';

/**
 * The third-party hosts the harness refuses to talk to.
 *
 * Declaring the boundary is the point (plan §8): every one of these fails in
 * CI and in agent sandboxes anyway, and a declared abort is a one-line failure
 * instead of a thirty-second timeout nobody can attribute.
 *
 * - OpenStreetMap tiles: no outbound network in CI. Leaflet still mounts, and
 *   its markers and clusters are still asserted.
 * - `firebase.googleapis.com`: `logPageView()` runs on every in-app navigation
 *   and dynamically imports `firebase/analytics`, which fetches a web config.
 *   On the dummy credentials that request fails and retries with backoff.
 * - `*.google-analytics.com`: where the events themselves would go.
 *
 * Exported because PWA-03 asserts "no uncaught console errors" and an aborted
 * request logs one. That case allowlists exactly this list rather than
 * restating it — a second copy would drift the first time a host is added.
 */
export const BLOCKED_HOSTS = [
  'tile.openstreetmap.org',
  'firebase.googleapis.com',
  'google-analytics.com',
] as const;

/** True for a blocked host itself or any subdomain of it. */
export function isBlockedHost(hostname: string): boolean {
  return BLOCKED_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));
}

/** True when a URL — as it appears in a console message — points at a blocked host. */
export function isBlockedUrl(url: string): boolean {
  try {
    return isBlockedHost(new URL(url).hostname);
  } catch {
    return false;
  }
}

/**
 * Abort every request to a blocked host. Applied to every test by the `page`
 * fixture in `./test`, so no spec has to remember it.
 */
export async function blockThirdPartyHosts(page: Page): Promise<void> {
  await page.route(
    (url) => isBlockedHost(url.hostname),
    (route) => route.abort('blockedbyclient'),
  );
}
