import { describe, it, expect, vi } from 'vitest';
import type { User } from 'firebase/auth';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Page } from '../../types/routes';
import { useState } from 'react';
import { fireEvent } from '@testing-library/react';
import LandingPage, { landingKindFor, isStandaloneLanding, type LandingKind } from './LandingPage';
import { ChildStoreValueProvider } from '../contexts/ChildStoreContext';
import { SIGNED_OUT_CHILD_STORE } from '../contexts/signedOutChildStore';
import type { ChildStore } from '../hooks/useChildStore';

const signedIn = { uid: 'u1' } as User;

/**
 * 這些規則原本散在 App.tsx 三個分支加兩個 useEffect 裡，沒有任何測試守著。
 */
describe('landingKindFor', () => {
  it('服務集合首頁一律顯示 hub，登入與否都一樣', () => {
    expect(landingKindFor('home', null, false)).toBe('hub');
    expect(landingKindFor('home', signedIn, true)).toBe('hub');
  });

  it('未登入進到任何需登入的頁面，都顯示該服務的介紹頁', () => {
    // 三個階段服務共用同一張介紹頁；以前 LittleSteps 自己一種、另外兩個一種。
    expect(landingKindFor('littlesteps/dashboard', null, false)).toBe('service-intro');
    expect(landingKindFor('littlesteps', null, false)).toBe('service-intro');
    expect(landingKindFor('littlebloom', null, false)).toBe('service-intro');
    expect(landingKindFor('littleexplorer/reminders', null, false)).toBe('service-intro');
  });

  it('不需登入的頁面不顯示介紹頁，即使未登入', () => {
    expect(landingKindFor('littlebloom/wiki', null, false)).toBeNull();
    expect(landingKindFor('babyoasis', null, false)).toBeNull();
    expect(landingKindFor('littlesteps/baby-wiki', null, false)).toBeNull();
    expect(landingKindFor('littleguard', null, false)).toBeNull();
  });

  it('已登入但還沒有孩子時，提示先新增寶寶', () => {
    expect(landingKindFor('littlesteps', signedIn, false)).toBe('first-child');
  });

  it('已登入但沒有孩子時，LittleSteps 每一個需要孩子的頁面都先請他新增或加入', () => {
    // 這裡原本只管服務首頁。其餘頁面各說各話：有的叫人去「左上角選單」新增
    // （那裡早就沒有了），里程碑與疫苗整頁照畫、按了沒反應。
    for (const page of [
      'littlesteps/dashboard',
      'littlesteps/milestones',
      'littlesteps/vaccine-tracking',
      'littlesteps/daily-log',
      'littlesteps/growth-charts',
      'littlesteps/clinic-summary',
    ] as const) {
      expect(landingKindFor(page, signedIn, false), page).toBe('first-child');
    }
  });

  it('免登入的內容頁不擋——讀百科不需要先有孩子', () => {
    for (const page of [
      'littlesteps/baby-wiki',
      'littlesteps/care-guide',
      'littlesteps/sleep-training',
    ] as const) {
      expect(landingKindFor(page, signedIn, false), page).toBeNull();
    }
  });

  it('另外兩個階段服務有自己的空狀態，不套 LittleSteps 的這一張', () => {
    expect(landingKindFor('littlebloom', signedIn, false)).toBeNull();
    expect(landingKindFor('littleexplorer/diary', signedIn, false)).toBeNull();
  });

  it('已登入且有孩子時交還給實際頁面', () => {
    expect(landingKindFor('littlesteps', signedIn, true)).toBeNull();
    expect(landingKindFor('littlesteps/dashboard', signedIn, true)).toBeNull();
  });
});

describe('isStandaloneLanding', () => {
  it('只有服務介紹頁自帶版面', () => {
    expect(isStandaloneLanding('service-intro')).toBe(true);
    // hub 需要側邊欄切換孩子，first-child 需要側邊欄新增孩子。
    expect(isStandaloneLanding('hub')).toBe(false);
    expect(isStandaloneLanding('first-child')).toBe(false);
  });
});

describe('登入後的去向', () => {
  const renderAt = (
    user: User | null,
    hasChildren: boolean,
    onNavigate = vi.fn(),
    entryPage: Page = 'littlesteps/dashboard',
  ) => {
    const view = render(
      <LandingPage
        kind="service-intro"
        page="littlesteps"
        user={user}
        hasChildren={hasChildren}
        entryPage={entryPage}
        onSignIn={vi.fn()}
        onNavigate={onNavigate}
      />,
    );
    return { view, onNavigate };
  };

  it('剛登入且已有孩子時前往該孩子的那一頁', async () => {
    const { view, onNavigate } = renderAt(null, true);
    view.rerender(
      <LandingPage
        kind="service-intro"
        page="littlesteps"
        user={signedIn}
        hasChildren
        entryPage="littlesteps/dashboard"
        onSignIn={vi.fn()}
        onNavigate={onNavigate}
      />,
    );
    await waitFor(() => expect(onNavigate).toHaveBeenCalledWith('littlesteps/dashboard'));
  });

  it('目的地由外面決定，不再寫死嬰兒儀表板', async () => {
    // 只有孕期檔案的使用者原本會落在嬰兒儀表板上。
    const { view, onNavigate } = renderAt(null, true, vi.fn(), 'littlebloom');
    view.rerender(
      <LandingPage
        kind="service-intro"
        page="littlesteps"
        user={signedIn}
        hasChildren
        entryPage="littlebloom"
        onSignIn={vi.fn()}
        onNavigate={onNavigate}
      />,
    );
    await waitFor(() => expect(onNavigate).toHaveBeenCalledWith('littlebloom'));
  });

  it('剛登入但還沒有孩子時不跳走，否則會落在空的儀表板', async () => {
    const { view, onNavigate } = renderAt(null, false);
    view.rerender(
      <LandingPage
        kind="service-intro"
        page="littlesteps"
        user={signedIn}
        hasChildren={false}
        entryPage="littlesteps/dashboard"
        onSignIn={vi.fn()}
        onNavigate={onNavigate}
      />,
    );
    await waitFor(() => expect(onNavigate).not.toHaveBeenCalled());
  });

  it('本來就是登入狀態時不會再跳一次', async () => {
    const { onNavigate } = renderAt(signedIn, true);
    await waitFor(() => expect(onNavigate).not.toHaveBeenCalled());
  });
});

describe('還沒有寶寶時的引導', () => {
  it('「新增寶寶」打開新增表單，而不是打開沒有新增功能的側邊欄', async () => {
    const user = userEvent.setup();
    render(
      <LandingPage
        kind="first-child"
        page="littlesteps"
        user={signedIn}
        hasChildren={false}
        entryPage="littlesteps/dashboard"
        onSignIn={vi.fn()}
        onNavigate={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: '新增寶寶' }));

    // 表單真的開了才算：這顆按鈕原本只是 setSidebarOpen(true)，而寶寶管理
    // 已經從側邊欄搬走，於是新註冊的家長按下去什麼也做不了。
    expect(screen.getByLabelText('寶寶姓名')).toBeInTheDocument();
    expect(screen.getByLabelText('寶寶生日')).toBeInTheDocument();
  });
});

describe('入口頁上已登入的家長', () => {
  const renderHub = (hasChildren: boolean, onNavigate = vi.fn()) =>
    render(
      <LandingPage
        kind="hub"
        page="home"
        user={signedIn}
        hasChildren={hasChildren}
        entryPage={hasChildren ? 'littleexplorer' : 'home'}
        currentService={hasChildren ? 'littleexplorer' : undefined}
        childName={hasChildren ? '小米' : undefined}
        onSignIn={vi.fn()}
        onNavigate={onNavigate}
      />,
    );

  it('一按就到這個孩子該去的那一頁，不是服務的預設首頁', async () => {
    // 兩歲孩子的家長要去的是幼兒期，不是嬰兒儀表板；目的地是 App 算好傳進來的。
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    renderHub(true, onNavigate);

    await user.click(screen.getByRole('button', { name: '打開紀錄' }));
    expect(onNavigate).toHaveBeenCalledWith('littleexplorer');
  });

  it('還沒有孩子時，同一個位置是新增寶寶，而且真的打開表單', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    renderHub(false, onNavigate);

    await user.click(screen.getByRole('button', { name: '新增寶寶' }));
    expect(screen.getByLabelText('寶寶姓名')).toBeInTheDocument();
    expect(onNavigate).not.toHaveBeenCalled();
  });
});

describe('入口頁的新增表單', () => {
  // 入口頁寫著「懷孕中也可以：填預產期，就從孕期開始記」，表單卻只有「寶寶」
  // 與「加入寶寶」兩頁——預產期只能填進「寶寶生日」，建出來的是一份寶寶檔案。
  it('有「懷孕中」這一頁，填得了預產期', async () => {
    const user = userEvent.setup();
    render(
      <LandingPage
        kind="hub"
        page="home"
        user={signedIn}
        hasChildren={false}
        entryPage="home"
        onSignIn={vi.fn()}
        onNavigate={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: '新增寶寶' }));
    await user.click(screen.getByRole('button', { name: '懷孕中' }));

    expect(screen.getByLabelText('預產期')).toBeInTheDocument();
  });
});

/**
 * 在入口頁建好或加入第一個孩子之後，直接到那個孩子的頁面。表單原本只是關掉，
 * 家長回到入口頁，得自己找到「打開紀錄」。
 */
describe('從入口頁新增第一個孩子之後', () => {
  const setup = (kind: LandingKind = 'hub', startWithChild = false) => {
    const onNavigate = vi.fn();
    const addChild = vi.fn().mockResolvedValue(undefined);
    const joinChild = vi.fn().mockResolvedValue(undefined);
    const store: ChildStore = { ...SIGNED_OUT_CHILD_STORE, addChild, joinChild };

    // 旗標由外面保管（實際上是 App），這裡用一個最小的外殼代替。
    function Harness({ hasChildren, entryPage }: { hasChildren: boolean; entryPage: Page }) {
      const [awaiting, setAwaiting] = useState(false);
      return (
        <ChildStoreValueProvider store={store}>
          <LandingPage
            kind={kind}
            page={kind === 'hub' ? 'home' : 'littlesteps'}
            user={signedIn}
            hasChildren={hasChildren}
            entryPage={entryPage}
            childName={hasChildren ? '小明' : undefined}
            onSignIn={vi.fn()}
            onNavigate={onNavigate}
            awaitingFirstChild={awaiting}
            onAwaitFirstChild={setAwaiting}
          />
        </ChildStoreValueProvider>
      );
    }

    const view = render(<Harness hasChildren={startWithChild} entryPage="home" />);
    const childArrives = (entryPage: Page) =>
      view.rerender(<Harness hasChildren entryPage={entryPage} />);
    return { onNavigate, addChild, joinChild, childArrives, user: userEvent.setup() };
  };

  it('建好寶寶就到寶寶成長的總覽', async () => {
    const { onNavigate, addChild, childArrives, user } = setup();

    await user.click(screen.getByRole('button', { name: '新增寶寶' }));
    await user.type(screen.getByLabelText('寶寶姓名'), '小明');
    fireEvent.change(screen.getByLabelText('寶寶生日'), { target: { value: '2026-01-15' } });
    await user.click(
      screen.getAllByRole('button', { name: '新增寶寶' }).find((b) => b.getAttribute('type') === 'submit')!,
    );
    await waitFor(() => expect(addChild).toHaveBeenCalled());
    expect(onNavigate).not.toHaveBeenCalled();

    childArrives('littlesteps/dashboard');
    await waitFor(() => expect(onNavigate).toHaveBeenCalledWith('littlesteps/dashboard'));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it('填預產期建的是孕期檔案，到的是孕期陪伴', async () => {
    const { onNavigate, addChild, childArrives, user } = setup();

    await user.click(screen.getByRole('button', { name: '新增寶寶' }));
    await user.click(screen.getByRole('button', { name: '懷孕中' }));
    fireEvent.change(screen.getByLabelText('預產期'), { target: { value: '2027-03-01' } });
    await user.click(screen.getByRole('button', { name: '開始追蹤孕期' }));

    // 第四個參數是預產期：少了它，資料層建出來的是寶寶檔案。
    await waitFor(() =>
      expect(addChild).toHaveBeenCalledWith('寶寶', '2027-03-01', undefined, '2027-03-01', undefined),
    );

    childArrives('littlebloom');
    await waitFor(() => expect(onNavigate).toHaveBeenCalledWith('littlebloom'));
  });

  it('用代碼加入之後也一樣', async () => {
    const { onNavigate, joinChild, childArrives, user } = setup();

    await user.click(screen.getByRole('button', { name: /用代碼加入/ }));
    await user.type(screen.getByLabelText('寶寶代碼'), 'uuid-1');
    await user.click(
      screen.getAllByRole('button', { name: '加入寶寶' }).find((b) => b.getAttribute('type') === 'submit')!,
    );
    await waitFor(() => expect(joinChild).toHaveBeenCalledWith('uuid-1'));

    childArrives('littleexplorer');
    await waitFor(() => expect(onNavigate).toHaveBeenCalledWith('littleexplorer'));
  });

  it('寫入失敗就不等了：之後孩子從別處出現也不會被帶走', async () => {
    const { onNavigate, addChild, childArrives, user } = setup();
    addChild.mockRejectedValueOnce(new Error('PERMISSION_DENIED'));

    await user.click(screen.getByRole('button', { name: '新增寶寶' }));
    await user.click(screen.getByRole('button', { name: '懷孕中' }));
    fireEvent.change(screen.getByLabelText('預產期'), { target: { value: '2027-03-01' } });
    await user.click(screen.getByRole('button', { name: '開始追蹤孕期' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    childArrives('littlebloom');
    await waitFor(() => expect(screen.getByRole('button', { name: '打開紀錄' })).toBeInTheDocument());
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('沒送過表單時，孩子出現（例如另一台裝置建的）不會把人帶走', async () => {
    const { onNavigate, childArrives } = setup();

    childArrives('littlesteps/dashboard');
    await waitFor(() => expect(screen.getByRole('button', { name: '打開紀錄' })).toBeInTheDocument());
    expect(onNavigate).not.toHaveBeenCalled();
  });
});

describe('第二位照顧者', () => {
  // 另一半或阿公阿嬤登入的是一個沒有孩子的帳號。只給「新增寶寶」的話，他會
  // 再建一個同名的孩子，而家人已經記了幾個月的那一份他永遠看不到。
  it.each([
    ['入口頁', 'hub', 'home'],
    ['LittleSteps 的引導頁', 'first-child', 'littlesteps/milestones'],
  ] as const)('%s 給得出「用代碼加入」，而且直接開在加入那一頁', async (_name, kind, page) => {
    const user = userEvent.setup();
    render(
      <LandingPage
        kind={kind}
        page={page}
        user={signedIn}
        hasChildren={false}
        entryPage="home"
        onSignIn={vi.fn()}
        onNavigate={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: /用代碼加入/ }));

    expect(screen.getByLabelText('寶寶代碼')).toBeInTheDocument();
    expect(screen.queryByLabelText('寶寶姓名')).not.toBeInTheDocument();
  });

  it('按「新增寶寶」仍然開在新增那一頁', async () => {
    const user = userEvent.setup();
    render(
      <LandingPage
        kind="first-child"
        page="littlesteps/daily-log"
        user={signedIn}
        hasChildren={false}
        entryPage="home"
        onSignIn={vi.fn()}
        onNavigate={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: '新增寶寶' }));
    expect(screen.getByLabelText('寶寶姓名')).toBeInTheDocument();
  });
});
