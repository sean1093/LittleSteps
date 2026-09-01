import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ChildProfile, VaccineProgress } from '../../types';
import { toLocalDateKey } from '../../common/utils/dateHelpers';
import VaccineTrackingPage from './VaccineTrackingPage';

/**
 * 這一頁曾經把「改日期」和「取消接種」綁在同一個動作上：日期的 sheet 送出時
 * 呼叫的是 toggle，於是家長在已接種的那一劑上確認新日期，administered 反而被
 * 翻成 false，資料層連 administeredDate 一起刪掉——想訂正日期，整筆接種紀錄
 * 消失。這組測試守的就是「確認日期永遠是已接種，取消接種是另一個明講的動作」。
 *
 * 出生當天的孩子讓月齡篩選停在 0 個月，畫面上只剩出生那兩劑，查詢才咬得準。
 */

const child: ChildProfile = {
  id: 'c1',
  name: '小豆',
  birthday: toLocalDateKey(),
  milestoneProgress: {},
  vaccineProgress: {},
  createdAt: '2026-01-01T00:00:00.000Z',
  createdBy: 'u1',
  members: { u1: true },
};

/** 出生那一劑 B 肝，doses 3 / currentDose 1。 */
const HEPB = 'hepb-birth';
const CIRCLE_RECORD = 'B型肝炎疫苗 第1劑：記錄接種日期';
const CIRCLE_EDIT = 'B型肝炎疫苗 第1劑：修改接種日期';

const administered = (administeredDate?: string): VaccineProgress => ({
  [HEPB]: { doses: { 1: { administered: true, administeredDate } } },
});

const renderPage = (vaccineProgress: VaccineProgress = {}) => {
  const onSetVaccineDose = vi.fn();
  const user = userEvent.setup();
  render(
    <VaccineTrackingPage
      currentChild={child}
      vaccineProgress={vaccineProgress}
      onSetVaccineDose={onSetVaccineDose}
    />,
  );
  return { user, onSetVaccineDose };
};

describe('還沒接種的那一劑', () => {
  it('開的是「記錄接種日期」，而且沒有取消接種的路', async () => {
    const { user } = renderPage();

    await user.click(screen.getByRole('button', { name: CIRCLE_RECORD }));

    expect(await screen.findByRole('heading', { name: '記錄接種日期' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '取消接種記錄' })).toBeNull();
  });

  it('確認日期就是登記接種，administered 傳 true', async () => {
    const { user, onSetVaccineDose } = renderPage();

    await user.click(screen.getByRole('button', { name: CIRCLE_RECORD }));
    fireEvent.change(await screen.findByLabelText('接種日期'), {
      target: { value: '2026-05-01' },
    });
    await user.click(screen.getByRole('button', { name: '確認' }));

    expect(onSetVaccineDose.mock.calls).toEqual([[HEPB, 1, true, '2026-05-01']]);
  });
});

describe('已經接種的那一劑', () => {
  it('確認新日期改的是日期，不是把接種紀錄清掉', async () => {
    const { user, onSetVaccineDose } = renderPage(administered('2026-05-01'));

    await user.click(screen.getByRole('button', { name: CIRCLE_EDIT }));
    expect(await screen.findByRole('heading', { name: '修改接種日期' })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('接種日期'), { target: { value: '2026-06-02' } });
    await user.click(screen.getByRole('button', { name: '確認' }));

    expect(onSetVaccineDose.mock.calls).toEqual([[HEPB, 1, true, '2026-06-02']]);
  });

  it('取消接種記錄才會把 administered 寫成 false，並收起 sheet', async () => {
    const { user, onSetVaccineDose } = renderPage(administered('2026-05-01'));

    await user.click(screen.getByRole('button', { name: CIRCLE_EDIT }));
    await user.click(await screen.findByRole('button', { name: '取消接種記錄' }));

    expect(onSetVaccineDose.mock.calls).toEqual([[HEPB, 1, false]]);
    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: '修改接種日期' })).toBeNull(),
    );
  });

  it('只勾了接種、沒填日期的那一劑，還是算已接種', async () => {
    // 這一種紀錄是真實存在的。用「有沒有日期」判斷已接種與否的話，這一劑會
    // 被當成還沒打，家長按確認就變成重新登記，取消接種也找不到入口。
    const { user } = renderPage(administered());

    expect(screen.getByRole('button', { name: '已接種，點擊補上日期' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: CIRCLE_EDIT }));

    expect(await screen.findByRole('heading', { name: '修改接種日期' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '取消接種記錄' })).toBeInTheDocument();
  });
});
