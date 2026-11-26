import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FoodTrialRecord } from '../../../types';
import { toLocalDateKey } from '../../../common/utils/dateHelpers';
import FourByThreeTracker from './FourByThreeTracker';

/**
 * 這個追蹤器實作的是同一頁印出來的「每 3–5 天試一種新食材」：同一種食物天天給，
 * 觀察滿 3 天沒有反應就可以換下一種。它原本要求兩次之間隔 3 天，還把「記錄今天
 * 嘗試」藏起來三天；後來又照舊制要記滿 9 天才算完成。
 */

const dayOffset = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toLocalDateKey(date);
};

const food = (trialDates: string[]): FoodTrialRecord => ({
  id: 'f1',
  foodName: '地瓜',
  firstTriedDate: trialDates[0] ?? toLocalDateKey(),
  trialDates,
  hasAllergy: false,
  createdAt: '2026-08-01T00:00:00.000Z',
});

const renderTracker = (foodTrials: FoodTrialRecord[]) => {
  const onAddTrialDate = vi.fn();
  const user = userEvent.setup();
  render(
    <FourByThreeTracker
      foodTrials={foodTrials}
      onAddTrialDate={onAddTrialDate}
      onViewFood={vi.fn()}
    />,
  );
  return { user, onAddTrialDate };
};

describe('連續兩天嘗試同一種食物', () => {
  it('昨天試過，今天還是記得下去', async () => {
    const { user, onAddTrialDate } = renderTracker([food([dayOffset(-1)])]);

    await user.click(screen.getByRole('button', { name: '記錄今天嘗試' }));

    expect(onAddTrialDate).toHaveBeenCalledWith('f1');
  });

  it('前天、昨天都試過，今天照樣可以記', async () => {
    const { user, onAddTrialDate } = renderTracker([food([dayOffset(-2), dayOffset(-1)])]);

    await user.click(screen.getByRole('button', { name: '記錄今天嘗試' }));

    expect(onAddTrialDate).toHaveBeenCalledWith('f1');
  });

  it('今天已經記過就不再給記第二次', () => {
    renderTracker([food([dayOffset(-1), toLocalDateKey()])]);

    expect(screen.queryByRole('button', { name: '記錄今天嘗試' })).toBeNull();
    expect(screen.getByText('今天已記錄')).toBeInTheDocument();
  });
});

describe('進度依照指南：每 3 到 5 天試一種', () => {
  it('還沒記過時在第一步，要觀察的天數是 3 天', () => {
    renderTracker([food([])]);

    expect(screen.getByText('進度：0 / 3 天')).toBeInTheDocument();
    expect(screen.getByText('先給一小口')).toBeInTheDocument();
    expect(screen.getByText(/觀察/, { selector: 'p' })).toHaveTextContent('3 到 5 天');
  });

  it('記過一天就進到加量那一步', () => {
    renderTracker([food([dayOffset(-1)])]);

    expect(screen.getByText('進度：1 / 3 天')).toBeInTheDocument();
    expect(screen.getByText('沒有反應再加量')).toBeInTheDocument();
  });

  it('記滿三天就說可以試下一種，但第四天照樣記得下去', async () => {
    const { user, onAddTrialDate } = renderTracker([
      food([dayOffset(-3), dayOffset(-2), dayOffset(-1)]),
    ]);

    expect(screen.getByText('已觀察 3 天，沒有反應就可以試下一種')).toBeInTheDocument();
    expect(screen.queryByText(/進度：/)).toBeNull();

    await user.click(screen.getByRole('button', { name: '記錄今天嘗試' }));
    expect(onAddTrialDate).toHaveBeenCalledWith('f1');
  });

  it('觀察滿三天、之後沒再記的食物不再是追蹤中', () => {
    renderTracker([food([dayOffset(-10), dayOffset(-9), dayOffset(-8)])]);

    expect(screen.getByRole('heading', { name: '目前沒有正在追蹤的食物' })).toBeInTheDocument();
    expect(screen.getByText('1 種食物已觀察滿 3 天')).toBeInTheDocument();
  });

  it('只記了兩天就停下來的食物還在追蹤中', () => {
    renderTracker([food([dayOffset(-10), dayOffset(-9)])]);

    expect(screen.getByText('進度：2 / 3 天')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '記錄今天嘗試' })).toBeInTheDocument();
  });
});

describe('舊制（9 天）留下來的紀錄', () => {
  it('記到第 7 天的那一筆，七天都還在、都算進去，不再說還差幾天', () => {
    // 舊紀錄在資料庫裡是以索引為 key 的物件。
    const legacy = Object.fromEntries(
      Array.from({ length: 7 }, (_, i) => [String(i), dayOffset(-7 + i)]),
    );
    renderTracker([{ ...food([]), firstTriedDate: dayOffset(-7), trialDates: legacy }]);

    expect(screen.getByText('已觀察 7 天，沒有反應就可以試下一種')).toBeInTheDocument();
    expect(screen.getAllByText(/^第 \d 天：/)).toHaveLength(7);
    expect(screen.queryByText(/\/ 9 天/)).toBeNull();
    expect(screen.getByRole('button', { name: '記錄今天嘗試' })).toBeInTheDocument();
  });

  it('早就記滿九天的那一筆算在已觀察完的食物裡', () => {
    renderTracker([food(Array.from({ length: 9 }, (_, i) => dayOffset(-30 + i)))]);

    expect(screen.getByText('1 種食物已觀察滿 3 天')).toBeInTheDocument();
  });
});

describe('記錄過反應的食物', () => {
  it('不請家長再記一天，也不說可以試下一種', () => {
    renderTracker([{ ...food([dayOffset(-1)]), hasAllergy: true }]);

    expect(screen.queryByRole('button', { name: '記錄今天嘗試' })).toBeNull();
    expect(screen.queryByText(/可以試下一種/)).toBeNull();
    expect(screen.getByText(/先暫停這種食材，回診時問醫師/)).toBeInTheDocument();
  });
});
