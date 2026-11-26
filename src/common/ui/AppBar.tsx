import { useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { ServiceTheme } from './serviceTheme';
import type { Page } from '../../types/routes';
import { goTo } from '../navigate';

/**
 * The one page header.
 *
 * There were three, and they disagreed about everything that matters: the
 * LittleSteps bar was white with a hamburger, LittleBloom's was a solid
 * dusty-rose band with white text (2.16:1 — the title was hard to read),
 * LittleExplorer's was white with a gradient icon badge that never changed
 * across its four tabs. Container widths were `max-w-3xl` and `max-w-4xl` for
 * no reason anyone wrote down.
 *
 * Structure is now identical everywhere and a service's personality comes from
 * its `ServiceTheme` — the title ink and the page background underneath. A
 * white bar keeps the coloured content below it as the thing you look at, and
 * costs a phone ~20px less vertical space than a tinted band.
 *
 * The identity icon that used to sit on the left of every single screen is
 * gone: the wordmark already says which app you are in, and on a 375px screen
 * that badge was competing with the title for the only row that matters.
 */

interface AppBarProps {
  theme: ServiceTheme;
  title: string;
  subtitle?: string;
  /** Renders a back button pointing at this page. */
  backTo?: Page;
  /** Accessible label for the back button; defaults to a generic one. */
  backLabel?: string;
  /** Replaces the back button — used by LittleSteps for its menu button. */
  leading?: ReactNode;
  /** Trailing controls, right-aligned. */
  actions?: ReactNode;
  /** Match the content column below. */
  width?: 'body' | 'wide';
}

export default function AppBar({
  theme,
  title,
  subtitle,
  backTo,
  backLabel,
  leading,
  actions,
  width = 'body',
}: AppBarProps) {
  const column = width === 'wide' ? 'max-w-4xl' : 'max-w-2xl';

  // Anything pinned below the bar reads its height from `--app-bar-h`
  // (the `top-app-bar` spacing token, 4rem when unset). The row is measured,
  // not the header, so the 1px border stays out of it as it always has: at
  // default text with a one-line title this publishes exactly 4rem.
  const row = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = row.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;
    const root = document.documentElement;
    const publish = () => {
      root.style.setProperty('--app-bar-h', `${element.offsetHeight}px`);
    };
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(element);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--app-bar-h');
    };
  }, []);

  return (
    <header className="app-bar sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-ink/5">
      {/* At least 4rem, and exactly 4rem whenever the title fits on one line
          beside the buttons — which is every page at default text size. It
          grows when the title needs a second line, or when large text stacks
          the title under the buttons (`.app-bar-row` in index.css), which is
          why things pinned below it say `top-app-bar` rather than `top-16`
          (DiaryPage's month divider once hardcoded `top-[72px]`). Only a bar
          with trailing actions stacks: a lone back button leaves the title
          room for two lines beside it even at 200% text on 320px. */}
      <div
        ref={row}
        className={`${actions ? 'app-bar-row' : ''} ${column} mx-auto px-4 min-h-16 flex items-center gap-2`}
      >
        {leading ??
          (backTo && (
            <button
              type="button"
              onClick={() => {
                goTo(backTo);
              }}
              aria-label={backLabel ?? `返回${theme.role}首頁`}
              className="btn-icon -ml-1.5"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ))}

        {/* min-w-0: a flex item will not shrink below its content width, so
            without it a long title pushes the trailing buttons off a narrow
            screen. The title then takes up to two lines rather than
            ellipsing at once: at 200% text a single truncated line was one
            character wide. The subtitle is a caption and still truncates. */}
        <div className="app-bar-title min-w-0 flex-1">
          <h1 className={`text-lg font-bold line-clamp-2 break-words ${theme.ink}`}>{title}</h1>
          {subtitle && <p className={`text-xs truncate ${theme.muted}`}>{subtitle}</p>}
        </div>

        {/* ml-auto does nothing while the title is flex-1 beside it; once the
            title stacks onto its own line it keeps the buttons on the right. */}
        {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
