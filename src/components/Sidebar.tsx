import { motion, AnimatePresence } from 'framer-motion';
import { X, Baby, AlertCircle, Home, Syringe, UtensilsCrossed, PlusCircle, Edit, Trash2, LogIn, LogOut, TrendingUp } from 'lucide-react';
import { User } from 'firebase/auth';
import { ChildProfile } from '../types'; // Import ChildProfile
import AddChildModal from './AddChildModal'; // Import AddChildModal
import { useState } from 'react'; // Import useState

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: 'home' | 'dashboard' | 'milestones' | 'care-guide' | 'vaccine-tracking' | 'complementary-food' | 'daily-log' | 'growth-charts';
  onNavigate: (page: 'home' | 'dashboard' | 'milestones' | 'care-guide' | 'vaccine-tracking' | 'complementary-food' | 'daily-log' | 'growth-charts') => void;
  childProfiles: ChildProfile[];
  currentChildId: string | null;
  setCurrentChildId: (id: string) => void;
  addChild: (name: string, birthday: string) => void;
  updateChild: (id: string, name: string, birthday: string) => void;
  deleteChild: (id: string) => void;
  user: User | null;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

export default function Sidebar({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  childProfiles,
  currentChildId,
  setCurrentChildId,
  addChild,
  updateChild,
  deleteChild,
  user,
  onSignIn,
  onSignOut,
}: SidebarProps) {
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [editingChild, setEditingChild] = useState<ChildProfile | null>(null);

  // 計算子女數量與免費版限制
  const childCount = childProfiles.length;
  const canAddChild = childCount < 2;

  const allMenuItems = [
    {
      id: 'dashboard' as const,
      label: '儀表板',
      icon: Home,
      description: '寶寶成長總覽',
      requiresAuth: true // Dashboard requires login
    },
    {
      id: 'growth-charts' as const,
      label: '成長曲線圖',
      icon: TrendingUp,
      description: '追蹤身高體重發展',
      requiresAuth: true // Growth charts require login
    },
    {
      id: 'milestones' as const,
      label: '里程碑追蹤',
      icon: Baby,
      description: '記錄寶寶發展進度',
      requiresAuth: false // Can view without login (read-only)
    },
    {
      id: 'care-guide' as const,
      label: '照顧重點',
      icon: AlertCircle,
      description: '各階段注意事項',
      requiresAuth: false // Open to all users
    },
    {
      id: 'vaccine-tracking' as const,
      label: '疫苗追蹤',
      icon: Syringe,
      description: '疫苗接種時程與副作用',
      requiresAuth: false // Can view without login (read-only)
    },
    {
      id: 'complementary-food' as const,
      label: '副食品指南',
      icon: UtensilsCrossed,
      description: '副食品添加完整攻略',
      requiresAuth: false // Open to all users
    }
  ];

  // Filter menu items based on auth status
  const menuItems = allMenuItems.filter(item => !item.requiresAuth || user);

  const handleNavigate = (page: 'home' | 'dashboard' | 'milestones' | 'care-guide' | 'vaccine-tracking' | 'complementary-food' | 'daily-log' | 'growth-charts') => {
    onNavigate(page);
    onClose();
  };

  const handleSaveChild = (name: string, birthday: string) => {
    if (editingChild) {
      updateChild(editingChild.id, name, birthday);
    } else {
      addChild(name, birthday);
    }
    setEditingChild(null);
  };

  const handleDeleteChild = (id: string) => {
    if (window.confirm('確定要刪除這位寶寶的資料嗎？所有里程碑進度也將一併刪除。')) {
      deleteChild(id);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary to-secondary p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Home className="w-6 h-6" />
                  <h2 className="text-xl font-bold">LittleSteps</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-white/80">育兒里程碑追蹤</p>
            </div>

            {/* Auth Section */}
            <div className="p-4 border-b border-gray-100">
              {!user ? (
                <>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 mb-3">
                    <LogIn className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">登入以保存資料</p>
                      <p className="text-xs text-gray-500">使用 Google 帳號登入</p>
                    </div>
                  </div>
                  <button
                    onClick={onSignIn}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all shadow-sm"
                  >
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700">使用 Google 登入</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <img
                    src={user.photoURL || '/default-avatar.png'}
                    alt={user.displayName || '用戶'}
                    className="w-12 h-12 rounded-full border-2 border-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {user.displayName || '用戶'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={onSignOut}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    title="登出"
                  >
                    <LogOut className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Child Profiles Section */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">我的寶寶</h3>
              <div className="space-y-2">
                {childProfiles.length === 0 && (
                  <p className="text-gray-500 text-sm">尚未新增寶寶資料</p>
                )}
                {childProfiles.map((child) => (
                  <div
                    key={child.id}
                    className={`
                      flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all
                      ${child.id === currentChildId
                        ? 'bg-primary text-white shadow-soft'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div
                      className="flex-1 flex items-center gap-2"
                      onClick={() => setCurrentChildId(child.id)}
                    >
                      <Baby className={`w-5 h-5 ${child.id === currentChildId ? 'text-white' : 'text-primary'}`} />
                      <span className="font-medium">{child.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingChild(child);
                          setShowAddChildModal(true);
                        }}
                        className={`
                          w-8 h-8 flex items-center justify-center rounded-full transition-colors
                          ${child.id === currentChildId
                            ? 'hover:bg-white/20'
                            : 'hover:bg-gray-200'
                          }
                        `}
                        title="編輯寶寶資料"
                      >
                        <Edit className={`w-4 h-4 ${child.id === currentChildId ? 'text-white' : 'text-gray-600'}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChild(child.id);
                        }}
                        className={`
                          w-8 h-8 flex items-center justify-center rounded-full transition-colors
                          ${child.id === currentChildId
                            ? 'hover:bg-white/20'
                            : 'hover:bg-gray-200'
                          }
                        `}
                        title="刪除寶寶資料"
                      >
                        <Trash2 className={`w-4 h-4 ${child.id === currentChildId ? 'text-white' : 'text-red-500'}`} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    if (canAddChild) {
                      setEditingChild(null); // Ensure we're adding, not editing
                      setShowAddChildModal(true);
                    }
                  }}
                  disabled={!canAddChild}
                  className={`w-full flex items-center justify-center gap-2 p-3 mt-3 rounded-xl transition-colors ${
                    canAddChild
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  title={!canAddChild ? '免費版最多只能新增 2 個寶寶，升級付費會員可新增更多' : '新增寶寶'}
                >
                  <PlusCircle className="w-5 h-5" />
                  新增寶寶
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`
                      w-full p-4 rounded-2xl transition-all text-left
                      ${isActive
                        ? 'bg-primary text-white shadow-soft'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-6 h-6 flex-shrink-0 mt-0.5 ${isActive ? 'text-white' : 'text-primary'}`} />
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{item.label}</div>
                        <div className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 left-0 right-0 p-6 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                © {new Date().getFullYear()} LittleSteps
                <br />
                陪伴寶貝每一步成長
              </p>
            </div>
          </motion.div>

          {/* Add/Edit Child Modal */}
          <AddChildModal
            isOpen={showAddChildModal}
            onClose={() => setShowAddChildModal(false)}
            onSave={handleSaveChild}
            editingChild={editingChild}
          />
        </>
      )}
    </AnimatePresence>
  );
}
