import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LOADING_CHILD_STORE } from './signedOutChildStore';
import { ChildStoreValueProvider } from './ChildStoreContext';
import { ToastProvider } from '../ui/toast';
import AccountButton from '../components/AccountButton';

/**
 * Public pages render before a signed-in parent's child list has arrived
 * (#162), with the account sheet in their header. While the list is loading,
 * no write may pretend to succeed: "delete my account" deletes the data first
 * and the Auth user second, so a data step that silently did nothing would
 * delete the user and strand the child's record.
 */

const { deleteAccount } = vi.hoisted(() => ({ deleteAccount: vi.fn().mockResolvedValue(true) }));

vi.mock('../../contexts/AuthContext', async () => {
  const actual = await vi.importActual<typeof import('../../contexts/AuthContext')>(
    '../../contexts/AuthContext',
  );
  const value = {
    user: { uid: 'u1', displayName: '測試家長', email: 'test@example.com', photoURL: null },
    loading: false,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
    deleteAccount,
  };
  return { ...actual, useAuth: () => value, useOptionalAuth: () => value };
});

describe('the store while the child list is loading', () => {
  it('refuses every write instead of resolving as if it had saved', async () => {
    const writes = Object.entries(LOADING_CHILD_STORE).filter(
      ([, value]) => typeof value === 'function',
    );
    expect(writes.length).toBeGreaterThan(10);
    for (const [name, write] of writes) {
      await expect((write as () => Promise<unknown>)(), name).rejects.toThrow();
    }
  });

  it('never deletes the account while the data step cannot run', async () => {
    window.confirm = vi.fn(() => true);
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ChildStoreValueProvider store={LOADING_CHILD_STORE}>
          <AccountButton service="littlesteps" />
        </ChildStoreValueProvider>
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: '帳號與寶寶' }));
    await user.click(await screen.findByRole('button', { name: '刪除帳號' }));

    expect(await screen.findByText('帳號還沒刪掉，請稍後再試')).toBeInTheDocument();
    await waitFor(() => expect(deleteAccount).not.toHaveBeenCalled());
  });
});
