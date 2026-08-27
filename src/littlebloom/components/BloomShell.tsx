import type { ReactNode } from 'react';
import { ChevronLeft, Flower2 } from 'lucide-react';
import AppHomeButton from '../../common/components/AppHomeButton';

interface BloomShellProps {
  title: string;
  subtitle?: string;
  /** 有值時顯示返回鍵，導向該 hash；LittleBloom 首頁自己不需要 */
  backTo?: string;
  children: ReactNode;
}

/**
 * LittleBloom 三個頁面共用的外框。
 *
 * 兩層導覽和其他子應用一致：返回鍵回到本服務首頁（`#/littlebloom`），
 * 九宮格回到所有服務的進入點。
 */
export default function BloomShell({ title, subtitle, backTo, children }: BloomShellProps) {
  return (
    <div className="min-h-screen bg-bloom-cream">
      <header className="bg-bloom-dusty-rose text-white sticky top-0 z-30 shadow-soft">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          {backTo ? (
            <button
              type="button"
              onClick={() => {
                window.location.hash = backTo;
              }}
              aria-label="返回 LittleBloom 首頁"
              className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Flower2 className="w-5 h-5" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold leading-tight truncate">{title}</h1>
            {subtitle && <p className="text-sm text-white/80 truncate">{subtitle}</p>}
          </div>

          <AppHomeButton className="bg-white/20 hover:bg-white/30 text-white" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
