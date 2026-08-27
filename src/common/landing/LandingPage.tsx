import { useEffect, useRef } from 'react';
import { Baby } from 'lucide-react';
import type { User } from 'firebase/auth';
import type { Page } from '../../types/routes';
import { requiresAuth, serviceOf } from '../routePolicy';
import HubLanding from './HubLanding';
import StepsLanding from './StepsLanding';
import ServiceLanding from './ServiceLanding';

/**
 * 「還沒有內容可看」的所有畫面，集中在這一支。
 *
 * 這些分支原本散在 App.tsx 三個地方加兩個 useEffect：未登入被擋下時挑一張
 * 介紹頁、`#/` 挑服務集合首頁、`#/littlesteps` 再依有沒有孩子分岔，而「登入
 * 後要去哪」同時寫在 App.tsx 與 StepsLanding 裡，兩者條件還不一致——一個
 * 要求已經有孩子，另一個不要求，於是剛註冊還沒建檔的人會被送進空的儀表板。
 * 規則收在這裡，就只有一個地方描述「什麼都還沒有的時候看到什麼」。
 */

export type LandingKind = 'hub' | 'steps-intro' | 'service-intro' | 'first-child';

/** 這一頁該顯示哪一種首頁；有實際內容可看時回傳 null，交還給 App 渲染真正的頁面。 */
export function landingKindFor(
  page: Page,
  user: User | null,
  hasChildren: boolean,
): LandingKind | null {
  if (page === 'home') return 'hub';

  // 未登入又需要登入的頁面：顯示該服務的自我介紹，網址保持不變，
  // 登入後同一個路由就會渲染出使用者原本要去的地方。
  if (!user && requiresAuth(page)) {
    const service = serviceOf(page);
    return service === 'littlebloom' || service === 'littleexplorer'
      ? 'service-intro'
      : 'steps-intro';
  }

  if (page === 'littlesteps') {
    if (!user) return 'steps-intro';
    if (!hasChildren) return 'first-child';
  }

  return null;
}

/**
 * 介紹頁自帶版面，不能套 LittleSteps 的 header 與側邊欄；
 * 服務集合首頁與「先新增寶寶」則要留在既有版面裡（後者還得開側邊欄）。
 */
export function isStandaloneLanding(kind: LandingKind): boolean {
  return kind === 'steps-intro' || kind === 'service-intro';
}

interface LandingPageProps {
  kind: LandingKind;
  page: Page;
  user: User | null;
  hasChildren: boolean;
  onSignIn: () => Promise<void>;
  onNavigate: (page: Page) => void;
  /** 「先新增寶寶」需要它來開啟側邊欄的新增流程 */
  onAddChild: () => void;
}

export default function LandingPage({
  kind,
  page,
  user,
  hasChildren,
  onSignIn,
  onNavigate,
  onAddChild,
}: LandingPageProps) {
  // 登入完成的瞬間帶去儀表板，但只在真的有孩子時——否則會落在一個沒有資料的
  // 儀表板上，而不是「先新增寶寶」。用 ref 比對前一次的 user 才能區分「剛登入」
  // 與「本來就是登入狀態」。
  const wasSignedIn = useRef(user !== null);
  useEffect(() => {
    if (!wasSignedIn.current && user && hasChildren) {
      onNavigate('littlesteps/dashboard');
    }
    wasSignedIn.current = user !== null;
  }, [user, hasChildren, onNavigate]);

  if (kind === 'service-intro') {
    const service = serviceOf(page);
    // landingKindFor 只在這兩個服務回傳 service-intro。
    if (service === 'littlebloom' || service === 'littleexplorer') {
      return <ServiceLanding service={service} onSignIn={onSignIn} />;
    }
  }

  if (kind === 'steps-intro') {
    return <StepsLanding onNavigate={onNavigate} user={user} onSignIn={onSignIn} />;
  }

  if (kind === 'hub') {
    return <HubLanding onNavigate={onNavigate} user={user} onSignIn={onSignIn} />;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <Baby className="w-16 h-16 text-primary mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">開始記錄寶寶的成長</h2>
      <p className="text-gray-600 mb-6">先新增一個寶寶，即可開始追蹤里程碑、疫苗與日常照顧。</p>
      <button
        type="button"
        onClick={onAddChild}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-soft hover:shadow-soft-lg transition-all"
      >
        <Baby className="w-5 h-5" />
        新增寶寶
      </button>
    </div>
  );
}
