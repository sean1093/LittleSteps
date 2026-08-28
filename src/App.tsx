import { useState, useEffect, Suspense, lazy } from 'react';
import { Menu, Home } from 'lucide-react';
import { pageFromPath, type Page, type LittleStepsPage } from './types/routes';
import { goTo, subscribeToNavigation } from './common/navigate';
import { useDocumentMeta } from './common/seo/useDocumentMeta';
import { logPageView } from './lib/firebase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useDailyLogs } from './littlesteps/hooks/useDailyLogs';
import { useChildStore } from './common/hooks/useChildStore';
import { useCareTasks } from './littleexplorer/hooks/useCareTasks';
import { useDiary } from './littleexplorer/hooks/useDiary';
import Sidebar from './common/components/Sidebar';
import AppHomeButton from './common/components/AppHomeButton';
import AppBar from './common/ui/AppBar';
import { SERVICE_THEME } from './common/ui/serviceTheme';
import LandingPage, { landingKindFor, isStandaloneLanding } from './common/landing/LandingPage';
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
const BabyWikiPage = lazy(() => import('./littlesteps/pages/BabyWikiPage'));
const ClinicSummaryPage = lazy(() => import('./littlesteps/pages/ClinicSummaryPage'));
const ReportPage = lazy(() => import('./littlesteps/pages/ReportPage'));
const DevelopmentPage = lazy(() => import('./littleexplorer/pages/DevelopmentPage'));
const RemindersPage = lazy(() => import('./littleexplorer/pages/RemindersPage'));
const DiaryPage = lazy(() => import('./littleexplorer/pages/DiaryPage'));
const ToddlerWikiPage = lazy(() => import('./littleexplorer/pages/ToddlerWikiPage'));
import FeedbackButton from './common/components/FeedbackButton';
import { toLocalDateKey } from './common/utils/dateHelpers';

function AppContent() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  const {
    childProfiles,
    currentChildId,
    currentChild,
    currentChildMilestoneProgress,
    currentChildVaccineProgress,
    childrenLoading,
    toggleMilestone,
    toggleVaccineDose,
    addChild,
    joinChild,
    updateChild,
    deleteChild,
    currentChildDevelopmentProgress,
    currentChildToothProgress,
    toggleDevelopmentCheck,
    toggleTooth,
    currentChildPrenatalProgress,
    upsertPrenatalRecord,
    clearPrenatalRecord,
    recordBirth,
    upsertCareTaskRecord,
    addDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
    setCurrentChild: handleSetCurrentChild,
  } = useChildStore(user);

  const [currentPage, setCurrentPage] = useState<Page>(() => pageFromPath(window.location.pathname));

  const [sidebarOpen, setSidebarOpen] = useState(false);


  // Get daily logs for current child
  const { logs: dailyLogs } = useDailyLogs(currentChildId, user);
  const { tasks: careTasks } = useCareTasks(currentChild);
  const { entries: diaryEntries } = useDiary(currentChildId, user);
  const reminderBadge = careTasks.filter(
    (task) => task.status === 'overdue' || task.status === 'due',
  ).length;


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

  // 登出後網址會留在原本的路由上。若那是需要登入的 LittleSteps 頁，畫面會
  // 換成 LittleSteps 的介紹頁——使用者看起來像是「登出後被丟回 LittleSteps」，
  // 而不是回到五個服務的入口。所以登出一併把路由帶回服務集合首頁。
  const handleSignOut = async () => {
    await signOut();
    navigateToPage('home');
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

  // LittleBloom (hub + wiki) and BabyOasis are standalone sub-apps that render
  // their own chrome, so the LittleSteps header/sidebar stays hidden for them.
  const isStandaloneSubApp =
    currentPage.startsWith('littlebloom') ||
    currentPage.startsWith('littleexplorer') ||
    currentPage === 'littleouting' ||
    currentPage === 'babyoasis';
  // Login is mandatory, so every LittleSteps route shows the header (and thus the
  // sidebar/menu) once we reach the authenticated tree below.
  const showHeader = !(currentPage === 'home' || isStandaloneSubApp);


  // Show loading state while auth or children data is loading.
  // A pulsing 64px baby icon was the old treatment; a thin progress bar says
  // the same thing without an illustration and without a layout jump.
  if (loading || (user && childrenLoading)) {
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
      onSignIn={signInWithGoogle}
      onNavigate={navigateToPage}
      onAddChild={() => setSidebarOpen(true)}
    />
  );

  // 服務介紹頁自帶版面；服務集合首頁與「先新增寶寶」留在既有版面裡。
  if (landingKind && isStandaloneLanding(landingKind)) {
    return landing;
  }

  return (
    <div className="min-h-dscreen bg-warm-white">
      {/* Sidebar - Only show for LittleSteps routes */}
      {!isStandaloneSubApp && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPage={currentPage as LittleStepsPage}
          onNavigate={navigateToPage}
          childProfiles={childProfiles}
          currentChildId={currentChildId}
          setCurrentChildId={handleSetCurrentChild}
          addChild={addChild}
          joinChild={joinChild}
          updateChild={updateChild}
          deleteChild={deleteChild}
          user={user}
          onSignIn={signInWithGoogle}
          onSignOut={handleSignOut}
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
              <AppHomeButton />
            </>
          }
        />
      )}

      {/* Main Content */}
      <main className={showHeader ? "pb-6" : ""}>
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
          <MilestonesPage
            progress={currentChildMilestoneProgress}
            onToggleMilestone={toggleMilestone}
          />
        )}
        {currentPage === 'littlesteps/care-guide' && (
          <CareGuidePage />
        )}
        {currentPage === 'littlesteps/vaccine-tracking' && (
          <VaccineTrackingPage
            vaccineProgress={currentChildVaccineProgress}
            onToggleVaccineDose={toggleVaccineDose}
          />
        )}
        {currentPage === 'littlesteps/complementary-food' && (
          <ComplementaryFoodPage
            currentChild={currentChild}
            user={user}
          />
        )}
        {currentPage === 'littlesteps/daily-log' && (
          <DailyLogPage currentChild={currentChild} user={user} />
        )}
        {currentPage === 'littlesteps/growth-charts' && (
          <GrowthChartsPage
            currentChild={currentChild}
            user={user}
          />
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
            currentChild={currentChild}
            progress={currentChildPrenatalProgress}
            onRecordBirth={recordBirth}
            // 孕期檔案就是「還沒出生的孩子」，所以走同一個 addChild；帶了
            // 預產期，資料層就會標成孕期檔案。共用資料層，不共用畫面。
            onAddPregnancy={(name, dueDate) => addChild(name, dueDate, undefined, dueDate)}
          />
        )}
        {currentPage === 'littlebloom/prenatal' && (
          <PrenatalPage
            currentChild={currentChild}
            progress={currentChildPrenatalProgress}
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
            onAddChild={(name, birthday, gender) => addChild(name, birthday, gender)}
            onJoinChild={joinChild}
          />
        )}
        {currentPage === 'littleexplorer/reminders' && (
          <RemindersPage
            currentChild={currentChild}
            tasks={careTasks}
            reminderBadge={reminderBadge}
            onCompleteTask={upsertCareTaskRecord}
            onAddChild={(name, birthday, gender) => addChild(name, birthday, gender)}
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
            onAddChild={(name, birthday, gender) => addChild(name, birthday, gender)}
            onJoinChild={joinChild}
          />
        )}
        {currentPage === 'littleexplorer/wiki' && (
          <ToddlerWikiPage currentChild={currentChild} reminderBadge={reminderBadge} />
        )}

        {/* BabyOasis Route */}
        {currentPage === 'littleouting' && <OutingPage />}
        {currentPage === 'babyoasis' && <BabyOasisPage />}
        </Suspense>
      </main>

      {/* Feedback Button */}
      <FeedbackButton user={user} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
