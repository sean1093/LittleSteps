import { useState } from 'react';
import BloomShell from '../components/BloomShell';
import WeeklyGuide from '../components/WeeklyGuide';
import ToolCallout from '../../common/tools/ToolCallout';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { PREGNANCY_TOTAL_WEEKS } from '../data/pregnancyGuides';
import { lmpFromDueDate, weeksPregnant } from '../utils/prenatalSchedule';
import { toLocalDateKey } from '../../common/utils/dateHelpers';

/**
 * The weekly pregnancy guide, public: enter a due date, read that week, step to
 * the week before or after.
 *
 * The week-by-week guide is what a pregnant visitor comes for, and it used to
 * exist only behind sign-in. This page reads `pregnancyGuides.ts` and nothing
 * else. The due date lives in component state and nowhere else: not in the
 * URL, not in `preferences.ts`, not in any storage.
 */

/** Where the due date puts the pregnancy today. */
type Position =
  | { kind: 'week'; week: number }
  | { kind: 'too-early' }
  | { kind: 'past-term' };

function positionOf(dueDate: string): Position | null {
  if (!dueDate) return null;
  const lmp = lmpFromDueDate(dueDate);
  // A half-typed or impossible date shifts to NaN parts; show nothing for it.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lmp)) return null;
  // A last period still in the future: the due date is more than 40 weeks away.
  if (lmp > toLocalDateKey()) return { kind: 'too-early' };
  // Past term only once the due date itself is behind us. On the due date
  // weeksPregnant is already 40, which would read as week 41 below.
  if (dueDate < toLocalDateKey()) return { kind: 'past-term' };
  // weeksPregnant counts completed weeks; "week N" in the guide is one more.
  // Capped at 40 the way the signed-in hub caps it.
  const week = Math.min(weeksPregnant(lmp) + 1, PREGNANCY_TOTAL_WEEKS);
  return { kind: 'week', week };
}

export default function WeeklyGuideToolPage() {
  const theme = SERVICE_THEME.littlebloom;
  const [dueDate, setDueDate] = useState('');
  // The week the visitor stepped to. Cleared whenever the due date changes, so
  // a new date always opens on its own week.
  const [browsedWeek, setBrowsedWeek] = useState<number | null>(null);

  const position = positionOf(dueDate);
  const currentWeek = position?.kind === 'week' ? position.week : null;
  const fallbackWeek = position?.kind === 'past-term' ? PREGNANCY_TOTAL_WEEKS : 1;
  const week = browsedWeek ?? currentWeek ?? fallbackWeek;

  return (
    <BloomShell title="孕期每週指南" subtitle={theme.role}>
      <div className="space-y-6">
        <section className="panel space-y-4">
          <p className={`text-sm leading-relaxed ${theme.muted}`}>
            填預產期，看這一週寶寶與身體的變化、該注意的事，前後週都能翻。不用登入，日期不會被存下來。
          </p>
          <div>
            <label htmlFor="weekly-guide-due-date" className="block text-sm font-medium text-ink mb-1">
              預產期
            </label>
            <input
              id="weekly-guide-due-date"
              type="date"
              value={dueDate}
              onChange={(event) => {
                setDueDate(event.target.value);
                setBrowsedWeek(null);
              }}
              className="w-full min-h-tap px-4 py-3 bg-white border border-ink/15 rounded-2xl text-ink"
            />
          </div>
          {position?.kind === 'week' && (
            <p className={`text-sm font-medium ${theme.ink}`}>現在大約是懷孕第 {position.week} 週。</p>
          )}
          {position?.kind === 'too-early' && (
            <p role="status" className={`text-sm leading-relaxed ${theme.body}`}>
              這個預產期離現在超過 {PREGNANCY_TOTAL_WEEKS} 週，請確認日期。下面從第 1 週開始。
            </p>
          )}
          {position?.kind === 'past-term' && (
            <p role="status" className={`text-sm leading-relaxed ${theme.body}`}>
              這個預產期已經過了。37 至 42 週都屬正常生產期，請依產檢醫師的安排追蹤。下面是第{' '}
              {PREGNANCY_TOTAL_WEEKS} 週。
            </p>
          )}
        </section>

        {position && (
          <WeeklyGuide week={week} currentWeek={currentWeek} onWeekChange={setBrowsedWeek} />
        )}

        {position && (
          <p className="text-xs text-ink-muted leading-relaxed">
            週數由填入的預產期往回推算，實際狀況請以產檢醫師的評估為準。內容整理自國民健康署孕產兒關懷網站、孕媽咪衛教手冊等公開資料。
          </p>
        )}

        <ToolCallout
          title="每次打開就是這一週"
          body="登入後建立孕期檔案，週數自動跟著走，產檢做過的也能記下來。"
          cta="看孕期陪伴"
          signedInCta="打開孕期陪伴"
          page="littlebloom"
        />
      </div>
    </BloomShell>
  );
}
