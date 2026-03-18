import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ChildProfile } from '../types';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, birthday: string) => void;
  editingChild?: ChildProfile | null;
}

export default function AddChildModal({ isOpen, onClose, onSave, editingChild }: AddChildModalProps) {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');

  useEffect(() => {
    if (editingChild) {
      setName(editingChild.name);
      setBirthday(editingChild.birthday);
    } else {
      setName('');
      setBirthday('');
    }
  }, [editingChild, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && birthday) {
      onSave(name, birthday);
      onClose();
    }
  };

  if (!isOpen) return null;

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
                {editingChild ? '編輯寶寶資料' : '新增寶寶'}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold shadow-soft hover:bg-primary-dark transition-colors"
              >
                {editingChild ? '儲存修改' : '新增寶寶'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
