import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingPage from './LandingPage';

/**
 * 這一頁是所有「需要登入的 LittleSteps 路由」在未登入時的落點：登出之後、
 * 從書籤進入、瀏覽器還原分頁都會到這裡。
 *
 * 它原本沒有任何通往服務集合首頁的路，頁面本身也完全沒提到 LittleBloom、
 * LittleExplorer 與 BabyOasis，於是未登入的訪客會以為整個產品就是 LittleSteps，
 * 而且只能手動改網址才出得去。LittleBloom 與 LittleExplorer 的介紹頁
 * （ServiceLandingPage）一直都有這顆按鈕，只有這一頁漏掉。
 */
describe('LandingPage', () => {
  beforeEach(() => {
    window.location.hash = '#/littlesteps/dashboard';
  });

  const renderPage = () =>
    render(<LandingPage onNavigate={vi.fn()} user={null} onSignIn={vi.fn()} />);

  it('提供通往所有服務的出口', () => {
    renderPage();
    expect(screen.getByRole('button', { name: '所有服務' })).toBeInTheDocument();
  });

  it('按下之後回到服務集合首頁，而不是停在 LittleSteps', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: '所有服務' }));

    expect(window.location.hash).toBe('#/');
  });
});
