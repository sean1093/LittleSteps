import { motion, AnimatePresence } from 'framer-motion';
import { X, Baby, AlertCircle, Home, Syringe, UtensilsCrossed, TrendingUp, Moon, BarChart3, ClipboardList, BookOpen, Stethoscope, FileBarChart } from 'lucide-react';
import { User } from 'firebase/auth';
import { LittleStepsPage } from '../../types/routes'; // Import route types
import { requiresAuth } from '../routePolicy';
import { backdrop, listItem, stagger } from '../ui/motion';
import { useDialogA11y } from '../ui/useDialogA11y';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: LittleStepsPage;
  onNavigate: (page: LittleStepsPage) => void;
  user: User | null;
}

/** 抽屜裡每一組的標題共用同一個 eyebrow 樣式，才不會五組標題五種大小。 */
const GROUP_LABEL = 'text-xs font-semibold text-ink-faint tracking-wider mb-3 px-2';

// Menu structure organized by functional domains.
// 「這一頁要不要登入」不在這裡宣告：routePolicy 的白名單是唯一出處。抄一份
// 旗標在選單上的下場，就是里程碑、疫苗、副食品三列對未登入的人是亮的，點下去
// 卻被彈回介紹頁。
const MENU_SECTIONS = [
  {
    title: '數據中心',
    items: [
      {
        id: 'littlesteps/dashboard' as const,
        // 頁首與儀表板自己都叫這一頁「成長總覽」，選單跟著叫同一個名字。
        label: '成長總覽',
        icon: Home,
        description: '寶寶成長總覽'
      },
      {
        id: 'littlesteps/daily-log' as const,
        label: '快速日誌',
        icon: ClipboardList,
        description: '記錄日常照顧'
      },
      {
        id: 'littlesteps/growth-charts' as const,
        label: '成長曲線圖',
        icon: TrendingUp,
        description: '追蹤身高體重發展'
      },
      {
        id: 'littlesteps/report' as const,
        label: '週報月報',
        icon: FileBarChart,
        description: '數據趨勢與報告'
      },
      {
        id: 'littlesteps/clinic-summary' as const,
        label: '看診摘要',
        icon: Stethoscope,
        description: '一鍵產生看診資料'
      }
    ]
  },
  {
    title: '發展追蹤',
    items: [
      {
        id: 'littlesteps/milestones' as const,
        label: '里程碑追蹤',
        icon: Baby,
        description: '記錄寶寶發展進度'
      },
      {
        id: 'littlesteps/vaccine-tracking' as const,
        label: '疫苗追蹤',
        icon: Syringe,
        description: '疫苗接種時程與副作用'
      }
    ]
  },
  {
    title: '飲食與睡眠',
    items: [
      {
        id: 'littlesteps/complementary-food' as const,
        label: '副食品指南',
        icon: UtensilsCrossed,
        description: '副食品添加完整攻略'
      },
      {
        id: 'littlesteps/sleep-training' as const,
        label: '睡眠指南',
        icon: Moon,
        description: '睡眠需求與訓練技巧'
      },
      {
        id: 'littlesteps/sleep-analysis' as const,
        label: '睡眠分析',
        icon: BarChart3,
        description: '分析寶寶睡眠模式'
      }
    ]
  },
  {
    title: '照顧指南',
    items: [
      {
        id: 'littlesteps/care-guide' as const,
        label: '照顧重點',
        icon: AlertCircle,
        description: '各階段注意事項'
      },
      {
        id: 'littlesteps/baby-wiki' as const,
        label: '寶寶百科',
        icon: BookOpen,
        description: '常見狀況與處理方式'
      }
    ]
  },
  // 不用登入的試算。未登入的訪客在這個選單裡只看得到公開頁，這兩項讓他們
  // 從百科或照顧重點走得到工具；登入的家長有自己的追蹤頁，但偶爾也會想替
  // 朋友的孩子算一下。
  {
    title: '試算工具',
    items: [
      {
        id: 'littlesteps/vaccine-schedule' as const,
        label: '疫苗時程試算',
        icon: Syringe,
        description: '填生日算出每一劑日期'
      },
      {
        id: 'littlesteps/growth-percentile' as const,
        label: '生長百分位試算',
        icon: TrendingUp,
        description: '身高體重頭圍對照 WHO 標準'
      }
    ]
  }
];

export default function Sidebar({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  user,
}: SidebarProps) {
  const drawerRef = useDialogA11y(isOpen, onClose);

  // Filter menu sections based on auth status
  const filteredSections = MENU_SECTIONS.map(section => ({
    ...section,
    items: section.items.filter(item => user || !requiresAuth(item.id))
  })).filter(section => section.items.length > 0);

  const handleNavigate = (page: LittleStepsPage) => {
    onNavigate(page);
    onClose();
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            {...backdrop}
            onClick={onClose}
            className="fixed inset-0 bg-ink/40 z-40"
          />

          {/* Sidebar — 固定 320px 在 320px 的手機上會貼滿兩側，留一點底層可見 */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="寶寶成長選單"
            tabIndex={-1}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[min(20rem,85vw)] bg-white z-50 shadow-soft-lg overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-secondary-light px-5 py-4 z-10">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-ink truncate">寶寶成長</h2>
                  <p className="text-xs text-ink-muted">育兒里程碑追蹤</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="關閉選單"
                  className="btn-icon -mr-1.5 text-ink"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 帳號與寶寶切換不在這裡了。它們是全站脈絡，但這個抽屜只在
                LittleSteps 的路由下渲染，等於另外四個服務都登不出、也換不了
                孩子。現在由每個 AppBar 上的 AccountButton 提供，這裡只留
                LittleSteps 自己的頁面導覽。 */}

            {/* Menu Items - Grouped by Function */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="p-4 pb-6 space-y-6"
            >
              {filteredSections.map((section) => (
                <motion.div key={section.title} variants={stagger}>
                  <h3 className={GROUP_LABEL}>{section.title}</h3>

                  {/* 12 個項目的清單，圖示是真的在幫忙掃視，故保留。 */}
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.id;

                      return (
                        <motion.button
                          key={item.id}
                          type="button"
                          variants={listItem}
                          onClick={() => handleNavigate(item.id)}
                          aria-current={isActive ? 'page' : undefined}
                          className={`w-full p-3 rounded-2xl border-l-4 transition-colors text-left ${
                            isActive
                              ? 'bg-secondary-light border-secondary-dark'
                              : 'border-transparent hover:bg-ink/5'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Icon
                              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isActive ? 'text-secondary-dark' : 'text-ink-muted'}`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className={`font-semibold ${isActive ? 'text-secondary-dark' : 'text-ink'}`}>
                                {item.label}
                              </div>
                              <div className="text-sm text-ink-muted">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* 這裡原本有一塊 sticky 的版權頁尾，在 12 列的選單上永遠蓋住底部
                約 70px。那一行入口頁已經有了，抽屜的高度留給選單。 */}
          </motion.div>

        </>
      )}
    </AnimatePresence>
  );
}
