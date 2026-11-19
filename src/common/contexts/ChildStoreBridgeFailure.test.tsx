import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChildStoreProvider, useChildStoreContext } from './ChildStoreContext';

/**
 * What a signed-in parent gets when the store's chunk will not load.
 *
 * The bridge sits beside every page, public ones included, so the page's own
 * error boundary cannot catch it. A deploy that replaced the hashed file while
 * the tab was open, or a dropped connection, must not turn a wiki article into
 * the full-screen error.
 */

// A module that fails to load is what a 404 on the hashed chunk looks like to
// React.lazy.
vi.mock('./ChildStoreBridge', () => {
  throw new Error('Failed to fetch dynamically imported module');
});

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'u1' } }),
}));

function Page() {
  const { childrenLoading } = useChildStoreContext();
  return <p>{childrenLoading ? 'article, store loading' : 'article, store settled'}</p>;
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('ChildStoreProvider when the bridge chunk fails to load', () => {
  it('keeps rendering the app, and keeps saying the store is loading', async () => {
    render(
      <ChildStoreProvider>
        <Page />
      </ChildStoreProvider>,
    );
    // Long enough for the import to reject and React to hand it to a boundary.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // Still on screen: the failure did not reach a boundary above the app.
    // Still loading: "no children" would be a claim nobody can back, and
    // loading is what brings the stall notice and its reload button.
    expect(screen.getByText('article, store loading')).toBeInTheDocument();
    expect(console.error).toHaveBeenCalled();
  });
});
