import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { backdrop, sheet } from '../ui/motion';
import { useDialogA11y } from '../ui/useDialogA11y';

interface ModalFrameProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /** 送出中時鎖住關閉，避免半途卸載掉正在等待的請求。 */
  closeDisabled?: boolean;
  children: ReactNode;
  /**
   * 釘在 sheet 底部、捲動時不會離開畫面的那一列，通常是送出鍵。
   *
   * 餵奶表單有時間、七個類型、時長與奶量各一排快捷鍵，單手拿著手機時送出鍵
   * 永遠在摺線以下。header 已經釘在頂端，footer 用同一個做法釘在底部——這是
   * 唯一的一份，要釘住送出鍵的表單都用它，不要再各自手寫 sticky。
   *
   * 鍵在表單外面，所以 submit 鍵要用 `form` 屬性指回表單的 id。
   */
  footer?: ReactNode;
}

/**
 * 三個 modal 各自手抄過一份一模一樣的外框與 header，而且三份都沒有設高度上限：
 * 手機叫出鍵盤之後，送出按鈕被推到畫面外，而且捲不到。
 *
 * 改成從底部升起的 sheet——拇指按得到，內容超過高度就自己捲，header 釘在頂端
 * 所以捲動時還看得到自己在哪一張表單上。
 */
export default function ModalFrame({
  isOpen,
  onClose,
  title,
  closeDisabled,
  children,
  footer,
}: ModalFrameProps) {
  const dialogRef = useDialogA11y(isOpen, onClose, closeDisabled);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            {...backdrop}
            // 存檔中連遮罩也不能關：只鎖住 X 的話，關掉請求的那條路還開著一半。
            onClick={closeDisabled ? undefined : onClose}
            className="fixed inset-0 bg-ink/40 z-50"
          />

          <motion.div
            {...sheet}
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-t-3xl shadow-soft-lg"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-white px-5 pt-5 pb-3">
              <h2 className="text-ink">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                disabled={closeDisabled}
                aria-label="關閉"
                className="btn-icon -mr-1.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={footer ? 'px-5 pb-4' : 'px-5 pb-6'}>{children}</div>

            {footer && (
              <div className="sticky bottom-0 z-10 border-t border-ink/10 bg-white px-5 pt-3 pb-5">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
