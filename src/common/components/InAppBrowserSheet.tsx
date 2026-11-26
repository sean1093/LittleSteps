import { useState } from 'react';
import ModalFrame from './ModalFrame';
import { openInExternalBrowser, type InAppBrowser } from '../inAppBrowser';
import { currentLinkWithJoinCode } from '../joinLink';

interface InAppBrowserSheetProps {
  /** Which in-app browser the page is in; null keeps the sheet closed. */
  browser: InAppBrowser | null;
  onClose: () => void;
}

/**
 * The one action that gets a parent out of an in-app browser.
 *
 * LINE can be asked to reopen the page in the phone's own browser, so there
 * it is one button. Facebook, Instagram and the rest offer no such door, so
 * the parent copies the link and opens it in Chrome or Safari; where the
 * webview exposes no clipboard, the link is shown to be selected by hand.
 * Either way a share link keeps its join code (currentLinkWithJoinCode).
 *
 * Shared by the sheet below and by the /join intro, which puts it first
 * instead of a sign-in button that cannot work there.
 */
export function InAppBrowserAction({
  browser,
  className = 'btn-primary w-full',
}: {
  browser: InAppBrowser;
  className?: string;
}) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');

  if (browser === 'line') {
    return (
      <button type="button" onClick={openInExternalBrowser} className={className}>
        用瀏覽器開啟
      </button>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentLinkWithJoinCode());
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };

  return (
    <div className="space-y-4">
      <button type="button" onClick={handleCopy} className={className}>
        {copyState === 'copied' ? '已複製連結' : '複製連結'}
      </button>
      {copyState === 'failed' && (
        <div className="space-y-1">
          <p className="text-sm text-ink-muted">沒辦法自動複製，請長按下面的網址複製：</p>
          <p className="card text-sm text-ink break-all select-all">{currentLinkWithJoinCode()}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Shown instead of Google sign-in inside an in-app browser. ModalFrame
 * unmounts its content when closed, so reopening starts from a fresh copy
 * state.
 */
export default function InAppBrowserSheet({ browser, onClose }: InAppBrowserSheetProps) {
  return (
    <ModalFrame isOpen={browser !== null} onClose={onClose} title="請改用瀏覽器開啟">
      {browser && (
        <div className="space-y-4">
          <p className="text-ink-muted">
            {browser === 'line'
              ? 'Google 不允許在 LINE 裡登入。按下面的按鈕，會用手機的瀏覽器重新打開這一頁，在那裡登入就可以了。'
              : 'Google 不允許在這個 App 裡登入。請複製連結，貼到 Chrome 或 Safari 開啟後再登入。'}
          </p>
          <InAppBrowserAction browser={browser} />
        </div>
      )}
    </ModalFrame>
  );
}
