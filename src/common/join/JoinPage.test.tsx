import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JoinPage from './JoinPage';
import { ChildStoreValueProvider } from '../contexts/ChildStoreContext';
import { SIGNED_OUT_CHILD_STORE } from '../contexts/signedOutChildStore';
import type { ChildStore } from '../hooks/useChildStore';
import type { ChildProfile } from '../../types';
import { ChildJoinError } from '../childJoinError';
import { captureJoinLink, clearJoinCode } from '../joinLink';
import { entryPageForChild } from '../stageEntry';
import { ROUTE_PATH } from '../../types/routes';

/**
 * The confirm screen behind a share link. The parent arrives signed in (the
 * route is gated) with the code already lifted out of the URL; the page must
 * join only on an explicit press, and say plainly why a join did not happen.
 */

vi.mock('../../contexts/AuthContext', () => ({
  useOptionalAuth: () => ({ user: { uid: 'dad', displayName: '小豆爸' } }),
}));

const CODE = '3f9a2c1e-8b7d-4e6f-a1b2-c3d4e5f60718';

const profile = (overrides: Partial<ChildProfile> = {}): ChildProfile => ({
  id: 'mine',
  name: '小樹',
  birthday: '2025-02-27',
  milestoneProgress: {},
  vaccineProgress: {},
  createdAt: '2025-02-27T00:00:00.000Z',
  createdBy: 'dad',
  members: { dad: true },
  ...overrides,
});

const renderPage = (overrides: Partial<ChildStore> = {}) => {
  const store: ChildStore = {
    ...SIGNED_OUT_CHILD_STORE,
    joinChild: vi.fn(async () => {}),
    setCurrentChild: vi.fn(async () => {}),
    ...overrides,
  };
  const user = userEvent.setup();
  const view = render(
    <ChildStoreValueProvider store={store}>
      <JoinPage />
    </ChildStoreValueProvider>,
  );
  return { store, user, unmount: view.unmount };
};

/** Arrive the way a parent does: on /join with the code in the fragment. */
const arriveWithCode = (code = CODE) => {
  window.history.replaceState(null, '', `/join#${code}`);
  captureJoinLink();
};

beforeEach(() => {
  clearJoinCode();
  window.history.replaceState(null, '', '/join');
});

describe('JoinPage', () => {
  it('does not join on load — only the button does', async () => {
    arriveWithCode();
    const { store, user } = renderPage();

    expect(screen.getByRole('heading', { name: '要加入家人的紀錄嗎？' })).toBeInTheDocument();
    expect(store.joinChild).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: '加入' }));

    expect(store.joinChild).toHaveBeenCalledTimes(1);
    expect(store.joinChild).toHaveBeenCalledWith(CODE);
  });

  it('follows a second link pasted into a tab already on /join', async () => {
    arriveWithCode();
    const { store, user } = renderPage();
    const SECOND = '9b8a7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d';

    // Only the fragment changes; main.tsx's listener captures it first.
    window.history.replaceState(null, '', `/join#${SECOND}`);
    captureJoinLink();
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    await user.click(await screen.findByRole('button', { name: '加入' }));
    expect(store.joinChild).toHaveBeenCalledWith(SECOND);
  });

  it('tells the parent which name the family will see', () => {
    arriveWithCode();
    renderPage();

    expect(screen.getByText(/名字是「小豆爸」/)).toBeInTheDocument();
  });

  it('shows the not-open message when the family has sharing switched off', async () => {
    // joinChild says this itself when the membership write is refused: the code
    // exists, but joinOpen is false.
    arriveWithCode();
    const { user } = renderPage({
      joinChild: vi.fn(async () => {
        throw new ChildJoinError(
          '這個寶寶目前未開放加入。請對方在分享視窗打開「開放用代碼加入」，再試一次',
        );
      }),
    });

    await user.click(screen.getByRole('button', { name: '加入' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('未開放加入');
    expect(screen.getByRole('button', { name: '加入' })).toBeEnabled();
  });

  it('does not show an SDK error to the parent', async () => {
    arriveWithCode();
    const { user } = renderPage({
      joinChild: vi.fn(async () => {
        throw new Error('PERMISSION_DENIED: Client does not have permission');
      }),
    });

    await user.click(screen.getByRole('button', { name: '加入' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('加入沒有成功');
    expect(alert).not.toHaveTextContent('PERMISSION_DENIED');
  });

  it('says how to recover when the code did not survive the sign-in', () => {
    // A sign-in that reloads the page loses the in-memory code by design: it is
    // never written to the device.
    renderPage();

    expect(screen.getByRole('heading', { name: '沒有收到代碼' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '加入' })).toBeNull();
  });

  it('does not show the raw code on the confirm screen', () => {
    arriveWithCode();
    renderPage();

    expect(screen.getByRole('heading', { name: '要加入家人的紀錄嗎？' })).toBeInTheDocument();
    expect(screen.queryByText(CODE, { exact: false })).toBeNull();
  });

  it('after a join pressed in this visit, says it worked rather than "already on the list"', async () => {
    arriveWithCode();
    const first = renderPage();
    await first.user.click(screen.getByRole('button', { name: '加入' }));

    // Joining puts the app back on its loading bar, which unmounts this page;
    // it comes back with the record already on the parent's list.
    first.unmount();
    const joined = profile({ id: CODE, name: '小豆', members: { mom: true, dad: true } });
    const { store, user } = renderPage({ childProfiles: [joined] });

    expect(screen.getByRole('heading', { name: '加入好了' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '你已經在這份紀錄的名單上' })).toBeNull();

    await user.click(screen.getByRole('button', { name: '打開紀錄' }));
    expect(store.setCurrentChild).toHaveBeenCalledWith(CODE);
  });

  it('a join that failed does not later read as one that worked', async () => {
    arriveWithCode();
    const first = renderPage({
      joinChild: vi.fn(async () => {
        throw new Error('network');
      }),
    });
    await first.user.click(screen.getByRole('button', { name: '加入' }));
    await screen.findByRole('alert');

    first.unmount();
    renderPage({ childProfiles: [profile({ id: CODE, name: '小豆' })] });

    expect(screen.getByRole('heading', { name: '你已經在這份紀錄的名單上' })).toBeInTheDocument();
  });

  it('arriving already on the list, offers to open the record instead of joining again', async () => {
    // No 「加入」 was pressed in this visit: the parent followed a link to a
    // record they were already a member of.
    arriveWithCode();
    const joined = profile({ id: CODE, name: '小豆', members: { mom: true, dad: true } });
    const { store, user } = renderPage({ childProfiles: [joined] });

    expect(screen.getByRole('heading', { name: '你已經在這份紀錄的名單上' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '加入' })).toBeNull();

    await user.click(screen.getByRole('button', { name: '打開紀錄' }));

    expect(store.setCurrentChild).toHaveBeenCalledWith(CODE);
    // Wherever that child's stage lives, not the join page.
    expect(window.location.pathname).toBe(ROUTE_PATH[entryPageForChild(joined)]);
  });

  it('says the account is full rather than offering a join that cannot happen', () => {
    arriveWithCode();
    const { store } = renderPage({
      childProfiles: [profile({ id: 'a' }), profile({ id: 'b' })],
    });

    expect(screen.getByRole('heading', { name: '這個帳號的檔案已經滿了' })).toBeInTheDocument();
    // Joined records count toward the limit, so "full" alone is a dead end:
    // the parent has to be told what frees a slot.
    expect(screen.getByText(/離開或刪除其中一份紀錄，就能空出一個位置/)).toBeInTheDocument();
    expect(store.joinChild).not.toHaveBeenCalled();
  });
});
