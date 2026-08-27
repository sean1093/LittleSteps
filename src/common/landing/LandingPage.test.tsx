import { describe, it, expect, vi } from 'vitest';
import type { User } from 'firebase/auth';
import { render, waitFor } from '@testing-library/react';
import LandingPage, { landingKindFor, isStandaloneLanding } from './LandingPage';

const signedIn = { uid: 'u1' } as User;

/**
 * 這些規則原本散在 App.tsx 三個分支加兩個 useEffect 裡，沒有任何測試守著。
 */
describe('landingKindFor', () => {
  it('服務集合首頁一律顯示 hub，登入與否都一樣', () => {
    expect(landingKindFor('home', null, false)).toBe('hub');
    expect(landingKindFor('home', signedIn, true)).toBe('hub');
  });

  it('未登入進到需登入的 LittleSteps 頁，顯示 LittleSteps 介紹頁', () => {
    expect(landingKindFor('littlesteps/dashboard', null, false)).toBe('steps-intro');
    expect(landingKindFor('littlesteps', null, false)).toBe('steps-intro');
  });

  it('未登入進到需登入的孕期或幼兒頁，顯示該服務的介紹頁', () => {
    expect(landingKindFor('littlebloom', null, false)).toBe('service-intro');
    expect(landingKindFor('littleexplorer/reminders', null, false)).toBe('service-intro');
  });

  it('不需登入的頁面不顯示介紹頁，即使未登入', () => {
    expect(landingKindFor('littlebloom/wiki', null, false)).toBeNull();
    expect(landingKindFor('babyoasis', null, false)).toBeNull();
    expect(landingKindFor('littlesteps/baby-wiki', null, false)).toBeNull();
  });

  it('已登入但還沒有孩子時，提示先新增寶寶', () => {
    expect(landingKindFor('littlesteps', signedIn, false)).toBe('first-child');
  });

  it('已登入且有孩子時交還給實際頁面', () => {
    expect(landingKindFor('littlesteps', signedIn, true)).toBeNull();
    expect(landingKindFor('littlesteps/dashboard', signedIn, true)).toBeNull();
  });
});

describe('isStandaloneLanding', () => {
  it('只有服務介紹頁自帶版面', () => {
    expect(isStandaloneLanding('steps-intro')).toBe(true);
    expect(isStandaloneLanding('service-intro')).toBe(true);
    // hub 需要側邊欄切換孩子，first-child 需要側邊欄新增孩子。
    expect(isStandaloneLanding('hub')).toBe(false);
    expect(isStandaloneLanding('first-child')).toBe(false);
  });
});

describe('登入後的去向', () => {
  const renderAt = (user: User | null, hasChildren: boolean, onNavigate = vi.fn()) => {
    const view = render(
      <LandingPage
        kind="steps-intro"
        page="littlesteps"
        user={user}
        hasChildren={hasChildren}
        onSignIn={vi.fn()}
        onNavigate={onNavigate}
        onAddChild={vi.fn()}
      />,
    );
    return { view, onNavigate };
  };

  it('剛登入且已有孩子時前往儀表板', async () => {
    const { view, onNavigate } = renderAt(null, true);
    view.rerender(
      <LandingPage
        kind="steps-intro"
        page="littlesteps"
        user={signedIn}
        hasChildren
        onSignIn={vi.fn()}
        onNavigate={onNavigate}
        onAddChild={vi.fn()}
      />,
    );
    await waitFor(() => expect(onNavigate).toHaveBeenCalledWith('littlesteps/dashboard'));
  });

  it('剛登入但還沒有孩子時不跳走，否則會落在空的儀表板', async () => {
    const { view, onNavigate } = renderAt(null, false);
    view.rerender(
      <LandingPage
        kind="steps-intro"
        page="littlesteps"
        user={signedIn}
        hasChildren={false}
        onSignIn={vi.fn()}
        onNavigate={onNavigate}
        onAddChild={vi.fn()}
      />,
    );
    await waitFor(() => expect(onNavigate).not.toHaveBeenCalled());
  });

  it('本來就是登入狀態時不會再跳一次', async () => {
    const { onNavigate } = renderAt(signedIn, true);
    await waitFor(() => expect(onNavigate).not.toHaveBeenCalled());
  });
});
