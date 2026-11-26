import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { stagger, listItem, tap, hoverLift } from '../../../common/ui/motion';
import type { ViewMode } from './types';

const GUIDE_CARDS: { view: ViewMode; title: string; description: string }[] = [
  { view: 'guide-overview', title: '開始使用指南', description: '副食品添加原則與時機' },
  { view: 'guide-stages', title: '發展階段', description: '奶量與副食品轉換' },
  { view: 'guide-menu', title: '菜單建議', description: '月份推薦與過敏等級' },
  { view: 'guide-safety', title: '安全須知', description: '禁忌食物與注意事項' },
];

interface FoodHomeViewProps {
  /** 還不能記錄的人在追蹤區的位置上看到的那張卡；能記錄時追蹤區由頁面另外掛。 */
  prompt?: ReactNode;
  onOpenGuide: (view: ViewMode) => void;
}

/** 副食品頁的主頁：四張知識庫入口。這裡不碰任何一筆孩子的紀錄。 */
export default function FoodHomeView({ prompt, onOpenGuide }: FoodHomeViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3">副食品知識庫</h2>

        <motion.div
          className="grid grid-cols-2 gap-3"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {GUIDE_CARDS.map((guide) => (
            <motion.button
              key={guide.view}
              variants={listItem}
              whileHover={hoverLift}
              whileTap={tap}
              onClick={() => onOpenGuide(guide.view)}
              className="card-tap text-left"
            >
              <h3 className="mb-1">{guide.title}</h3>
              <p className="text-sm text-ink-muted">{guide.description}</p>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* 指南在前、登入提示在後：訪客是來查資料的，一進來先看到一顆登入按鈕，
          等於告訴他這一頁和以前一樣要帳號。 */}
      {prompt}
    </div>
  );
}
