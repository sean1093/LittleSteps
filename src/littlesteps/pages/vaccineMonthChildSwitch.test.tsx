import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ChildProfile } from '../../types';
import ChildSwitcher from '../../common/components/ChildSwitcher';
import {
  ChildStoreProvider,
  useChildStoreContext,
} from '../../common/contexts/ChildStoreContext';
import VaccineTrackingPage from './VaccineTrackingPage';

/**
 * The month group this page opens on is derived from the child's age, and the
 * page does not unmount when the parent switches child — App.tsx keys its
 * error boundary on the route, not on the child. Left alone, the derived
 * default is therefore whichever child was selected on mount: switch from a
 * newborn to a two-year-old and the schedule stays on the newborn's doses
 * while the new child's completion state is ticked against them.
 *
 * Re-deriving unconditionally is the wrong fix, so the two cases below are one
 * pair and neither is redundant. The derived default follows the newly
 * selected child, but a month the parent picked outranks it and survives the
 * switch. Dropping the "picked" flag makes the second case red; ignoring it
 * the other way, and never re-deriving, makes the first.
 *
 * The page carries no switcher of its own — on this screen the parent switches
 * through the account sheet in the shell, which is why the page stays mounted
 * across the switch. The harness stands a real ChildSwitcher next to the page
 * so the switch travels the same route: through the store and back down as a
 * new `currentChild`.
 */

const mocks = vi.hoisted(() => ({
  profiles: [] as ChildProfile[],
  startChildId: 'c1',
  rerender: () => {},
}));

/**
 * A stateful stand-in for the store, because the switch has to travel through
 * the store and back down into the page for the assertions to mean anything.
 */
vi.mock('../../common/hooks/useChildStore', () => ({
  useChildStore: () => {
    const [currentChildId, setCurrentChildId] = useState(mocks.startChildId);
    // `bump` exists only so a test can edit a profile in place and re-render,
    // which is how the birthday case below reaches the page.
    const [, bump] = useState(0);
    mocks.rerender = () => bump((n) => n + 1);
    return {
      childProfiles: mocks.profiles,
      currentChildId,
      currentChild: mocks.profiles.find((child) => child.id === currentChildId),
      setCurrentChild: async (id: string) => setCurrentChildId(id),
    };
  },
}));

vi.mock('../../contexts/AuthContext', () => {
  const value = {
    user: { uid: 'u1', displayName: '測試家長', email: 'test@example.com', photoURL: null },
    loading: false,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  };
  return { useAuth: () => value, useOptionalAuth: () => value };
});

/** A child exactly `months` old today, so the test cannot age out. */
const childAged = (
  months: number,
  over: Pick<ChildProfile, 'id' | 'name'> & Partial<ChildProfile>,
): ChildProfile => {
  const birth = new Date();
  birth.setMonth(birth.getMonth() - months);
  return {
    birthday: birth.toISOString().slice(0, 10),
    milestoneProgress: {},
    vaccineProgress: {},
    createdAt: new Date().toISOString(),
    createdBy: 'u1',
    members: { u1: true },
    ...over,
  };
};

/**
 * The schedule's month groups are 0, 1, 2, 4, 5, 6, 12, 15, 18, 27, 48 and 60,
 * and the filter picks the last one the child has reached.
 */
/** Six months old: the filter derives 6. */
const bean = childAged(6, { id: 'c1', name: '小豆' });
/** Twenty-seven months old: the filter derives 27. */
const tree = childAged(27, { id: 'c2', name: '小樹' });

/** Mirrors how App.tsx wires the page: the store decides which child it is about. */
function VaccineScreen() {
  const { currentChild } = useChildStoreContext();
  return (
    <>
      <ChildSwitcher service="littlesteps" />
      <VaccineTrackingPage
        currentChild={currentChild}
        vaccineProgress={{}}
        onSetVaccineDose={() => {}}
      />
    </>
  );
}

const renderScreen = () => {
  const user = userEvent.setup();
  render(
    <ChildStoreProvider>
      <VaccineScreen />
    </ChildStoreProvider>,
  );
  return user;
};

const monthChip = (label: string) => screen.getByRole('button', { name: label });

/** Two taps: open the switcher, pick the other child. */
const switchTo = async (user: ReturnType<typeof userEvent.setup>, from: string, to: string) => {
  await user.click(screen.getByRole('button', { name: `寶寶 ${from}` }));
  await user.click(screen.getByRole('button', { name: to }));
};

beforeEach(() => {
  mocks.profiles = [bean, tree];
  mocks.startChildId = 'c1';
});

describe('switching child on the vaccine tracking page', () => {
  it('re-derives the month group while it is still the derived default', async () => {
    const user = renderScreen();
    expect(monthChip('6個月')).toHaveAttribute('aria-pressed', 'true');

    await switchTo(user, '小豆', '小樹');

    expect(await screen.findByRole('button', { name: '27個月' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(monthChip('6個月')).toHaveAttribute('aria-pressed', 'false');
  });

  it('keeps a month the parent picked, rather than re-deriving over it', async () => {
    const user = renderScreen();

    await user.click(monthChip('2個月'));
    expect(monthChip('2個月')).toHaveAttribute('aria-pressed', 'true');

    await switchTo(user, '小豆', '小樹');

    // The new child's derived group is 27; the parent's choice outranks it.
    expect(await screen.findByRole('button', { name: '寶寶 小樹' })).toBeInTheDocument();
    expect(monthChip('2個月')).toHaveAttribute('aria-pressed', 'true');
    expect(monthChip('27個月')).toHaveAttribute('aria-pressed', 'false');
  });

  it('follows a birthday correction on the child already selected', async () => {
    // The derived default is recomputed from the child every render rather than
    // remembered against an id, so correcting a birthday that was entered wrong
    // moves the filter without needing a switch away and back.
    renderScreen();
    expect(monthChip('6個月')).toHaveAttribute('aria-pressed', 'true');

    mocks.profiles = [childAged(27, { id: 'c1', name: '小豆' }), tree];
    await act(async () => mocks.rerender());

    expect(monthChip('27個月')).toHaveAttribute('aria-pressed', 'true');
    expect(monthChip('6個月')).toHaveAttribute('aria-pressed', 'false');
  });
});
