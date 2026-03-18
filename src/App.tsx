import { useState } from 'react';
import { Menu } from 'lucide-react';
import { MilestoneProgress } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import MilestonesPage from './pages/MilestonesPage';
import CareGuidePage from './pages/CareGuidePage';
import VaccineTrackingPage from './pages/VaccineTrackingPage';
import ComplementaryFoodPage from './pages/ComplementaryFoodPage';

type Page = 'milestones' | 'care-guide' | 'vaccine-tracking' | 'complementary-food';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('milestones');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progress, setProgress] = useLocalStorage<MilestoneProgress>("milestones-progress", {});

  const toggleMilestone = (id: string) => {
    setProgress(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getPageTitle = () => {
    switch (currentPage) {
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

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      {/* Header */}
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
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-6">
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
