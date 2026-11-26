import { ROUTE_PATH } from '../types/routes';

/**
 * The share link: `/join#<code>`.
 *
 * The code is a child's id. It goes in the fragment because a fragment never
 * leaves the browser — not to the hosting server, not to LINE's link preview
 * fetcher — and it is taken out of the address bar the moment the app starts,
 * before anything can read `location.href`: Analytics fills `page_location`
 * from the document's URL for every event it sends, and a code there would
 * tie an Analytics client id to a child.
 *
 * It is held in memory only, never in browser storage: the about page promises
 * that no child's id is kept on the device. The cost is that a sign-in which
 * reloads the page (the redirect flow used in in-app browsers) loses it, and
 * the join page then asks the parent to open the link again — now signed in.
 */

let pendingCode: string | null = null;

/** What a child id can look like: a UUID today, a push-style key in older data. */
const CODE = /^[A-Za-z0-9_-]{1,64}$/;

/** Fragment with or without its `#`, possibly percent-encoded by a chat app. */
function codeFrom(hash: string): string | null {
  let raw = hash.replace(/^#/, '').trim();
  try {
    raw = decodeURIComponent(raw);
  } catch {
    return null;
  }
  return CODE.test(raw) ? raw : null;
}

/**
 * Take the code out of the address bar and keep it in memory.
 *
 * Runs once at start-up, before the first render, and again whenever the
 * fragment changes on `/join` (a link pasted into a tab already on the page
 * does not reload it). The fragment is stripped even when it is not a valid
 * code: whatever someone pasted there is no business of the URL either.
 */
export function captureJoinLink(): void {
  const { pathname, hash, search } = window.location;
  const onJoin = pathname.replace(/\/+$/, '') === ROUTE_PATH.join;
  if (!onJoin || !hash) return;

  const code = codeFrom(hash);
  if (code) pendingCode = code;
  window.history.replaceState(window.history.state, '', `${pathname}${search}`);
}

/** Start-up wiring: capture now, and on every later fragment change. */
export function installJoinLinkCapture(): void {
  captureJoinLink();
  window.addEventListener('hashchange', captureJoinLink);
}

/** The code the parent arrived with, if any. */
export function pendingJoinCode(): string | null {
  return pendingCode;
}

/** Forget the code: after joining, or when the parent declines. */
export function clearJoinCode(): void {
  pendingCode = null;
}

/** The link the share sheet hands to LINE or the system share sheet. */
export function joinLinkFor(code: string, origin: string = window.location.origin): string {
  return `${origin}${ROUTE_PATH.join}#${encodeURIComponent(code)}`;
}
