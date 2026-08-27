import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HubLanding from './HubLanding';

/**
 * The main landing page is the only place a parent can discover the other
 * sub-apps: no sub-app links to any sibling, and the LittleSteps sidebar is
 * scoped to LittleSteps routes by type. If a card goes missing here, that
 * sub-app becomes unreachable without hand-editing the URL.
 */
describe('HubLanding', () => {
  const SUB_APPS = [
    { name: 'LittleBloom', page: 'littlebloom', cta: '進入孕期陪伴' },
    { name: 'LittleSteps', page: 'littlesteps', cta: '開始記錄成長' },
    { name: 'LittleExplorer', page: 'littleexplorer', cta: '進入幼兒期' },
    { name: 'BabyOasis', page: 'babyoasis', cta: '探索附近哺乳室' },
  ] as const;

  it('每個子應用都有一張卡片', () => {
    render(<HubLanding onNavigate={vi.fn()} />);
    for (const app of SUB_APPS) {
      expect(screen.getByRole('heading', { name: app.name })).toBeInTheDocument();
    }
  });

  it('每張卡片都導向自己的子應用', async () => {
    const user = userEvent.setup();

    for (const app of SUB_APPS) {
      const onNavigate = vi.fn();
      const { unmount } = render(<HubLanding onNavigate={onNavigate} />);

      await user.click(screen.getByText(app.cta));
      expect(onNavigate, app.name).toHaveBeenCalledWith(app.page);

      unmount();
    }
  });

  it('LittleExplorer 卡片點出 1-3 歲的四項能力', () => {
    render(<HubLanding onNavigate={vi.fn()} />);

    // 這些字串只出現在 LittleExplorer 卡片，故不需要先鎖定容器——
    // 以 styling class 當選擇器會在改版時假性失敗。
    expect(screen.getByText('幼兒期陪伴')).toBeInTheDocument();
    expect(screen.getByText('12-36 個月成長檢核')).toBeInTheDocument();
    expect(screen.getByText('健檢、疫苗與塗氟提醒')).toBeInTheDocument();
    expect(screen.getByText('幼兒百科與成長日記')).toBeInTheDocument();
  });

  it('旅程時間軸的幼兒期節點可點，並導向 LittleExplorer', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<HubLanding onNavigate={onNavigate} />);

    await user.click(screen.getByText('1-3 歲'));
    expect(onNavigate).toHaveBeenCalledWith('littleexplorer');
  });

  it('未登入時進入點自己就給得出登入', async () => {
    const user = userEvent.setup();
    const onSignIn = vi.fn(async () => {});
    render(<HubLanding onNavigate={vi.fn()} user={null} onSignIn={onSignIn} />);

    await user.click(screen.getByRole('button', { name: /使用 Google 登入/ }));

    expect(onSignIn).toHaveBeenCalled();
  });

  it('已登入時不再顯示登入按鈕', () => {
    render(
      <HubLanding
        onNavigate={vi.fn()}
        user={{ uid: 'u1' } as never}
        onSignIn={vi.fn()}
      />,
    );
    expect(screen.queryByRole('button', { name: /使用 Google 登入/ })).not.toBeInTheDocument();
  });
});
