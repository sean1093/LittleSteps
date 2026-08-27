import type { LucideIcon } from 'lucide-react';
import type { ServiceId } from '../routePolicy';

/**
 * 整寬卡片，用在頁面沒有東西可顯示、必須說明原因的地方：年齡守門、
 * 空狀態、畢業通知、孕期檔案提示。
 *
 * 原本只有 LittleExplorer 有（ExplorerNotice，10 處使用）。LittleBloom
 * 需要同樣的東西來處理「寶寶已經出生」與「還沒有孕期資料」，兩者除了
 * 配色以外完全相同，所以配色改用 ServiceId 索引——那是 routePolicy 已經
 * 存在的概念，不必另外發明一套主題詞彙。
 */

interface ServiceNoticeProps {
  service: Extract<ServiceId, 'littlebloom' | 'littleexplorer'>;
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  /** 'info' 為中性引導，'celebrate' 用於畢業或出生這類值得道賀的節點 */
  tone?: 'info' | 'celebrate';
}

const PALETTE = {
  littleexplorer: {
    info: 'bg-explorer-sky/15 text-explorer-sky',
    celebrate: 'bg-explorer-meadow/15 text-explorer-meadow-dark',
    title: 'text-explorer-bark',
    body: 'text-explorer-bark/70',
    button: 'bg-gradient-to-r from-explorer-sunbeam to-explorer-meadow',
  },
  littlebloom: {
    info: 'bg-bloom-sage/20 text-bloom-sage-dark',
    celebrate: 'bg-bloom-dusty-rose/15 text-bloom-dusty-rose-dark',
    title: 'text-bloom-stone',
    body: 'text-bloom-stone/70',
    button: 'bg-gradient-to-r from-bloom-dusty-rose to-bloom-mauve',
  },
} as const;

export default function ServiceNotice({
  service,
  icon: Icon,
  title,
  description,
  action,
  tone = 'info',
}: ServiceNoticeProps) {
  const palette = PALETTE[service];

  return (
    <div className="bg-white rounded-3xl shadow-soft p-6 text-center">
      <div
        className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${palette[tone]}`}
      >
        <Icon className="w-7 h-7" />
      </div>
      <h2 className={`text-lg font-bold mb-2 ${palette.title}`}>{title}</h2>
      <p className={`text-sm leading-relaxed whitespace-pre-line ${palette.body}`}>{description}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={`mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-soft hover:shadow-soft-lg transition-all ${palette.button}`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
