import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ChildProfile } from '../../types';
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
  readState: { error: false },
}));

vi.mock('../hooks/useDailyLogs', () => ({
  useDailyLogs: () => ({ logs: [], loading: false, error: readState.error }),
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
