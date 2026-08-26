import { useState, useEffect, Suspense, lazy } from 'react';
import { Menu, Home, Baby } from 'lucide-react';
import { Page, LittleStepsPage } from './types/routes'; // Import route types
import { logPageView } from './lib/firebase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useDailyLogs } from './littlesteps/hooks/useDailyLogs';
import { useChildStore } from './common/hooks/useChildStore';
import Sidebar from './common/components/Sidebar';
import MainLandingPage from './common/pages/MainLandingPage';
import LandingPage from './common/pages/LandingPage';
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
const BabyOasisPage = lazy(() => import('./babyoasis/pages/BabyOasisPage'));
const BabyWikiPage = lazy(() => import('./littlesteps/pages/BabyWikiPage'));
const ClinicSummaryPage = lazy(() => import('./littlesteps/pages/ClinicSummaryPage'));
const ReportPage = lazy(() => import('./littlesteps/pages/ReportPage'));
import FeedbackButton from './common/components/FeedbackButton';

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
    setCurrentChild: handleSetCurrentChild,
  } = useChildStore(user);

  // Parse initial page from URL hash
  const getPageFromHash = (): Page => {
    const hash = window.location.hash;
    const pageMap: Record<string, Page> = {
      '#/': 'home',
      '#/littlesteps': 'littlesteps',
      '#/littlesteps/dashboard': 'littlesteps/dashboard',
      '#/littlesteps/milestones': 'littlesteps/milestones',
      '#/littlesteps/care-guide': 'littlesteps/care-guide',
      '#/littlesteps/vaccine-tracking': 'littlesteps/vaccine-tracking',
      '#/littlesteps/complementary-food': 'littlesteps/complementary-food',
      '#/littlesteps/daily-log': 'littlesteps/daily-log',
      '#/littlesteps/growth-charts': 'littlesteps/growth-charts',
      '#/littlesteps/sleep-training': 'littlesteps/sleep-training',
      '#/littlesteps/sleep-analysis': 'littlesteps/sleep-analysis',
      '#/littlesteps/baby-wiki': 'littlesteps/baby-wiki',
      '#/littlesteps/clinic-summary': 'littlesteps/clinic-summary',
      '#/littlesteps/report': 'littlesteps/report',
      '#/littlebloom': 'littlebloom',
      '#/littlebloom/wiki': 'littlebloom/wiki',
      '#/babyoasis': 'babyoasis'
    };
    return pageMap[hash] || 'home';
  };

  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash());
  const [sidebarOpen, setSidebarOpen] = useState(false);


  // Get daily logs for current child
  const { logs: dailyLogs } = useDailyLogs(currentChildId, user);


  // Auto-redirect to dashboard when user logs in or adds first baby
  useEffect(() => {
    if (user && childProfiles.length > 0 && currentPage === 'littlesteps') {
      navigateToPage('littlesteps/dashboard');
    }
  }, [user, childProfiles.length]);

  // Redirect to littlesteps home if accessing protected pages without login
  useEffect(() => {
    const protectedPages: Page[] = ['littlesteps/dashboard', 'littlesteps/daily-log', 'littlesteps/growth-charts', 'littlesteps/clinic-summary', 'littlesteps/report'];
    if (!user && protectedPages.includes(currentPage)) {
      navigateToPage('littlesteps');
    }
  }, [user, currentPage]);

  // Handle hash changes (browser back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const newPage = getPageFromHash();
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);


  // Update URL when page changes
  const navigateToPage = (page: Page) => {
    const hashMap: Record<Page, string> = {
      'home': '#/',
      'littlesteps': '#/littlesteps',
      'littlesteps/dashboard': '#/littlesteps/dashboard',
      'littlesteps/milestones': '#/littlesteps/milestones',
      'littlesteps/care-guide': '#/littlesteps/care-guide',
      'littlesteps/vaccine-tracking': '#/littlesteps/vaccine-tracking',
      'littlesteps/complementary-food': '#/littlesteps/complementary-food',
      'littlesteps/daily-log': '#/littlesteps/daily-log',
      'littlesteps/growth-charts': '#/littlesteps/growth-charts',
      'littlesteps/sleep-training': '#/littlesteps/sleep-training',
      'littlesteps/sleep-analysis': '#/littlesteps/sleep-analysis',
      'littlesteps/baby-wiki': '#/littlesteps/baby-wiki',
      'littlesteps/clinic-summary': '#/littlesteps/clinic-summary',
      'littlesteps/report': '#/littlesteps/report',
      'littlebloom': '#/littlebloom',
      'littlebloom/wiki': '#/littlebloom/wiki',
      'babyoasis': '#/babyoasis'
    };
    window.location.hash = hashMap[page];
    setCurrentPage(page);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Log page view
    logPageView(page);
  };


  const getPageTitle = () => {
    // LittleBloom has its own title
    if (currentPage === 'littlebloom') {
      return 'LittleBloom';
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
  const isStandaloneSubApp = currentPage.startsWith('littlebloom') || currentPage === 'babyoasis';
  // Login is mandatory, so every LittleSteps route shows the header (and thus the
  // sidebar/menu) once we reach the authenticated tree below.
  const showHeader = !(currentPage === 'home' || isStandaloneSubApp);


  // Show loading state while auth or children data is loading
  if (loading || (user && childrenLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <div className="text-center">
          <Baby className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  // Login is required for the entire app — unauthenticated users only ever see
  // the landing/login screen.
  if (!user) {
    return <LandingPage onNavigate={navigateToPage} user={user} onSignIn={signInWithGoogle} />;
  }

  return (
    <div className="min-h-screen bg-warm-white">
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
          onSignOut={signOut}
        />
      )}

      {/* Header */}
      {showHeader && (
        <header className="bg-white shadow-soft sticky top-0 z-30">
          <div className="px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-primary flex-1">
              {getPageTitle()}
            </h1>
            <button
              onClick={() => navigateToPage('littlesteps')}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
              title="返回首頁"
            >
              <Home className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={showHeader ? "pb-6" : ""}>
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
              <Baby className="w-12 h-12 text-primary animate-pulse" />
            </div>
          }
        >
        {/* Main Landing Page */}
        {currentPage === 'home' && (
          <MainLandingPage onNavigate={navigateToPage} />
        )}

        {/* LittleSteps Routes */}
        {currentPage === 'littlesteps' && (
          childProfiles.length > 0 ? (
            <DashboardPage
              currentChild={currentChild}
              dailyLogs={dailyLogs}
              user={user}
              onNavigate={navigateToPage}
            />
          ) : (
            <div className="max-w-md mx-auto px-4 py-16 text-center">
              <Baby className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">開始記錄寶寶的成長</h2>
              <p className="text-gray-600 mb-6">先新增一個寶寶，即可開始追蹤里程碑、疫苗與日常照顧。</p>
              <button
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-soft hover:shadow-soft-lg transition-all"
              >
                <Baby className="w-5 h-5" />
                新增寶寶
              </button>
            </div>
          )
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
            user={user}
            onSignIn={signInWithGoogle}
          />
        )}
        {currentPage === 'littlesteps/care-guide' && (
          <CareGuidePage />
        )}
        {currentPage === 'littlesteps/vaccine-tracking' && (
          <VaccineTrackingPage
            vaccineProgress={currentChildVaccineProgress}
            onToggleVaccineDose={toggleVaccineDose}
            user={user}
            onSignIn={signInWithGoogle}
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
            user={user}
          />
        )}
        {currentPage === 'littlebloom/wiki' && <LittleBloomWikiPage />}

        {/* BabyOasis Route */}
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
