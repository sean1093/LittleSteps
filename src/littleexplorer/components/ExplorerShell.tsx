import type { ReactNode } from 'react';
import { Sun } from 'lucide-react';
import ExplorerTabBar from './ExplorerTabBar';
import HomeButton from '../../common/components/HomeButton';
import type { ExplorerTab } from './ExplorerTabBar';

interface ExplorerShellProps {
  active: ExplorerTab;
  childName?: string;
  /** 已格式化的年齡字串，例：2歲3個月 */
  ageLabel?: string;
  reminderBadge?: number;
  children: ReactNode;
}

/**
 * Chrome shared by LittleExplorer's four tabs: header, content slot, bottom
 * tab bar. Written once here so the four pages carry no chrome of their own.
 *
 * No back button — the tabs are siblings, there is no level above them.
 */
export default function ExplorerShell({
  active,
  childName,
  ageLabel,
  reminderBadge,
  children,
}: ExplorerShellProps) {
  const subtitle = [childName ?? '小小探險家', ageLabel].filter(Boolean).join(' · ');

  return (
    <div className="min-h-screen bg-explorer-sand">
      <header className="bg-white shadow-soft sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-explorer-sunbeam/20 to-explorer-meadow/20 flex items-center justify-center shrink-0">
            <Sun className="w-6 h-6 text-explorer-sunbeam-dark" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-explorer-bark leading-tight">LittleExplorer</h1>
            <p className="text-sm text-explorer-bark/60 truncate">{subtitle}</p>
          </div>
          <HomeButton className="bg-explorer-sand hover:bg-explorer-sunbeam-light text-explorer-bark" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-4 pb-24">{children}</main>

      <ExplorerTabBar active={active} reminderBadge={reminderBadge} />
    </div>
  );
}
