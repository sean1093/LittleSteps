import { useState, useEffect, Suspense, lazy } from 'react';
import { Menu } from 'lucide-react';
import { pageFromPath, type Page, type LittleStepsPage } from './types/routes';
import { entryPageForChild, serviceForStage, stageOfChild } from './common/stageEntry';
import { goTo, subscribeToNavigation } from './common/navigate';
import { isStandaloneSubApp, wantsDailyLogs, wantsDiaryEntries } from './common/routePolicy';
import { useDocumentMeta } from './common/seo/useDocumentMeta';
import { useStalled } from './common/hooks/useStalled';
import { recordsStatusOf } from './common/recordsStatus';
import { splitOverdueByProfileStart } from './common/utils/profileHistory';
import { logPageView } from './lib/firebase';
import { stripOpenExternalBrowserParam } from './common/inAppBrowser';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useChildStoreContext, ChildStoreProvider } from './common/contexts/ChildStoreContext';
import { useCareTasks } from './littleexplorer/hooks/useCareTasks';
import { NO_CHILD_RECORDS, sliceFor, type ChildRecords } from './common/childRecords';
import Sidebar from './common/components/Sidebar';
import AppHomeButton from './common/components/AppHomeButton';
import AccountButton from './common/components/AccountButton';
import PregnancyGate from './littlesteps/components/PregnancyGate';
import LandingPage, { landingKindFor, isStandaloneLanding } from './common/landing/LandingPage';
import HubHeader from './common/landing/HubHeader';
import ErrorBoundary from './common/components/ErrorBoundary';
import { ToastProvider } from './common/ui/toast';
import AppBar from './common/ui/AppBar';
import EmptyState from './common/ui/EmptyState';
import LoadingBar from './common/ui/LoadingBar';
import { SERVICE_THEME } from './common/ui/serviceTheme';
const DashboardPage = lazy(() => import('./littlesteps/pages/DashboardPage'));
const MilestonesPage = lazy(() => import('./littlesteps/pages/MilestonesPage'));
const CareGuidePage = lazy(() => import('./littlesteps/pages/CareGuidePage'));
const VaccineScheduleToolPage = lazy(() => import('./littlesteps/pages/VaccineScheduleToolPage'));
const GrowthPercentileToolPage = lazy(() => import('./littlesteps/pages/GrowthPercentileToolPage'));
const CheckupScheduleToolPage = lazy(() => import('./littlebloom/pages/CheckupScheduleToolPage'));
const WeeklyGuideToolPage = lazy(() => import('./littlebloom/pages/WeeklyGuideToolPage'));
const VaccineTrackingPage = lazy(() => import('./littlesteps/pages/VaccineTrackingPage'));
const ComplementaryFoodPage = lazy(() => import('./littlesteps/pages/ComplementaryFoodPage'));
const GrowthChartsPage = lazy(() => import('./littlesteps/pages/GrowthChartsPage'));
const SleepTrainingPage = lazy(() => import('./littlesteps/pages/SleepTrainingPage'));
const DailyLogPage = lazy(() => import('./littlesteps/pages/DailyLogPage'));
const SleepAnalysisPage = lazy(() => import('./littlesteps/pages/SleepAnalysisPage'));
const LittleBloomPage = lazy(() => import('./littlebloom/pages/LittleBloomPage'));
// 登入後才會到這裡：分享連結的確認畫面，會把這個帳號寫進某個孩子的名單。
const JoinPage = lazy(() => import('./common/join/JoinPage'));
const LittleBloomWikiPage = lazy(() => import('./littlebloom/pages/LittleBloomWikiPage'));
const OutingPage = lazy(() => import('./littleouting/pages/OutingPage'));
const PrenatalPage = lazy(() => import('./littlebloom/pages/PrenatalPage'));
const BabyOasisPage = lazy(() => import('./babyoasis/pages/BabyOasisPage'));
const RadarPage = lazy(() => import('./littleguard/pages/RadarPage'));
const BabyWikiPage = lazy(() => import('./littlesteps/pages/BabyWikiPage'));
const ClinicSummaryPage = lazy(() => import('./littlesteps/pages/ClinicSummaryPage'));
const ReportPage = lazy(() => import('./littlesteps/pages/ReportPage'));
const DevelopmentPage = lazy(() => import('./littleexplorer/pages/DevelopmentPage'));
const RemindersPage = lazy(() => import('./littleexplorer/pages/RemindersPage'));
const DiaryPage = lazy(() => import('./littleexplorer/pages/DiaryPage'));
const ToddlerWikiPage = lazy(() => import('./littleexplorer/pages/ToddlerWikiPage'));
const AboutPage = lazy(() => import('./common/about/AboutPage'));
import FeedbackButton from './common/components/FeedbackButton';
import QuietBoundary from './common/components/QuietBoundary';
// 會碰到資料庫 SDK，而且只有登入之後才用得到，所以不放在進入點的 import
// 路徑上：它替這個外框跑 useDailyLogs／useDiary。理由見 lib/database.ts。
const ChildRecordsBridge = lazy(() => import('./common/ChildRecordsBridge'));
import { toLocalDateKey } from './common/utils/dateHelpers';

function AppContent() {
  const { user, loading, signInWithGoogle } = useAuth();

  const {
    childProfiles,
    currentChild,
    currentChildMilestoneProgress,
    currentChildVaccineProgress,
    childrenLoading,
    toggleMilestone,
    setMilestone,
    setVaccineDose,
    addChild,
    joinChild,
    currentChildDevelopmentProgress,
    currentChildToothProgress,
    toggleDevelopmentCheck,
    toggleTooth,
    pregnancyChild,
    pregnancyPrenatalProgress,
    upsertPrenatalRecord,
    clearPrenatalRecord,
    recordBirth,
    upsertCareTaskRecord,
    clearCareTaskRecord,
    addDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
  } = useChildStoreContext();

  const [currentPage, setCurrentPage] = useState<Page>(() => pageFromPath(window.location.pathname));

  const [sidebarOpen, setSidebarOpen] = useState(false);
  // 入口頁的表單剛送出第一個孩子，名單還沒回來。這個旗標住在這裡而不是
  // LandingPage 裡：名單一多出一個 id，childrenLoading 會短暫變回 true，下面
  // 整個畫面換成載入條，LandingPage 跟著卸載——放在它自己的 state 裡，等孩子
  // 真的出現時旗標已經不在了。
  const [awaitingFirstChild, setAwaitingFirstChild] = useState(false);
  // 家長在名單回來之前自己走開了，就不要等他下次回到入口頁時把他帶走。
  useEffect(() => {
    if (currentPage !== 'home') setAwaitingFirstChild(false);
  }, [currentPage]);


  // Get daily logs for current child
  // currentChild 不一定是 currentChildId 指的那一個：共享的孩子被建立者刪掉
  // 之後 currentChildId 會被清成 null，而畫面已經退到名單裡的第一個孩子。
  // 這裡若用 id，日誌與日記就會去讀一個 null，家長看到的是「這孩子沒有紀錄」。
  //
  // 兩份讀的量都不小（日記是整個集合，日誌是最近 90 天），所以只在會讀它的
  // 服務裡才訂閱；其餘頁面傳
  // null，useFirebaseCollection 遇到 null 就什麼都不掛。理由與為什麼以服務而
  // 不是頁面為界，寫在 routePolicy 的 wantsDailyLogs 上。
  const recordsChildId = currentChild?.id ?? null;
  const logsChildId = wantsDailyLogs(currentPage) ? recordsChildId : null;
  const diaryChildId = wantsDiaryEntries(currentPage) ? recordsChildId : null;
  // listener 本身在 ChildRecordsBridge 裡（lazy，見上面 import 處），這裡拿到的
  // 是它回報的結果。回報一定比「想要誰的」晚一步——bridge 的 chunk 可能還在
  // 路上，到了之後也是在 effect 裡回報——所以用 sliceFor 對一下是不是這個孩子
  // 的：不是，就是「還不知道」，不是「沒有紀錄」。
  const [records, setRecords] = useState<ChildRecords>(NO_CHILD_RECORDS);
  // 登出之後 bridge 就卸載了，不會再回報；上一位家長的紀錄不該繼續留在這裡。
  useEffect(() => {
    if (!user) setRecords(NO_CHILD_RECORDS);
  }, [user]);
  const {
    data: dailyLogs,
    loading: dailyLogsLoading,
    error: dailyLogsError,
  } = sliceFor(records.dailyLogs, logsChildId);
  const {
    data: diaryEntries,
    loading: diaryLoading,
    error: diaryError,
  } = sliceFor(records.diaryEntries, diaryChildId);
  const { tasks: careTasks } = useCareTasks(currentChild);
  // 空陣列有三種意思，只有一種是「沒有紀錄」：第一份快照還沒回來、讀取被拒
  // （例如成員資格剛被收回），以及斷線——RTDB 斷線時兩個 callback 都不會來。
  // listener 以前在入口頁就熱了，現在走進服務才訂閱，所以「還沒回來」每次
  // 都會遇到。看診摘要寫「這七天沒有餵奶」是比轉一下更糟的答案，所以把這三種
  // 合成一個狀態，跟著資料一起傳給讀這一份的四頁，不是 ready 就不拿去算。
  //
  // 由頁面在自己的版面裡顯示，不在這裡把整頁換掉：那樣頁面的 chunk 與它自己
  // 的 listener 要等快照回來才開始載，三件本來同時進行的事變成排隊；而日記頁
  // 的頁首與分頁列是它自己畫的，換掉就連離開的路都沒有。
  const dailyLogsStalled = useStalled(dailyLogsLoading);
  const diaryStalled = useStalled(diaryLoading);
  const dailyLogsStatus = recordsStatusOf({
    loading: dailyLogsLoading,
    error: dailyLogsError,
    stalled: dailyLogsStalled,
  });
  const diaryStatus = recordsStatusOf({
    loading: diaryLoading,
    error: diaryError,
    stalled: diaryStalled,
  });
  // 建檔之前就到期的項目不算逾期——app 只是沒有那段紀錄，不是家長漏掉了。
  // 把它們算進紅點，會讓新增一個既有的兩歲孩子立刻背上十幾筆「未完成」。
  const reminderBadge =
    splitOverdueByProfileStart(careTasks, currentChild?.createdAt).overdue.length +
    careTasks.filter((task) => task.status === 'due').length;


  // 「什麼都還沒有」的畫面與登入後的去向都由 common/landing/LandingPage 決定，
  // 包含未登入被擋下時該顯示哪一張服務介紹頁。這裡不再各自判斷。

  // 瀏覽器上一頁／下一頁與 app 內部換頁都不會重新掛載，所以要自己跟著換頁。
  useEffect(
    () =>
      subscribeToNavigation(() => {
        setCurrentPage(pageFromPath(window.location.pathname));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }),
    [],
  );

  useDocumentMeta(currentPage);

  // page_view 只在這裡送，全站就這一個呼叫點。
  //
  // 換頁有兩條路：經過 onNavigate 的 navigateToPage，以及元件自己呼叫的
  // goTo()、瀏覽器的上一頁／下一頁與第一次載入。以前只有第一條會記，所以
  // LittleExplorer 的分頁、返回鍵與每次造訪的第一頁都沒有 page_view。綁在
  // currentPage 上，不管是誰換的頁都只記一次；重畫而沒換頁則不記。
  //
  // 記的單位是路由，不是畫面：只換 query 的導覽（同一個百科換關鍵字）不會
  // 再記一筆；未登入而看到服務介紹頁、或還在載入時，記的仍是網址上那一頁，
  // 登入後停在同一個網址也不會補記。要區分那些得加維度，而每個事件能帶哪些
  // 欄位是 analytics.test.ts 釘死的。
  //
  // 必須宣告在 useDocumentMeta 之後：同一個元件的 effect 照宣告順序執行，而
  // logPageView 讀的是 document.title。放在前面，或是像以前那樣在事件處理
  // 函式裡同步呼叫，送出去的就是上一頁的標題。
  //
  // 先拿掉 LINE 的 openExternalBrowser：那是請 LINE 換到外部瀏覽器的參數
  // （見 common/inAppBrowser），到了這裡已經完成任務，不該留在網址列、書籤
  // 與第一筆 page_view 裡。
  useEffect(() => {
    stripOpenExternalBrowserParam();
    logPageView(currentPage);
  }, [currentPage]);

  const navigateToPage = (page: Page) => {
    // 畫面由上面訂閱的導覽事件來換，這裡不必自己 setCurrentPage。
    goTo(page);
    // 捲回頂端要留在這裡：goTo 遇到「已經在這一頁」會直接 return，連事件都
    // 不發。少了這一行，在目前這一頁點側邊選單的同一項或頁首的首頁鍵就什麼
    // 都不會發生。
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  const getPageTitle = () => {
    // LittleBloom and LittleExplorer are titled by their own role.
    if (currentPage === 'littlebloom') {
      return SERVICE_THEME.littlebloom.role;
    }
    if (currentPage.startsWith('littleexplorer')) {
      return SERVICE_THEME.littleexplorer.role;
    }

    // 服務首頁的標題是服務的角色名「寶寶成長」，不是英文代號；其餘每一頁的
    // 標題就是頁名本身。「誰的」放在副標（見下面的 AppBar）：這裡原本組成
    // 「{名字} 的 里程碑追蹤」，而這一列還有四顆 44px 的按鈕，在 390px 上被
    // 截掉的正好是後半段的頁名——家長看得到孩子的名字，看不到自己在哪一頁。
    let title = currentPage === 'littlesteps' ? SERVICE_THEME.littlesteps.role : '';

    switch (currentPage) {
      case 'littlesteps':
        break;
      case 'littlesteps/dashboard':
        title += '成長總覽';
        break;
      case 'littlesteps/milestones':
        title += '里程碑追蹤';
        break;
      case 'littlesteps/care-guide':
        title += '照顧重點';
        break;
      case 'littlesteps/vaccine-tracking':
        title += '疫苗追蹤';
        break;
      case 'littlesteps/complementary-food':
        title += '副食品指南';
        break;
      case 'littlesteps/vaccine-schedule':
        title += '疫苗時程試算';
        break;
      case 'littlesteps/growth-percentile':
        title += '生長百分位試算';
        break;
      case 'littlesteps/daily-log':
        title += '快速日誌';
        break;
      case 'littlesteps/growth-charts':
        title += '成長曲線圖';
        break;
      case 'littlesteps/sleep-training':
        title += '睡眠指南';
        break;
      case 'littlesteps/sleep-analysis':
        title += '睡眠分析';
        break;
      case 'littlesteps/baby-wiki':
        title += '寶寶百科';
        break;
      case 'littlesteps/clinic-summary':
        title += '看診摘要';
        break;
      case 'littlesteps/report':
        title += '週報月報';
        break;
      default:
        break;
    }
    return title;
  };

  // Whether this page renders its own chrome — the about page and the five
  // standalone sub-apps. The predicate and the landmark contract that comes
  // with it live in `routePolicy.ts`, where a test can derive the list from it
  // without importing this file's React tree.
  const isStandalone = isStandaloneSubApp(currentPage);
  // Login is mandatory, so every LittleSteps route shows the header (and thus the
  // sidebar/menu) once we reach the authenticated tree below.
  const showHeader = !(currentPage === 'home' || isStandalone);
  // 自帶 header 與 <main> 的服務由自己描述文件結構；其餘的由這個外框提供。
  // 理由寫在下面 render 的那段註解裡。
  const ContentLandmark = isStandalone ? 'div' : 'main';


  // RTDB 沒有磁碟快取。已安裝的 PWA 在離線時仍然開得起來（shell 有 precache），
  // 但 onValue 永遠不會回呼，於是載入條會一直轉下去，沒有任何說明。
  const dataPending = loading || (user !== null && childrenLoading);
  const loadStalled = useStalled(dataPending);

  // 下面每一個 return 都把它放在同一個位置（外框的兄弟、同一個 key），而不是
  // 只放在最後那個 return 裡面。新增、加入或刪除一個孩子時 childrenLoading 會
  // 短暫變回 true，畫面退回載入條；bridge 跟著卸載的話 listener 會退訂，RTDB
  // 把快取丟掉，整份日誌重新下載一次——正是 wantsDailyLogs 那段說要避免的事。
  //
  // 外面那層 QuietBoundary：chunk 載不進來時不讓整個 app 換成錯誤畫面。那時
  // 回報永遠不會來，sliceFor 一直回「載入中」，頁面自己的「連不上伺服器」
  // 會在平常的等待之後出現。
  const recordsBridge = user && (
    <QuietBoundary key="records-bridge" scope="child records">
      <Suspense fallback={null}>
        <ChildRecordsBridge
          user={user}
          logsChildId={logsChildId}
          diaryChildId={diaryChildId}
          onRecords={setRecords}
        />
      </Suspense>
    </QuietBoundary>
  );

  // Show loading state while auth or children data is loading.
  // A pulsing 64px baby icon was the old treatment; a thin progress bar says
  // the same thing without an illustration and without a layout jump.
  if (dataPending) {
    if (loadStalled) {
      return (
        <>
        <div key="screen" className="min-h-dscreen bg-warm-white flex items-center justify-center p-4">
          {/* 取代的是一條 role="status" 的載入條；沒有自己的 live region，螢幕
              閱讀器的使用者聽完「載入中」之後就什麼都聽不到了。 */}
          <div className="w-full max-w-md" role="alert">
            <EmptyState
              theme={SERVICE_THEME.littlesteps}
              title="連不上伺服器"
              description="目前似乎沒有網路連線。寶寶的資料存在雲端，連上網路後就會出現。"
              action={{ label: '重新載入', onClick: () => window.location.reload() }}
            />
          </div>
        </div>
        {recordsBridge}
        </>
      );
    }
    return (
      <>
        <div key="screen" className="min-h-dscreen flex items-center justify-center bg-warm-white">
          <LoadingBar />
        </div>
        {recordsBridge}
      </>
    );
  }

  // 未登入不再是整站一道牆。只有會讀孩子資料的頁面需要登入，其餘（服務集合
  // 首頁、各服務的介紹頁、百科與哺乳室地圖）一律可看——擋住靜態內容只會讓還
  // 沒有帳號的家長連認識這些服務的機會都沒有。
  //
  // 被擋下時渲染該服務自己的介紹頁，而不是改網址跳走：hash 保持原樣，登入後
  // 同一個路由就會渲染出使用者原本想去的頁面。
  const landingKind = landingKindFor(currentPage, user, childProfiles.length > 0);
  const landing = landingKind && (
    <LandingPage
      kind={landingKind}
      page={currentPage}
      user={user}
      hasChildren={childProfiles.length > 0}
      entryPage={entryPageForChild(currentChild)}
      awaitingFirstChild={awaitingFirstChild}
      onAwaitFirstChild={setAwaitingFirstChild}
      currentService={serviceForStage(stageOfChild(currentChild))}
      childName={currentChild?.name}
      onSignIn={signInWithGoogle}
      onNavigate={navigateToPage}
    />
  );

  // 服務介紹頁自帶版面；服務集合首頁與「先新增寶寶」留在既有版面裡。
  if (landingKind && isStandaloneLanding(landingKind)) {
    return landing;
  }

  return (
    <>
    <div key="screen" className="min-h-dscreen bg-warm-white">
      {/* Sidebar - Only show for LittleSteps routes */}
      {!isStandalone && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPage={currentPage as LittleStepsPage}
          onNavigate={navigateToPage}
          user={user}
        />
      )}

      {/* 入口頁的品牌列。放在下面那個 <main> 外面：<header> 包在 main 裡就不是
          banner 地標，而入口頁原本是唯一一個沒有 banner 的公開路由。 */}
      {currentPage === 'home' && <HubHeader user={user} onSignIn={signInWithGoogle} />}

      {/* Header */}
      {showHeader && (
        <AppBar
          theme={SERVICE_THEME.littlesteps}
          title={getPageTitle()}
          // 這一頁是關於誰的。服務首頁不放：那裡還沒進到任何一個孩子的頁面。
          subtitle={
            currentPage !== 'littlesteps' &&
            // 試算工具不是關於哪一個孩子的：填進去的可以是任何人的生日。
            currentPage !== 'littlesteps/vaccine-schedule' &&
            currentPage !== 'littlesteps/growth-percentile'
              ? currentChild?.name
              : undefined
          }
          leading={
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="開啟選單"
              className="btn-icon -ml-1.5 bg-ink/5 hover:bg-ink/10"
            >
              <Menu className="w-5 h-5" />
            </button>
          }
          actions={
            <>
              {/* 這裡原本還有一顆「寶寶成長首頁」。它跟左邊選單的第一列去的是
                  同一個地方，卻佔掉標題 44px，所以拿掉了。 */}
              <AccountButton service="littlesteps" />
              <AppHomeButton />
            </>
          }
        />
      )}

      {/* Main Content */}
      {/*
        Standalone 子服務底下這一層不能是 <main>。

        HTML 只在 <header> 不位於 main / section / article / aside / nav 之內時
        才把它算成 banner 地標，而那五個服務的 AppBar 是它們自己的頁面畫出來的，
        由這裡 lazy-load 進來——包在 <main> 裡，那顆 header 就不再是地標，用地標
        跳轉的螢幕閱讀器使用者在 BabyOasis、LittleGuard、LittleOuting、
        LittleBloom 與 LittleExplorer 上會找不到頁首，而 LittleSteps 的每一頁都
        找得到。同一個捷徑在半個 app 上有效、另外半個安靜失效，比兩邊都沒有更糟。

        另一半是 <main> 自己：BloomShell、ExplorerShell 與 OutingPage 各有一個
        <main>，包在這一層裡就變成巢狀的兩個 main，而 <main> 依規格不得有 main
        祖先。這兩件事是同一個錯誤的兩面——外框替自帶版面的頁面多包了一層。

        LittleSteps 的外框與入口頁沒有自己的地標，那一層仍然由這裡提供。

        兩個 fallback 分開處理。下面 Suspense 的載入畫面刻意不給地標：那個狀態是
        暫時的，role="status" 已經報過一次，而只活過一次 chunk 載入就被換掉的地標
        對用地標跳轉的人沒有可以落腳的地方；ErrorBoundary 的錯誤畫面相反，它是終
        局，就是那一刻整頁的內容，所以 standalone 路由上由它自己當 <main>。
      */}
      <ContentLandmark className={showHeader ? "pb-6" : ""}>
        {/* key 綁 currentPage：一頁壞掉之後換頁就會重掛，不會把家長困在
            錯誤畫面裡直到重新整理。 */}
        <ErrorBoundary key={currentPage} scope={currentPage} ownsMain={isStandalone}>
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
              <LoadingBar />
            </div>
          }
        >
        {/* 服務集合首頁與「先新增寶寶」都由 LandingPage 決定，這裡只負責放進版面 */}
        {landing}

        {/* landingKind 有值時不畫任何頁面：入口頁本來就沒有對應的路由，而「先
            新增寶寶」現在涵蓋 LittleSteps 每一個需要孩子的頁面——不擋下來的話，
            那張引導會和一整頁按了沒反應的里程碑疊在一起。 */}
        {!landingKind && (
          <>
        {/* LittleSteps Routes */}
        {currentPage === 'littlesteps' && (
          <DashboardPage
            currentChild={currentChild}
            dailyLogs={dailyLogs}
            logsStatus={dailyLogsStatus}
            user={user}
            onNavigate={navigateToPage}
          />
        )}
        {currentPage === 'littlesteps/dashboard' && (
          <DashboardPage
            currentChild={currentChild}
            dailyLogs={dailyLogs}
            logsStatus={dailyLogsStatus}
            user={user}
            onNavigate={navigateToPage}
          />
        )}
        {currentPage === 'littlesteps/milestones' && (
          <PregnancyGate currentChild={currentChild}>
            <MilestonesPage
              // 篩選器要從孩子現在的月齡起跑，所以這兩頁需要孩子本身，
              // 不只是進度資料。
              currentChild={currentChild}
              progress={currentChildMilestoneProgress}
              onToggleMilestone={toggleMilestone}
              onSetMilestone={setMilestone}
            />
          </PregnancyGate>
        )}
        {currentPage === 'littlesteps/care-guide' && (
          <CareGuidePage />
        )}
        {currentPage === 'littlesteps/vaccine-schedule' && <VaccineScheduleToolPage />}
        {currentPage === 'littlesteps/growth-percentile' && <GrowthPercentileToolPage />}
        {currentPage === 'littlesteps/vaccine-tracking' && (
          <PregnancyGate currentChild={currentChild}>
            <VaccineTrackingPage
              currentChild={currentChild}
              vaccineProgress={currentChildVaccineProgress}
              onSetVaccineDose={setVaccineDose}
            />
          </PregnancyGate>
        )}
        {currentPage === 'littlesteps/complementary-food' && (
          // 公開頁：指南誰都能看，所以不包 PregnancyGate。「我的追蹤」只在登入且
          // 孩子已經出生時才由頁面自己掛載。
          <ComplementaryFoodPage
            currentChild={currentChild}
            user={user}
            onSignIn={signInWithGoogle}
          />
        )}
        {currentPage === 'littlesteps/daily-log' && (
          <PregnancyGate currentChild={currentChild}>
            <DailyLogPage currentChild={currentChild} user={user} />
          </PregnancyGate>
        )}
        {currentPage === 'littlesteps/growth-charts' && (
          <PregnancyGate currentChild={currentChild}>
            <GrowthChartsPage
              currentChild={currentChild}
              user={user}
            />
          </PregnancyGate>
        )}
        {currentPage === 'littlesteps/sleep-training' && (
          <SleepTrainingPage />
        )}
        {currentPage === 'littlesteps/sleep-analysis' && (
          <SleepAnalysisPage currentChild={currentChild} user={user} />
        )}
        {currentPage === 'littlesteps/baby-wiki' && (
          <BabyWikiPage />
        )}
        {currentPage === 'littlesteps/clinic-summary' && (
          <ClinicSummaryPage
            currentChild={currentChild}
            dailyLogs={dailyLogs}
            logsStatus={dailyLogsStatus}
            user={user}
          />
        )}
        {currentPage === 'littlesteps/report' && (
          <ReportPage
            currentChild={currentChild}
            dailyLogs={dailyLogs}
            logsStatus={dailyLogsStatus}
            user={user}
          />
        )}

        {/* LittleBloom Route */}
        {currentPage === 'littlebloom' && (
          <LittleBloomPage
            currentChild={pregnancyChild}
            progress={pregnancyPrenatalProgress}
            onRecordBirth={recordBirth}
            // 孕期檔案就是「還沒出生的孩子」，所以走同一個 addChild；帶了
            // 預產期，資料層就會標成孕期檔案。共用資料層，不共用畫面。
            onAddPregnancy={(name, dueDate) => addChild(name, dueDate, undefined, dueDate)}
            onJoinPregnancy={joinChild}
          />
        )}
        {currentPage === 'littlebloom/prenatal' && (
          <PrenatalPage
            currentChild={pregnancyChild}
            progress={pregnancyPrenatalProgress}
            onComplete={upsertPrenatalRecord}
            onUndo={clearPrenatalRecord}
          />
        )}
        {currentPage === 'littlebloom/wiki' && <LittleBloomWikiPage />}
        {currentPage === 'littlebloom/checkup-schedule' && <CheckupScheduleToolPage />}
        {currentPage === 'littlebloom/weekly-guide' && <WeeklyGuideToolPage />}

        {/* LittleExplorer Routes */}
        {currentPage === 'littleexplorer' && (
          <DevelopmentPage
            currentChild={currentChild}
            progress={currentChildDevelopmentProgress}
            toothProgress={currentChildToothProgress}
            reminderBadge={reminderBadge}
            onToggleCheck={toggleDevelopmentCheck}
            onToggleTooth={toggleTooth}
            onQuickDiary={async (content, linkedCheckItemId) => {
              await addDiaryEntry({
                date: toLocalDateKey(),
                content,
                linkedCheckItemId,
              });
            }}
            onAddChild={(name, birthday, gender, gestationalAge) =>
              addChild(name, birthday, gender, undefined, gestationalAge)
            }
            onJoinChild={joinChild}
          />
        )}
        {currentPage === 'littleexplorer/reminders' && (
          <RemindersPage
            currentChild={currentChild}
            tasks={careTasks}
            reminderBadge={reminderBadge}
            onCompleteTask={upsertCareTaskRecord}
            onUndoTask={clearCareTaskRecord}
            onAddChild={(name, birthday, gender, gestationalAge) =>
              addChild(name, birthday, gender, undefined, gestationalAge)
            }
            onJoinChild={joinChild}
          />
        )}
        {currentPage === 'littleexplorer/diary' && (
          <DiaryPage
            currentChild={currentChild}
            entries={diaryEntries}
            status={diaryStatus}
            reminderBadge={reminderBadge}
            onAdd={addDiaryEntry}
            onUpdate={updateDiaryEntry}
            onDelete={deleteDiaryEntry}
            onAddChild={(name, birthday, gender, gestationalAge) =>
              addChild(name, birthday, gender, undefined, gestationalAge)
            }
            onJoinChild={joinChild}
          />
        )}
        {currentPage === 'littleexplorer/wiki' && (
          <ToddlerWikiPage currentChild={currentChild} reminderBadge={reminderBadge} />
        )}

        {/* Standalone sub-app routes */}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'join' && <JoinPage />}
        {currentPage === 'littleouting' && <OutingPage />}
        {currentPage === 'babyoasis' && <BabyOasisPage />}
        {currentPage === 'littleguard' && <RadarPage />}
          </>
        )}
        </Suspense>
        </ErrorBoundary>
      </ContentLandmark>

      {/* Feedback Button */}
      <FeedbackButton user={user} />
    </div>
    {recordsBridge}
    </>
  );
}

function App() {
  return (
    // 外層這道攔的是頁首、側邊欄、context provider 之類的外框錯誤——那些
    // 在 <main> 之外，裡面那道 boundary 看不到。上面沒有任何一層會給地標，
    // 所以這道的錯誤畫面自己就是整頁的 <main>。
    <ErrorBoundary scope="app" ownsMain>
      {/* Toast 在最外層：AuthProvider 自己也會回報登入失敗。 */}
      <ToastProvider>
        <AuthProvider>
        {/* 孩子資料與帳號一樣是全站脈絡：五個服務的 AppBar 都要拿得到，
            不然登出與切換寶寶就只會存在於能拿到 prop 的那一個服務裡。 */}
          <ChildStoreProvider>
            <AppContent />
          </ChildStoreProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
