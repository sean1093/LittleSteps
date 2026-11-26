import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VaccineScheduleToolPage from './VaccineScheduleToolPage';
import GrowthPercentileToolPage from './GrowthPercentileToolPage';
import CheckupScheduleToolPage from '../../littlebloom/pages/CheckupScheduleToolPage';
import { prenatalCheckupSchedule } from '../../littlebloom/data/prenatalCheckups';
import { vaccineSchedules } from '../data/vaccines';
import { toLocalDateKey } from '../../common/utils/dateHelpers';

/**
 * The three public calculators. Each takes a date or a few numbers and answers
 * on the page, signed out, with nothing saved.
 */
const daysFromToday = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toLocalDateKey(date);
};

describe('疫苗時程試算', () => {
  it('shows nothing to read until a birthday is given', () => {
    render(<VaccineScheduleToolPage />);
    expect(screen.queryByRole('heading', { name: /接下來要打的/ })).not.toBeInTheDocument();
  });

  it('lists every dated dose for a newborn as still ahead, and none as passed', async () => {
    const user = userEvent.setup();
    render(<VaccineScheduleToolPage />);

    await user.type(screen.getByLabelText('寶寶生日'), daysFromToday(0));

    const dated = vaccineSchedules.filter((vaccine) => vaccine.ageInMonths !== undefined).length;
    expect(screen.getByRole('heading', { name: `接下來要打的（${dated} 劑）` })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /建議日期已過/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: `把這 ${dated} 劑加到行事曆` })).toBeInTheDocument();
  });

  it('says a past date has passed, never that a dose is overdue', async () => {
    const user = userEvent.setup();
    const { container } = render(<VaccineScheduleToolPage />);

    await user.type(screen.getByLabelText('寶寶生日'), daysFromToday(-400));

    expect(screen.getByRole('heading', { name: /建議日期已過的/ })).toBeInTheDocument();
    expect(screen.getByText(/這一頁不知道哪幾劑已經打過/)).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/逾期|過期|漏打了/);
  });

  it('tells the visitor the birthday is not kept', () => {
    render(<VaccineScheduleToolPage />);
    expect(screen.getByText(/生日不會被存下來/)).toBeInTheDocument();
  });
});

describe('生長百分位試算', () => {
  const fill = async (user: ReturnType<typeof userEvent.setup>, label: RegExp, value: string) =>
    user.type(screen.getByLabelText(label), value);

  it('answers with a percentile and how to read it', async () => {
    const user = userEvent.setup();
    render(<GrowthPercentileToolPage />);

    await fill(user, /月齡/, '6');
    await fill(user, /體重/, '7.3');
    await user.click(screen.getByRole('button', { name: '算百分位' }));

    const result = screen.getByRole('region', { name: '計算結果' });
    expect(within(result).getByRole('heading', { name: '體重' })).toBeInTheDocument();
    expect(within(result).getByText(/^第 \d+ 百分位$/)).toBeInTheDocument();
    // The sentence that keeps a number from reading as a grade.
    expect(within(result).getByText(/百分位不是分數/)).toBeInTheDocument();
    expect(within(result).queryByRole('heading', { name: '身高' })).not.toBeInTheDocument();
  });

  it('asks for a measurement instead of answering with nothing', async () => {
    const user = userEvent.setup();
    render(<GrowthPercentileToolPage />);

    await fill(user, /月齡/, '6');
    await user.click(screen.getByRole('button', { name: '算百分位' }));

    expect(screen.getByRole('alert')).toHaveTextContent('至少填一項');
    expect(screen.queryByRole('region', { name: '計算結果' })).not.toBeInTheDocument();
  });

  it('says what the standard covers when the age is past three years', async () => {
    const user = userEvent.setup();
    render(<GrowthPercentileToolPage />);

    await fill(user, /月齡/, '48');
    await fill(user, /體重/, '16');
    await user.click(screen.getByRole('button', { name: '算百分位' }));

    expect(screen.getByRole('alert')).toHaveTextContent('涵蓋到滿 3 歲');
  });

  it('catches grams typed as kilograms', async () => {
    const user = userEvent.setup();
    render(<GrowthPercentileToolPage />);

    await fill(user, /月齡/, '6');
    await fill(user, /體重/, '7300');
    await user.click(screen.getByRole('button', { name: '算百分位' }));

    expect(screen.getByRole('alert')).toHaveTextContent('請確認單位');
  });
});

describe('產檢時程試算', () => {
  it('lists the whole schedule for someone who has just found out', async () => {
    const user = userEvent.setup();
    render(<CheckupScheduleToolPage />);

    // A due date 38 weeks away: about two weeks pregnant, everything ahead.
    await user.type(screen.getByLabelText('預產期'), daysFromToday(38 * 7));

    expect(
      screen.getByRole('heading', { name: `接下來的（${prenatalCheckupSchedule.length} 項）` }),
    ).toBeInTheDocument();
    expect(screen.getByText(/現在大約是懷孕第 2 週/)).toBeInTheDocument();
  });

  it('gives the same schedule from the last period as from the due date it implies', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<CheckupScheduleToolPage />);
    await user.type(screen.getByLabelText('預產期'), daysFromToday(280 - 70));
    const fromDue = screen.getAllByRole('listitem').map((node) => node.textContent);
    unmount();

    render(<CheckupScheduleToolPage />);
    await user.click(screen.getByRole('radio', { name: '最後一次月經' }));
    await user.type(screen.getByLabelText('最後一次月經的第一天'), daysFromToday(-70));
    const fromLmp = screen.getAllByRole('listitem').map((node) => node.textContent);

    expect(fromLmp).toEqual(fromDue);
    expect(fromLmp.length).toBeGreaterThan(0);
  });

  it('does not pretend to know whether a past checkup was done', async () => {
    const user = userEvent.setup();
    render(<CheckupScheduleToolPage />);

    await user.type(screen.getByLabelText('預產期'), daysFromToday(21));

    expect(screen.getByText(/建議週數已經過了。有沒有做過、需不需要補做，請問產檢醫師/)).toBeInTheDocument();
  });
});

vi.mock('../../common/utils/icsExport', async (original) => ({
  ...(await original<typeof import('../../common/utils/icsExport')>()),
  downloadCalendar: vi.fn(),
}));
