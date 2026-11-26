/** 為什麼眼前沒有追蹤區：還沒登入、還沒有寶寶，或選的是孕期檔案。 */
export type FoodTrackingBlocker = 'signed-out' | 'no-child' | 'not-born';

interface FoodTrackingPromptProps {
  blocker: FoodTrackingBlocker;
  onSignIn?: () => Promise<void> | void;
}

/**
 * 追蹤區的位置上，給還不能記錄的人看的那一張卡。
 *
 * 指南本身誰都能讀；要帳號的只有「我家寶寶試過什麼」。這張卡只說這件事，
 * 並且照實說出現在差的是哪一步。它不讀登入狀態也不碰資料庫，所以可以留在
 * 公開頁的靜態匯入路徑上。
 */
export default function FoodTrackingPrompt({ blocker, onSignIn }: FoodTrackingPromptProps) {
  return (
    <div className="panel">
      <h2 className="mb-1">記下寶寶試過哪些食材</h2>
      <p className="text-sm text-ink-muted">
        登入後可以記錄每一種食材試吃的日期與反應，過敏的食材會特別標出來。
      </p>

      {blocker === 'signed-out' && onSignIn && (
        <button
          onClick={() => {
            void onSignIn();
          }}
          className="btn-primary w-full mt-4"
        >
          用 Google 登入，開始記錄
        </button>
      )}
      {blocker === 'no-child' && (
        <p className="text-sm font-medium text-ink mt-3">先新增寶寶，就可以開始記錄。</p>
      )}
      {blocker === 'not-born' && (
        <p className="text-sm font-medium text-ink mt-3">寶寶出生後就可以開始記錄。</p>
      )}
    </div>
  );
}
