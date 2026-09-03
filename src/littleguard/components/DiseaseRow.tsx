import { motion } from 'framer-motion';
import type { RadarCell } from '../../types';
import { listItem } from '../../common/ui/motion';
import { STATUS_COPY, formatRate, statusOf } from '../utils/radar';

interface Props {
  disease: string;
  cell: RadarCell;
  /** 資料過期時只留數字，不顯示可能已經錯的狀態。 */
  showStatus: boolean;
  onOpen: () => void;
}

/**
 * 一種病一列。
 *
 * 狀態是文字不是圖示：文案本身已經帶方向（變多／差不多／比平常少），再加一個
 * 箭頭只是把同一件事說兩次，而六個並排的上升箭頭本身就是一組警報視覺。
 *
 * 文案與顏色一律從 STATUS_COPY 取，這裡不列任何狀態名單——radar.ts 之後再多
 * 幾個狀態，這一列都不用改，也不會漏掉哪一個。
 *
 * 兩行而不是一行：390px 的卡片內寬只有約 326px，「疱疹性咽峽炎 ＋ 最近變多，
 * 多留意 ＋ 169.0/萬 ＋ 35 人次」擠在同一行會溢出。病名配狀態、數字配人次，
 * 各自成一欄，也讓數字不必為了塞得下而縮字級。
 */
export default function DiseaseRow({ disease, cell, showStatus, onOpen }: Props) {
  const copy = STATUS_COPY[statusOf(cell)];
  return (
    <motion.button
      type="button"
      variants={listItem}
      onClick={onOpen}
      className="card-tap w-full min-h-tap flex items-start justify-between gap-3 text-left"
    >
      <span className="min-w-0">
        <span className="block text-ink font-medium">{disease}</span>
        {showStatus && <span className={`block text-sm mt-0.5 ${copy.tone}`}>{copy.label}</span>}
      </span>
      <span className="shrink-0 text-right">
        <span className="block text-ink tabular-nums">{formatRate(cell.rate)}</span>
        <span className="block mt-0.5 text-sm text-ink-faint tabular-nums">
          {cell.visits} 人次
        </span>
      </span>
    </motion.button>
  );
}
