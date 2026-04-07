import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Baby, Link2 } from 'lucide-react';
import { ChildProfile } from '../types';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, birthday: string) => void;
  onJoin?: (uuid: string) => void; // New: join existing child
  editingChild?: ChildProfile | null;
}

export default function AddChildModal({
  isOpen,
  onClose,
  onSave,
  onJoin,
  editingChild
}: AddChildModalProps) {
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [childUuid, setChildUuid] = useState('');

  useEffect(() => {
    if (editingChild) {
      setMode('create');
      setName(editingChild.name);
      setBirthday(editingChild.birthday);
    } else {
      setName('');
      setBirthday('');
      setChildUuid('');
    }
  }, [editingChild, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'create') {
      if (name && birthday) {
        onSave(name, birthday);
        onClose();
      }
    } else if (mode === 'join') {
      if (childUuid && onJoin) {
        onJoin(childUuid.trim());
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  // If editing, only show create mode
  const showModeSelector = !editingChild && onJoin;

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
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '-50%', x: '-50%' }}
            animate={{ opacity: 1, y: '-50%', x: '-50%' }}
            exit={{ opacity: 0, y: '-50%', x: '-50%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 w-11/12 max-w-md bg-white rounded-3xl shadow-xl z-50 p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingChild ? '編輯寶寶資料' : mode === 'create' ? '新增寶寶' : '加入寶寶'}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Mode Selector */}
            {showModeSelector && (
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setMode('create')}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all
                    ${mode === 'create'
                      ? 'bg-primary text-white shadow-soft'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  <Baby className="w-4 h-4" />
                  <span>新增寶寶</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('join')}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all
                    ${mode === 'join'
                      ? 'bg-primary text-white shadow-soft'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  <Link2 className="w-4 h-4" />
                  <span>加入寶寶</span>
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'create' ? (
                <>
                  <div>
                    <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-1">
                      寶寶姓名
                    </label>
                    <input
                      type="text"
                      id="childName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="例如: 小寶"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="childBirthday" className="block text-sm font-medium text-gray-700 mb-1">
                      寶寶生日
                    </label>
                    <input
                      type="date"
                      id="childBirthday"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="childUuid" className="block text-sm font-medium text-gray-700 mb-1">
                      寶寶代碼
                    </label>
                    <input
                      type="text"
                      id="childUuid"
                      value={childUuid}
                      onChange={(e) => setChildUuid(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-colors font-mono text-sm"
                      placeholder="例如: 1234abcd-5678-90ef-ghij-klmnopqrstuv"
                      required
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      請輸入家人分享的寶寶代碼，即可一起管理寶寶資料
                    </p>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold shadow-soft hover:bg-primary-dark transition-colors"
              >
                {editingChild ? '儲存修改' : mode === 'create' ? '新增寶寶' : '加入寶寶'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
