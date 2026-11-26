import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Gender, MeasurementType } from '../../types';
import ChoiceChips from '../../common/ui/ChoiceChips';
import ToolCallout from '../../common/tools/ToolCallout';
import { GESTATIONAL_AGE_RANGE, TERM_WEEKS } from '../../common/correctedAge';
import {
  GROWTH_TOOL_MAX_MONTHS,
  growthPercentiles,
  type GrowthToolResult,
} from '../utils/growthTool';

/**
 * 生長百分位試算：性別、月齡、量到的數字，算出 WHO 生長標準的百分位。
 * 不用登入，什麼都不存。
 *
 * 健檢量完，家長想知道的是「這個數字算高還是矮」。登入後的成長曲線圖答得更好
 * ——它看的是趨勢——但只想查一次的人不會為此註冊。
 *
 * 這一頁最重要的不是算出來的數字，而是數字下面那幾句話：一次的百分位不是分數，
 * 第 10 和第 90 一樣可以是健康的。少了這句，這個工具只是在製造焦慮。
 */
const GENDERS: { value: Gender; label: string }[] = [
  { value: 'female', label: '女生' },
  { value: 'male', label: '男生' },
];

const FIELDS: { type: MeasurementType; label: string; unit: string }[] = [
  { type: 'weight', label: '體重', unit: '公斤' },
  { type: 'height', label: '身高（身長）', unit: '公分' },
  { type: 'headCircumference', label: '頭圍', unit: '公分' },
];

const LABEL: Record<MeasurementType, string> = {
  weight: '體重',
  height: '身高',
  headCircumference: '頭圍',
};

const ERROR: Record<Exclude<GrowthToolResult, { ok: true }>['reason'], string> = {
  age: `月齡請填 0 到 ${GROWTH_TOOL_MAX_MONTHS} 之間的數字。這份 WHO 標準涵蓋到滿 3 歲。`,
  weeks: `出生週數請填 ${GESTATIONAL_AGE_RANGE.minWeeks} 到 ${GESTATIONAL_AGE_RANGE.maxWeeks} 之間的整數；不確定可以留白。`,
  'before-term':
    '換算成矯正月齡後，寶寶還沒到預產期。這份世界衛生組織的標準從足月出生開始，還不適用；請以醫院的早產兒生長曲線為準。',
  'no-measurement': '體重、身高、頭圍至少填一項。',
  implausible: '這個數字看起來不像這個年齡會量到的，請確認單位：體重是公斤，身高與頭圍是公分。',
};

const INPUT = 'w-full min-h-tap px-4 py-3 bg-white border border-ink/15 rounded-2xl text-ink';

export default function GrowthPercentileToolPage() {
  const [gender, setGender] = useState<Gender>('female');
  const [ageMonths, setAgeMonths] = useState('');
  const [weeks, setWeeks] = useState('');
  const [values, setValues] = useState<Record<MeasurementType, string>>({
    weight: '',
    height: '',
    headCircumference: '',
  });
  const [result, setResult] = useState<GrowthToolResult | null>(null);
  // 送出後結果畫在按鈕下面、常在螢幕外；手機鍵盤開著時看起來像什麼都沒發生，
  // 報讀器也停在按鈕上。所以送出成功後把焦點與畫面帶到結果的標題。
  // 只在送出時這麼做：每次送出換一個號碼，effect 只認號碼，不認輸入。
  const [submission, setSubmission] = useState(0);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (submission === 0) return;
    const heading = resultHeadingRef.current;
    if (!heading) return;
    heading.focus({ preventScroll: true });
    // 不用 behavior: 'smooth'：明寫的話會蓋過減少動態效果的偏好，而直接跳到
    // 結果本來就是這裡要的。
    heading.scrollIntoView?.({ block: 'start' });
  }, [submission]);

  const number = (text: string) => (text.trim() === '' ? undefined : Number(text));

  const calculate = (event: FormEvent) => {
    event.preventDefault();
    setResult(
      growthPercentiles({
        gender,
        ageMonths: ageMonths.trim() === '' ? Number.NaN : Number(ageMonths),
        gestationalWeeks: number(weeks),
        weight: number(values.weight),
        height: number(values.height),
        headCircumference: number(values.headCircumference),
      }),
    );
    setSubmission((count) => count + 1);
  };

  return (
    <div className="screen">
      <div className="screen-body space-y-6">
        {/* noValidate：超出範圍時要顯示的是下面那幾句說明該怎麼填的話，不是瀏覽器
            自己跳出來、每家長得不一樣的小泡泡。 */}
        <form onSubmit={calculate} noValidate className="panel space-y-4">
          <p className="text-sm text-ink-muted leading-relaxed">
            填健檢量到的數字，對照世界衛生組織的兒童生長標準。不用登入，填的數字不會被存下來。
          </p>

          <ChoiceChips label="性別" value={gender} options={GENDERS} onChange={setGender} />

          <div>
            <label htmlFor="growth-tool-age" className="block text-sm font-medium text-ink mb-1">
              月齡（滿幾個月）
            </label>
            <input
              id="growth-tool-age"
              type="number"
              inputMode="numeric"
              min={0}
              max={GROWTH_TOOL_MAX_MONTHS}
              step={1}
              value={ageMonths}
              onChange={(event) => setAgeMonths(event.target.value)}
              className={INPUT}
            />
          </div>

          {/* 原本只有一行小字請早產兒家長自己算矯正月齡。32 週出生、7 個月大的
              寶寶照實際月齡填，三項都會落在曲線最外側——正是 correctedAge.ts
              要避免的假警報。換算交給同一套規則，家長只要填出生週數。 */}
          <div>
            <label htmlFor="growth-tool-weeks" className="block text-sm font-medium text-ink mb-1">
              出生週數（選填）
            </label>
            <input
              id="growth-tool-weeks"
              type="number"
              inputMode="numeric"
              min={GESTATIONAL_AGE_RANGE.minWeeks}
              max={GESTATIONAL_AGE_RANGE.maxWeeks}
              step={1}
              value={weeks}
              onChange={(event) => setWeeks(event.target.value)}
              className={INPUT}
            />
            <p className="text-xs text-ink-muted mt-1">
              早產（未滿 {TERM_WEEKS} 週）的寶寶，2 歲前會自動換算成矯正月齡再對照。
            </p>
          </div>

          {FIELDS.map(({ type, label, unit }) => (
            <div key={type}>
              <label
                htmlFor={`growth-tool-${type}`}
                className="block text-sm font-medium text-ink mb-1"
              >
                {label}（{unit}）
              </label>
              <input
                id={`growth-tool-${type}`}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={values[type]}
                onChange={(event) => setValues({ ...values, [type]: event.target.value })}
                className={INPUT}
              />
            </div>
          ))}

          <button type="submit" className="btn-primary w-full">
            算百分位
          </button>

          {result && !result.ok && (
            <p role="alert" className="text-sm text-primary-dark">
              {ERROR[result.reason]}
            </p>
          )}
        </form>

        {result?.ok && (
          <section aria-labelledby="growth-tool-result" className="space-y-3">
            <h2
              id="growth-tool-result"
              ref={resultHeadingRef}
              tabIndex={-1}
              className="scroll-mt-20 focus:outline-none"
            >
              計算結果
            </h2>
            {result.corrected && (
              <p className="text-sm text-ink leading-relaxed">
                依矯正月齡約 {Math.round(result.ageMonths)} 個月對照（實際 {result.givenMonths} 個月）。
              </p>
            )}
            <ul className="space-y-3">
              {result.readings.map((reading) => (
                <li key={reading.type} className="card">
                  <h3 className="text-ink">{LABEL[reading.type]}</h3>
                  {/* 一個顏色。百分位不是成績，高低都不該讀起來像好壞。 */}
                  <p className="text-2xl font-bold text-ink tabular-nums mt-1">
                    第 {reading.percentile} 百分位
                  </p>
                  <p className="text-sm text-ink-muted leading-relaxed mt-1">
                    每 100 個同年齡、同性別的孩子裡，大約有 {reading.percentile} 個的
                    {LABEL[reading.type]}比這個數字小。
                  </p>
                  {reading.outsideOuterLines && (
                    <p className="text-sm text-ink leading-relaxed mt-1">
                      這個數字落在兒童健康手冊曲線圖最外側的線之外。單看一次不代表有問題，下次健檢請醫師看看。
                    </p>
                  )}
                </li>
              ))}
            </ul>

            {/* 來源（2026-11-26 查證）：American Academy of Pediatrics「Growth Charts: By the Numbers」
                https://www.healthychildren.org/English/health-issues/conditions/Glands-Growth-Disorders/Pages/Growth-Charts-By-the-Numbers.aspx
                "it's really no better or worse than coming in at the 90th… It is the rate and
                trend in your child's growth that is important"。 */}
            <p className="panel text-sm text-ink leading-relaxed">
              百分位不是分數，第 10 和第 90 一樣可以是健康的。重點是孩子沿著自己的那條曲線長；單一次的數字說明不了趨勢，有疑問請在兒童健檢時和醫師討論。
            </p>

            <p className="text-xs text-ink-muted leading-relaxed">
              依世界衛生組織 Child Growth Standards（2006）計算，適用 0 到 3 歲。這不是診斷。
            </p>
          </section>
        )}

        <ToolCallout
          title="一次的數字看不出趨勢"
          body="登入後把每次量到的身高體重記下來，畫成孩子自己的成長曲線。"
          cta="看寶寶成長"
          signedInCta="打開成長曲線圖"
          page="littlesteps/growth-charts"
        />
      </div>
    </div>
  );
}
