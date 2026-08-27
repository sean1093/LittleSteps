import type { LucideIcon } from 'lucide-react';

interface ExplorerNoticeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  /** 'info' 為中性引導，'celebrate' 用於畢業卡 */
  tone?: 'info' | 'celebrate';
}

/**
 * Full-width card used for age gates, graduation notices and empty states —
 * the places where a page has nothing to show and must say why.
 */
export default function ExplorerNotice({
  icon: Icon,
  title,
  description,
  action,
  tone = 'info',
}: ExplorerNoticeProps) {
  const accent =
    tone === 'celebrate'
      ? 'bg-explorer-meadow/15 text-explorer-meadow-dark'
      : 'bg-explorer-sky/15 text-explorer-sky';

  return (
    <div className="bg-white rounded-3xl shadow-soft p-6 text-center">
      <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${accent}`}>
        <Icon className="w-7 h-7" />
      </div>
      <h2 className="text-lg font-bold text-explorer-bark mb-2">{title}</h2>
      <p className="text-sm text-explorer-bark/70 leading-relaxed whitespace-pre-line">
        {description}
      </p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-explorer-sunbeam to-explorer-meadow text-white font-semibold shadow-soft hover:shadow-soft-lg transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
