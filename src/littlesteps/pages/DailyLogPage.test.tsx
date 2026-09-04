import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ChildProfile, DailyLog, FeedingData, SleepData } from '../../types';
import { ToastProvider } from '../../common/ui/toast';
import DailyLogPage from './DailyLogPage';

/**
 * 這一頁以前把 addDailyLog 的失敗接住變成一則 toast，於是 LogEntryModal 收到的
 * 是一個成功的 promise：表單關掉、家長剛打的內容消失、表單自己的錯誤框永遠沒
 * 機會出現。訊息屬於那張表，這一頁只負責把失敗原封不動往上丟。
 */

const { addDailyLog, updateDailyLog, deleteDailyLog, readState } = vi.hoisted(() => ({
  addDailyLog: vi.fn(),
  updateDailyLog: vi.fn(),
  deleteDailyLog: vi.fn(),
  readState: { error: false, logs: [] as DailyLog[] },
}));

vi.mock('../hooks/useDailyLogs', () => ({
  // 每個孩子只看得到自己的紀錄，就像真的 Firebase 監聽器一樣。
  useDailyLogs: (childId: string | null) => ({
    logs: readState.logs.filter((log) => log.childId === childId),
    loading: false,
    error: readState.error,
  }),
}));

vi.mock('../../common/hooks/useFirebaseChildren', () => ({
  useFirebaseChildren: () => ({ addDailyLog, updateDailyLog, deleteDailyLog }),
}));

const child: ChildProfile = {
  id: 'c1',
  name: '小豆',
  birthday: '2026-02-01',
  milestoneProgress: {},
  vaccineProgress: {},
  createdAt: '2026-02-01T00:00:00.000Z',
  createdBy: 'u1',
  members: { u1: true },
};

/** 開餵奶那張表，並填一個奶量，方便驗「失敗後值還在不在」。 */
const openFeedingSheet = async () => {
  const user = userEvent.setup();
  render(<DailyLogPage currentChild={child} user={null} />);

  await user.click(screen.getByRole('button', { name: '餵奶' }));
  await screen.findByRole('heading', { name: '新增餵奶記錄' });
  await user.type(screen.getByLabelText('奶量（ml）'), '120');

  return user;
};

beforeEach(() => {
  vi.clearAllMocks();
  readState.error = false;
  readState.logs = [];
});

describe('記錄一筆餵奶', () => {
  it('寫入失敗時表單不關，錯誤顯示在表單裡，奶量還在', async () => {
    addDailyLog.mockRejectedValue(new Error('權限不足，無法寫入'));
    const user = await openFeedingSheet();

    await user.click(screen.getByRole('button', { name: '儲存' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('權限不足，無法寫入');
    expect(screen.getByRole('heading', { name: '新增餵奶記錄' })).toBeInTheDocument();
    expect(screen.getByLabelText('奶量（ml）')).toHaveValue(120);
  });

  it('寫入成功才關表', async () => {
    addDailyLog.mockResolvedValue(undefined);
    const user = await openFeedingSheet();

    await user.click(screen.getByRole('button', { name: '儲存' }));

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: '新增餵奶記錄' })).toBeNull(),
    );
    expect(addDailyLog).toHaveBeenCalledTimes(1);
  });
});

describe('讀不到記錄時', () => {
  it('說讀不到，而不是說今天還沒記', () => {
    readState.error = true;
    render(<DailyLogPage currentChild={child} user={null} />);

    expect(screen.getByText('讀不到日常記錄，請確認網路後重新載入')).toBeInTheDocument();
    expect(screen.queryByText(/還沒有記錄/)).toBeNull();
  });
});

/*
  日檢視上那個「餵奶」數字是媽媽真正會看的那一個。它跟摘要卡必須說同一件事，
  否則同一個畫面上兩個數字互相矛盾——而擠奶被算進去的話，全擠奶的媽媽每天
  看到的是實際餐數的兩倍。
*/
describe('日檢視的餵奶次數', () => {
  it('六次瓶餵加六次擠奶顯示 6，不是 12', () => {
    const at = (hour: number) => {
      const d = new Date();
      d.setHours(hour, 0, 0, 0);
      return d.toISOString();
    };
    const log = (id: string, data: FeedingData, hour: number): DailyLog => ({
      id,
      childId: 'c1',
      type: 'feeding',
      timestamp: at(hour),
      data,
      createdAt: at(hour),
    });
    readState.logs = [
      ...[1, 4, 7, 10, 13, 16].map((h) =>
        log(`bottle-${h}`, { feedingType: 'breast_milk_bottle', amount: 100 }, h),
      ),
      ...[2, 5, 8, 11, 14, 17].map((h) =>
        log(`pump-${h}`, { feedingType: 'pumping', amount: 150, duration: 20 }, h),
      ),
    ];

    render(
      <ToastProvider>
        <DailyLogPage currentChild={child} user={null} />
      </ToastProvider>,
    );

    const statsCard = screen.getByRole('heading', { name: '今日統計' }).parentElement!;
    expect(within(statsCard).getByText('餵奶').previousElementSibling).toHaveTextContent('6');
  });
});

/*
  表單每次都從 breast_left 和空白奶量開始，所以一位餵配方奶的家長一天要重打
  同樣的 120 八次。記憶要跟著孩子走：一位有兩個孩子的家長，一個喝配方奶一個
  親餵，用帳號記住上一次只會讓兩張表都填錯。
*/
describe('沿用上一筆', () => {
  const childB: ChildProfile = { ...child, id: 'c2', name: '小米' };

  const feedingLog = (id: string, childId: string, data: FeedingData): DailyLog => ({
    id,
    childId,
    type: 'feeding',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    data,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  });

  beforeEach(() => {
    readState.logs = [
      feedingLog('a', 'c1', { feedingType: 'formula', amount: 120 }),
      feedingLog('b', 'c2', { feedingType: 'breast_both', duration: 15 }),
    ];
    addDailyLog.mockResolvedValue('new-log');
  });

  it('開餵奶表單時帶出這個孩子上次的值', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <DailyLogPage currentChild={child} user={null} />
      </ToastProvider>,
    );

    await user.click(screen.getByRole('button', { name: '餵奶' }));

    expect(await screen.findByLabelText('類型 *')).toHaveValue('formula');
    expect(screen.getByLabelText('奶量（ml）')).toHaveValue(120);
  });

  it('換一個孩子，帶出的是那個孩子的值', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <DailyLogPage currentChild={childB} user={null} />
      </ToastProvider>,
    );

    await user.click(screen.getByRole('button', { name: '餵奶' }));

    expect(await screen.findByLabelText('類型 *')).toHaveValue('breast_both');
    expect(screen.getByLabelText('奶量（ml）')).toHaveValue(null);
    expect(screen.getByLabelText('時長（分鐘）')).toHaveValue(15);
  });

  it('一鍵重複：內容照抄上一筆，時間是現在，不開表單', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <DailyLogPage currentChild={child} user={null} />
      </ToastProvider>,
    );

    await user.click(screen.getByRole('button', { name: /再記一次|餵奶（配方奶 120 ml）/ }));

    expect(addDailyLog).toHaveBeenCalledTimes(1);
    const [, written] = addDailyLog.mock.calls[0];
    expect(written.type).toBe('feeding');
    expect(written.data).toMatchObject({ feedingType: 'formula', amount: 120 });
    expect(Date.now() - Date.parse(written.timestamp)).toBeLessThan(1000);
    expect(screen.queryByRole('heading', { name: '新增餵奶記錄' })).toBeNull();
  });

  /*
    一鍵重複是唯一不開表單就寫進去的路徑：家長看不到存了什麼，所以寫錯孩子
    不會有任何跡象。孩子綁定在這裡比在表單裡更要緊。
  */
  it('一鍵重複寫的是目前這個孩子', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <DailyLogPage currentChild={childB} user={null} />
      </ToastProvider>,
    );

    await user.click(screen.getByRole('button', { name: /再記一次|餵奶（/ }));

    expect(addDailyLog).toHaveBeenCalledTimes(1);
    const [childId, written] = addDailyLog.mock.calls[0];
    expect(childId).toBe('c2');
    expect(written.childId).toBe('c2');
    expect(written.data).toMatchObject({ feedingType: 'breast_both', duration: 15 });
  });

  it('一鍵重複不把上一次的備註抄過來', async () => {
    readState.logs = [
      {
        ...feedingLog('with-note', 'c1', { feedingType: 'formula', amount: 120 }),
        data: { feedingType: 'formula', amount: 120, notes: '喝得很急' } as FeedingData,
      },
    ];
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <DailyLogPage currentChild={child} user={null} />
      </ToastProvider>,
    );

    await user.click(screen.getByRole('button', { name: /再記一次|餵奶（/ }));

    const [, written] = addDailyLog.mock.calls[0];
    expect((written.data as FeedingData).notes).toBeUndefined();
  });

  it('尿布表單也帶出這個孩子上次的類型與性狀', async () => {
    const at = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    readState.logs = [
      {
        id: 'd1',
        childId: 'c1',
        type: 'diaper',
        timestamp: at,
        data: { type: 'both', consistency: 'soft' },
        createdAt: at,
      },
    ];
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <DailyLogPage currentChild={child} user={null} />
      </ToastProvider>,
    );

    await user.click(screen.getByRole('button', { name: '尿布' }));

    expect(await screen.findByLabelText('類型 *')).toHaveValue('both');
    expect(screen.getByLabelText('性狀')).toHaveValue('soft');
  });

  /*
    擠奶是這個孩子最新的一筆 feeding 型別紀錄，但它不是一餐。把它當成「上次的
    餵奶」有兩個錯：按鈕會寫成「餵奶（擠奶 90 ml）」，而剛擠完奶的媽媽從此
    再也叫不出「再餵一次上次那餐」。
  */
  it('最近一筆是擠奶時，餵奶與擠奶各有各的按鈕', async () => {
    const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
    readState.logs = [
      {
        id: 'feed',
        childId: 'c1',
        type: 'feeding',
        timestamp: ago(180),
        data: { feedingType: 'formula', amount: 120 },
        createdAt: ago(180),
      },
      {
        id: 'pump',
        childId: 'c1',
        type: 'feeding',
        timestamp: ago(30),
        data: { feedingType: 'pumping', amount: 90 },
        createdAt: ago(30),
      },
    ];
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <DailyLogPage currentChild={child} user={null} />
      </ToastProvider>,
    );

    expect(screen.queryByRole('button', { name: /餵奶（擠奶/ })).toBeNull();
    expect(screen.getByRole('button', { name: '餵奶（配方奶 120 ml）' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '擠奶（90 ml）' }));

    const [, written] = addDailyLog.mock.calls[0];
    expect((written.data as FeedingData).feedingType).toBe('pumping');
  });

  it('還沒有任何紀錄的孩子沒有重複鍵，表單也回到原本的預設值', async () => {
    readState.logs = [];
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <DailyLogPage currentChild={child} user={null} />
      </ToastProvider>,
    );

    expect(screen.queryByText('再記一次上次的')).toBeNull();

    await user.click(screen.getByRole('button', { name: '餵奶' }));
    expect(await screen.findByLabelText('類型 *')).toHaveValue('breast_left');
    expect(screen.getByLabelText('奶量（ml）')).toHaveValue(null);
  });
});

/*
  睡眠的另一半。開始一段睡眠一直都是一鍵，結束卻要在時間軸裡找到那一筆、
  點開、拉日期時間選擇器、存檔——所以真正被使用的只有事後補記，而那正是
  「不填結束時間」這個設計要避免的。
*/
describe('進行中的睡眠', () => {
  /** 本地時間晚上 11 點：早上 8 點開始的睡眠已經超過門檻，而且還在同一個日曆日。 */
  const LATE_EVENING = new Date('2026-06-15T23:00:00+08:00');

  const openSleepLog = (startedMinutesAgo: number): DailyLog => {
    const startTime = new Date(Date.now() - startedMinutesAgo * 60_000).toISOString();
    return {
      id: 'sleep-1',
      childId: 'c1',
      type: 'sleep',
      timestamp: startTime,
      data: { startTime } as SleepData,
      createdAt: startTime,
    };
  };

  const renderPage = () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <ToastProvider>
        <DailyLogPage currentChild={child} user={null} />
      </ToastProvider>,
    );
    return user;
  };

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(LATE_EVENING);
    // 寫入成功後把結果放回 logs，模擬 Firebase 監聽器把新值送回畫面。
    updateDailyLog.mockImplementation(async (_childId: string, logId: string, updates: Partial<DailyLog>) => {
      readState.logs = readState.logs.map((log) => (log.id === logId ? { ...log, ...updates } : log));
    });
    addDailyLog.mockResolvedValue('new-log');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('一鍵開始睡：寫進去的是一筆沒有結束時間的睡眠', async () => {
    const user = renderPage();

    await user.click(screen.getByRole('button', { name: '開始睡' }));

    expect(addDailyLog).toHaveBeenCalledTimes(1);
    const [, written] = addDailyLog.mock.calls[0];
    expect(written.type).toBe('sleep');
    expect((written.data as SleepData).startTime).toBe(LATE_EVENING.toISOString());
    expect((written.data as SleepData).endTime).toBeUndefined();
  });

  it('日檢視上直接看得到睡了多久，不用點開任何東西', () => {
    readState.logs = [openSleepLog(80)];
    renderPage();

    expect(screen.getByText('1小時20分鐘')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '醒了' })).toBeInTheDocument();
  });

  it('「醒了」一鍵結束，結束時間是現在，時長跟著對上', async () => {
    readState.logs = [openSleepLog(80)];
    const user = renderPage();

    await user.click(screen.getByRole('button', { name: '醒了' }));

    expect(updateDailyLog).toHaveBeenCalledTimes(1);
    const [, logId, updates] = updateDailyLog.mock.calls[0];
    expect(logId).toBe('sleep-1');
    const closed = updates.data as SleepData;
    expect(Date.now() - Date.parse(closed.endTime!)).toBeLessThan(1000);
    expect((updates.data as SleepData).duration).toBe(80);
  });

  it('已經在睡的時候再按一次，說清楚原因而不是默默蓋掉', async () => {
    readState.logs = [openSleepLog(80)];
    const user = renderPage();

    await user.click(screen.getByRole('button', { name: '睡眠中' }));

    expect(await screen.findByText(/先按「醒了」結束這一段/)).toBeInTheDocument();
    expect(addDailyLog).not.toHaveBeenCalled();
  });

  it('開了 15 小時的睡眠改成待補結束時間，不算進當天統計', () => {
    readState.logs = [openSleepLog(15 * 60)];
    renderPage();

    expect(screen.getByText('這段睡眠還沒有結束時間')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '醒了' })).toBeNull();

    const statsCard = screen.getByRole('heading', { name: '今日統計' }).parentElement!;
    expect(within(statsCard).getByText('睡眠').previousElementSibling).toHaveTextContent('0');
  });

  /*
    夜醒次數只有在剛醒的那一刻問得準，但「醒了」不能因此變成一張表單。
    問題留在關掉之後：想回答的人多按一下，走開的人什麼也沒記。
  */
  it('結束之後才問夜醒次數，答了才寫進去', async () => {
    readState.logs = [openSleepLog(80)];
    const user = renderPage();

    await user.click(screen.getByRole('button', { name: '醒了' }));
    await user.click(await screen.findByRole('button', { name: '夜醒 2 次' }));

    expect(updateDailyLog).toHaveBeenCalledTimes(2);
    const [, , updates] = updateDailyLog.mock.calls[1];
    expect((updates.data as SleepData).nightWakings).toBe(2);
  });

  /*
    夜醒次數是把整個 data 寫回去的，所以它必須帶著剛剛設好的結束時間。
    從 logs 重查那一筆會拿到監聽器還沒更新的舊值——也就是還沒關的那一版——
    於是「回答夜醒次數」會把剛結束的睡眠變回進行中。
  */
  it('補夜醒次數時不會把剛設好的結束時間洗掉', async () => {
    readState.logs = [openSleepLog(80)];
    // 監聽器還沒把關掉後的值送回來：logs 裡仍然是沒有結束時間的那一版。
    updateDailyLog.mockResolvedValue(undefined);
    const user = renderPage();

    await user.click(screen.getByRole('button', { name: '醒了' }));
    await user.click(await screen.findByRole('button', { name: '夜醒 1 次' }));

    const [, , updates] = updateDailyLog.mock.calls[1];
    const written = updates.data as SleepData;
    expect(written.nightWakings).toBe(1);
    expect(written.endTime).toBeDefined();
    expect(written.duration).toBe(80);
  });

  it('沒有回答夜醒次數就什麼都不寫', async () => {
    readState.logs = [openSleepLog(80)];
    const user = renderPage();

    await user.click(screen.getByRole('button', { name: '醒了' }));
    await user.click(await screen.findByRole('button', { name: '不記夜醒次數' }));

    expect(updateDailyLog).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('這一段中間醒來幾次？')).toBeNull();
  });
});
