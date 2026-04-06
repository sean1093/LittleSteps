import { Baby } from 'lucide-react';
import TimerDisplay from '../components/TimerDisplay';
import { useTimerPersistence } from '../hooks/useTimerPersistence';

/**
 * TimerDemoPage - Demonstration page for timer functionality
 *
 * This page showcases:
 * - Feeding timer with persistence
 * - Sleep timer with persistence
 * - Different timer sizes
 * - Background running capability
 *
 * Test instructions:
 * 1. Start a timer
 * 2. Close the browser tab
 * 3. Reopen the page - timer should continue from where it left off
 */
export default function TimerDemoPage() {
  // Demo child ID - in real app, this would come from current child context
  const demoChildId = 'demo-child-123';

  // Feeding timer with persistence
  const feedingTimer = useTimerPersistence('feeding', demoChildId);

  // Sleep timer with persistence
  const sleepTimer = useTimerPersistence('sleep', demoChildId);

  return (
    <div className="min-h-screen bg-warm-white pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 px-4 py-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Baby className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-gray-800">計時器功能展示</h2>
        </div>
        <p className="text-sm text-gray-600">
          測試背景計時功能：啟動計時器後關閉瀏覽器，重新開啟頁面計時器會繼續運行
        </p>
      </div>

      <div className="px-4 space-y-6">
        {/* Feeding Timer */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            🍼 餵奶計時器
          </h3>
          <p className="text-sm text-gray-600">
            追蹤餵奶時長，支援背景運行。即使關閉 App 也會繼續計時。
          </p>
          <TimerDisplay
            timer={feedingTimer}
            label="餵奶時長"
            size="large"
            showControls={true}
          />
          {feedingTimer.hasPersistedTimer && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3">
              <p className="text-sm text-green-700">
                ✓ 已從背景恢復計時器
              </p>
            </div>
          )}
        </div>

        {/* Sleep Timer */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            💤 睡眠計時器
          </h3>
          <p className="text-sm text-gray-600">
            追蹤睡眠時長，即使 App 在背景運行也能準確記錄。
          </p>
          <TimerDisplay
            timer={sleepTimer}
            label="睡眠時長"
            size="large"
            showControls={true}
          />
          {sleepTimer.hasPersistedTimer && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3">
              <p className="text-sm text-green-700">
                ✓ 已從背景恢復計時器
              </p>
            </div>
          )}
        </div>

        {/* Usage Examples */}
        <div className="card">
          <h4 className="font-semibold text-gray-800 mb-3">計時器尺寸範例</h4>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-2">Small 尺寸</p>
              <TimerDisplay
                timer={feedingTimer}
                label="小型計時器"
                size="small"
                showControls={false}
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Medium 尺寸（預設）</p>
              <TimerDisplay
                timer={feedingTimer}
                label="中型計時器"
                size="medium"
                showControls={false}
              />
            </div>
          </div>
        </div>

        {/* Test Instructions */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
          <h4 className="font-semibold text-blue-900 mb-3">🧪 測試步驟</h4>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>點擊「開始」按鈕啟動餵奶計時器</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>關閉瀏覽器分頁或重新整理頁面</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>重新開啟頁面，計時器應該繼續運行並顯示正確的經過時間</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>測試「暫停」、「繼續」、「停止」功能是否正常</span>
            </li>
          </ol>
        </div>

        {/* Technical Details */}
        <div className="card">
          <h4 className="font-semibold text-gray-800 mb-3">⚙️ 技術實作細節</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">資料持久化：</span> 使用 localStorage 儲存計時器狀態</p>
            <p><span className="font-medium">準確性：</span> 使用系統時鐘計時，不受分頁切換影響</p>
            <p><span className="font-medium">背景運行：</span> 即使關閉 App，計時器也會在 localStorage 繼續記錄</p>
            <p><span className="font-medium">自動恢復：</span> 重新開啟 App 時自動從 localStorage 讀取並恢復計時器</p>
          </div>
        </div>

        {/* Clear Timers Button */}
        <button
          onClick={() => {
            feedingTimer.clearPersistedTimer();
            sleepTimer.clearPersistedTimer();
            feedingTimer.stop();
            sleepTimer.stop();
          }}
          className="w-full py-3 px-6 rounded-2xl bg-red-500 text-white font-semibold shadow-soft hover:bg-red-600 transition-all"
        >
          清除所有計時器
        </button>
      </div>
    </div>
  );
}
