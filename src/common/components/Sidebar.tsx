import { motion, AnimatePresence } from 'framer-motion';
import { X, Baby, AlertCircle, Home, Syringe, UtensilsCrossed, TrendingUp, Moon, BarChart3, ClipboardList, BookOpen, Stethoscope, FileBarChart } from 'lucide-react';
import { User } from 'firebase/auth';
import { LittleStepsPage } from '../../types/routes'; // Import route types
import { backdrop, listItem, stagger } from '../ui/motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: LittleStepsPage;
  onNavigate: (page: LittleStepsPage) => void;
  user: User | null;
}

/** 抽屜裡每一組的標題共用同一個 eyebrow 樣式，才不會五組標題五種大小。 */
const GROUP_LABEL = 'text-xs font-semibold text-ink-faint tracking-wider mb-3 px-2';

export default function Sidebar({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  user,
}: SidebarProps) {
  // Menu structure organized by functional domains
  const menuSections = [
    {
      title: '數據中心',
      items: [
        {
          id: 'littlesteps/dashboard' as const,
          label: '儀表板',
          icon: Home,
          description: '寶寶成長總覽',
          requiresAuth: true
        },
        {
          id: 'littlesteps/daily-log' as const,
          label: '快速日誌',
          icon: ClipboardList,
          description: '記錄日常照顧',
          requiresAuth: true
        },
        {
          id: 'littlesteps/growth-charts' as const,
          label: '成長曲線圖',
          icon: TrendingUp,
          description: '追蹤身高體重發展',
          requiresAuth: true
        },
        {
          id: 'littlesteps/report' as const,
          label: '週報月報',
          icon: FileBarChart,
          description: '數據趨勢與報告',
          requiresAuth: true
        },
        {
          id: 'littlesteps/clinic-summary' as const,
          label: '看診摘要',
          icon: Stethoscope,
          description: '一鍵產生看診資料',
          requiresAuth: true
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
          description: '記錄寶寶發展進度',
          requiresAuth: false
        },
        {
          id: 'littlesteps/vaccine-tracking' as const,
          label: '疫苗追蹤',
          icon: Syringe,
          description: '疫苗接種時程與副作用',
          requiresAuth: false
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
          description: '副食品添加完整攻略',
          requiresAuth: false
        },
        {
          id: 'littlesteps/sleep-training' as const,
          label: '睡眠訓練',
          icon: Moon,
          description: '睡眠需求與訓練技巧',
          requiresAuth: false
        },
        {
          id: 'littlesteps/sleep-analysis' as const,
          label: '睡眠分析',
          icon: BarChart3,
          description: '分析寶寶睡眠模式',
          requiresAuth: true
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
          description: '各階段注意事項',
          requiresAuth: false
        },
        {
          id: 'littlesteps/baby-wiki' as const,
          label: '寶寶百科',
          icon: BookOpen,
          description: '常見狀況與處理方式',
          requiresAuth: false
        }
      ]
    }
  ];

  // Filter menu sections based on auth status
  const filteredSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item => !item.requiresAuth || user)
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
                  <h2 className="text-ink truncate">LittleSteps</h2>
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

            {/* Footer */}
            <div className="sticky bottom-0 left-0 right-0 p-5 bg-warm-white border-t border-ink/5">
              <p className="text-xs text-ink-faint text-center">
                © {new Date().getFullYear()} LittleSteps
                <br />
                陪伴寶貝每一步成長
              </p>
            </div>
          </motion.div>

        </>
      )}
    </AnimatePresence>
  );
}
