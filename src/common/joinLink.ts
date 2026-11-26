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
 * that no child's id is kept on the device. Sign-in runs in a popup, so the
 * page and the code survive it. An in-app browser cannot sign in at all; its
 * sheet reopens the page in a real browser with the code put back on the link
 * (currentLinkWithJoinCode). Anything else that reloads the page loses the
 * code, and the join page then asks the parent to open the link again.
 */

let pendingCode: string | null = null;

/**
 * The code the parent pressed 「加入」 for in this visit, if any.
 *
 * Joining puts the app back on its loading bar, which unmounts the join page,
 * so the page cannot remember the press in its own state. Without this, the
 * page that comes back cannot tell "you just joined" from "you were already
 * on the list" and greets a successful join with the wording of the second.
 * Memory only, like the code itself, and cleared with it.
 */
let pressedJoinCode: string | null = null;

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
  pressedJoinCode = null;
}

/**
 * Note that the parent pressed 「加入」 for this code, or, with null, that the
 * join failed. Set before the join starts: the page can unmount before the
 * join's promise settles.
 */
export function noteJoinPressed(code: string | null): void {
  pressedJoinCode = code;
}

/** Whether 「加入」 was pressed for this code in this visit. */
export function joinPressedFor(code: string): boolean {
  return pressedJoinCode === code;
}

/**
 * This page's address, with the join code put back if the parent arrived
 * through a share link.
 *
 * The code left the address bar at start-up, so `location.href` on `/join` is
 * a link to nothing. The in-app browser sheet reopens or copies this page to
 * get the parent into a real browser where Google sign-in works; without the
 * code, a grandparent following a link from LINE would land on a join page
 * that has forgotten which child it was for.
 */
export function currentLinkWithJoinCode(href: string = window.location.href): string {
  const url = new URL(href);
  const onJoin = url.pathname.replace(/\/+$/, '') === ROUTE_PATH.join;
  if (onJoin && pendingCode) url.hash = encodeURIComponent(pendingCode);
  return url.toString();
}

/** The link the share sheet hands to LINE or the system share sheet. */
export function joinLinkFor(code: string, origin: string = window.location.origin): string {
  return `${origin}${ROUTE_PATH.join}#${encodeURIComponent(code)}`;
}
