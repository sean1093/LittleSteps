import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DailyLog, FeedingData, SleepData } from '../../../types';
import LogEntryModal from './LogEntryModal';

/**
 * 這張表以前有兩個會靜靜吃掉資料的洞。
 *
 * 一是寫入失敗照樣關閉：onSave 的 rejection 被上層接走變成一則 toast，表單當成
 * 成功關掉，家長剛打的東西全部消失，而表單自己的錯誤框永遠顯示不出來。
 *
 * 二是結束時間早於開始時間沒人擋，calculateDuration 會存進負數；列表印成
 * 「0分鐘」，睡眠平均、報告與建議卻被它一路往下拉。跨夜睡眠不在此列——兩個欄位
 * 都是 datetime-local，各自帶日期，22:30 睡到隔天 06:00 本來就是正的。
 */

const renderModal = (props: Partial<Parameters<typeof LogEntryModal>[0]> = {}) => {
  const onSave = vi.fn().mockResolvedValue(undefined);
  const onClose = vi.fn();
  const user = userEvent.setup();
  render(
    <LogEntryModal
      isOpen
      onClose={onClose}
      onSave={onSave}
      logType="feeding"
      {...props}
    />,
  );
  return { user, onSave, onClose };
};

/** datetime-local 沒辦法用打字輸入，直接改值再讓 React 收到 change。 */
const setDateTime = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe('寫入失敗時', () => {
  it('表單留在原地，剛填的奶量還在，錯誤就顯示在表單裡', async () => {
    const { user, onSave, onClose } = renderModal();
    vi.mocked(onSave).mockRejectedValue(new Error('權限不足，無法寫入'));

    await user.type(screen.getByLabelText('奶量（ml）'), '120');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('權限不足，無法寫入');
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByLabelText('奶量（ml）')).toHaveValue(120);
  });

  it('寫入成功才關', async () => {
    const { user, onSave, onClose } = renderModal();

    await user.type(screen.getByLabelText('奶量（ml）'), '120');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});

describe('睡眠的起訖時間', () => {
  it('結束時間早於開始時間就不給存，並說明怎麼填跨夜', async () => {
    const { user, onSave } = renderModal({ logType: 'sleep' });

    setDateTime('開始時間 *', '2026-09-01T22:30');
    setDateTime('結束時間', '2026-09-01T06:00');

    expect(screen.getByRole('alert')).toHaveTextContent('結束時間要晚於開始時間');
    // 負數的時長不該先被算出來給人看
    expect(screen.queryByText(/時長：/)).toBeNull();

    await user.click(screen.getByRole('button', { name: '儲存' }));
    expect(onSave).not.toHaveBeenCalled();
  });

  it('相同時刻也算不出睡眠，一樣擋下來', () => {
    renderModal({ logType: 'sleep' });

    setDateTime('開始時間 *', '2026-09-01T22:30');
    setDateTime('結束時間', '2026-09-01T22:30');

    expect(screen.getByRole('alert')).toHaveTextContent('結束時間要晚於開始時間');
  });

  it('跨夜睡眠照收，時長是正的 450 分鐘', async () => {
    const { user, onSave } = renderModal({ logType: 'sleep' });

    setDateTime('開始時間 *', '2026-09-01T22:30');
    setDateTime('結束時間', '2026-09-02T06:00');

    expect(screen.getByText('時長：450 分鐘')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '儲存' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    const saved = onSave.mock.calls[0][0] as Omit<DailyLog, 'id'>;
    expect((saved.data as SleepData).duration).toBe(450);
  });
});

describe('擠奶', () => {
  it('存成 pumping，帶擠出量、時間與哪一邊', async () => {
    const { user, onSave } = renderModal({ logType: 'feeding' });

    await user.selectOptions(screen.getByLabelText('類型 *'), 'pumping');
    await user.selectOptions(screen.getByLabelText('哪一邊'), 'left');
    await user.type(screen.getByLabelText('擠出量（ml）'), '150');
    await user.type(screen.getByLabelText('時長（分鐘）'), '20');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    const saved = onSave.mock.calls[0][0] as Omit<DailyLog, 'id'>;
    const data = saved.data as FeedingData;
    expect(data.feedingType).toBe('pumping');
    expect(data.amount).toBe(150);
    expect(data.duration).toBe(20);
    expect(data.side).toBe('left');
  });

  it('哪一邊只屬於擠奶，換成瓶餵就不會被帶著走', async () => {
    const { user, onSave } = renderModal({ logType: 'feeding' });

    await user.selectOptions(screen.getByLabelText('類型 *'), 'pumping');
    await user.selectOptions(screen.getByLabelText('哪一邊'), 'both');
    await user.selectOptions(screen.getByLabelText('類型 *'), 'breast_milk_bottle');

    expect(screen.queryByLabelText('哪一邊')).toBeNull();

    await user.type(screen.getByLabelText('奶量（ml）'), '120');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    const data = (onSave.mock.calls[0][0] as Omit<DailyLog, 'id'>).data as FeedingData;
    expect(data.feedingType).toBe('breast_milk_bottle');
    expect(data.side).toBeUndefined();
  });
});

/*
  週報畫了一張夜醒趨勢卡，但這個欄位全 app 沒有任何地方寫得進去，所以那張卡
  永遠說「持平」——讀起來是「寶寶的夜醒沒有變化」，實情是從來沒有人問過。
*/
describe('夜醒次數', () => {
  it('填了就存進這一段睡眠', async () => {
    const { user, onSave } = renderModal({ logType: 'sleep' });

    setDateTime('開始時間 *', '2026-09-01T22:30');
    setDateTime('結束時間', '2026-09-02T06:00');
    await user.click(screen.getByRole('button', { name: '增加夜醒次數' }));
    await user.click(screen.getByRole('button', { name: '增加夜醒次數' }));
    await user.click(screen.getByRole('button', { name: '儲存' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    const saved = onSave.mock.calls[0][0] as Omit<DailyLog, 'id'>;
    expect((saved.data as SleepData).nightWakings).toBe(2);
  });

  it('留白存的是「沒問到」，不是 0 次', async () => {
    const { user, onSave } = renderModal({ logType: 'sleep' });

    setDateTime('開始時間 *', '2026-09-01T22:30');
    setDateTime('結束時間', '2026-09-02T06:00');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    const saved = onSave.mock.calls[0][0] as Omit<DailyLog, 'id'>;
    expect((saved.data as SleepData).nightWakings).toBeUndefined();
  });

  it('編輯既有紀錄時帶出原本的次數，且不會低於 0', async () => {
    const editingLog: DailyLog = {
      id: 'sleep-1',
      childId: 'c1',
      type: 'sleep',
      timestamp: '2026-09-01T14:30:00.000Z',
      data: {
        startTime: '2026-09-01T14:30:00.000Z',
        endTime: '2026-09-01T22:00:00.000Z',
        duration: 450,
        nightWakings: 1,
      },
      createdAt: '2026-09-01T14:30:00.000Z',
    };
    const { user } = renderModal({ logType: 'sleep', editingLog });

    const field = screen.getByLabelText('夜醒次數');
    expect(field).toHaveValue(1);

    await user.click(screen.getByRole('button', { name: '減少夜醒次數' }));
    await user.click(screen.getByRole('button', { name: '減少夜醒次數' }));
    expect(field).toHaveValue(0);
  });
});
