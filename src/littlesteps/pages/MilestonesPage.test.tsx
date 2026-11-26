import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ChildProfile, MilestoneProgress } from '../../types';
import { milestones } from '../data/milestones';
import MilestonesPage from './MilestonesPage';

/**
 * A milestone's date used to be whatever day the parent got round to ticking
 * it, and unticking erased it without a word. These pin the three behaviours
 * that replace that: the date is chosen, it can be corrected afterwards, and
 * losing it takes a confirmation.
 */

// The switcher reads the child store; this page's behaviour does not.
vi.mock('../../common/components/ChildSwitcher', () => ({ default: () => null }));

const NOW = new Date(2026, 10, 26, 12); // 2026-11-26

// No child means the page opens on 0-2 months; take its first row from the
// data rather than naming one, so a copy edit cannot break this file.
const first = milestones.filter((m) => m.monthRange === '0-2')[0];

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const renderPage = (progress: MilestoneProgress = {}) => {
  const onToggleMilestone = vi.fn();
  const onSetMilestone = vi.fn();
  const user = userEvent.setup();
  render(
    <MilestonesPage
      progress={progress}
      onToggleMilestone={onToggleMilestone}
      onSetMilestone={onSetMilestone}
    />,
  );
  return { user, onToggleMilestone, onSetMilestone };
};

const openFirst = async (user: ReturnType<typeof userEvent.setup>) => {
  // The row's button is named by its title and summary together; match on the
  // title as plain text, since a title may contain regex punctuation.
  await user.click(
    screen.getByRole('button', { name: (name) => name.includes(first.title) }),
  );
  return screen.getByRole('dialog');
};

describe('MilestonesPage', () => {
  it('the date defaults to today and cannot be in the future', async () => {
    const { user, onSetMilestone } = renderPage();
    const dialog = await openFirst(user);

    const input = within(dialog).getByLabelText('第一次看到的日期');
    expect(input).toHaveValue('2026-11-26');
    expect(input).toHaveAttribute('max', '2026-11-26');

    fireEvent.change(input, { target: { value: '2026-11-27' } });
    expect(within(dialog).getByRole('button', { name: '會了' })).toBeDisabled();
    expect(onSetMilestone).not.toHaveBeenCalled();
  });

  it('records the day the parent picked, not the day they ticked', async () => {
    const { user, onSetMilestone, onToggleMilestone } = renderPage();
    const dialog = await openFirst(user);

    fireEvent.change(within(dialog).getByLabelText('第一次看到的日期'), {
      target: { value: '2026-11-20' },
    });
    await user.click(within(dialog).getByRole('button', { name: '會了' }));

    expect(onSetMilestone).toHaveBeenCalledWith(first.id, true, '2026-11-20');
    expect(onToggleMilestone).not.toHaveBeenCalled();
  });

  it('corrects the date of a milestone already achieved without unticking it', async () => {
    const { user, onSetMilestone, onToggleMilestone } = renderPage({
      [first.id]: { achieved: true, achievedDate: '2026-11-20' },
    });
    const dialog = await openFirst(user);

    const input = within(dialog).getByLabelText('第一次看到的日期');
    expect(input).toHaveValue('2026-11-20');

    fireEvent.change(input, { target: { value: '2026-11-18' } });
    await user.click(within(dialog).getByRole('button', { name: '儲存日期' }));

    expect(onSetMilestone).toHaveBeenCalledWith(first.id, true, '2026-11-18');
    expect(onToggleMilestone).not.toHaveBeenCalled();
  });

  it('asks before an untick erases the date, and keeps it when the parent says no', async () => {
    // happy-dom has no window.confirm, so it is stubbed rather than spied on.
    const confirm = vi.fn((_message?: string) => false);
    vi.stubGlobal('confirm', confirm);
    const { user, onToggleMilestone } = renderPage({
      [first.id]: { achieved: true, achievedDate: '2026-11-20' },
    });

    await user.click(screen.getAllByRole('button', { name: '已經會了，取消' })[0]);
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(confirm.mock.calls[0][0]).toContain(first.title);
    expect(onToggleMilestone).not.toHaveBeenCalled();

    confirm.mockReturnValue(true);
    await user.click(screen.getAllByRole('button', { name: '已經會了，取消' })[0]);
    expect(onToggleMilestone).toHaveBeenCalledWith(first.id);
  });

  it('ticks from the list without asking anything', async () => {
    const confirm = vi.fn(() => false);
    vi.stubGlobal('confirm', confirm);
    const { user, onToggleMilestone } = renderPage();

    await user.click(screen.getAllByRole('button', { name: '會了' })[0]);

    expect(confirm).not.toHaveBeenCalled();
    expect(onToggleMilestone).toHaveBeenCalledWith(first.id);
  });

  it('shows no date field when nothing can receive a date', async () => {
    const user = userEvent.setup();
    const onToggleMilestone = vi.fn();
    render(<MilestonesPage progress={{}} onToggleMilestone={onToggleMilestone} />);

    const dialog = await openFirst(user);
    expect(within(dialog).queryByLabelText('第一次看到的日期')).not.toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: '會了' }));
    expect(onToggleMilestone).toHaveBeenCalledWith(first.id);
  });

  it('says once under the list that pace varies and when to tell a doctor', () => {
    renderPage();
    expect(screen.getByText(/晚一兩個月很常見.*請在兒童健檢時告訴醫師/)).toBeInTheDocument();
  });
});

describe('MilestonesPage corrected age', () => {
  // NOW is 2026-11-26; born 2026-04-26 is 7 months old.
  const baby = (gestationalAgeWeeks?: number): ChildProfile => ({
    id: 'c1',
    name: '小豆',
    birthday: '2026-04-26',
    gestationalAgeWeeks,
    milestoneProgress: {},
    vaccineProgress: {},
    createdAt: '2026-04-26T00:00:00.000Z',
    createdBy: 'u1',
    members: { u1: true },
  });

  const renderFor = (child: ChildProfile) =>
    render(<MilestonesPage currentChild={child} progress={{}} onToggleMilestone={vi.fn()} />);

  it('says which corrected age it is showing for a preterm baby', () => {
    renderFor(baby(32));
    // 7 months, 8 weeks early: 5 months corrected.
    expect(screen.getByText('依矯正年齡 5 個月顯示')).toBeInTheDocument();
  });

  it('adds nothing for a term baby or one without birth weeks', () => {
    renderFor(baby(38));
    expect(screen.queryByText(/矯正年齡/)).not.toBeInTheDocument();
    renderFor(baby());
    expect(screen.queryByText(/矯正年齡/)).not.toBeInTheDocument();
  });
});
