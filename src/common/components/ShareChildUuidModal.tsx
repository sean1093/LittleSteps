import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { ChildProfile } from '../../types';
import { tap } from '../ui/motion';
import ModalFrame from './ModalFrame';

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

  if (!child) return null;

  return (
    <ModalFrame isOpen={isOpen} onClose={onClose} title="分享寶寶資料">
      <div className="bg-primary-soft rounded-2xl p-4 mb-4">
        <p className="text-sm text-ink-muted mb-1">分享對象</p>
        <p className="font-bold text-ink">{child.name}</p>
      </div>

      <div className="mb-4">
        <label htmlFor="childCode" className="block text-sm font-medium text-ink mb-2">
          寶寶代碼
        </label>
        <div className="relative">
          <input
            id="childCode"
            type="text"
            value={child.id}
            readOnly
            className="w-full min-h-tap pl-4 pr-14 py-3 rounded-2xl border border-ink/15 bg-warm-white font-mono text-sm text-ink select-all"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <motion.button
            type="button"
            whileTap={tap}
            onClick={handleCopy}
            aria-label={copied ? '已複製寶寶代碼' : '複製寶寶代碼'}
            className="btn-icon absolute right-1 top-1/2 -translate-y-1/2"
          >
            {copied ? (
              <Check className="w-5 h-5 text-mint-dark" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

      <div className="bg-secondary-soft border border-secondary/40 rounded-2xl p-4 mb-5">
        <h3 className="text-ink mb-1.5">如何與家人共同管理？</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-ink-muted">
          <li>複製上方的寶寶代碼</li>
          <li>傳送給家人（Line、WhatsApp 等）</li>
          <li>家人在「新增寶寶」選擇「加入寶寶」</li>
          <li>貼上代碼即可一起管理寶寶資料</li>
        </ol>
      </div>

      <button type="button" onClick={onClose} className="btn-secondary w-full">
        關閉
      </button>
    </ModalFrame>
  );
}
