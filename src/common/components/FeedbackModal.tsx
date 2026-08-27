import { useState, useEffect } from 'react';
import ModalFrame from './ModalFrame';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => Promise<void>;
  userName: string;
}

const FIELD =
  'w-full min-h-tap px-4 py-3 rounded-2xl border border-ink/15 text-ink placeholder-ink-faint transition-colors';

const LABEL = 'block text-sm font-medium text-ink mb-1';

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
    } catch (err: unknown) {
      console.error('提交回報失敗:', err);
      setError(err instanceof Error ? err.message : '提交失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contentLength = content.trim().length;
  const isContentValid = contentLength >= 10;

  return (
    <ModalFrame
      isOpen={isOpen}
      onClose={onClose}
      title="問題回報"
      closeDisabled={isSubmitting}
    >
      <div className="mb-4 p-4 bg-secondary-soft rounded-2xl">
        <p className="text-sm text-ink">
          感謝 <span className="font-semibold">{userName}</span> 的回報！
        </p>
        <p className="text-xs text-ink-muted mt-1">
          您的意見將幫助我們改善 LittleSteps
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="feedbackTitle" className={LABEL}>
            標題 <span className="text-primary-dark">*</span>
          </label>
          <input
            id="feedbackTitle"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError(null);
            }}
            className={FIELD}
            placeholder="簡短描述您的問題或建議"
            maxLength={100}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="feedbackContent" className={LABEL}>
            詳細內容 <span className="text-primary-dark">*</span>
          </label>
          <textarea
            id="feedbackContent"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError(null);
            }}
            className={`${FIELD} resize-none`}
            rows={6}
            placeholder="請詳細描述您遇到的問題或想要的功能（至少 10 個字）"
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-1">
            <p className={`text-xs ${
              contentLength === 0 ? 'text-ink-faint' :
              isContentValid ? 'text-mint-dark' : 'text-butter-dark'
            }`}>
              {contentLength === 0 ? '請輸入至少 10 個字' :
               isContentValid ? `已輸入 ${contentLength} 個字` :
               `還需要 ${10 - contentLength} 個字`}
            </p>
            <p className="text-xs text-ink-faint">
              {contentLength}/500
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-primary-light border border-primary/40 rounded-2xl p-3">
            <p className="text-sm text-primary-dark">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isContentValid || !title.trim()}
          className="btn-primary w-full"
        >
          {isSubmitting ? '送出中...' : '送出回報'}
        </button>
      </form>

      <p className="text-xs text-ink-muted text-center mt-4">
        我們會仔細閱讀每一則回報，謝謝您的支持
      </p>
    </ModalFrame>
  );
}
