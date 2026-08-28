import { motion, AnimatePresence } from 'framer-motion';
import { X, Baby, AlertCircle, Home, Syringe, UtensilsCrossed, Edit, LogOut, TrendingUp, Moon, Share2, BarChart3, ClipboardList, BookOpen, Stethoscope, FileBarChart } from 'lucide-react';
import { isPregnancyProfile } from '../pregnancy';
import { User } from 'firebase/auth';
import { ChildProfile, Gender } from '../../types'; // Import ChildProfile and Gender
import { LittleStepsPage } from '../../types/routes'; // Import route types
import { backdrop, listItem, stagger } from '../ui/motion';
import AddChildModal from './AddChildModal'; // Import AddChildModal
import ShareChildUuidModal from './ShareChildUuidModal'; // Import ShareChildUuidModal
import { useState } from 'react'; // Import useState

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: LittleStepsPage;
  onNavigate: (page: LittleStepsPage) => void;
  childProfiles: ChildProfile[];
  currentChildId: string | null;
  setCurrentChildId: (id: string) => void;
  addChild: (name: string, birthday: string, gender?: Gender, dueDate?: string) => void;
  joinChild: (uuid: string) => void;
  updateChild: (id: string, name: string, birthday: string, gender?: Gender) => void;
  deleteChild: (id: string) => void;
  user: User | null;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

/** 抽屜裡每一組的標題共用同一個 eyebrow 樣式，才不會五組標題五種大小。 */
const GROUP_LABEL = 'text-xs font-semibold text-ink-faint tracking-wider mb-3 px-2';

export default function Sidebar({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  childProfiles,
  currentChildId,
  setCurrentChildId,
  addChild,
  joinChild,
  updateChild,
  deleteChild,
  user,
  onSignIn,
  onSignOut,
}: SidebarProps) {
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharingChild, setSharingChild] = useState<ChildProfile | null>(null);

  // 計算子女數量與免費版限制
  const childCount = childProfiles.length;
  const canAddChild = childCount < 2;

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

  const handleSaveChild = (
    name: string,
    birthday: string,
    gender?: Gender,
    _isPregnancy?: boolean,
    dueDate?: string,
  ) => {
    if (editingChild) {
      updateChild(editingChild.id, name, birthday, gender);
    } else {
      addChild(name, birthday, gender, dueDate);
    }
    setEditingChild(null);
  };

  // 刪除是不可回復的（里程碑進度一起消失），所以它不再和「編輯」並排擺在
  // 每一列裡——原本兩者只隔 4px，誤觸代價太大。入口收進編輯表單內。
  const handleDeleteChild = (id: string) => {
    if (window.confirm('確定要刪除這位寶寶的資料嗎？所有里程碑進度也將一併刪除。')) {
      deleteChild(id);
      setShowAddChildModal(false);
      setEditingChild(null);
    }
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

            {/* Auth Section */}
            <div className="p-4 border-b border-ink/5">
              {!user ? (
                <>
                  <div className="p-4 rounded-2xl bg-secondary-soft mb-3">
                    <p className="text-sm font-medium text-ink">登入以保存資料</p>
                    <p className="text-xs text-ink-muted">使用 Google 帳號登入</p>
                  </div>
                  <button
                    type="button"
                    onClick={onSignIn}
                    className="btn-secondary w-full"
                  >
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <span>使用 Google 登入</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <img
                    src={user.photoURL || '/default-avatar.png'}
                    alt={user.displayName || '用戶'}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink truncate">
                      {user.displayName || '用戶'}
                    </p>
                    <p className="text-sm text-ink-muted truncate">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="btn-icon"
                    title="登出"
                    aria-label="登出"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Child Profiles Section */}
            <div className="p-4 border-b border-ink/5">
              <h3 className={GROUP_LABEL}>我的寶寶</h3>
              <div className="space-y-2">
                {childProfiles.length === 0 && (
                  <p className="text-ink-muted text-sm px-2">尚未新增寶寶資料</p>
                )}
                {childProfiles.map((child) => (
                  <div
                    key={child.id}
                    className={`flex items-center gap-1 p-2 pl-3 rounded-2xl transition-colors ${
                      child.id === currentChildId
                        ? 'bg-primary-light'
                        : 'bg-ink/5 hover:bg-ink/10'
                    }`}
                  >
                    <button
                      type="button"
                      className="flex-1 min-w-0 flex items-center gap-2 min-h-tap text-left"
                      onClick={() => setCurrentChildId(child.id)}
                    >
                      <span className="font-medium text-ink truncate">{child.name}</span>
                      {/* 孕期檔案的 birthday 是預產期，外觀上與寶寶檔案無異；
                          沒有這個標記，切換器裡兩者分不出來。 */}
                      {isPregnancyProfile(child) && (
                        <span className="tag bg-bloom-dusty-rose/15 text-bloom-dusty-rose-ink shrink-0">
                          孕期
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSharingChild(child);
                        setShowShareModal(true);
                      }}
                      className="btn-icon"
                      title="分享寶寶資料給家人"
                      aria-label={`分享 ${child.name} 的資料給家人`}
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingChild(child);
                        setShowAddChildModal(true);
                      }}
                      className="btn-icon"
                      title="編輯寶寶資料"
                      aria-label={`編輯 ${child.name} 的資料`}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    if (canAddChild) {
                      setEditingChild(null); // Ensure we're adding, not editing
                      setShowAddChildModal(true);
                    }
                  }}
                  disabled={!canAddChild}
                  className={`w-full min-h-tap mt-3 rounded-2xl text-sm font-medium transition-colors ${
                    canAddChild
                      ? 'bg-secondary-light text-secondary-dark hover:bg-secondary-light/70'
                      : 'bg-ink/5 text-ink-faint cursor-not-allowed'
                  }`}
                  title={!canAddChild ? '免費版最多只能新增 2 個寶寶，升級付費會員可新增更多' : '新增寶寶'}
                >
                  新增寶寶
                </button>
              </div>
            </div>

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

          {/*
            Add/Edit Child Modal.

            沒有「懷孕中」分頁：孕期檔案由 LittleBloom 自己新增。要求家長先進
            LittleSteps 的側邊欄才能開始用 LittleBloom，是把兩個服務綁在一起；
            共用的應該只有帳號與孩子資料。
          */}
          <AddChildModal
            isOpen={showAddChildModal}
            onClose={() => setShowAddChildModal(false)}
            onSave={handleSaveChild}
            onJoin={joinChild}
            editingChild={editingChild}
            onDelete={editingChild ? () => handleDeleteChild(editingChild.id) : undefined}
            modes={['create', 'join']}
          />

          {/* Share Child UUID Modal */}
          <ShareChildUuidModal
            isOpen={showShareModal}
            onClose={() => {
              setShowShareModal(false);
              setSharingChild(null);
            }}
            child={sharingChild}
          />
        </>
      )}
    </AnimatePresence>
  );
}
