import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, AlertCircle } from 'lucide-react';
import { ChildProfile } from '../types';

interface ShareChildUuidModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: ChildProfile | null;
}

export default function ShareChildUuidModal({
  isOpen,
  onClose,
  child
}: ShareChildUuidModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!child) return;

    try {
      await navigator.clipboard.writeText(child.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('複製失敗，請手動選取並複製');
    }
  };

  if (!isOpen || !child) return null;

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
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">分享寶寶資料</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Child Info */}
            <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-2xl p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">分享對象</p>
              <p className="text-lg font-bold text-gray-800">{child.name}</p>
            </div>

            {/* UUID Display */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                寶寶代碼
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={child.id}
                  readOnly
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-300 bg-gray-50 font-mono text-sm text-gray-700 select-all"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">如何與家人共同管理？</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>複製上方的寶寶代碼</li>
                  <li>傳送給家人（Line、WhatsApp 等）</li>
                  <li>家人在「新增寶寶」選擇「加入寶寶」</li>
                  <li>貼上代碼即可一起管理寶寶資料</li>
                </ol>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-semibold shadow-soft hover:shadow-soft-lg transition-all"
            >
              關閉
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
