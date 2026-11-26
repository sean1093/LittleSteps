import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VaccineScheduleToolPage from './VaccineScheduleToolPage';
import GrowthPercentileToolPage from './GrowthPercentileToolPage';
import CheckupScheduleToolPage from '../../littlebloom/pages/CheckupScheduleToolPage';
import WeeklyGuideToolPage from '../../littlebloom/pages/WeeklyGuideToolPage';
import { pregnancyGuides } from '../../littlebloom/data/pregnancyGuides';
import { prenatalCheckupSchedule } from '../../littlebloom/data/prenatalCheckups';
import { vaccineSchedules } from '../data/vaccines';
import { toLocalDateKey } from '../../common/utils/dateHelpers';

/**
 * The public calculators. Each takes a date or a few numbers and answers
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

    // 一行一劑，但同一次門診擇一的兩種產品（輪狀病毒 2 劑型或 3 劑型）併成
    // 一行：家長那天只會打其中一種。
    const datedRows = vaccineSchedules.filter((vaccine) => vaccine.ageInMonths !== undefined);
    const alternatives = datedRows.filter((vaccine) => vaccine.alternative);
    const visits = new Set(
      alternatives.map((v) => `${v.alternative!.group}|${v.ageInMonths}|${v.currentDose ?? 1}`),
    );
    const dated = datedRows.length - alternatives.length + visits.size;
    expect(dated).toBeLessThan(datedRows.length);
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

  it('announces a summary of the result in a polite status region', async () => {
    const user = userEvent.setup();
    render(<VaccineScheduleToolPage />);
    // Mounted before there is anything to say, so the first result is read too.
    expect(screen.getByRole('status')).toBeEmptyDOMElement();

    await user.type(screen.getByLabelText('寶寶生日'), daysFromToday(-400));

    const upcoming = screen.getByRole('heading', { name: /^接下來要打的/ }).textContent!;
    const past = screen.getByRole('heading', { name: /^建議日期已過的/ }).textContent!;
    expect(screen.getByRole('status')).toHaveTextContent(`${upcoming}；${past}`);
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

  it('takes focus and the view to the result heading after a successful submit', async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    try {
      render(<GrowthPercentileToolPage />);

      await fill(user, /月齡/, '6');
      await fill(user, /體重/, '7.3');
      // Typing alone moves nothing.
      expect(scrollIntoView).not.toHaveBeenCalled();
      await user.click(screen.getByRole('button', { name: '算百分位' }));

      expect(screen.getByRole('heading', { name: '計算結果' })).toHaveFocus();
      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      // A jump, not a smooth scroll: an explicit 'smooth' would override reduced motion.
      expect(scrollIntoView.mock.calls[0][0]).not.toMatchObject({ behavior: 'smooth' });
    } finally {
      delete (Element.prototype as Partial<Element>).scrollIntoView;
    }
  });

  it('leaves focus alone when the submit is refused', async () => {
    const user = userEvent.setup();
    render(<GrowthPercentileToolPage />);

    await fill(user, /月齡/, '6');
    const button = screen.getByRole('button', { name: '算百分位' });
    await user.click(button);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(button).toHaveFocus();
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
  it('reads a preterm baby at the corrected age and says so', async () => {
    const user = userEvent.setup();
    render(<GrowthPercentileToolPage />);

    await fill(user, /月齡/, '7');
    await fill(user, /出生週數/, '32');
    await fill(user, /體重/, '7');
    await user.click(screen.getByRole('button', { name: '算百分位' }));

    const result = screen.getByRole('region', { name: '計算結果' });
    expect(within(result).getByText('依矯正月齡約 5 個月對照（實際 7 個月）。')).toBeInTheDocument();
  });

  it('says nothing about correction for a baby born at term', async () => {
    const user = userEvent.setup();
    render(<GrowthPercentileToolPage />);

    await fill(user, /月齡/, '7');
    await fill(user, /出生週數/, '38');
    await fill(user, /體重/, '7.5');
    await user.click(screen.getByRole('button', { name: '算百分位' }));

    expect(screen.getByRole('region', { name: '計算結果' })).not.toHaveTextContent('矯正');
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
    expect(screen.getByText('今天是懷孕 2 週又 0 天。')).toBeInTheDocument();
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

  it('sets checkups whose window is open now apart from the ones not started yet', async () => {
    const user = userEvent.setup();
    render(<CheckupScheduleToolPage />);

    // 13 weeks and 3 days: the second checkup's window (weeks 12 to 15) is open,
    // the third's (from week 16) has not started.
    await user.type(screen.getByLabelText('預產期'), daysFromToday(280 - (13 * 7 + 3)));

    const openNow = screen.getByRole('heading', { name: /^現在可以做（\d+ 項）$/ }).closest('section')!;
    const upcoming = screen.getByRole('heading', { name: /^接下來的（\d+ 項）$/ }).closest('section')!;
    expect(within(openNow).getByRole('heading', { name: /第 2 次公費產檢/ })).toBeInTheDocument();
    expect(within(openNow).queryByRole('heading', { name: /第 3 次公費產檢/ })).not.toBeInTheDocument();
    expect(within(upcoming).getByRole('heading', { name: /第 3 次公費產檢/ })).toBeInTheDocument();
    expect(within(upcoming).queryByRole('heading', { name: /第 2 次公費產檢/ })).not.toBeInTheDocument();

    // Both groups still go to the calendar together.
    const ahead = within(openNow).getAllByRole('listitem').length + within(upcoming).getAllByRole('listitem').length;
    expect(screen.getByRole('button', { name: `把這 ${ahead} 項加到行事曆` })).toBeInTheDocument();
  });

  it('names the date the parent actually entered as the basis of the weeks', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<CheckupScheduleToolPage />);
    await user.type(screen.getByLabelText('預產期'), daysFromToday(200));
    expect(screen.getByText(/週數由填入的預產期往回推算/)).toBeInTheDocument();
    expect(screen.queryByText(/週數依最後一次月經/)).not.toBeInTheDocument();
    unmount();

    render(<CheckupScheduleToolPage />);
    await user.click(screen.getByRole('radio', { name: '最後一次月經' }));
    await user.type(screen.getByLabelText('最後一次月經的第一天'), daysFromToday(-80));
    expect(screen.getByText(/週數依最後一次月經的第一天推算/)).toBeInTheDocument();
    expect(screen.queryByText(/預產期往回推算/)).not.toBeInTheDocument();
  });

  it('does not pretend to know whether a past checkup was done', async () => {
    const user = userEvent.setup();
    render(<CheckupScheduleToolPage />);

    await user.type(screen.getByLabelText('預產期'), daysFromToday(21));

    expect(screen.getByText(/建議週數已經過了。有沒有做過、需不需要補做，請問產檢醫師/)).toBeInTheDocument();
  });
});

describe('孕期每週指南', () => {
  const titleOf = (week: number) => pregnancyGuides.find((guide) => guide.week === week)!.title;

  it('opens on the week the due date puts the pregnancy in', async () => {
    const user = userEvent.setup();
    render(<WeeklyGuideToolPage />);
    expect(screen.queryByRole('heading', { name: titleOf(1) })).not.toBeInTheDocument();

    // 20 completed weeks and 3 days: "week 21".
    await user.type(screen.getByLabelText('預產期'), daysFromToday(280 - (20 * 7 + 3)));

    expect(screen.getByRole('heading', { name: titleOf(21) })).toBeInTheDocument();
    expect(screen.getByText('今天是懷孕 20 週又 3 天，看第 21 週的內容。')).toBeInTheDocument();
  });

  it('reads the week line out through a polite status region', async () => {
    const user = userEvent.setup();
    render(<WeeklyGuideToolPage />);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();

    await user.type(screen.getByLabelText('預產期'), daysFromToday(280 - (20 * 7 + 3)));

    expect(screen.getByRole('status')).toHaveTextContent('今天是懷孕 20 週又 3 天，看第 21 週的內容。');
  });

  it('steps to the next and previous week, and back to this one', async () => {
    const user = userEvent.setup();
    render(<WeeklyGuideToolPage />);
    await user.type(screen.getByLabelText('預產期'), daysFromToday(280 - (20 * 7 + 3)));

    await user.click(screen.getByRole('button', { name: '下一週' }));
    expect(screen.getByRole('heading', { name: titleOf(22) })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '上一週' }));
    await user.click(screen.getByRole('button', { name: '上一週' }));
    expect(screen.getByRole('heading', { name: titleOf(20) })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '回到本週' }));
    expect(screen.getByRole('heading', { name: titleOf(21) })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '回到本週' })).not.toBeInTheDocument();
  });

  it('stops at week 1 and week 40 instead of stepping off the guide', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<WeeklyGuideToolPage />);
    await user.type(screen.getByLabelText('預產期'), daysFromToday(280 - 2));
    expect(screen.getByRole('heading', { name: titleOf(1) })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '上一週' })).toBeDisabled();
    unmount();

    render(<WeeklyGuideToolPage />);
    await user.type(screen.getByLabelText('預產期'), daysFromToday(2));
    expect(screen.getByRole('heading', { name: titleOf(40) })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '下一週' })).toBeDisabled();
  });

  it('is still week 40 on the due date itself, and past term only the day after', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<WeeklyGuideToolPage />);
    await user.type(screen.getByLabelText('預產期'), daysFromToday(0));
    // The past-term state also falls back to week 40's guide, so the heading
    // alone cannot tell them apart; the notice can.
    expect(screen.getByRole('heading', { name: titleOf(40) })).toBeInTheDocument();
    expect(screen.queryByText(/這個預產期已經過了/)).not.toBeInTheDocument();
    unmount();

    render(<WeeklyGuideToolPage />);
    await user.type(screen.getByLabelText('預產期'), daysFromToday(-1));
    expect(screen.getByRole('status')).toHaveTextContent('這個預產期已經過了');
  });

  it('says so when the due date is out of range rather than guessing a week', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<WeeklyGuideToolPage />);
    await user.type(screen.getByLabelText('預產期'), daysFromToday(300));
    expect(screen.getByRole('status')).toHaveTextContent('請確認日期');
    unmount();

    render(<WeeklyGuideToolPage />);
    await user.type(screen.getByLabelText('預產期'), daysFromToday(-20));
    expect(screen.getByRole('status')).toHaveTextContent('這個預產期已經過了');
  });

  it('keeps the due date nowhere but the page', async () => {
    const user = userEvent.setup();
    localStorage.clear();
    sessionStorage.clear();
    const due = daysFromToday(150);
    render(<WeeklyGuideToolPage />);
    await user.type(screen.getByLabelText('預產期'), due);

    expect(screen.getByText(/日期不會被存下來/)).toBeInTheDocument();
    const stored = [localStorage, sessionStorage].flatMap((store) =>
      Array.from({ length: store.length }, (_, i) => store.getItem(store.key(i)!) ?? ''),
    );
    expect(stored.join('\n')).not.toContain(due);
    expect(window.location.href).not.toContain(due);
  });
});

vi.mock('../../common/utils/icsExport', async (original) => ({
  ...(await original<typeof import('../../common/utils/icsExport')>()),
  downloadCalendar: vi.fn(),
}));
