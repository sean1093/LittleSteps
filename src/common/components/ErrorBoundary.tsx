import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { logEvent } from '../../lib/firebase';
import { goTo } from '../navigate';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** 記到 analytics 時用來分辨是哪一層攔到的。 */
  scope: string;
  /**
   * 這個 fallback 要不要當成整頁的 <main>。
   *
   * 錯誤畫面出現的那一刻，它就是整頁的內容，所以自帶版面的 standalone 路由
   * 壞掉時由這裡補上地標——那些路由的 <main> 是頁面自己畫的，而壞掉的正是
   * 那個頁面。反之外框已經提供 <main> 時必須維持 false：巢狀的兩個 main 和
   * 一個都沒有一樣是錯的。
   */
  ownsMain?: boolean;
}

interface ErrorBoundaryState {
  message: string | null;
  /** 是不是 lazy 頁面的 chunk 沒載進來（見 isChunkLoadError）。 */
  chunkLoad: boolean;
}

/**
 * lazy 頁面的 chunk 沒載進來。Vite 的動態 import 失敗時，各家瀏覽器丟的是
 * 同一種 TypeError、不同的訊息：Chrome 是 "Failed to fetch dynamically
 * imported module"，Firefox 是 "error loading dynamically imported module"，
 * Safari 是 "Importing a module script failed."。
 */
function isChunkLoadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /dynamically imported module|Importing a module script failed/i.test(message);
}

/**
 * 一頁壞掉不該讓整個 app 變成白畫面。
 *
 * 這個 app 原本沒有任何 error boundary，所以任何 render 期間的例外都會把整棵
 * 樹卸載——實際發生過三次：看診摘要讀一個 Firebase 沒存的空物件、成長百分位
 * 在沒有性別時不存在。家長看到的是一片空白，沒有任何說明，也沒有下一步。
 *
 * 例外照樣往 console 與 analytics 送，這裡不是把錯誤藏起來，是讓它只損失一頁。
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { message: null, chunkLoad: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { message: error.message, chunkLoad: isChunkLoadError(error) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.scope}] 畫面發生錯誤:`, error, info.componentStack);
    // 沒有這一行的話，線上的白畫面完全查不到——使用者不會回報，只會關掉。
    logEvent('render_error', {
      scope: this.props.scope,
      message: error.message?.slice(0, 200),
    });
  }

  render() {
    if (this.state.message === null) return this.props.children;

    const Frame = this.props.ownsMain ? 'main' : 'div';

    /*
      離線時點到一頁還沒快取的頁面：chunk 載不進來。原本的畫面說「你的紀錄都
      還在…重新載入通常就好了」，可是離線重新載入會把整個 app 弄丟，而且對
      未登入的訪客提紀錄沒有意義。所以這裡改說真正的原因，不叫人重新載入。

      navigator.onLine 為 true 不代表真的連得上（接著 wifi 但沒有對外網路時
      也是 true），所以 chunk 沒載進來本身就當成沒有網路。但 onLine 為 true
      時仍然留著重新載入：剛部署完、舊分頁要的 chunk 已經不在了，那時重新
      載入正是解法。
    */
    const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
    if (this.state.chunkLoad || offline) {
      return (
        <Frame className="screen">
          <div className="screen-body">
            <div className="card text-center">
              <h2 className="mb-2">這一頁打不開</h2>
              <p className="text-sm text-ink-muted mb-5">
                現在沒有網路，這一頁還沒存在手機上。連上網路後再開一次。
              </p>

              <div className="flex flex-col gap-2">
                {!offline && (
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="btn-primary w-full"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>重新載入</span>
                  </button>
                )}
                {/* 這裡壞掉的只是一個沒載進來的 chunk，外框還是好的，用 SPA
                    換頁就回得去；整頁重新載入在離線時反而回不來。 */}
                <button
                  type="button"
                  onClick={() => goTo('home')}
                  className={offline ? 'btn-secondary w-full' : 'btn-ghost w-full'}
                >
                  回所有服務
                </button>
              </div>
            </div>
          </div>
        </Frame>
      );
    }

    return (
      <Frame className="screen">
        <div className="screen-body">
          <div className="card text-center">
            <h2 className="mb-2">這一頁出了點問題</h2>
            <p className="text-sm text-ink-muted mb-1">
              你的紀錄都還在，只是這一頁沒能正確顯示。
            </p>
            <p className="text-sm text-ink-muted mb-5">重新載入通常就好了。</p>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn-primary w-full"
              >
                <RefreshCw className="w-5 h-5" />
                <span>重新載入</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  // 直接改網址再整頁載入：目前這棵樹已經壞了，用 SPA 換頁
                  // 不保證救得回來。
                  goTo('home');
                  window.location.reload();
                }}
                className="btn-ghost w-full"
              >
                回所有服務
              </button>
            </div>
          </div>
        </div>
      </Frame>
    );
  }
}
