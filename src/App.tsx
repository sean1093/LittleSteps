import { useState, useEffect } from 'react';
import { Menu, Home } from 'lucide-react';
import { MilestoneProgress } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import MilestonesPage from './pages/MilestonesPage';
import CareGuidePage from './pages/CareGuidePage';
import VaccineTrackingPage from './pages/VaccineTrackingPage';
import ComplementaryFoodPage from './pages/ComplementaryFoodPage';

type Page = 'home' | 'milestones' | 'care-guide' | 'vaccine-tracking' | 'complementary-food';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progress, setProgress] = useLocalStorage<MilestoneProgress>("milestones-progress", {});

  // Handle URL hash routing
  useEffect(() => {
    const getPageFromHash = (): Page => {
      const hash = window.location.hash.slice(1); // Remove the '#'
      switch (hash) {
        case '/milestones':
          return 'milestones';
        case '/care-guide':
          return 'care-guide';
        case '/vaccine-tracking':
          return 'vaccine-tracking';
        case '/complementary-food':
          return 'complementary-food';
        default:
          return 'home';
      }
    };

    // Set initial page from URL
    setCurrentPage(getPageFromHash());

    // Listen for hash changes
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update URL when page changes
  const navigateToPage = (page: Page) => {
    const hashMap: Record<Page, string> = {
      'home': '#/',
      'milestones': '#/milestones',
      'care-guide': '#/care-guide',
      'vaccine-tracking': '#/vaccine-tracking',
      'complementary-food': '#/complementary-food'
    };
    window.location.hash = hashMap[page];
    setCurrentPage(page);
  };

  const toggleMilestone = (id: string) => {
    setProgress(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'home':
        return 'LittleSteps';
      case 'milestones':
        return '里程碑追蹤';
      case 'care-guide':
        return '照顧重點';
      case 'vaccine-tracking':
        return '疫苗追蹤';
      case 'complementary-food':
        return '副食品指南';
      default:
        return 'LittleSteps';
    }
  };

  const showHeader = currentPage !== 'home';

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={navigateToPage}
      />

      {/* Header */}
      {showHeader && (
        <header className="bg-white shadow-soft sticky top-0 z-10">
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
              onClick={() => navigateToPage('home')}
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
        {currentPage === 'home' && (
          <LandingPage onNavigate={navigateToPage} />
        )}
        {currentPage === 'milestones' && (
          <MilestonesPage
            progress={progress}
            onToggleMilestone={toggleMilestone}
          />
        )}
        {currentPage === 'care-guide' && (
          <CareGuidePage />
        )}
        {currentPage === 'vaccine-tracking' && (
          <VaccineTrackingPage />
        )}
        {currentPage === 'complementary-food' && (
          <ComplementaryFoodPage />
        )}
      </main>
    </div>
  );
}

export default App;
