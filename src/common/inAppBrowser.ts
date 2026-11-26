/**
 * In-app browsers: the webviews LINE, Facebook, Instagram and the like open
 * links in.
 *
 * Google refuses OAuth inside them (`disallowed_useragent`). The refusal is
 * shown on Google's own page, after the redirect, so the app never sees an
 * error it could report. The only way through is to get the parent into a
 * real browser before sign-in starts.
 */

import { currentLinkWithJoinCode } from './joinLink';

export type InAppBrowser = 'line' | 'other';

/** LINE's documented query parameter for leaving its webview. */
export const OPEN_EXTERNAL_BROWSER_PARAM = 'openExternalBrowser';

const LINE_PATTERN = /Line\//i;

const OTHER_WEBVIEW_PATTERNS = [
  /FBAN|FBAV/i, // Facebook
  /Instagram/i,
  /Twitter/i,
  /Messenger/i, // Facebook Messenger
  /MicroMessenger/i, // WeChat
  /WebView/i, // generic WebView
  /wv\)/i, // Android WebView marker
];

/** Which in-app browser this is, or null in a real browser. */
export function inAppBrowser(
  ua: string = navigator.userAgent || navigator.vendor,
): InAppBrowser | null {
  if (LINE_PATTERN.test(ua)) return 'line';
  if (OTHER_WEBVIEW_PATTERNS.some((pattern) => pattern.test(ua))) return 'other';
  return null;
}

/** The same URL, asking LINE to open it in the phone's default browser. */
export function withOpenExternalBrowser(href: string): string {
  const url = new URL(href);
  url.searchParams.set(OPEN_EXTERNAL_BROWSER_PARAM, '1');
  return url.toString();
}

/**
 * Reloads the current page through LINE's external-browser parameter. On a
 * share link the join code goes along (see currentLinkWithJoinCode).
 */
export function openInExternalBrowser(): void {
  window.location.assign(withOpenExternalBrowser(currentLinkWithJoinCode()));
}

/**
 * Removes `openExternalBrowser` from the address bar without a navigation.
 *
 * Once the page is in the real browser the parameter has done its job. Left
 * in place it would end up in bookmarks and in links shared onwards, and it
 * must not be in the URL when the first page view is logged. Every other
 * parameter and the hash are kept.
 */
export function stripOpenExternalBrowserParam(): void {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(OPEN_EXTERNAL_BROWSER_PARAM)) return;
  url.searchParams.delete(OPEN_EXTERNAL_BROWSER_PARAM);
  window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
}
