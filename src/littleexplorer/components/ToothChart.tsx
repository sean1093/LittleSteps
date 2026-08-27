import { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import type { PrimaryTooth, ToothJaw, ToothProgress } from '../../types';
import { primaryTeeth, toothPositionLabels } from '../data/primaryTeeth';

interface ToothChartProps {
  progress: ToothProgress;
  /** 孩子目前月齡，用於標示「差不多該長了」的牙位 */
  ageMonths: number;
  onToggleTooth: (toothId: string) => Promise<void>;
}

/**
 * 乳牙萌發記錄，畫成上下兩排牙弓。
 *
 * 收合在成長分頁底部，但標題永遠帶著已長顆數，所以不必展開也看得到進度。
 * 每個牙位是一個可點擊的方塊，依中線往外排列，與孩子照鏡子時看到的順序一致。
 */
export default function ToothChart({ progress, ageMonths, onToggleTooth }: ToothChartProps) {
  const [open, setOpen] = useState(false);

  const eruptedCount = primaryTeeth.filter((tooth) => progress[tooth.id]?.erupted).length;

  const renderJaw = (jaw: ToothJaw) => {
    // 右側由外往內、左側由內往外，排出面對孩子時的實際牙弓順序。
    const right = primaryTeeth
      .filter((t) => t.jaw === jaw && t.side === 'right')
      .sort((a, b) => b.position - a.position);
    const left = primaryTeeth
      .filter((t) => t.jaw === jaw && t.side === 'left')
      .sort((a, b) => a.position - b.position);

    return (
      <div className="flex justify-center gap-1">
        {[...right, ...left].map((tooth, index) => (
          <ToothCell
            key={tooth.id}
            tooth={tooth}
            erupted={progress[tooth.id]?.erupted === true}
            due={ageMonths >= tooth.eruptFromMonth}
            onToggle={onToggleTooth}
            // 左右兩半之間留一個中線間隙
            className={index === right.length ? 'ml-3' : ''}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="bg-white rounded-3xl shadow-soft p-5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center gap-2 text-left"
      >
        <Sparkles className="w-5 h-5 text-explorer-sunbeam-dark shrink-0" />
        <h3 className="flex-1 font-semibold text-explorer-bark">
          乳牙萌發
          <span className="ml-2 text-sm font-normal text-explorer-bark/60">
            已長 {eruptedCount}／{primaryTeeth.length} 顆
          </span>
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-explorer-bark/40 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <p className="text-xs text-explorer-bark/50 text-center">上排</p>
            {renderJaw('upper')}
            <div className="h-px bg-explorer-sand" />
            {renderJaw('lower')}
            <p className="text-xs text-explorer-bark/50 text-center">下排</p>
          </div>

          <p className="text-xs text-explorer-bark/50 leading-relaxed">
            點一下記錄長出來了。虛線框是依月齡差不多該長的牙位；萌發時間個別差異很大，
            早半年或晚半年都常見，順序比時間更值得參考。
          </p>
        </div>
      )}
    </section>
  );
}

interface ToothCellProps {
  tooth: PrimaryTooth;
  erupted: boolean;
  due: boolean;
  onToggle: (toothId: string) => Promise<void>;
  className?: string;
}

function ToothCell({ tooth, erupted, due, onToggle, className = '' }: ToothCellProps) {
  const surface = erupted
    ? 'bg-explorer-meadow border-explorer-meadow text-white'
    : due
      ? 'bg-white border-explorer-sunbeam border-dashed text-explorer-bark/50'
      : 'bg-explorer-sand border-explorer-sand text-explorer-bark/30';

  return (
    <button
      type="button"
      onClick={() => onToggle(tooth.id)}
      aria-pressed={erupted}
      title={`${tooth.name}（約 ${tooth.eruptFromMonth}-${tooth.eruptToMonth} 個月）`}
      aria-label={`${tooth.name}，約 ${tooth.eruptFromMonth} 至 ${tooth.eruptToMonth} 個月`}
      className={`w-8 h-9 rounded-lg border-2 text-[10px] font-medium flex items-center justify-center transition-colors ${surface} ${className}`}
    >
      {toothPositionLabels[tooth.position].slice(0, 1)}
    </button>
  );
}
