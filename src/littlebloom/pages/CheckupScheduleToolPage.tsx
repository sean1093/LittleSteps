import { useMemo, useState } from 'react';
import BloomShell from '../components/BloomShell';
import ChoiceChips from '../../common/ui/ChoiceChips';
import ToolCallout from '../../common/tools/ToolCallout';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { prenatalCheckupSchedule, prenatalItemKindLabels } from '../data/prenatalCheckups';
import { lmpFromDueDate, resolvePrenatalItems, weeksPregnant } from '../utils/prenatalSchedule';
import { buildPrenatalIcs } from '../utils/prenatalCalendar';
import { downloadCalendar } from '../../common/utils/icsExport';
import { formatDate, toLocalDateKey } from '../../common/utils/dateHelpers';
import { logCalendarExport } from '../../lib/firebase';

/**
 * 產檢時程試算：填預產期或末次月經，列出每一次產檢與篩檢各在哪一週、哪幾天。
 * 不用登入，什麼都不存。
 *
 * 剛驗到懷孕的人最先想知道的就是這張表，而它原本在登入後面。和孕期陪伴的產檢
 * 時程用同一支計算，所以兩邊的日期不會不一樣；差別只在這裡不記「做了沒」。
 */
type Basis = 'due' | 'lmp';

const BASIS: { value: Basis; label: string }[] = [
  { value: 'due', label: '預產期' },
  { value: 'lmp', label: '最後一次月經' },
];

export default function CheckupScheduleToolPage() {
  const theme = SERVICE_THEME.littlebloom;
  const [basis, setBasis] = useState<Basis>('due');
  const [date, setDate] = useState('');

  const lastPeriodDate = date ? (basis === 'due' ? lmpFromDueDate(date) : date) : '';

  const items = useMemo(
    () => (lastPeriodDate ? resolvePrenatalItems(lastPeriodDate, prenatalCheckupSchedule, {}) : []),
    [lastPeriodDate],
  );

  const todayKey = toLocalDateKey();
  // 「還做得到的」看的是可執行區間的最後一天，不是建議日：建議日過了幾天，
  // 那一次產檢多半還能做。
  const ahead = items.filter((item) => item.windowEnd >= todayKey);
  const past = items.filter((item) => item.windowEnd < todayKey);
  const week = lastPeriodDate ? weeksPregnant(lastPeriodDate) : null;

  const exportAhead = () => {
    downloadCalendar(buildPrenatalIcs(ahead, { id: 'checkup-schedule-tool' }), '產檢時程.ics');
    logCalendarExport('prenatal');
  };

  return (
    <BloomShell title="產檢時程試算" subtitle={theme.role}>
      <div className="space-y-6">
        <section className="panel space-y-4">
          <p className={`text-sm leading-relaxed ${theme.muted}`}>
            填一個日期，列出每一次公費產檢與篩檢各在第幾週、哪幾天。不用登入，日期不會被存下來。
          </p>
          <ChoiceChips
            label="用哪一個日期算"
            value={basis}
            options={BASIS}
            onChange={setBasis}
            accent={`${theme.fill} ${theme.fillText}`}
          />
          <div>
            <label htmlFor="checkup-tool-date" className="block text-sm font-medium text-ink mb-1">
              {basis === 'due' ? '預產期' : '最後一次月經的第一天'}
            </label>
            <input
              id="checkup-tool-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="w-full min-h-tap px-4 py-3 bg-white border border-ink/15 rounded-2xl text-ink"
            />
          </div>
          {week !== null && week >= 0 && week <= 42 && (
            <p className={`text-sm font-medium ${theme.ink}`}>現在大約是懷孕第 {week} 週。</p>
          )}
        </section>

        {items.length > 0 && (
          <>
            <section className="space-y-3">
              <h2>接下來的（{ahead.length} 項）</h2>
              {ahead.length === 0 ? (
                <p className={`text-sm ${theme.muted}`}>這份時程上的項目，可執行的週數都已經過了。</p>
              ) : (
                <>
                  <ul className="space-y-3">
                    {ahead.map((item) => (
                      <li key={item.template.id} className="card">
                        <p className={`text-sm font-semibold ${theme.ink}`}>
                          第 {item.template.dueWeek} 週
                          <span className={`font-normal ${theme.muted}`}>
                            {' '}
                            · {formatDate(item.windowStart)} 至 {formatDate(item.windowEnd)}
                          </span>
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <h3 className="text-ink">{item.template.title}</h3>
                          <span className="tag bg-ink/5 text-ink-muted">
                            {prenatalItemKindLabels[item.template.kind]}
                          </span>
                        </div>
                        <p className="text-sm text-ink-muted leading-relaxed mt-1">
                          {item.template.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={exportAhead} className="btn-secondary w-full">
                    把這 {ahead.length} 項加到行事曆
                  </button>
                </>
              )}
            </section>

            {past.length > 0 && (
              <p className={`text-sm leading-relaxed ${theme.muted}`}>
                另有 {past.length} 項的建議週數已經過了。有沒有做過、需不需要補做，請問產檢醫師。
              </p>
            )}

            <p className="text-xs text-ink-muted leading-relaxed">
              週數依最後一次月經的第一天推算，實際時程請以產檢醫師安排為準。項目依衛生福利部國民健康署的孕婦產前檢查時程整理。
            </p>
          </>
        )}

        <ToolCallout
          title="做過的記下來，下一次產檢排在最上面"
          body="登入後記錄每次產檢的日期與院所，每一週的身體變化也先知道。"
          cta="看孕期陪伴"
          signedInCta="打開產檢時程"
          page="littlebloom/prenatal"
        />
      </div>
    </BloomShell>
  );
}
