import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WeeklyGuide from './WeeklyGuide';
import { pregnancyGuides } from '../data/pregnancyGuides';

/**
 * The warning box lists the signs that need a doctor soon; the article on
 * when to go to hospital right away is the full answer, so the box links to it.
 */
const withWarnings = pregnancyGuides.find((guide) => guide.warningSignals.length > 0)!.week;
const withoutWarnings = pregnancyGuides.find((guide) => guide.warningSignals.length === 0)!.week;

afterEach(() => {
  window.history.replaceState(null, '', '/');
});

describe('WeeklyGuide warning box link', () => {
  it('links to the when-to-go-now article and opens it in the wiki', async () => {
    const user = userEvent.setup();
    render(<WeeklyGuide week={withWarnings} currentWeek={null} onWeekChange={vi.fn()} />);

    const link = screen.getByRole('link', { name: '孕期什麼狀況要立刻去醫院' });
    expect(link).toHaveAttribute('href', '/littlebloom/wiki/health-when-to-go-now');

    await user.click(link);
    expect(window.location.pathname).toBe('/littlebloom/wiki/health-when-to-go-now');
  });

  it('shows no link in a week without a warning box', () => {
    render(<WeeklyGuide week={withoutWarnings} currentWeek={null} onWeekChange={vi.fn()} />);
    expect(screen.queryByRole('link', { name: '孕期什麼狀況要立刻去醫院' })).toBeNull();
  });
});
