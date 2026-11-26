import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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

  it('備註不沿用：那是上一次那一餐的事', async () => {
    const { user } = renderModal({ logType: 'feeding', lastLog: lastFormula });

    await user.click(screen.getByRole('button', { name: '加備註' }));
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

  it('大便的那一題用家長的話問：便便的樣子，不是病歷上的「性狀」', () => {
    renderModal({ logType: 'diaper', lastLog: null });

    // 預設是小便，那一題還不在。
    expect(screen.queryByRole('radiogroup', { name: '便便的樣子' })).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: '大便' }));

    const group = screen.getByRole('radiogroup', { name: '便便的樣子' });
    expect(within(group).getByRole('radio', { name: '稀' })).toBeInTheDocument();
    expect(screen.queryByText('性狀')).toBeNull();
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
    await user.click(screen.getByRole('button', { name: '加備註' }));
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
  it('備註的上限就是規則的上限', async () => {
    const { user } = renderModal();
    await user.click(screen.getByRole('button', { name: '加備註' }));
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

/*
  這張表一天開八次以上，多半單手。每一個要叫出鍵盤的欄位，都是把送出鍵頂出
  畫面的一次機會。
*/
describe('少開幾次鍵盤', () => {
  it('常用奶量一點就填進欄位，存進去的就是那個數字', async () => {
    const { user, onSave } = renderModal();

    await user.click(screen.getByRole('button', { name: '120 ml' }));

    expect(screen.getByLabelText('奶量（ml）')).toHaveValue(120);
    expect(screen.getByRole('button', { name: '120 ml' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: '儲存' }));
    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect((onSave.mock.calls[0][0].data as FeedingData).amount).toBe(120);
  });

  it('常用時長也是，而且不在這五個裡的數字照樣打得進去', async () => {
    const { user, onSave } = renderModal();

    await user.click(screen.getByRole('button', { name: '15 分鐘' }));
    expect(screen.getByLabelText('時長（分鐘）')).toHaveValue(15);

    await user.clear(screen.getByLabelText('時長（分鐘）'));
    await user.type(screen.getByLabelText('時長（分鐘）'), '7');
    expect(screen.getByRole('button', { name: '15 分鐘' })).toHaveAttribute('aria-pressed', 'false');

    await user.click(screen.getByRole('button', { name: '儲存' }));
    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect((onSave.mock.calls[0][0].data as FeedingData).duration).toBe(7);
  });

  it('「15 分鐘前」把時間往回撥，存進去的仍然是 toISOString() 的格式', async () => {
    // 只假造 Date：userEvent 還是要靠真的計時器走。
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-09-01T02:30:20.000Z'));
    try {
      const { user, onSave } = renderModal({ logType: 'diaper' });

      await user.click(screen.getByRole('button', { name: '15 分鐘前' }));
      await user.click(screen.getByRole('button', { name: '儲存' }));

      await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
      const saved = onSave.mock.calls[0][0] as Omit<DailyLog, 'id'>;
      // datetime-local 只到分鐘，所以秒數歸零。規則只收這個形狀的字串。
      expect(saved.timestamp).toBe('2026-09-01T02:15:00.000Z');
      expect(new Date(saved.timestamp).toISOString()).toBe(saved.timestamp);
    } finally {
      vi.useRealTimers();
    }
  });

  it('「現在」把改過的時間撥回來', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-09-01T02:30:00.000Z'));
    try {
      const { user, onSave } = renderModal();

      await user.click(screen.getByRole('button', { name: '1 小時前' }));
      await user.click(screen.getByRole('button', { name: '現在' }));
      await user.click(screen.getByRole('button', { name: '儲存' }));

      await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
      expect(onSave.mock.calls[0][0].timestamp).toBe('2026-09-01T02:30:00.000Z');
    } finally {
      vi.useRealTimers();
    }
  });

  it('編輯舊紀錄時沒有「幾分鐘前」：那會把上週的紀錄搬到今天', () => {
    const editingLog: DailyLog = {
      id: 'f-old',
      childId: 'c1',
      type: 'feeding',
      timestamp: '2026-08-20T02:00:00.000Z',
      data: { feedingType: 'formula', amount: 120 },
      createdAt: '2026-08-20T02:00:00.000Z',
    };
    renderModal({ editingLog });

    expect(screen.queryByRole('button', { name: '15 分鐘前' })).toBeNull();
  });
});

describe('備註', () => {
  it('預設收著，送出鍵緊跟在欄位後面；沒打備註就不存備註', async () => {
    const { user, onSave } = renderModal({ logType: 'diaper' });

    expect(screen.queryByLabelText('備註')).toBeNull();

    await user.click(screen.getByRole('button', { name: '儲存' }));
    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave.mock.calls[0][0].data.notes).toBeUndefined();
  });

  it('按「加備註」就展開，游標直接在裡面，打的字存得進去', async () => {
    const { user, onSave } = renderModal({ logType: 'diaper' });

    await user.click(screen.getByRole('button', { name: '加備註' }));
    expect(screen.getByLabelText('備註')).toHaveFocus();

    await user.keyboard('有點紅屁股');
    await user.click(screen.getByRole('button', { name: '儲存' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave.mock.calls[0][0].data.notes).toBe('有點紅屁股');
  });

  it('編輯一筆有備註的紀錄時自動展開，備註不會看起來像不見了', () => {
    const editingLog: DailyLog = {
      id: 'd-note',
      childId: 'c1',
      type: 'diaper',
      timestamp: '2026-09-01T02:00:00.000Z',
      data: { type: 'pee', notes: '量很多' },
      createdAt: '2026-09-01T02:00:00.000Z',
    };
    renderModal({ logType: 'diaper', editingLog });

    expect(screen.getByLabelText('備註')).toHaveValue('量很多');
    expect(screen.queryByRole('button', { name: '加備註' })).toBeNull();
  });

  it('編輯一筆沒有備註的紀錄時收著', () => {
    const editingLog: DailyLog = {
      id: 'd-plain',
      childId: 'c1',
      type: 'diaper',
      timestamp: '2026-09-01T02:00:00.000Z',
      data: { type: 'pee' },
      createdAt: '2026-09-01T02:00:00.000Z',
    };
    renderModal({ logType: 'diaper', editingLog });

    expect(screen.getByRole('button', { name: '加備註' })).toBeInTheDocument();
  });
});

describe('標題說這是誰的紀錄', () => {
  it.each([
    ['feeding', '幫小安記餵奶'],
    ['sleep', '幫小安記睡眠'],
    ['diaper', '幫小安記尿布'],
  ] as const)('新增 %s：%s', (logType, title) => {
    renderModal({ logType, childName: '小安' });
    expect(screen.getByRole('dialog', { name: title })).toBeInTheDocument();
  });

  it('編輯時是「修改某某的……記錄」', () => {
    const editingLog: DailyLog = {
      id: 'd-edit',
      childId: 'c1',
      type: 'diaper',
      timestamp: '2026-09-01T02:00:00.000Z',
      data: { type: 'pee' },
      createdAt: '2026-09-01T02:00:00.000Z',
    };
    renderModal({ logType: 'diaper', editingLog, childName: '小安' });

    expect(screen.getByRole('dialog', { name: '修改小安的尿布記錄' })).toBeInTheDocument();
  });

  it('擠奶仍然不叫餵奶', async () => {
    const { user } = renderModal({ childName: '小安' });

    await user.click(screen.getByRole('radio', { name: '擠奶' }));

    expect(screen.getByRole('dialog', { name: '幫小安記擠奶' })).toBeInTheDocument();
  });
});

/*
  餵奶表單有時間、七個類型、時長與奶量各一排快捷鍵，送出鍵原本排在最後一個
  欄位下面，單手拿著手機時永遠在摺線以下。現在它在 ModalFrame 釘在底部的那一
  列裡，不在會捲動的欄位之間。happy-dom 沒有版面可量，所以這裡驗的是位置：鍵
  不在表單的欄位裡，卻仍然送出這張表單。真的量過的是 390px 與 320px 的截圖。
*/
describe('儲存鍵一直看得到', () => {
  it('儲存鍵在 sheet 底部那一列，不在捲動的欄位之間，按下去送出的仍是這張表', async () => {
    const { user, onSave } = renderModal({ logType: 'feeding' });

    const save = screen.getByRole('button', { name: '儲存' });
    const amount = screen.getByLabelText('奶量（ml）');
    const form = amount.closest('form')!;

    expect(form.contains(save)).toBe(false);
    // 在對話框裡、排在所有欄位之後：讀螢幕軟體走到它之前已經讀完整張表。
    expect(screen.getByRole('dialog').contains(save)).toBe(true);
    expect(form.compareDocumentPosition(save) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    await user.type(amount, '90');
    await user.click(save);
    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave.mock.calls[0][0].data.amount).toBe(90);
  });
});

describe('上次親餵的那一邊', () => {
  const breastFeed = (feedingType: FeedingData['feedingType'], timestamp: string): DailyLog => ({
    id: `b-${feedingType}`,
    childId: 'c1',
    type: 'feeding',
    timestamp,
    data: { feedingType, duration: 15 },
    createdAt: timestamp,
  });
  const today = (hours: number, minutes: number) => {
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  };

  it('類型上面寫著上次是哪一邊、幾點，選中的類型照舊是上一筆，不會自動換邊', () => {
    const last = breastFeed('breast_left', today(0, 5));
    renderModal({ logType: 'feeding', lastLog: last, lastBreastFeed: last });

    expect(screen.getByText('上次：左側（00:05）')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '母乳（左）' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '母乳（右）' })).not.toBeChecked();
  });

  it('不是今天的話帶上日期', () => {
    renderModal({
      logType: 'feeding',
      lastBreastFeed: breastFeed('breast_both', '2026-09-01T02:00:00.000+08:00'),
    });

    expect(screen.getByText('上次：兩側（9/1 02:00）')).toBeInTheDocument();
  });

  it('編輯一筆舊紀錄時不說「上次」', () => {
    const last = breastFeed('breast_right', today(0, 5));
    renderModal({ logType: 'feeding', editingLog: last, lastBreastFeed: last });

    expect(screen.queryByText(/^上次：/)).toBeNull();
  });
});
