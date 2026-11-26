import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JoinIntro from './JoinIntro';
import { openInExternalBrowser } from '../inAppBrowser';
import { captureJoinLink, clearJoinCode } from '../joinLink';

/**
 * The signed-out view of a share link. Share links mostly arrive in LINE,
 * where Google refuses sign-in, so there the first button must be the way out
 * of LINE, not a sign-in button that only opens a sheet explaining why it
 * cannot work.
 */

// jsdom cannot navigate, so the reopen itself is observed at the helper. The
// copy-link path below proves the code rides along on the link.
vi.mock('../inAppBrowser', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../inAppBrowser')>()),
  openInExternalBrowser: vi.fn(),
}));

const LINE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Line/13.5.0';
const INSTAGRAM_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 300.0.0';
const SAFARI_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

const CODE = '3f9a2c1e-8b7d-4e6f-a1b2-c3d4e5f60718';
const ORIGINAL_USER_AGENT = navigator.userAgent;

const setUserAgent = (value: string) =>
  Object.defineProperty(navigator, 'userAgent', { value, configurable: true });

const renderIntro = (ua: string) => {
  setUserAgent(ua);
  window.history.replaceState(null, '', `/join#${CODE}`);
  captureJoinLink();
  const onSignIn = vi.fn(async () => {});
  render(<JoinIntro onSignIn={onSignIn} />);
  return { onSignIn, user: userEvent.setup() };
};

beforeEach(() => {
  vi.clearAllMocks();
  clearJoinCode();
});

afterEach(() => {
  setUserAgent(ORIGINAL_USER_AGENT);
  window.history.replaceState(null, '', '/');
});

describe('JoinIntro', () => {
  it('in LINE, the primary action reopens the page in the phone browser', async () => {
    const { onSignIn, user } = renderIntro(LINE_UA);

    expect(screen.queryByRole('button', { name: '使用 Google 登入' })).toBeNull();
    await user.click(screen.getByRole('button', { name: '用瀏覽器開啟' }));

    expect(openInExternalBrowser).toHaveBeenCalledTimes(1);
    expect(onSignIn).not.toHaveBeenCalled();
  });

  it('in another in-app browser, the primary action copies the link with the code on it', async () => {
    const { onSignIn, user } = renderIntro(INSTAGRAM_UA);
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    expect(screen.queryByRole('button', { name: '使用 Google 登入' })).toBeNull();
    await user.click(screen.getByRole('button', { name: '複製連結' }));

    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/join#${CODE}`);
    expect(await screen.findByRole('button', { name: '已複製連結' })).toBeInTheDocument();
    expect(onSignIn).not.toHaveBeenCalled();
  });

  it('in a real browser, the primary action is Google sign-in', async () => {
    const { onSignIn, user } = renderIntro(SAFARI_UA);

    expect(screen.queryByRole('button', { name: '用瀏覽器開啟' })).toBeNull();
    await user.click(screen.getByRole('button', { name: '使用 Google 登入' }));

    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['LINE', LINE_UA],
    ['Safari', SAFARI_UA],
  ])('says a Google account is needed (%s)', (_label, ua) => {
    renderIntro(ua);

    expect(screen.getByText('需要一個 Google 帳號才能加入。')).toBeInTheDocument();
  });
});
