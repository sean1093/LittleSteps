import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HubLanding from './HubLanding';
import { SERVICE_ORDER, SERVICE_THEME } from '../ui/serviceTheme';
import type { ServiceId } from '../ui/serviceTheme';

/**
 * The main landing page is the only place a parent can discover the other
 * sub-apps: no sub-app links to any sibling, and the LittleSteps sidebar is
 * scoped to LittleSteps routes by type. If a card goes missing here, that
 * sub-app becomes unreachable without hand-editing the URL.
 */
describe('HubLanding', () => {
  /**
   * The one thing the page renders that is not already in `SERVICE_THEME`.
   * Typed as a total `Record<ServiceId, …>`, so a sixth service fails to
   * compile until its CTA is listed here — and the list below then covers it
   * automatically. A hand-written array of four is what let LittleOuting ship
   * with no card assertion at all, the same way `routePolicy.test.ts` quietly
   * stopped covering it.
   */
  const CTA: Record<ServiceId, string> = {
    littlebloom: '進入孕期陪伴',
    littlesteps: '開始記錄成長',
    littleexplorer: '進入幼兒期',
    littleouting: '找親子好去處',
    babyoasis: '探索附近哺乳室',
  };

  /** Derived from the same list the page maps over. */
  const SUB_APPS = SERVICE_ORDER.map((id) => ({
    id,
    name: SERVICE_THEME[id].name,
    cta: CTA[id],
  }));

  it('清單涵蓋每一個服務', () => {
    // 沒有這條，SUB_APPS 少一個服務時底下兩條就只是「少測一張卡」，不會紅。
    expect([...SERVICE_ORDER].sort()).toEqual(Object.keys(SERVICE_THEME).sort());
    for (const app of SUB_APPS) {
      expect(app.name, `${app.id} 沒有 name`).toBeTruthy();
      expect(app.cta, `${app.id} 沒有列出進入按鈕的說法`).toBeTruthy();
    }
  });

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
      expect(onNavigate, app.name).toHaveBeenCalledWith(app.id);

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
