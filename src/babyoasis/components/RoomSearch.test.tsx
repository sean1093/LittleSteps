import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { NursingRoom } from '../../types';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import RoomSearch from './RoomSearch';

/**
 * 搜尋列守兩件事：
 *
 *   選定一筆之後關鍵字要清掉。清單是浮在地圖上的，留著關鍵字等於家長關掉詳情
 *   面板後，看到的還是清單蓋住地圖與剛剛飛過去的那個點。
 *
 *   比對不只看名稱。家長記得的常常是路名或區名，這件事只要有人「順手簡化成
 *   只搜 name」就會靜靜消失。
 */

const ROOMS: NursingRoom[] = [
  {
    id: 'tpe-sogo-zhongxiao',
    name: 'SOGO 忠孝館',
    address: '臺北市大安區忠孝東路四段 45 號',
    city: '臺北市',
    district: '大安區',
    floor: '3 樓婦嬰用品區',
    latitude: 25.0417,
    longitude: 121.5436,
  },
  {
    id: 'tpe-shinkong-tianmu',
    // 地址與店名都不含「士林」，只有 district 有：驗得出真的看了行政區。
    name: '新光三越天母店',
    address: '臺北市中山北路六段 77 號',
    city: '臺北市',
    district: '士林區',
    latitude: 25.1153,
    longitude: 121.5301,
  },
  {
    id: 'khh-dream-mall',
    name: '統一夢時代購物中心',
    address: '高雄市前鎮區中華五路 789 號',
    city: '高雄市',
    district: '前鎮區',
    latitude: 22.5956,
    longitude: 120.3065,
  },
];

const theme = SERVICE_THEME.babyoasis;

describe('RoomSearch', () => {
  it('選了一筆之後清掉關鍵字，結果清單把地圖讓出來', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<RoomSearch rooms={ROOMS} theme={theme} onSelect={onSelect} />);

    await user.type(screen.getByRole('searchbox', { name: '搜尋哺乳室' }), 'SOGO');
    await user.click(await screen.findByRole('button', { name: /SOGO 忠孝館/ }));

    expect(onSelect).toHaveBeenCalledWith(ROOMS[0]);
    expect(screen.getByRole('searchbox', { name: '搜尋哺乳室' })).toHaveValue('');
    expect(screen.queryByText(/共 \d+ 處/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /SOGO 忠孝館/ })).not.toBeInTheDocument();
  });

  it('用行政區也找得到，不是只比對店名', async () => {
    const user = userEvent.setup();
    render(<RoomSearch rooms={ROOMS} theme={theme} onSelect={vi.fn()} />);

    await user.type(screen.getByRole('searchbox', { name: '搜尋哺乳室' }), '士林區');

    expect(await screen.findByRole('button', { name: /新光三越天母店/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /夢時代/ })).not.toBeInTheDocument();
  });

  it('真的沒有相符的才說找不到', async () => {
    const user = userEvent.setup();
    render(<RoomSearch rooms={ROOMS} theme={theme} onSelect={vi.fn()} />);

    // 沒打字時清單完全讓位，不能先說「找不到」。
    expect(screen.queryByText('找不到符合的哺乳室')).not.toBeInTheDocument();

    await user.type(screen.getByRole('searchbox', { name: '搜尋哺乳室' }), '南極');

    expect(await screen.findByText('找不到符合的哺乳室')).toBeInTheDocument();
  });
});
