import { useState, useEffect, useMemo } from 'react';
import { Menu, Home } from 'lucide-react';
import { MilestoneProgress, ChildProfile } from './types'; // Import ChildProfile
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

  // Manage multiple child profiles
  const [childProfiles, setChildProfiles] = useLocalStorage<ChildProfile[]>("child-profiles", []);
  const [currentChildId, setCurrentChildId] = useLocalStorage<string | null>("current-child-id", null);

  // Derive current child based on currentChildId
  const currentChild = useMemo(() => {
    return childProfiles.find(child => child.id === currentChildId);
  }, [childProfiles, currentChildId]);

  // Derive current child's milestone progress
  const currentChildMilestoneProgress: MilestoneProgress = useMemo(() => {
    return currentChild ? currentChild.milestoneProgress : {};
  }, [currentChild]);

  // If no current child is selected, or the selected child was deleted, set the first child as current
  useEffect(() => {
    if (childProfiles.length > 0 && !currentChild) {
      setCurrentChildId(childProfiles[0].id);
    } else if (childProfiles.length === 0 && currentChildId !== null) {
      setCurrentChildId(null);
    }
  }, [childProfiles, currentChild, currentChildId, setCurrentChildId]);


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
    if (!currentChild) return; // Cannot toggle if no child is selected

    setChildProfiles(prevProfiles => {
      return prevProfiles.map(profile => {
        if (profile.id === currentChild.id) {
          const isAchieved = !profile.milestoneProgress[id]?.achieved;
          const newProgressEntry = isAchieved
            ? { achieved: true, achievedDate: new Date().toISOString().split('T')[0] }
            : { achieved: false, achievedDate: undefined };

          return {
            ...profile,
            milestoneProgress: {
              ...profile.milestoneProgress,
              [id]: newProgressEntry,
            },
          };
        }
        return profile;
      });
    });
  };

  const getPageTitle = () => {
    let title = 'LittleSteps';
    if (currentChild && currentPage !== 'home') {
      title = `${currentChild.name} 的 `;
    }

    switch (currentPage) {
      case 'home':
        break; // Handled above
      case 'milestones':
        title += '里程碑追蹤';
        break;
      case 'care-guide':
        title += '照顧重點';
        break;
      case 'vaccine-tracking':
        title += '疫苗追蹤';
        break;
      case 'complementary-food':
        title += '副食品指南';
        break;
      default:
        break;
    }
    return title;
  };

  const showHeader = currentPage !== 'home';

  // Child Management Functions
  const addChild = (name: string, birthday: string) => {
    const newChild: ChildProfile = {
      id: Date.now().toString(), // Simple unique ID
      name,
      birthday,
      milestoneProgress: {},
      createdAt: new Date().toISOString(),
    };
    setChildProfiles(prev => [...prev, newChild]);
    setCurrentChildId(newChild.id); // Automatically select the new child
  };

  const updateChild = (id: string, name: string, birthday: string) => {
    setChildProfiles(prev =>
      prev.map(child => (child.id === id ? { ...child, name, birthday } : child))
    );
  };

  const deleteChild = (id: string) => {
    setChildProfiles(prev => prev.filter(child => child.id !== id));
    // If the deleted child was the current one, reset currentChildId
    if (currentChildId === id) {
      setCurrentChildId(childProfiles[0]?.id || null);
    }
  };

  const handleSetCurrentChild = (id: string) => {
    setCurrentChildId(id);
  };

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={navigateToPage}
        childProfiles={childProfiles}
        currentChildId={currentChildId}
        setCurrentChildId={handleSetCurrentChild}
        addChild={addChild}
        updateChild={updateChild}
        deleteChild={deleteChild}
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
            progress={currentChildMilestoneProgress}
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
