import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChildStoreProvider } from '../contexts/ChildStoreContext';
import AccountButton from './AccountButton';

/**
 * 帳號與寶寶切換原本只存在於 LittleSteps 的側邊抽屜，而那個抽屜只在
 * LittleSteps 的路由下渲染——另外四個服務登不出，也換不了孩子。
 *
 * 這組測試釘住修好之後的規則：帳號到處都碰得到，寶寶切換只出現在真的會讀
 * 孩子資料的服務裡。
 */

// vi.mock 的 factory 會被提升到檔案最上方，所以它引用的東西也必須先被提升。
const mocks = vi.hoisted(() => ({
  setCurrentChild: vi.fn(),
  signOut: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../hooks/useChildStore', () => ({
  useChildStore: () => ({
    childProfiles: [
      {
        id: 'c1',
        name: '小豆',
        birthday: '2025-02-27',
        milestoneProgress: {},
        vaccineProgress: {},
        createdAt: '2025-02-27T00:00:00.000Z',
        createdBy: 'u1',
      },
      {
        id: 'c2',
        name: '小樹',
        birthday: '2024-02-27',
        milestoneProgress: {},
        vaccineProgress: {},
        createdAt: '2024-02-27T00:00:00.000Z',
        createdBy: 'u1',
      },
    ],
    currentChildId: 'c1',
    setCurrentChild: mocks.setCurrentChild,
    addChild: vi.fn(),
    joinChild: vi.fn(),
    updateChild: vi.fn(),
    deleteChild: vi.fn(),
  }),
}));

vi.mock('../../contexts/AuthContext', async () => {
  const actual = await vi.importActual<typeof import('../../contexts/AuthContext')>(
    '../../contexts/AuthContext',
  );
  const value = {
    user: { uid: 'u1', displayName: '測試家長', email: 'test@example.com', photoURL: null },
    loading: false,
    signInWithGoogle: vi.fn(),
    signOut: mocks.signOut,
  };
  return { ...actual, useAuth: () => value, useOptionalAuth: () => value };
});

const openSheet = async (service: 'littlesteps' | 'littleexplorer' | 'babyoasis' | 'littleouting') => {
  const user = userEvent.setup();
  render(
    <ChildStoreProvider>
      <AccountButton service={service} />
    </ChildStoreProvider>,
  );
  await user.click(screen.getByRole('button', { name: '帳號與寶寶' }));
  return user;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('每個服務都碰得到帳號', () => {
  it.each(['littlesteps', 'littleexplorer', 'babyoasis', 'littleouting'] as const)(
    '%s 可以開啟帳號視窗並登出',
    async (service) => {
      const user = await openSheet(service);

      expect(await screen.findByText('測試家長')).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: '登出' }));
      expect(mocks.signOut).toHaveBeenCalled();
    },
  );
});

describe('寶寶切換只出現在會讀孩子資料的服務', () => {
  it.each(['littlesteps', 'littleexplorer'] as const)('%s 顯示寶寶清單並可切換', async (service) => {
    const user = await openSheet(service);

    expect(await screen.findByRole('heading', { name: '我的寶寶' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '小樹' }));
    expect(mocks.setCurrentChild).toHaveBeenCalledWith('c2');
  });

  it.each(['babyoasis', 'littleouting'] as const)(
    '%s 不顯示寶寶切換——那裡的畫面不會因為換孩子而改變',
    async (service) => {
      await openSheet(service);

      // 帳號仍然在，只有切換器不該出現。
      expect(await screen.findByText('測試家長')).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: '我的寶寶' })).toBeNull();
    },
  );
});
