import { useState, useEffect, useMemo } from 'react';
import { Menu, Home, Baby } from 'lucide-react';
import { MilestoneProgress, VaccineProgress, ChildProfile } from './types'; // Import types
import { useLocalStorage } from './hooks/useLocalStorage';
import { logPageView, logMilestoneToggle, logVaccineToggle, logChildProfileAction } from './lib/firebase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useFirebaseFamily } from './hooks/useFirebaseFamily';
import { useFirebaseChildren } from './hooks/useFirebaseChildren';
import { useDailyLogs } from './hooks/useDailyLogs';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import MilestonesPage from './pages/MilestonesPage';
import CareGuidePage from './pages/CareGuidePage';
import VaccineTrackingPage from './pages/VaccineTrackingPage';
import ComplementaryFoodPage from './pages/ComplementaryFoodPage';

type Page = 'home' | 'dashboard' | 'milestones' | 'care-guide' | 'vaccine-tracking' | 'complementary-food' | 'daily-log';

function AppContent() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  // Firebase hooks (for logged in users)
  const { familyId, familyData, loading: familyLoading } = useFirebaseFamily(user);
  const firebaseChildren = useFirebaseChildren(familyId);

  // Parse initial page from URL hash
  const getPageFromHash = (): Page => {
    const hash = window.location.hash;
    const pageMap: Record<string, Page> = {
      '#/': 'home',
      '#/dashboard': 'dashboard',
      '#/milestones': 'milestones',
      '#/care-guide': 'care-guide',
      '#/vaccine-tracking': 'vaccine-tracking',
      '#/complementary-food': 'complementary-food'
    };
    return pageMap[hash] || 'home';
  };

  const [currentPage, setCurrentPage] = useState<Page>(getPageFromHash());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Manage multiple child profiles (dual mode: Firebase vs LocalStorage)
  const [localChildProfiles, setLocalChildProfiles] = useLocalStorage<ChildProfile[]>("child-profiles", []);
  const [localCurrentChildId, setLocalCurrentChildId] = useLocalStorage<string | null>("current-child-id", null);

  // 根據登入狀態決定使用哪個資料源
  const childProfiles = user && familyData
    ? Object.values(familyData.children || {})
    : localChildProfiles;

  const currentChildId = user && familyData
    ? familyData.currentChildId
    : localCurrentChildId;

  // Derive current child based on currentChildId
  const currentChild = useMemo(() => {
    return childProfiles.find(child => child.id === currentChildId);
  }, [childProfiles, currentChildId]);

  // Get daily logs for current child
  const { logs: dailyLogs } = useDailyLogs(currentChildId, user, familyId);

  // Derive current child's milestone progress
  const currentChildMilestoneProgress: MilestoneProgress = useMemo(() => {
    return currentChild ? (currentChild.milestoneProgress || {}) : {};
  }, [currentChild]);

  // Derive current child's vaccine progress
  const currentChildVaccineProgress: VaccineProgress = useMemo(() => {
    return currentChild ? (currentChild.vaccineProgress || {}) : {};
  }, [currentChild]);

  // LocalStorage mode: Auto-select first child if none is selected
  useEffect(() => {
    if (!user) {
      if (localChildProfiles.length > 0 && !currentChild) {
        setLocalCurrentChildId(localChildProfiles[0].id);
      } else if (localChildProfiles.length === 0 && localCurrentChildId !== null) {
        setLocalCurrentChildId(null);
      }
    }
  }, [user, localChildProfiles, currentChild, localCurrentChildId]);

  // LocalStorage mode: Migrate existing profiles to include vaccineProgress if missing
  useEffect(() => {
    if (!user) {
      const needsMigration = localChildProfiles.some(profile => !profile.vaccineProgress);
      if (needsMigration) {
        setLocalChildProfiles(prevProfiles =>
          prevProfiles.map(profile => ({
            ...profile,
            vaccineProgress: profile.vaccineProgress || {}
          }))
        );
      }
    }
  }, [user, localChildProfiles]);

  // Auto-redirect to dashboard when user logs in or adds first baby
  useEffect(() => {
    if (user && childProfiles.length > 0 && currentPage === 'home') {
      navigateToPage('dashboard');
    }
  }, [user, childProfiles.length]);

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
      'dashboard': '#/dashboard',
      'milestones': '#/milestones',
      'care-guide': '#/care-guide',
      'vaccine-tracking': '#/vaccine-tracking',
      'complementary-food': '#/complementary-food',
      'daily-log': '#/daily-log'
    };
    window.location.hash = hashMap[page];
    setCurrentPage(page);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Log page view
    logPageView(page);
  };

  const toggleMilestone = async (id: string) => {
    if (!currentChild) return; // Cannot toggle if no child is selected

    const isAchieved = !currentChildMilestoneProgress[id]?.achieved;

    if (user) {
      // Firebase 模式
      try {
        await firebaseChildren.updateMilestoneProgress(currentChild.id, id, isAchieved);
        logMilestoneToggle(id, isAchieved);
      } catch (error: any) {
        console.error('更新里程碑失敗:', error);
      }
    } else {
      // LocalStorage 模式
      setLocalChildProfiles(prevProfiles => {
        return prevProfiles.map(profile => {
          if (profile.id === currentChild.id) {
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
      logMilestoneToggle(id, isAchieved);
    }
  };

  const toggleVaccineDose = async (vaccineId: string, doseNumber: number) => {
    if (!currentChild) return; // Cannot toggle if no child is selected

    const currentVaccine = currentChildVaccineProgress[vaccineId] || { doses: {} };
    const currentDose = currentVaccine.doses[doseNumber];
    const isAdministered = !currentDose?.administered;

    if (user) {
      // Firebase 模式
      try {
        await firebaseChildren.updateVaccineProgress(currentChild.id, vaccineId, doseNumber, isAdministered);
        logVaccineToggle(vaccineId, doseNumber, isAdministered);
      } catch (error: any) {
        console.error('更新疫苗記錄失敗:', error);
      }
    } else {
      // LocalStorage 模式
      setLocalChildProfiles(prevProfiles => {
        return prevProfiles.map(profile => {
          if (profile.id === currentChild.id) {
            const newDoseEntry = isAdministered
              ? { administered: true, administeredDate: new Date().toISOString().split('T')[0] }
              : { administered: false, administeredDate: undefined };

            return {
              ...profile,
              vaccineProgress: {
                ...currentChildVaccineProgress,
                [vaccineId]: {
                  doses: {
                    ...currentVaccine.doses,
                    [doseNumber]: newDoseEntry,
                  },
                },
              },
            };
          }
          return profile;
        });
      });
      logVaccineToggle(vaccineId, doseNumber, isAdministered);
    }
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

  // Show header for all pages except home (unless user is logged in with babies, then show Dashboard with header)
  const showHeader = currentPage !== 'home' || (user && childProfiles.length > 0);

  // Child Management Functions
  const addChild = async (name: string, birthday: string) => {
    // 檢查子女數量限制（免費版最多 2 個）
    if (childProfiles.length >= 2) {
      alert('免費版最多只能新增 2 個寶寶，請升級付費會員');
      return;
    }

    if (user) {
      // Firebase 模式
      try {
        await firebaseChildren.addChild(name, birthday, user.uid, childProfiles.length);
        logChildProfileAction('create');
      } catch (error: any) {
        console.error('新增寶寶失敗:', error);
        alert(error.message || '新增寶寶失敗，請稍後再試');
      }
    } else {
      // LocalStorage 模式
      const newChild: ChildProfile = {
        id: Date.now().toString(),
        name,
        birthday,
        milestoneProgress: {},
        vaccineProgress: {},
        createdAt: new Date().toISOString(),
      };
      setLocalChildProfiles(prev => [...prev, newChild]);
      setLocalCurrentChildId(newChild.id);
      logChildProfileAction('create');
    }
  };

  const updateChild = async (id: string, name: string, birthday: string) => {
    if (user) {
      // Firebase 模式
      try {
        await firebaseChildren.updateChild(id, name, birthday);
        logChildProfileAction('update');
      } catch (error: any) {
        console.error('更新寶寶資料失敗:', error);
        alert(error.message || '更新失敗，請稍後再試');
      }
    } else {
      // LocalStorage 模式
      setLocalChildProfiles(prev =>
        prev.map(child => (child.id === id ? { ...child, name, birthday } : child))
      );
      logChildProfileAction('update');
    }
  };

  const deleteChild = async (id: string) => {
    if (user) {
      // Firebase 模式
      try {
        await firebaseChildren.deleteChild(id);
        logChildProfileAction('delete');
      } catch (error: any) {
        console.error('刪除寶寶失敗:', error);
        alert(error.message || '刪除失敗，請稍後再試');
      }
    } else {
      // LocalStorage 模式
      setLocalChildProfiles(prev => prev.filter(child => child.id !== id));
      if (localCurrentChildId === id) {
        setLocalCurrentChildId(localChildProfiles[0]?.id || null);
      }
      logChildProfileAction('delete');
    }
  };

  const handleSetCurrentChild = async (id: string) => {
    if (user) {
      // Firebase 模式
      try {
        await firebaseChildren.setCurrentChild(id);
        logChildProfileAction('switch');
      } catch (error: any) {
        console.error('切換寶寶失敗:', error);
      }
    } else {
      // LocalStorage 模式
      setLocalCurrentChildId(id);
      logChildProfileAction('switch');
    }
  };

  // Show loading state while auth or family data is loading
  if (loading || (user && familyLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <div className="text-center">
          <Baby className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

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
        user={user}
        onSignIn={signInWithGoogle}
        onSignOut={signOut}
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
          <>
            {user && childProfiles.length > 0 ? (
              <DashboardPage
                currentChild={currentChild}
                dailyLogs={dailyLogs}
                onNavigate={navigateToPage}
              />
            ) : (
              <LandingPage
                onNavigate={navigateToPage}
                user={user}
                onSignIn={signInWithGoogle}
              />
            )}
          </>
        )}
        {currentPage === 'dashboard' && (
          <DashboardPage
            currentChild={currentChild}
            dailyLogs={dailyLogs}
            onNavigate={navigateToPage}
          />
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
          <VaccineTrackingPage
            vaccineProgress={currentChildVaccineProgress}
            onToggleVaccineDose={toggleVaccineDose}
          />
        )}
        {currentPage === 'complementary-food' && (
          <ComplementaryFoodPage />
        )}
      </main>
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
