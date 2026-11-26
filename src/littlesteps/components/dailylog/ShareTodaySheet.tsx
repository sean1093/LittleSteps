import { useState } from 'react';
import ModalFrame from '../../../common/components/ModalFrame';
import { shareText } from '../../../common/share';
import { useToast } from '../../../common/ui/toast';

interface ShareTodaySheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** The text exactly as it will be sent; built by buildDailyLogShareText. */
  text: string;
}

/**
 * Shows today's summary before it leaves, then hands it to the system share
 * sheet, or to the clipboard where there is none.
 *
 * Only the text is sent: no link and no token, so nobody who receives it gains
 * any way into the child's record. The parent reads every line first.
 */
export default function ShareTodaySheet({ isOpen, onClose, text }: ShareTodaySheetProps) {
  const toast = useToast();
  const [sharing, setSharing] = useState(false);

  const share = async () => {
    setSharing(true);
    const outcome = await shareText('今天的紀錄', text);
    setSharing(false);
    if (outcome === 'shared') onClose();
    if (outcome === 'copied') {
      toast.show('已複製，可以貼到 LINE 或訊息裡', 'success');
      onClose();
    }
    if (outcome === 'failed') toast.show('分享失敗，請稍後再試');
  };

  return (
    <ModalFrame
      isOpen={isOpen}
      onClose={onClose}
      title="分享今天的紀錄"
      footer={
        <button type="button" onClick={share} disabled={sharing} className="btn-primary w-full">
          分享這段文字
        </button>
      }
    >
      <p className="text-sm text-ink-muted">只會送出下面這段文字，不含連結，收到的人也看不到其他紀錄。</p>
      <pre className="mt-3 whitespace-pre-wrap break-words rounded-2xl bg-warm-white p-4 font-sans text-sm leading-relaxed text-ink">
        {text}
      </pre>
    </ModalFrame>
  );
}
