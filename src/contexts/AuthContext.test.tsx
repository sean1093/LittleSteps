import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider } from '../common/ui/toast';
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { logAuthEvent } from '../lib/firebase';
import { openInExternalBrowser } from '../common/inAppBrowser';
import { AuthProvider, useAuth } from './AuthContext';

/**
 * The Auth half of account deletion.
 *
 * `deleteUser` only accepts a user who signed in recently, so
 * `auth/requires-recent-login` is the ordinary case rather than an edge one —
 * and by the time it fires the parent's data has already been deleted. Failing
 * silently there leaves an account that holds nothing and cannot be removed,
 * which is exactly the state this flow exists to prevent. So the re-auth
 * attempt, and the honest way out of it inside an in-app browser, are pinned
 * down here.
 */

const mocks = vi.hoisted(() => ({
  deleteUser: vi.fn().mockResolvedValue(undefined),
  reauthenticateWithPopup: vi.fn().mockResolvedValue({}),
  signOut: vi.fn().mockResolvedValue(undefined),
  user: { uid: 'u1', email: 'parent@example.com' },
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_auth, callback) => {
    callback(mocks.user);
    return vi.fn();
  }),
  getRedirectResult: vi.fn().mockResolvedValue(null),
  signInWithPopup: vi.fn(),
  signInWithRedirect: vi.fn(),
  signOut: mocks.signOut,
  deleteUser: mocks.deleteUser,
  reauthenticateWithPopup: mocks.reauthenticateWithPopup,
  GoogleAuthProvider: vi.fn(),
  getAuth: vi.fn(() => ({ currentUser: mocks.user })),
}));

// The global mock in src/test/setup.ts starts every test signed out, and
// `deleteAccount` reads `auth.currentUser`. This one is signed in.
vi.mock('../lib/firebase', () => ({
  auth: { currentUser: mocks.user },
  googleProvider: {},
  logAuthEvent: vi.fn(),
}));

// jsdom cannot navigate, so the reload LINE needs is observed at its call.
vi.mock('../common/inAppBrowser', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../common/inAppBrowser')>()),
  openInExternalBrowser: vi.fn(),
}));

/** The Firebase SDK throws `FirebaseError`: an `Error` carrying a `code`. */
const authError = (code: string) => Object.assign(new Error(code), { code });

function DeleteAccountButton() {
  const { deleteAccount } = useAuth();

  return (
    <button type="button" onClick={() => deleteAccount()}>
      delete
    </button>
  );
}

const setUserAgent = (value: string) =>
  Object.defineProperty(navigator, 'userAgent', { value, configurable: true });

const ORIGINAL_USER_AGENT = navigator.userAgent;

const clickDelete = async () => {
  const user = userEvent.setup();
  render(
    <ToastProvider>
      <AuthProvider>
        <DeleteAccountButton />
      </AuthProvider>
    </ToastProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'delete' }));
};

beforeEach(() => {
  vi.clearAllMocks();
  setUserAgent(ORIGINAL_USER_AGENT);
  window.history.replaceState(null, '', '/littlesteps/dashboard');
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('deleteAccount', () => {
  it('signs out and returns to the entry point once the user is gone', async () => {
    await clickDelete();

    await waitFor(() => expect(mocks.signOut).toHaveBeenCalled());
    expect(mocks.deleteUser).toHaveBeenCalledTimes(1);
    // Staying on a private route would swap the screen for a service intro
    // page, which reads as "deleting my account dropped me into LittleSteps".
    expect(window.location.pathname).toBe('/');
  });

  it('re-authenticates and deletes again when the sign-in is too old', async () => {
    mocks.deleteUser.mockRejectedValueOnce(authError('auth/requires-recent-login'));

    await clickDelete();

    await waitFor(() => expect(mocks.reauthenticateWithPopup).toHaveBeenCalled());
    expect(mocks.deleteUser).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(mocks.signOut).toHaveBeenCalled());
    expect(window.location.pathname).toBe('/');
  });

  it('asks an in-app browser to sign in again, because a redirect cannot resume', async () => {
    // LINE, Facebook and Instagram open links in a WebView with no popup, and
    // a redirect replaces the page: this flow would not exist when it came
    // back. Signing out and asking for a fresh sign-in is the way to get the
    // recent login the deletion needs.
    setUserAgent('Mozilla/5.0 (iPhone) Line/13.5.0');
    mocks.deleteUser.mockRejectedValueOnce(authError('auth/requires-recent-login'));

    await clickDelete();

    expect(await screen.findByText(/重新登入/)).toBeInTheDocument();
    expect(mocks.reauthenticateWithPopup).not.toHaveBeenCalled();
    await waitFor(() => expect(mocks.signOut).toHaveBeenCalled());
  });

  it('keeps the parent signed in when re-authentication is refused', async () => {
    // Cancelling the popup must not sign them out: they need the same button
    // again, and the account still exists.
    mocks.deleteUser.mockRejectedValueOnce(authError('auth/requires-recent-login'));
    mocks.reauthenticateWithPopup.mockRejectedValueOnce(authError('auth/popup-closed-by-user'));

    await clickDelete();

    expect(await screen.findByText(/帳號還沒刪掉/)).toBeInTheDocument();
    expect(mocks.deleteUser).toHaveBeenCalledTimes(1);
    expect(mocks.signOut).not.toHaveBeenCalled();
  });

  it('says so when the deletion fails for any other reason', async () => {
    mocks.deleteUser.mockRejectedValueOnce(authError('auth/network-request-failed'));

    await clickDelete();

    expect(await screen.findByText(/帳號還沒刪掉/)).toBeInTheDocument();
    expect(mocks.reauthenticateWithPopup).not.toHaveBeenCalled();
    expect(mocks.signOut).not.toHaveBeenCalled();
  });
});

function SignInButton() {
  const { signInWithGoogle } = useAuth();

  return (
    <button type="button" onClick={() => signInWithGoogle()}>
      sign in
    </button>
  );
}

describe('signInWithGoogle', () => {
  const clickSignIn = async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <AuthProvider>
          <SignInButton />
        </AuthProvider>
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'sign in' }));
  };

  it('records that sign-in was started, separately from whether it finished', async () => {
    // The landing page now puts the no-account tools right under the sign-in
    // button. Whether that costs sign-ins cannot be read from successes
    // alone: a parent who gives up in the Google popup and one who never
    // pressed the button look the same.
    vi.mocked(signInWithPopup).mockRejectedValueOnce(authError('auth/popup-closed-by-user'));

    await clickSignIn();

    await waitFor(() => expect(vi.mocked(signInWithPopup)).toHaveBeenCalled());
    expect(vi.mocked(logAuthEvent).mock.calls.map(([action]) => action)).toEqual(['login_start']);
  });

  it('records the start and then the success when the popup completes', async () => {
    vi.mocked(signInWithPopup).mockResolvedValueOnce({ user: { uid: 'u1' } } as never);

    await clickSignIn();

    await waitFor(() =>
      expect(vi.mocked(logAuthEvent).mock.calls.map(([action]) => action)).toEqual([
        'login_start',
        'login',
      ]),
    );
  });

  it('uses the popup in a desktop browser', async () => {
    setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
    );
    vi.mocked(signInWithPopup).mockResolvedValueOnce({ user: { uid: 'u1' } } as never);

    await clickSignIn();

    await waitFor(() => expect(vi.mocked(signInWithPopup)).toHaveBeenCalledTimes(1));
    expect(vi.mocked(signInWithRedirect)).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('in LINE, offers to reopen the page in a real browser instead of starting OAuth', async () => {
    // Google refuses OAuth inside embedded webviews (disallowed_useragent) on
    // its own page, where no error reaches the app. Starting either flow here
    // only shows a parent a Google error page.
    setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari Line/13.18.0',
    );

    await clickSignIn();

    const dialog = await screen.findByRole('dialog', { name: '請改用瀏覽器開啟' });
    expect(vi.mocked(signInWithPopup)).not.toHaveBeenCalled();
    expect(vi.mocked(signInWithRedirect)).not.toHaveBeenCalled();
    expect(within(dialog).queryByRole('button', { name: '複製連結' })).not.toBeInTheDocument();

    await userEvent.click(within(dialog).getByRole('button', { name: '用瀏覽器開啟' }));
    expect(vi.mocked(openInExternalBrowser)).toHaveBeenCalledTimes(1);
  });

  it('in another in-app browser, offers the link to copy into Chrome or Safari', async () => {
    setUserAgent(
      'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP1A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/480.0.0.0;]',
    );
    window.history.replaceState(null, '', '/littleguard?d=flu');

    await clickSignIn();

    const dialog = await screen.findByRole('dialog', { name: '請改用瀏覽器開啟' });
    expect(vi.mocked(signInWithPopup)).not.toHaveBeenCalled();
    expect(vi.mocked(signInWithRedirect)).not.toHaveBeenCalled();
    expect(dialog).toHaveTextContent(/Chrome 或 Safari/);
    expect(within(dialog).queryByRole('button', { name: '用瀏覽器開啟' })).not.toBeInTheDocument();

    // setup() replaces navigator.clipboard, so the spy goes on after it.
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, 'writeText');
    await user.click(within(dialog).getByRole('button', { name: '複製連結' }));

    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/littleguard?d=flu`);
    expect(await within(dialog).findByRole('button', { name: '已複製連結' })).toBeInTheDocument();
  });

  it('shows the link itself when the webview has no clipboard', async () => {
    setUserAgent('Mozilla/5.0 (iPhone) Instagram 300.0');

    await clickSignIn();

    const dialog = await screen.findByRole('dialog', { name: '請改用瀏覽器開啟' });
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('denied'));
    await user.click(within(dialog).getByRole('button', { name: '複製連結' }));

    expect(await within(dialog).findByText(window.location.href)).toBeInTheDocument();
  });
});
