import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StepsLanding from './StepsLanding';
import { MAX_CHILDREN } from '../childLimits';

/**
 * 這一頁是所有「需要登入的 LittleSteps 路由」在未登入時的落點：登出之後、
 * 從書籤進入、瀏覽器還原分頁都會到這裡。
 *
 * 它原本沒有任何通往服務集合首頁的路，頁面本身也完全沒提到 LittleBloom、
 * LittleExplorer 與 BabyOasis，於是未登入的訪客會以為整個產品就是 LittleSteps，
 * 而且只能手動改網址才出得去。LittleBloom 與 LittleExplorer 的介紹頁
 * （ServiceLandingPage）一直都有這顆按鈕，只有這一頁漏掉。
 */
describe('StepsLanding', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/littlesteps/dashboard');
  });

  const renderPage = () =>
    render(<StepsLanding onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);

  it('提供通往所有服務的出口', () => {
    renderPage();
    expect(screen.getByRole('button', { name: '所有服務' })).toBeInTheDocument();
  });

  it('按下之後回到服務集合首頁，而不是停在 LittleSteps', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: '所有服務' }));

    expect(window.location.pathname).toBe('/');
  });

  /**
   * 授權掛在 children/$childId/members，一份紀錄是整個家庭的，成員之間權限
   * 相同——這一頁原本卻寫著「僅限本人存取」。家長是照著這一段決定要不要把
   * 孩子的健康紀錄交出來的，所以它只要跟 database.rules.json 有出入，就是
   * 這一頁最嚴重的錯誤。另外兩句「永久免費」與「企業級加密」也一起收掉：
   * 一個是對未來的承諾，一個把 Firebase 的預設講成自己做的。
   */
  it('不宣稱資料庫規則給不了的獨占存取、永久免費與企業級加密', () => {
    const { container } = renderPage();

    expect(container.textContent).not.toMatch(/僅限本人存取|永久免費|企業級加密/);
  });

  it('說明家庭共用，包含成員之間可以互相移除', () => {
    renderPage();

    expect(screen.getByText(/分享代碼/)).toBeInTheDocument();
    expect(screen.getByText(/可以移除其他成員/)).toBeInTheDocument();
  });

  it('提到免費時一併說出一個帳號能追蹤幾個寶寶', () => {
    renderPage();

    const freeTier = screen.getByText(/免費/);
    expect(freeTier.textContent).toContain(`${MAX_CHILDREN} 個寶寶`);
  });

  /**
   * 以下兩條是防守，不是這次修好的東西：免登入的內容標記與睡眠指南入口是這
   * 一頁比入口頁多給的兩件事，改版時最容易連著行銷段落一起被掃掉。
   */
  it('免登入的內容直接導過去，不先要求登入', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const onSignIn = vi.fn();
    render(<StepsLanding onNavigate={onNavigate} user={null} onSignIn={onSignIn} />);

    await user.click(screen.getByRole('button', { name: /照顧重點/ }));

    expect(onNavigate).toHaveBeenCalledWith('littlesteps/care-guide');
    expect(onSignIn).not.toHaveBeenCalled();
  });

  it('留著睡眠指南的入口', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<StepsLanding onNavigate={onNavigate} user={null} onSignIn={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /睡眠指南/ }));

    expect(onNavigate).toHaveBeenCalledWith('littlesteps/sleep-training');
  });
});
