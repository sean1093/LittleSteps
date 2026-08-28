import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ChildProfile, GrowthRecord } from '../../types';
import GrowthChartsPage from './GrowthChartsPage';
import { useGrowthTracking } from '../hooks/useGrowthTracking';

/**
 * 這一頁曾經同時疊兩張「沒東西」的卡：GrowthChartDisplay 的「無法顯示圖表」
 * 加上 GrowthRecordList 的「尚無記錄」。兩張講同一件事，只有後者告訴家長下一
 * 步要做什麼。這組測試守住「空狀態只出現一次」，同時守住另一半——有記錄但
 * 缺這個項目時，圖表自己的訊息仍然是對的回答，不能一起被關掉。
 */

vi.mock('../hooks/useGrowthTracking', () => ({
  useGrowthTracking: vi.fn(),
}));

const child: ChildProfile = {
  id: 'c1',
  name: '小豆',
  birthday: '2026-02-01',
  gender: 'female',
  milestoneProgress: {},
  vaccineProgress: {},
  createdAt: '2026-02-01T00:00:00.000Z',
  createdBy: 'u1',
};

/** 只量了體重、沒量身高的一筆——足以讓「有記錄」與「缺這項」同時成立。 */
const weightOnly: GrowthRecord = {
  id: 'g1',
  childId: 'c1',
  date: '2026-08-01',
  weight: 7.4,
  percentile: { weight: 52 },
};

const withRecords = (records: GrowthRecord[]) =>
  vi.mocked(useGrowthTracking).mockReturnValue({
    records,
    loading: false,
    addRecord: vi.fn(),
    updateRecord: vi.fn(),
    deleteRecord: vi.fn(),
  });

const renderPage = () => {
  const user = userEvent.setup();
  render(<GrowthChartsPage currentChild={child} user={null} />);
  return user;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('完全沒有記錄時', () => {
  it('只有一張空狀態卡，且是帶著下一步的那張', () => {
    withRecords([]);
    renderPage();

    expect(screen.getByRole('heading', { name: '尚無記錄' })).toBeInTheDocument();
    expect(screen.getByText('點擊「新增記錄」開始追蹤成長數據')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '無法顯示圖表' })).toBeNull();
  });

  it('沒有圖可畫，就不留下選圖的 chip', () => {
    withRecords([]);
    renderPage();

    for (const label of ['體重', '身高', '頭圍']) {
      expect(screen.queryByRole('button', { name: label })).toBeNull();
    }
  });
});

describe('有記錄但缺選中的項目時', () => {
  it('切到身高，圖表換成自己的訊息，而不是回到「尚無記錄」', async () => {
    withRecords([weightOnly]);
    const user = renderPage();

    // 預設的體重有資料，所以先看到圖、看不到任何空狀態。
    expect(screen.queryByRole('heading', { name: '無法顯示圖表' })).toBeNull();

    await user.click(screen.getByRole('button', { name: '身高' }));

    expect(screen.getByRole('heading', { name: '無法顯示圖表' })).toBeInTheDocument();
    expect(screen.getByText('尚無此項目的測量記錄')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '尚無記錄' })).toBeNull();
  });
});
