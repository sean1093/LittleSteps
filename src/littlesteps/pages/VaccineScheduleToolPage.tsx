import { useMemo, useState } from 'react';
import { vaccineSchedules } from '../data/vaccines';
import { FUNDING_LABEL, buildVaccineIcs } from '../utils/vaccineCalendar';
import { schedulesStillAhead, vaccineDatesFor } from '../utils/vaccineTool';
import type { ResolvedVaccineDose } from '../utils/vaccineSchedule';
import { downloadCalendar } from '../../common/utils/icsExport';
import { formatDate } from '../../common/utils/dateHelpers';
import { logCalendarExport } from '../../lib/firebase';
import ToolCallout from '../../common/tools/ToolCallout';

/**
 * 疫苗時程試算：填生日，列出每一劑建議在哪一天打。不用登入，什麼都不存。
 *
 * 疫苗追蹤頁做的是同一件事再加上「打了沒」，但它在登入後面。「寶寶什麼時候
 * 該打哪一針」是每個新手家長都會查的問題，答案只需要一個生日——為了一個日期
 * 要先交出 Google 帳號，多數人會直接離開去別的地方查。
 *
 * 這一頁不知道哪幾劑已經打了，所以日期過了的只說「建議日期已過」，不說逾期。
 * 生日只留在這一頁的記憶體裡，重新整理就沒了；頁面上照實寫出來。
 */
function DoseRow({ dose, muted }: { dose: ResolvedVaccineDose; muted?: boolean }) {
  return (
    <li className="card">
      <p className={`text-sm font-semibold ${muted ? 'text-ink-muted' : 'text-primary-dark'}`}>
        {formatDate(dose.dueDate)}
        <span className="font-normal text-ink-muted"> · {dose.timing}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2 mt-1">
        <h3 className="text-ink">{dose.name}</h3>
        {/* 過了來源寫的接種年齡上限，就不能再標「公費」——那等於說還有一劑
            免費的可以打。 */}
        <span className="tag bg-ink/5 text-ink-muted">
          {dose.setAside === 'past-age-limit' ? '已超過接種年齡' : FUNDING_LABEL[dose.funding]}
        </span>
      </div>
      {dose.fundingChangesOn && dose.setAside !== 'past-age-limit' && (
        <p className="text-sm text-ink-muted leading-relaxed mt-1">
          {formatDate(dose.fundingChangesOn)}起付費方式調整，請以最新公告為準
        </p>
      )}
      {dose.eligibility && (
        <p className="text-sm text-ink-muted leading-relaxed mt-1">{dose.eligibility}</p>
      )}
    </li>
  );
}

export default function VaccineScheduleToolPage() {
  const [birthday, setBirthday] = useState('');

  const result = useMemo(
    () => (birthday ? vaccineDatesFor(birthday, vaccineSchedules) : null),
    [birthday],
  );

  const exportUpcoming = () => {
    if (!birthday) return;
    downloadCalendar(
      buildVaccineIcs(
        { id: 'vaccine-schedule-tool', name: '寶寶', birthday },
        schedulesStillAhead(birthday, vaccineSchedules),
        {},
      ),
      '寶寶疫苗時程.ics',
    );
    logCalendarExport('vaccine');
  };

  return (
    <div className="screen">
      <div className="screen-body space-y-6">
        <section className="panel space-y-3">
          <p className="text-sm text-ink-muted leading-relaxed">
            填寶寶的生日，列出每一劑疫苗建議在哪一天打。不用登入，生日不會被存下來。
          </p>
          <div>
            <label htmlFor="vaccine-tool-birthday" className="block text-sm font-medium text-ink mb-1">
              寶寶生日
            </label>
            <input
              id="vaccine-tool-birthday"
              type="date"
              value={birthday}
              onChange={(event) => setBirthday(event.target.value)}
              className="w-full min-h-tap px-4 py-3 bg-white border border-ink/15 rounded-2xl text-ink"
            />
            <p className="text-xs text-ink-muted mt-1">還沒出生的話，先填預產期也可以。</p>
          </div>
          {/* 結果畫在輸入框下面，報讀器不會知道它出現了。這一區一直都在，換了
              生日就把摘要讀一次；畫面上已經有同樣的標題，所以只給報讀器。 */}
          <p role="status" className="sr-only">
            {result &&
              `接下來要打的（${result.upcoming.length} 劑）${
                result.past.length > 0 ? `；建議日期已過的（${result.past.length} 劑）` : ''
              }`}
          </p>
        </section>

        {result && (
          <>
            <section className="space-y-3">
              <h2>接下來要打的（{result.upcoming.length} 劑）</h2>
              {result.upcoming.length === 0 ? (
                <p className="text-sm text-ink-muted">這份時程上的疫苗，建議日期都已經過了。</p>
              ) : (
                <>
                  <ul className="space-y-3">
                    {result.upcoming.map((dose) => (
                      <DoseRow key={`${dose.vaccineId}-${dose.doseNumber}`} dose={dose} />
                    ))}
                  </ul>
                  <button type="button" onClick={exportUpcoming} className="btn-secondary w-full">
                    把這 {result.upcoming.length} 劑加到行事曆
                  </button>
                </>
              )}
            </section>

            {result.past.length > 0 && (
              <section className="space-y-3">
                <h2>建議日期已過的（{result.past.length} 劑）</h2>
                <p className="text-sm text-ink-muted leading-relaxed">
                  這一頁不知道哪幾劑已經打過。請對照兒童健康手冊的接種紀錄；有漏打的，下次回診請醫師安排補打。
                </p>
                <ul className="space-y-3">
                  {result.past.map((dose) => (
                    <DoseRow key={`${dose.vaccineId}-${dose.doseNumber}`} dose={dose} muted />
                  ))}
                </ul>
              </section>
            )}

            <p className="text-xs text-ink-muted leading-relaxed">
              日期由生日加上建議月齡算出，實際接種時間請以醫師安排與兒童健康手冊為準。時程依衛生福利部疾病管制署的兒童預防接種時程與各疫苗簡介整理，含自費項目。
            </p>
          </>
        )}

        <ToolCallout
          title="打過的打勾，下一針自動排在最上面"
          body="登入後逐劑記錄接種日期，哪一劑快到了、哪一劑還沒打，一眼看得到。"
          cta="看寶寶成長"
          signedInCta="打開疫苗追蹤"
          page="littlesteps/vaccine-tracking"
        />
      </div>
    </div>
  );
}
