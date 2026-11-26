import { useState } from 'react';
import BloomShell from '../components/BloomShell';
import WeeklyGuide from '../components/WeeklyGuide';
import ToolCallout from '../../common/tools/ToolCallout';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { PREGNANCY_TOTAL_WEEKS } from '../data/pregnancyGuides';
import {
  formatGestation,
  formatGuideWeek,
  lmpFromDueDate,
  pregnancyPosition,
} from '../utils/prenatalSchedule';

/**
 * The weekly pregnancy guide, public: enter a due date, read that week, step to
 * the week before or after.
 *
 * The week-by-week guide is what a pregnant visitor comes for, and it used to
 * exist only behind sign-in. This page reads `pregnancyGuides.ts` and nothing
 * else. The due date lives in component state and nowhere else: not in the
 * URL, not in `preferences.ts`, not in any storage.
 */

export default function WeeklyGuideToolPage() {
  const theme = SERVICE_THEME.littlebloom;
  const [dueDate, setDueDate] = useState('');
  // The week the visitor stepped to. Cleared whenever the due date changes, so
  // a new date always opens on its own week.
  const [browsedWeek, setBrowsedWeek] = useState<number | null>(null);

  // Where the due date puts the pregnancy today, from the helper the checkup
  // calculator and the signed-in hub read too, so all three say the same week.
  const position = dueDate ? pregnancyPosition(lmpFromDueDate(dueDate)) : null;
  const currentWeek = position?.status === 'in-term' ? position.guideWeek : null;
  const fallbackWeek = position?.status === 'past-term' ? PREGNANCY_TOTAL_WEEKS : 1;
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
          {position?.status === 'in-term' && (
            <p className={`text-sm font-medium ${theme.ink}`}>
              今天是{formatGestation(position)}，{formatGuideWeek(position)}。
            </p>
          )}
          {position?.status === 'too-early' && (
            <p role="status" className={`text-sm leading-relaxed ${theme.body}`}>
              這個預產期離現在超過 {PREGNANCY_TOTAL_WEEKS} 週，請確認日期。下面從第 1 週開始。
            </p>
          )}
          {position?.status === 'past-term' && (
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
