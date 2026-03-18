import { motion, AnimatePresence } from 'framer-motion';
import { X, Baby, AlertCircle, Home, Syringe, UtensilsCrossed } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: 'milestones' | 'care-guide' | 'vaccine-tracking' | 'complementary-food';
  onNavigate: (page: 'milestones' | 'care-guide' | 'vaccine-tracking' | 'complementary-food') => void;
}

export default function Sidebar({ isOpen, onClose, currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    {
      id: 'milestones' as const,
      label: '里程碑追蹤',
      icon: Baby,
      description: '記錄寶寶發展進度'
    },
    {
      id: 'care-guide' as const,
      label: '照顧重點',
      icon: AlertCircle,
      description: '各階段注意事項'
    },
    {
      id: 'vaccine-tracking' as const,
      label: '疫苗追蹤',
      icon: Syringe,
      description: '疫苗接種時程與副作用'
    },
    {
      id: 'complementary-food' as const,
      label: '副食品指南',
      icon: UtensilsCrossed,
      description: '副食品添加完整攻略'
    }
  ];

  const handleNavigate = (page: 'milestones' | 'care-guide' | 'vaccine-tracking' | 'complementary-food') => {
    onNavigate(page);
    onClose();
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
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                © 2024 LittleSteps
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
