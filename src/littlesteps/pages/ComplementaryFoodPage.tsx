import { lazy, Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Hand, TestTube } from 'lucide-react';
import type { User } from 'firebase/auth';
import { allergyTestingMethod, fingerFoodPrinciples } from '../data/complementaryFood';
import type { ChildProfile } from '../../types';
import { isPregnancyProfile } from '../../common/pregnancy';
import QuietBoundary from '../../common/components/QuietBoundary';
import LoadingBar from '../../common/ui/LoadingBar';
import FoodSheet from '../components/food/FoodSheet';
import FoodHomeView from '../components/food/FoodHomeView';
import FoodGuideOverview from '../components/food/FoodGuideOverview';
import FoodGuideStages from '../components/food/FoodGuideStages';
import FoodGuideMenu from '../components/food/FoodGuideMenu';
import FoodGuideSafety from '../components/food/FoodGuideSafety';
import FoodTrackingPrompt, {
  type FoodTrackingBlocker,
} from '../components/food/FoodTrackingPrompt';
import type { TrackingTab, ViewMode } from '../components/food/types';
import { fadeInUp } from '../../common/ui/motion';

/*
  這一頁是公開頁，資料庫 SDK 不能出現在它的靜態匯入路徑上（見 CLAUDE.md
  與 BUNDLE-01/02）。讀寫食物紀錄的一切都在這個 lazy chunk 裡。
*/
const FoodTrackingSection = lazy(() => import('../components/food/FoodTrackingSection'));

interface ComplementaryFoodPageProps {
  currentChild?: ChildProfile | null;
  user: User | null;
  /** 沒登入的人按下提示卡上的按鈕時呼叫。 */
  onSignIn?: () => Promise<void> | void;
}

/**
 * 副食品指南。
 *
 * 指南的部分誰都能讀；「我家寶寶試過什麼」要登入，而且要有一個已經出生的
 * 寶寶。這一頁自己只管現在是哪一個檢視，以及追蹤區該掛、還是該換成一張說明
 * 差哪一步的提示卡。食物紀錄的讀寫在 FoodTrackingSection。
 */
export default function ComplementaryFoodPage({
  currentChild,
  user,
  onSignIn,
}: ComplementaryFoodPageProps) {
  const [requestedView, setViewMode] = useState<ViewMode>('home');
  const [trackingTab, setTrackingTab] = useState<TrackingTab>('foods');
  const [showAllergyTest, setShowAllergyTest] = useState(false);
  const [showFingerFood, setShowFingerFood] = useState(false);
  const [expandedStage, setExpandedStage] = useState<number | null>(null);

  /*
    孕期檔案不掛追蹤區：這裡的寫入不看檔案型別，寫進去的食物紀錄會一路留到
    寶寶出生之後（PregnancyGate 擋的是同一件事，只是它會把整頁指南一起擋掉）。
  */
  const tracked = user && currentChild && !isPregnancyProfile(currentChild)
    ? { user, child: currentChild }
    : null;
  const blocker: FoodTrackingBlocker = !user
    ? 'signed-out'
    : !currentChild
      ? 'no-child'
      : 'not-born';

  // 人在追蹤檢視時登出或換成孕期檔案，那個檢視就不存在了，回主頁。
  const viewMode = !tracked && requestedView === 'my-tracking' ? 'home' : requestedView;

  const openTracking = (tab: TrackingTab) => {
    setTrackingTab(tab);
    setViewMode('my-tracking');
  };

  return (
    <div className="screen">
      <div className="screen-body">
        <p className="text-sm text-ink-muted mb-4">
          4-12個月寶寶的副食品添加完整攻略
        </p>

        <div className="grid grid-cols-2 gap-2 mb-6">
          <button onClick={() => setShowAllergyTest(true)} className="btn-secondary w-full text-sm">
            <TestTube className="w-4 h-4" />
            <span>怎麼試新食材</span>
          </button>
          <button onClick={() => setShowFingerFood(true)} className="btn-secondary w-full text-sm">
            <Hand className="w-4 h-4" />
            <span>手指食物指南</span>
          </button>
        </div>

        {viewMode !== 'home' && (
          <button onClick={() => setViewMode('home')} className="btn-ghost -ml-4 mb-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">返回主頁</span>
          </button>
        )}

        {/*
          追蹤區掛在換檢視的動畫外面，整頁只掛一次：讀指南時它什麼都不畫，
          但監聽還在。chunk 載不到時只是少了追蹤區，指南照常能讀。
        */}
        {tracked && (
          <QuietBoundary scope="food tracking">
            <Suspense
              fallback={
                viewMode === 'home' || viewMode === 'my-tracking' ? (
                  <div className="panel mb-6 flex justify-center">
                    <LoadingBar />
                  </div>
                ) : null
              }
            >
              <FoodTrackingSection
                currentChild={tracked.child}
                user={tracked.user}
                viewMode={viewMode}
                trackingTab={trackingTab}
                onTabChange={setTrackingTab}
                onOpenTracking={openTracking}
              />
            </Suspense>
          </QuietBoundary>
        )}

        {/* viewMode 是這一頁的主要導航（六個檢視），原本硬切換，
            其他小 modal 卻都有動畫。 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
          >
            {viewMode === 'home' && (
              <FoodHomeView
                prompt={
                  tracked ? undefined : <FoodTrackingPrompt blocker={blocker} onSignIn={onSignIn} />
                }
                onOpenGuide={setViewMode}
              />
            )}

            {viewMode === 'guide-overview' && <FoodGuideOverview />}

            {viewMode === 'guide-stages' && (
              <FoodGuideStages expandedStage={expandedStage} onToggleStage={setExpandedStage} />
            )}

            {viewMode === 'guide-menu' && <FoodGuideMenu />}

            {viewMode === 'guide-safety' && <FoodGuideSafety />}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAllergyTest && (
          <FoodSheet title={allergyTestingMethod.name} onClose={() => setShowAllergyTest(false)}>
            <div className="bg-secondary-soft rounded-2xl p-4">
              <p className="text-sm text-ink">{allergyTestingMethod.description}</p>
            </div>

            {allergyTestingMethod.steps.map((step) => (
              <div key={step.step} className="card">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-light flex items-center justify-center flex-shrink-0 font-bold text-secondary-dark">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1">{step.title}</h3>
                    <p className="text-sm text-ink-muted">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-butter-light rounded-2xl p-4">
              <p className="text-sm text-butter-dark font-medium">{allergyTestingMethod.principle}</p>
            </div>
          </FoodSheet>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFingerFood && (
          <FoodSheet title={fingerFoodPrinciples.title} onClose={() => setShowFingerFood(false)}>
            <div className="bg-butter-light rounded-2xl p-4">
              <p className="text-sm text-butter-dark font-medium">
                適用年齡：{fingerFoodPrinciples.ageRange}
              </p>
            </div>

            {fingerFoodPrinciples.principles.map((principle, idx) => (
              <div key={idx} className="card">
                <h3 className="mb-1">{principle.name}</h3>
                <p className="text-sm text-ink-muted">{principle.description}</p>
              </div>
            ))}
          </FoodSheet>
        )}
      </AnimatePresence>
    </div>
  );
}
