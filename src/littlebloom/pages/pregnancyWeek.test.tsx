import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ChildProfile } from '../../types';
import CheckupScheduleToolPage from './CheckupScheduleToolPage';
import WeeklyGuideToolPage from './WeeklyGuideToolPage';
import LittleBloomPage from './LittleBloomPage';
import PrenatalPage from './PrenatalPage';
import { lmpFromDueDate } from '../utils/prenatalSchedule';

/**
 * Every pregnancy screen says the same week for the same due date (#161).
 *
 * The checkup calculator used to print completed weeks and the weekly guide
 * and the hub completed weeks + 1, in the same sentence, so a parent at
 * 20 weeks 0 days read "week 20" on one public page and "week 21" on the next.
 */

const DUE = '2027-04-15';
const LMP = lmpFromDueDate(DUE);

const pregnant: ChildProfile = {
  id: 'c1',
  name: '小花',
  birthday: DUE,
  milestoneProgress: {},
  vaccineProgress: {},
  isPregnancy: true,
  pregnancyData: { childId: 'c1', dueDate: DUE, lastPeriodDate: LMP, status: 'active' },
  createdAt: '2026-07-09T00:00:00.000Z',
  createdBy: 'u1',
  members: { u1: true },
};

const GESTATION = /懷孕 (\d+) 週又 (\d+) 天/;

/** The weeks-and-days phrase a screen prints, or null if it prints none. */
function gestationOn(container: HTMLElement): string | null {
  return GESTATION.exec(container.textContent ?? '')?.[0] ?? null;
}

function everyScreen(): Record<string, string | null> {
  const read = (ui: ReactElement, fill?: () => void) => {
    const { container, unmount } = render(ui);
    fill?.();
    const phrase = gestationOn(container);
    unmount();
    return phrase;
  };
  return {
    checkup: read(<CheckupScheduleToolPage />, () =>
      fireEvent.change(screen.getByLabelText('預產期'), { target: { value: DUE } }),
    ),
    weeklyGuide: read(<WeeklyGuideToolPage />, () =>
      fireEvent.change(screen.getByLabelText('預產期'), { target: { value: DUE } }),
    ),
    hub: read(
      <LittleBloomPage
        currentChild={pregnant}
        progress={{}}
        onRecordBirth={async () => {}}
        onAddPregnancy={async () => {}}
      />,
    ),
    prenatal: read(
      <PrenatalPage
        currentChild={pregnant}
        progress={{}}
        onComplete={async () => {}}
        onUndo={async () => {}}
      />,
    ),
  };
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('one week number for the same due date', () => {
  it('reads 20 weeks 0 days on every screen on 2026-11-26, the way the clinic says it', () => {
    vi.setSystemTime(new Date(2026, 10, 26, 12));
    const phrases = everyScreen();
    expect(phrases).toEqual({
      checkup: '懷孕 20 週又 0 天',
      weeklyGuide: '懷孕 20 週又 0 天',
      hub: '懷孕 20 週又 0 天',
      prenatal: '懷孕 20 週又 0 天',
    });
  });

  it('agrees mid-week too, and the guide screens name the week of content they show', () => {
    vi.setSystemTime(new Date(2026, 10, 29, 12));
    const phrases = everyScreen();
    expect(new Set(Object.values(phrases))).toEqual(new Set(['懷孕 20 週又 3 天']));

    render(<WeeklyGuideToolPage />);
    fireEvent.change(screen.getByLabelText('預產期'), { target: { value: DUE } });
    expect(screen.getByText('今天是懷孕 20 週又 3 天，看第 21 週的內容。')).toBeInTheDocument();
  });
});

describe('a due date more than 40 weeks away', () => {
  // A mistyped year (2028 for 2027) puts the last period in the future. There
  // is no week to state then; "0 weeks 0 days, 40 weeks to go" would be wrong
  // on both counts, so every screen says nothing about weeks.
  it('prints no weeks-and-days anywhere, and the hub asks for the date to be checked', () => {
    vi.setSystemTime(new Date(2025, 10, 26, 12));
    expect(new Set(Object.values(everyScreen()))).toEqual(new Set([null]));

    render(
      <LittleBloomPage
        currentChild={pregnant}
        progress={{}}
        onRecordBirth={async () => {}}
        onAddPregnancy={async () => {}}
      />,
    );
    expect(screen.getByText(/這個預產期離現在超過 40 週，請確認日期/)).toBeInTheDocument();
    expect(screen.queryByText(/週見面/)).toBeNull();
  });
});
