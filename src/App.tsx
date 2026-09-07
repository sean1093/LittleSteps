import { useState, useEffect, Suspense, lazy } from 'react';
import { Menu, Home } from 'lucide-react';
import { pageFromPath, type Page, type LittleStepsPage } from './types/routes';
import { entryPageForChild, serviceForStage, stageOfChild } from './common/stageEntry';
import { goTo, subscribeToNavigation } from './common/navigate';
import { isStandaloneSubApp } from './common/routePolicy';
import { useDocumentMeta } from './common/seo/useDocumentMeta';
import { splitOverdueByProfileStart } from './common/utils/profileHistory';
import { logPageView } from './lib/firebase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useChildStoreContext, ChildStoreProvider } from './common/contexts/ChildStoreContext';
import { useDailyLogs } from './littlesteps/hooks/useDailyLogs';
import { useCareTasks } from './littleexplorer/hooks/useCareTasks';
import { useDiary } from './littleexplorer/hooks/useDiary';
import Sidebar from './common/components/Sidebar';
import AppHomeButton from './common/components/AppHomeButton';
import AccountButton from './common/components/AccountButton';
import PregnancyGate from './littlesteps/components/PregnancyGate';
import LandingPage, { landingKindFor, isStandaloneLanding } from './common/landing/LandingPage';
import ErrorBoundary from './common/components/ErrorBoundary';
import { ToastProvider } from './common/ui/toast';
import AppBar from './common/ui/AppBar';
import EmptyState from './common/ui/EmptyState';
import { SERVICE_THEME } from './common/ui/serviceTheme';
const DashboardPage = lazy(() => import('./littlesteps/pages/DashboardPage'));
const MilestonesPage = lazy(() => import('./littlesteps/pages/MilestonesPage'));
const CareGuidePage = lazy(() => import('./littlesteps/pages/CareGuidePage'));
const VaccineTrackingPage = lazy(() => import('./littlesteps/pages/VaccineTrackingPage'));
const ComplementaryFoodPage = lazy(() => import('./littlesteps/pages/ComplementaryFoodPage'));
const GrowthChartsPage = lazy(() => import('./littlesteps/pages/GrowthChartsPage'));
const SleepTrainingPage = lazy(() => import('./littlesteps/pages/SleepTrainingPage'));
const DailyLogPage = lazy(() => import('./littlesteps/pages/DailyLogPage'));
const SleepAnalysisPage = lazy(() => import('./littlesteps/pages/SleepAnalysisPage'));
const LittleBloomPage = lazy(() => import('./littlebloom/pages/LittleBloomPage'));
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


  // Get daily logs for current child
  // currentChild 不一定是 currentChildId 指的那一個：共享的孩子被建立者刪掉
  // 之後 currentChildId 會被清成 null，而畫面已經退到名單裡的第一個孩子。
  // 這裡若用 id，日誌與日記就會去讀一個 null，家長看到的是「這孩子沒有紀錄」。
  const { logs: dailyLogs } = useDailyLogs(currentChild?.id ?? null, user);
  const { tasks: careTasks } = useCareTasks(currentChild);
  const { entries: diaryEntries } = useDiary(currentChild?.id ?? null, user);
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

  const navigateToPage = (page: Page) => {
    goTo(page);
    setCurrentPage(page);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Log page view
    logPageView(page);
  };



  const getPageTitle = () => {
    // LittleBloom and LittleExplorer carry their own wordmark.
    if (currentPage === 'littlebloom') {
      return 'LittleBloom';
    }
    if (currentPage.startsWith('littleexplorer')) {
      return 'LittleExplorer';
    }

    let title = 'LittleSteps';
    if (currentChild && currentPage !== 'littlesteps') {
      title = `${currentChild.name} 的 `;
    }

    switch (currentPage) {
      case 'littlesteps':
        break; // Use default 'LittleSteps'
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
      case 'littlesteps/daily-log':
        title += '快速日誌';
        break;
      case 'littlesteps/growth-charts':
        title += '成長曲線圖';
        break;
      case 'littlesteps/sleep-training':
        title += '睡眠訓練';
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
  const [loadStalled, setLoadStalled] = useState(false);
  useEffect(() => {
    if (!dataPending) {
      setLoadStalled(false);
      return;
    }
    // 已知離線就不必等：直接說實話。
    if (navigator.onLine === false) {
      setLoadStalled(true);
      return;
    }
    const timer = window.setTimeout(() => setLoadStalled(true), 10000);
    return () => window.clearTimeout(timer);
  }, [dataPending]);

  // Show loading state while auth or children data is loading.
  // A pulsing 64px baby icon was the old treatment; a thin progress bar says
  // the same thing without an illustration and without a layout jump.
  if (dataPending) {
    if (loadStalled) {
      return (
        <div className="min-h-dscreen bg-warm-white flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <EmptyState
              theme={SERVICE_THEME.littlesteps}
              title="連不上伺服器"
              description="目前似乎沒有網路連線。寶寶的資料存在雲端，連上網路後就會出現。"
              action={{ label: '重新載入', onClick: () => window.location.reload() }}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-dscreen flex items-center justify-center bg-warm-white">
        <div className="w-40 h-1 rounded-full bg-primary-light overflow-hidden" role="status">
          <div className="h-full w-1/3 rounded-full bg-primary-dark animate-[loading_1.2s_ease-in-out_infinite]" />
          <span className="sr-only">載入中</span>
        </div>
      </div>
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
      currentService={serviceForStage(stageOfChild(currentChild))}
      onSignIn={signInWithGoogle}
      onNavigate={navigateToPage}
    />
  );

  // 服務介紹頁自帶版面；服務集合首頁與「先新增寶寶」留在既有版面裡。
  if (landingKind && isStandaloneLanding(landingKind)) {
    return landing;
  }

  return (
    <div className="min-h-dscreen bg-warm-white">
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

      {/* Header */}
      {showHeader && (
        <AppBar
          theme={SERVICE_THEME.littlesteps}
          title={getPageTitle()}
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
              <button
                onClick={() => navigateToPage('littlesteps')}
                className="btn-icon bg-ink/5 hover:bg-ink/10"
                title="LittleSteps 首頁"
                aria-label="LittleSteps 首頁"
              >
                <Home className="w-5 h-5" />
              </button>
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
              <div
                className="w-40 h-1 rounded-full bg-primary-light overflow-hidden"
                role="status"
              >
                <div className="h-full w-1/3 rounded-full bg-primary-dark animate-[loading_1.2s_ease-in-out_infinite]" />
                <span className="sr-only">載入中</span>
              </div>
            </div>
          }
        >
        {/* 服務集合首頁與「先新增寶寶」都由 LandingPage 決定，這裡只負責放進版面 */}
        {landing}

        {/* LittleSteps Routes */}
        {currentPage === 'littlesteps' && !landingKind && (
          <DashboardPage
            currentChild={currentChild}
            dailyLogs={dailyLogs}
            user={user}
            onNavigate={navigateToPage}
          />
        )}
        {currentPage === 'littlesteps/dashboard' && (
          <DashboardPage
            currentChild={currentChild}
            dailyLogs={dailyLogs}
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
            />
          </PregnancyGate>
        )}
        {currentPage === 'littlesteps/care-guide' && (
          <CareGuidePage />
        )}
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
          <PregnancyGate currentChild={currentChild}>
            <ComplementaryFoodPage
              currentChild={currentChild}
              user={user}
            />
          </PregnancyGate>
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
            user={user}
          />
        )}
        {currentPage === 'littlesteps/report' && (
          <ReportPage
            currentChild={currentChild}
            dailyLogs={dailyLogs}
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
        {currentPage === 'littleouting' && <OutingPage />}
        {currentPage === 'babyoasis' && <BabyOasisPage />}
        {currentPage === 'littleguard' && <RadarPage />}
        </Suspense>
        </ErrorBoundary>
      </ContentLandmark>

      {/* Feedback Button */}
      <FeedbackButton user={user} />
    </div>
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
