import { useState } from 'react';
import ModalFrame from './ModalFrame';
import { openInExternalBrowser, type InAppBrowser } from '../inAppBrowser';

interface InAppBrowserSheetProps {
  /** Which in-app browser the page is in; null keeps the sheet closed. */
  browser: InAppBrowser | null;
  onClose: () => void;
}

/**
 * Shown instead of Google sign-in inside an in-app browser.
 *
 * LINE can be asked to reopen the page in the phone's own browser, so there
 * the whole job is one button. Facebook, Instagram and the rest offer no such
 * door, so the parent copies the link and opens it in Chrome or Safari.
 */
export default function InAppBrowserSheet({ browser, onClose }: InAppBrowserSheetProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const close = () => {
    setCopyState('idle');
    onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState('copied');
    } catch {
      // Some webviews expose no clipboard at all. The link is then shown so
      // it can be selected by hand.
      setCopyState('failed');
    }
  };

  return (
    <ModalFrame isOpen={browser !== null} onClose={close} title="請改用瀏覽器開啟">
      {browser === 'line' ? (
        <div className="space-y-4">
          <p className="text-ink-muted">
            Google 不允許在 LINE 裡登入。按下面的按鈕，會用手機的瀏覽器重新打開這一頁，在那裡登入就可以了。
          </p>
          <button type="button" onClick={openInExternalBrowser} className="btn-primary w-full">
            用瀏覽器開啟
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-ink-muted">
            Google 不允許在這個 App 裡登入。請複製連結，貼到 Chrome 或 Safari 開啟後再登入。
          </p>
          <button type="button" onClick={handleCopy} className="btn-primary w-full">
            {copyState === 'copied' ? '已複製連結' : '複製連結'}
          </button>
          {copyState === 'failed' && (
            <div className="space-y-1">
              <p className="text-sm text-ink-muted">沒辦法自動複製，請長按下面的網址複製：</p>
              <p className="card text-sm text-ink break-all select-all">{window.location.href}</p>
            </div>
          )}
        </div>
      )}
    </ModalFrame>
  );
}
