import { useEffect, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import type { Page } from '../../types/routes';
import { requiresAuth, serviceOf } from '../routePolicy';
import { useOptionalChildStore } from '../contexts/ChildStoreContext';
import AddChildModal from '../components/AddChildModal';
import EmptyState from '../ui/EmptyState';
import { SERVICE_THEME, type ServiceId } from '../ui/serviceTheme';
import HubLanding from './HubLanding';
import ServiceIntro from './ServiceIntro';
import JoinIntro from './JoinIntro';

/**
 * 「還沒有內容可看」的所有畫面，集中在這一支。
 *
 * 這些分支原本散在 App.tsx 三個地方加兩個 useEffect：未登入被擋下時挑一張
 * 介紹頁、`#/` 挑服務集合首頁、`#/littlesteps` 再依有沒有孩子分岔，而「登入
 * 後要去哪」同時寫在 App.tsx 與 StepsLanding 裡，兩者條件還不一致——一個
 * 要求已經有孩子，另一個不要求，於是剛註冊還沒建檔的人會被送進空的儀表板。
 * 規則收在這裡，就只有一個地方描述「什麼都還沒有的時候看到什麼」。
 */

export type LandingKind = 'hub' | 'service-intro' | 'first-child';

/** 這一頁該顯示哪一種首頁；有實際內容可看時回傳 null，交還給 App 渲染真正的頁面。 */
export function landingKindFor(
  page: Page,
  user: User | null,
  hasChildren: boolean,
): LandingKind | null {
  if (page === 'home') return 'hub';

  // 未登入又需要登入的頁面：顯示該服務的自我介紹，網址保持不變，
  // 登入後同一個路由就會渲染出使用者原本要去的地方。
  // 三個階段服務共用同一張介紹頁（ServiceIntro）。另外三個服務整個公開，
  // requiresAuth 對它們永遠是 false，走不到這裡。
  if (!user && requiresAuth(page)) return 'service-intro';

  // 已登入但還沒有孩子：LittleSteps 每一個需要孩子的頁面都先請他新增或加入。
  // 這裡原本只管服務首頁，其餘頁面各自處理——有的叫家長去「左上角選單」或
  // 「側邊欄」新增（那裡早就沒有這個功能了），里程碑與疫苗則整頁照畫，按了
  // 沒有任何反應。免登入的內容頁不受影響：它們不需要孩子。
  if (user && !hasChildren && serviceOf(page) === 'littlesteps' && requiresAuth(page)) {
    return 'first-child';
  }

  return null;
}

/**
 * 介紹頁自帶版面，不能套 LittleSteps 的 header 與側邊欄；
 * 服務集合首頁與「先新增寶寶」則要留在既有版面裡（後者還得開側邊欄）。
 */
export function isStandaloneLanding(kind: LandingKind): boolean {
  return kind === 'service-intro';
}

interface LandingPageProps {
  kind: LandingKind;
  page: Page;
  user: User | null;
  hasChildren: boolean;
  /** 登入完成後要去的那一頁，依目前孩子的階段決定 */
  entryPage: Page;
  /** 入口頁用來標出「目前階段」的服務；沒有孩子時省略 */
  currentService?: ServiceId;
  /** 目前這個孩子的名字，入口頁的「繼續記錄」用 */
  childName?: string;
  onSignIn: () => Promise<void>;
  onNavigate: (page: Page) => void;
  /**
   * 入口頁的表單剛送出這個帳號的第一個孩子，名單還沒回來。
   *
   * 由外面保管而不是放在這個元件的 state：新的孩子一進名單，App 會短暫退回
   * 載入條，這個元件跟著卸載，自己記的東西到孩子出現時已經沒了。
   */
  awaitingFirstChild?: boolean;
  onAwaitFirstChild?: (awaiting: boolean) => void;
}

export default function LandingPage({
  kind,
  page,
  user,
  hasChildren,
  entryPage,
  currentService,
  childName,
  onSignIn,
  onNavigate,
  awaitingFirstChild = false,
  onAwaitFirstChild,
}: LandingPageProps) {
  const store = useOptionalChildStore();
  /* 表單開在哪一個分頁；null 是沒開。拿著家人給的代碼來的人直接開在「加入」。 */
  const [addingChild, setAddingChild] = useState<'create' | 'join' | null>(null);


  // 登入完成的瞬間帶去這個孩子該去的那一頁，但只在真的有孩子時——否則會落在
  // 一個沒有資料的頁面上，而不是「先新增寶寶」。用 ref 比對前一次的 user 才能
  // 區分「剛登入」與「本來就是登入狀態」。
  //
  // 原本寫死 littlesteps/dashboard，只看 hasChildren 這個布林值，所以只有
  // 孕期檔案的使用者登入後會落在嬰兒儀表板上。目的地現在由 App 依孩子的階段算出。
  const wasSignedIn = useRef(user !== null);
  useEffect(() => {
    // 分享連結例外：登入之後要停在 /join 的確認畫面，不是被帶去自己孩子的頁面。
    if (!wasSignedIn.current && user && hasChildren && page !== 'join') {
      onNavigate(entryPage);
    }
    wasSignedIn.current = user !== null;
  }, [user, hasChildren, entryPage, onNavigate, page]);

  // 在入口頁新增或加入第一個孩子之後，直接帶去那個孩子的頁面。表單原本只是
  // 關掉、回到入口頁，家長得自己找到「打開紀錄」才看得到剛建好的東西。
  //
  // 只管「從沒有孩子變成有孩子」：已經有孩子的家長再加一個，是在帳號視窗裡
  // 做的，人還在他原本那一頁上，不該被帶走。
  useEffect(() => {
    if (!awaitingFirstChild || !hasChildren) return;
    onAwaitFirstChild?.(false);
    if (kind === 'hub') onNavigate(entryPage);
  }, [awaitingFirstChild, hasChildren, kind, entryPage, onNavigate, onAwaitFirstChild]);

  /**
   * 寫入前就舉旗，失敗再放下：RTDB 的 listener 在寫入的 promise 完成之前就會
   * 收到新名單，等 await 回來才舉，孩子已經出現過了。
   */
  const fromHub = async (write: (() => Promise<void>) | undefined) => {
    const first = kind === 'hub' && !hasChildren;
    if (first) onAwaitFirstChild?.(true);
    try {
      await write?.();
    } catch (error) {
      if (first) onAwaitFirstChild?.(false);
      throw error;
    }
  };

  const joinChild = store?.joinChild;
  const addChildModal = (
    <AddChildModal
      isOpen={addingChild !== null}
      initialMode={addingChild ?? undefined}
      onClose={() => setAddingChild(null)}
      // 入口頁寫著「懷孕中也可以：填預產期」，所以表單要有那一頁。沒有的話，
      // 預產期只能填進「寶寶生日」，建出來的是一份寶寶檔案。
      modes={['create', 'pregnancy', 'join']}
      onSave={(name, birthday, gender, _isPregnancy, dueDate, gestationalAge) =>
        fromHub(store ? () => store.addChild(name, birthday, gender, dueDate, gestationalAge) : undefined)
      }
      onJoin={joinChild && ((uuid) => fromHub(() => joinChild(uuid)))}
    />
  );

  if (kind === 'service-intro') {
    // 分享連結：同一條連結可能是寶寶或孕期檔案，加入之前看不出來，所以不借
    // 任何一個服務的介紹頁。網址一樣停在 /join，登入後就是確認畫面。
    if (page === 'join') return <JoinIntro onSignIn={onSignIn} />;
    const service = serviceOf(page);
    // landingKindFor 只在需登入的頁面回傳 service-intro，而需登入的頁面都屬於
    // 這三個階段服務；型別不知道這件事，所以明講。
    if (service === 'littlebloom' || service === 'littlesteps' || service === 'littleexplorer') {
      return <ServiceIntro service={service} onSignIn={onSignIn} />;
    }
  }

  if (kind === 'hub') {
    // 已登入的家長回到入口頁是來記東西的：第一個畫面就是「打開紀錄」，直接
    // 進這個孩子該去的那一頁。還沒有孩子時 entryPage 是 home，那顆按鈕就換成
    // 新增寶寶——表單只有這裡這一份。
    return (
      <>
        <HubLanding
          onNavigate={onNavigate}
          user={user}
          onSignIn={onSignIn}
          currentService={currentService}
          childName={hasChildren ? childName : undefined}
          onContinue={hasChildren ? () => onNavigate(entryPage) : undefined}
          onAddChild={() => setAddingChild('create')}
          onJoinChild={() => setAddingChild('join')}
        />
        {addChildModal}
      </>
    );
  }

  return (
    <div className="screen-body">
      <EmptyState
        theme={SERVICE_THEME.littlesteps}
        title="開始記錄寶寶的成長"
        description="先新增一個寶寶，即可開始追蹤里程碑、疫苗與日常照顧。"
        action={{ label: '新增寶寶', onClick: () => setAddingChild('create') }}
      />
      {/* 第二位照顧者——另一半、阿公阿嬤——登入後看到的也是這一頁。只給「新增
          寶寶」的話，他會再建一個同名的孩子，而家人已經記了好幾個月的那一份
          他永遠看不到。 */}
      <div className="text-center mt-2">
        <button type="button" onClick={() => setAddingChild('join')} className="btn-ghost text-sm">
          家人已經在記了？用代碼加入
        </button>
      </div>

      {/* 這顆按鈕原本只是打開側邊欄，而寶寶管理早就從側邊欄搬到每個 AppBar 的
          帳號按鈕底下了——於是剛註冊的家長按下引導流程唯一的那顆按鈕，得到
          一份導覽選單，裡面沒有任何地方可以新增寶寶。 */}
      {addChildModal}
    </div>
  );
}
