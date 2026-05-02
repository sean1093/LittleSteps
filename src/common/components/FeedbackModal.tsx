import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => Promise<void>;
  userName: string;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  userName,
}: FeedbackModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setContent('');
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validateForm = (): string | null => {
    if (!title.trim()) {
      return '請輸入標題';
    }
    if (!content.trim()) {
      return '請輸入回報內容';
    }
    if (content.trim().length < 10) {
      return '回報內容至少需要 10 個字';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(title.trim(), content.trim());
      onClose();
    } catch (err: any) {
      console.error('提交回報失敗:', err);
      setError(err.message || '提交失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const contentLength = content.trim().length;
  const isContentValid = contentLength >= 10;

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
            initial={{ opacity: 0, y: '-50%', x: '-50%', scale: 0.9 }}
            animate={{ opacity: 1, y: '-50%', x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: '-50%', x: '-50%', scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 w-11/12 max-w-lg bg-white rounded-3xl shadow-xl z-50 p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">問題回報</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* User Info */}
            <div className="mb-4 p-3 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-700">
                感謝 <span className="font-semibold">{userName}</span> 的回報！
              </p>
              <p className="text-xs text-gray-500 mt-1">
                您的意見將幫助我們改善 LittleSteps
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  標題 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="簡短描述您的問題或建議"
                  maxLength={100}
                  disabled={isSubmitting}
                />
              </div>

              {/* Content Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  詳細內容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-colors resize-none"
                  rows={6}
                  placeholder="請詳細描述您遇到的問題或想要的功能（至少 10 個字）"
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className={`text-xs ${
                    contentLength === 0 ? 'text-gray-400' :
                    isContentValid ? 'text-green-600' : 'text-orange-500'
                  }`}>
                    {contentLength === 0 ? '請輸入至少 10 個字' :
                     isContentValid ? `已輸入 ${contentLength} 個字 ✓` :
                     `還需要 ${10 - contentLength} 個字`}
                  </p>
                  <p className="text-xs text-gray-400">
                    {contentLength}/500
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !isContentValid || !title.trim()}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-soft hover:shadow-soft-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '送出中...' : '送出回報'}
              </button>
            </form>

            {/* Footer Note */}
            <p className="text-xs text-gray-500 text-center mt-4">
              我們會仔細閱讀每一則回報，謝謝您的支持 💙
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
