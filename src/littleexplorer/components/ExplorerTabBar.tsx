import { BellRing, BookOpen, PenLine, Sprout } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ExplorerTab = 'development' | 'reminders' | 'diary' | 'wiki';

interface TabDefinition {
  id: ExplorerTab;
  label: string;
  icon: LucideIcon;
  hash: string;
}

/**
 * Data-driven so the bar stays one block of JSX rather than four copies,
 * mirroring how Sidebar declares its menuSections.
 */
const TABS: TabDefinition[] = [
  { id: 'development', label: '成長', icon: Sprout, hash: '#/littleexplorer' },
  { id: 'reminders', label: '提醒', icon: BellRing, hash: '#/littleexplorer/reminders' },
  { id: 'diary', label: '日記', icon: PenLine, hash: '#/littleexplorer/diary' },
  { id: 'wiki', label: '百科', icon: BookOpen, hash: '#/littleexplorer/wiki' },
];

interface ExplorerTabBarProps {
  active: ExplorerTab;
  /** 逾期＋到期的任務數；0 或未給則不顯示紅點 */
  reminderBadge?: number;
}

/**
 * Bottom navigation for LittleExplorer's four parallel tabs.
 *
 * Navigates by writing location.hash directly: App.tsx already listens for
 * hashchange, so no callback prop has to thread through four pages.
 */
export default function ExplorerTabBar({ active, reminderBadge = 0 }: ExplorerTabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-explorer-sand shadow-soft">
      <div className="flex pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === active;
          const showBadge = tab.id === 'reminders' && reminderBadge > 0;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                window.location.hash = tab.hash;
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 min-h-[56px] flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? 'text-explorer-sunbeam-dark' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'fill-explorer-sunbeam/20' : ''}`} />
                {showBadge && (
                  <span
                    className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-explorer-clay text-white text-[10px] font-semibold flex items-center justify-center"
                    aria-label={`${reminderBadge} 項待處理`}
                  >
                    {reminderBadge > 9 ? '9+' : reminderBadge}
                  </span>
                )}
              </span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
