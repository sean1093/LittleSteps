import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DailyLog, FeedingData, SleepData } from '../../../types';
import LogEntryModal from './LogEntryModal';
import { DAILY_LOG_NOTES_LIMIT } from '../../../common/recordLimits';

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

/*
  這張表以前每次都從 breast_left 和空白奶量開始，所以一位餵配方奶的家長
  一天要重打同樣的 120 八次。上一筆的值要真的填進欄位，不是灰色提示。
*/
describe('沿用上一筆', () => {
  const lastFormula: DailyLog = {
    id: 'f-last',
    childId: 'c1',
    type: 'feeding',
    timestamp: '2026-09-01T02:00:00.000Z',
    data: { feedingType: 'formula', amount: 120, duration: 10, notes: '喝很快' },
    createdAt: '2026-09-01T02:00:00.000Z',
  };

  it('新增餵奶時帶出上次的類型與奶量，而且是真的填在欄位裡', () => {
    renderModal({ logType: 'feeding', lastLog: lastFormula });

    expect(screen.getByRole('radio', { name: '配方奶' })).toBeChecked();
    expect(screen.getByLabelText('奶量（ml）')).toHaveValue(120);
    expect(screen.getByLabelText('時長（分鐘）')).toHaveValue(10);
  });

  it('備註不沿用：那是上一次那一餐的事', () => {
    renderModal({ logType: 'feeding', lastLog: lastFormula });

    expect(screen.getByLabelText('備註')).toHaveValue('');
  });

  it('尿布帶出上次的類型與性狀', () => {
    const lastDiaper: DailyLog = {
      id: 'd-last',
      childId: 'c1',
      type: 'diaper',
      timestamp: '2026-09-01T02:00:00.000Z',
      data: { type: 'both', consistency: 'soft' },
      createdAt: '2026-09-01T02:00:00.000Z',
    };
    renderModal({ logType: 'diaper', lastLog: lastDiaper });

    expect(screen.getByRole('radio', { name: '大小便' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '稀' })).toBeChecked();
  });

  it('第一次記錄的孩子回到原本的預設值，不報錯也沒有空狀態', () => {
    renderModal({ logType: 'feeding', lastLog: null });

    expect(screen.getByRole('radio', { name: '母乳（左）' })).toBeChecked();
    expect(screen.getByLabelText('奶量（ml）')).toHaveValue(null);
  });

  /*
    上一筆是「開啟的那一刻讀一次」，不是要追蹤的值。共用孩子的另一位照顧者
    存進一筆紀錄，監聽器就會送回新的物件——如果 effect 追著它跑，這位家長正在
    打的奶量會被無聲洗掉，而這個 app 別的地方正是花力氣在保住她打到一半的東西。
  */
  it('別人存了一筆之後，這裡打到一半的奶量不會被洗掉', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    const { rerender } = render(
      <LogEntryModal
        isOpen
        onClose={() => {}}
        onSave={onSave}
        logType="feeding"
        lastLog={lastFormula}
      />,
    );

    await user.clear(screen.getByLabelText('奶量（ml）'));
    await user.type(screen.getByLabelText('奶量（ml）'), '85');
    await user.type(screen.getByLabelText('備註'), '喝到一半睡著');

    // 另一位照顧者存了一筆 200ml：監聽器送回一個新的物件。
    rerender(
      <LogEntryModal
        isOpen
        onClose={() => {}}
        onSave={onSave}
        logType="feeding"
        lastLog={{ ...lastFormula, id: 'f-other', data: { feedingType: 'formula', amount: 200 } }}
      />,
    );

    expect(screen.getByLabelText('奶量（ml）')).toHaveValue(85);
    expect(screen.getByLabelText('備註')).toHaveValue('喝到一半睡著');
  });

  it('編輯既有紀錄時看到的是那一筆，不是上一筆', () => {
    const editingLog: DailyLog = {
      id: 'f-edit',
      childId: 'c1',
      type: 'feeding',
      timestamp: '2026-09-02T02:00:00.000Z',
      data: { feedingType: 'solid', amount: 30 },
      createdAt: '2026-09-02T02:00:00.000Z',
    };
    renderModal({ logType: 'feeding', editingLog, lastLog: lastFormula });

    expect(screen.getByRole('radio', { name: '副食品' })).toBeChecked();
    expect(screen.getByLabelText('奶量（ml）')).toHaveValue(30);
  });
});

describe('擠奶', () => {
  /*
    #14 的整個論點就是擠出來的量不是寶寶喝進去的量。標題還寫著「餵奶記錄」
    的時候，畫面自己否認了那個區別，而那是媽媽真的會讀的地方。
  */
  it('選了擠奶之後，標題不再說這是一筆餵奶記錄', async () => {
    const { user } = renderModal({ logType: 'feeding' });

    expect(screen.getByRole('heading', { name: '新增餵奶記錄' })).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: '擠奶' }));

    expect(screen.getByRole('heading', { name: '新增擠奶記錄' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '新增餵奶記錄' })).toBeNull();
  });

  it('存成 pumping，帶擠出量、時間與哪一邊', async () => {
    const { user, onSave } = renderModal({ logType: 'feeding' });

    await user.click(screen.getByRole('radio', { name: '擠奶' }));
    await user.click(screen.getByRole('radio', { name: '左側' }));
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

    await user.click(screen.getByRole('radio', { name: '擠奶' }));
    await user.click(screen.getByRole('radio', { name: '兩側' }));
    await user.click(screen.getByRole('radio', { name: '母乳（瓶餵）' }));

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

describe('欄位上限', () => {
  // 規則對 dailyLogs/$id/data/notes 有長度上限，超過時回來的是 PERMISSION_DENIED，
  // 表單只會把 SDK 的原文印出來。欄位本身不能超過規則，那個錯誤才不會出現。
  it('備註的上限就是規則的上限', () => {
    renderModal();
    expect(screen.getByLabelText('備註')).toHaveAttribute('maxlength', String(DAILY_LOG_NOTES_LIMIT));
  });
});

/**
 * The form is a dialog like every other form in the app. It used to be a sheet
 * drawn by hand, with no role, no way out by keyboard, and a backdrop that
 * closed it while a save was still in flight.
 */
describe('對話框的行為', () => {
  it('是一個有名字的對話框，名字就是這張表在記什麼', () => {
    renderModal({ logType: 'diaper' });
    expect(screen.getByRole('dialog', { name: '新增尿布記錄' })).toBeInTheDocument();
  });

  it('按 Esc 就關', async () => {
    const { user, onClose } = renderModal();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('存檔還沒回來時關不掉，剛填的東西不會跟著請求一起消失', async () => {
    let finish = () => {};
    const onSave = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const { user, onClose } = renderModal({ onSave });

    await user.type(screen.getByLabelText('奶量（ml）'), '120');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    // 存檔中：關閉鍵鎖住，Esc 也沒有用。
    expect(screen.getByRole('button', { name: '關閉' })).toBeDisabled();
    await user.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();

    finish();
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it('類型一點就選，不用開下拉選單', async () => {
    const { user, onSave } = renderModal({ logType: 'diaper' });

    await user.click(screen.getByRole('radio', { name: '大小便' }));
    await user.click(screen.getByRole('button', { name: '儲存' }));

    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(onSave.mock.calls[0][0].data).toMatchObject({ type: 'both' });
  });

  it('數字欄位叫出數字鍵盤', () => {
    renderModal();
    expect(screen.getByLabelText('奶量（ml）')).toHaveAttribute('inputmode', 'numeric');
    expect(screen.getByLabelText('時長（分鐘）')).toHaveAttribute('inputmode', 'numeric');
  });
});
