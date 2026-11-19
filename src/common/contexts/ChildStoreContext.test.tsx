import { useEffect } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChildProfile } from '../../types';
import { ChildStoreProvider, useChildStoreContext } from './ChildStoreContext';

/**
 * How the provider decides which store the tree gets.
 *
 * The real store is loaded lazily, once there is a user, so that a signed-out
 * visit never downloads the data hooks or the database SDK behind them. That
 * turned one line (`useChildStore(user)`) into a hand-off between a provider
 * and a lazily mounted bridge, and each case below is something that hand-off
 * can get wrong without any page looking broken in a unit test.
 *
 * `useChildStore` is replaced with a fake that behaves like the real one where
 * it matters here: data members keep their identity until they change, and
 * every function is a new closure on every render.
 */

const child = (id: string, name: string): ChildProfile => ({
  id,
  name,
  birthday: '2025-01-01',
  milestoneProgress: {},
  vaccineProgress: {},
  createdAt: '2025-01-02T00:00:00.000Z',
  createdBy: 'u1',
  members: { u1: true },
});

const h = vi.hoisted(() => ({
  user: null as { uid: string } | null,
  profilesByUid: {} as Record<string, unknown[]>,
  hookRenders: 0,
  tag: 'first',
  toggled: [] as string[],
}));

vi.mock('../hooks/useChildStore', () => ({
  useChildStore: (user: { uid: string }) => {
    h.hookRenders += 1;
    const tag = h.tag;
    return {
      childProfiles: h.profilesByUid[user.uid],
      currentChildId: null,
      childrenLoading: false,
      toggleMilestone: async (id: string) => {
        h.toggled.push(`${tag}:${id}`);
      },
    };
  },
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ user: h.user }),
}));

/** Everything a consumer was given, one entry per render. */
const seen: { uid: string | null; loading: boolean; names: string[]; store: unknown }[] = [];
let mounts = 0;
let latestToggle: ((id: string) => Promise<void>) | null = null;

function Consumer() {
  const store = useChildStoreContext();
  seen.push({
    uid: h.user?.uid ?? null,
    loading: store.childrenLoading,
    names: store.childProfiles.map((profile) => profile.name),
    store,
  });
  latestToggle = store.toggleMilestone;
  useEffect(() => {
    mounts += 1;
  }, []);
  return <p>{store.childrenLoading ? 'loading' : store.childProfiles.map((p) => p.name).join(',') || 'none'}</p>;
}

const tree = () => (
  <ChildStoreProvider>
    <Consumer />
  </ChildStoreProvider>
);

const last = () => seen[seen.length - 1];

beforeEach(() => {
  h.user = null;
  h.profilesByUid = { u1: [child('c1', 'Momo')], u2: [child('c9', 'Riku')] };
  h.hookRenders = 0;
  h.tag = 'first';
  h.toggled = [];
  seen.length = 0;
  mounts = 0;
  latestToggle = null;
});

describe('ChildStoreProvider', () => {
  it('gives a signed-out visitor an empty, settled store without running the store at all', async () => {
    render(tree());

    expect(screen.getByText('none')).toBeInTheDocument();
    expect(last().loading).toBe(false);
    // Give a wrongly mounted bridge time to load and run before concluding.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });
    expect(h.hookRenders).toBe(0);
  });

  it('says loading, never "no children", until the store for a signed-in parent arrives', async () => {
    h.user = { uid: 'u1' };
    render(tree());

    expect(await screen.findByText('Momo')).toBeInTheDocument();
    // Every render before the real store was a loading one.
    const beforeStore = seen.slice(0, seen.findIndex((entry) => entry.names.length > 0));
    expect(beforeStore.length).toBeGreaterThan(0);
    expect(beforeStore.every((entry) => entry.loading)).toBe(true);
  });

  it('does not remount the app when the store arrives', async () => {
    h.user = { uid: 'u1' };
    render(tree());
    await screen.findByText('Momo');

    expect(mounts).toBe(1);
  });

  it('settles: the same store object while nothing changes, and no render loop', async () => {
    h.user = { uid: 'u1' };
    const { rerender } = render(tree());
    await screen.findByText('Momo');
    const settled = last().store;
    const rendersSoFar = h.hookRenders;

    rerender(tree());
    rerender(tree());

    expect(last().store).toBe(settled);
    // One hook render per re-render of the tree, and nothing self-sustaining.
    expect(h.hookRenders - rendersSoFar).toBeLessThanOrEqual(2);
  });

  it('passes on new data when a member changes', async () => {
    h.user = { uid: 'u1' };
    const { rerender } = render(tree());
    await screen.findByText('Momo');

    h.profilesByUid = { ...h.profilesByUid, u1: [child('c1', 'Momo'), child('c2', 'Nana')] };
    rerender(tree());

    expect(await screen.findByText('Momo,Nana')).toBeInTheDocument();
  });

  it('keeps a function handed out earlier pointing at the latest render', async () => {
    h.user = { uid: 'u1' };
    const { rerender } = render(tree());
    await screen.findByText('Momo');
    const earlier = latestToggle;

    // The real store's functions close over the current child; a wrapper that
    // kept calling the first render's closure would write to the wrong one.
    h.tag = 'second';
    rerender(tree());
    await act(async () => {
      await earlier?.('m1');
    });

    expect(h.toggled).toEqual(['second:m1']);
  });

  it('never shows one account the previous account’s children', async () => {
    h.user = { uid: 'u1' };
    const { rerender } = render(tree());
    await screen.findByText('Momo');

    seen.length = 0;
    h.user = { uid: 'u2' };
    rerender(tree());
    expect(await screen.findByText('Riku')).toBeInTheDocument();

    const asSecondAccount = seen.filter((entry) => entry.uid === 'u2');
    expect(asSecondAccount.length).toBeGreaterThan(0);
    expect(asSecondAccount.some((entry) => entry.names.includes('Momo'))).toBe(false);
  });

  it('drops the store in the same render the parent signs out', async () => {
    h.user = { uid: 'u1' };
    const { rerender } = render(tree());
    await screen.findByText('Momo');

    seen.length = 0;
    h.user = null;
    rerender(tree());

    expect(seen.length).toBeGreaterThan(0);
    expect(seen.every((entry) => entry.names.length === 0 && !entry.loading)).toBe(true);
    await waitFor(() => expect(screen.getByText('none')).toBeInTheDocument());
  });
});
