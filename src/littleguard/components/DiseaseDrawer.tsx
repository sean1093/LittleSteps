import ModalFrame from '../../common/components/ModalFrame';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import type { RadarCell, RadarData } from '../../types';
import { DISEASE_INFO } from '../data/diseases';
import { STATUS_COPY, formatRate, statusOf } from '../utils/radar';
import Sparkline from './Sparkline';

interface Props {
  disease: string;
  cell: RadarCell;
  data: RadarData;
  age: string;
  onClose: () => void;
}

/**
 * 一種病一個抽屜。
 *
 * 順序是刻意的：先說這個名字在資料裡是什麼、再給可以做的事、再給什麼情況要看
 * 醫生，數字放最後。反過來的話家長會先被數字嚇一跳，才知道自己能做什麼。
 *
 * 數字那一段一次給率、人次與分母。少了分母，「169.0/萬」跟「35 人次」都讀不
 * 出可信度——板上那一列只放得下率與人次，分母的落點就在這裡。
 *
 * 外層不再包捲動容器：ModalFrame 自己就是 AnimatePresence ＋ role="dialog"
 * ＋ max-h-[85vh] overflow-y-auto（ModalFrame.tsx:34-50），再包一層會出現
 * 兩個捲軸。
 */
export default function DiseaseDrawer({ disease, cell, data, age, onClose }: Props) {
  const info = DISEASE_INFO[disease];
  const copy = STATUS_COPY[statusOf(cell)];
  const national = data.national[age]?.[disease]?.rate ?? null;

  return (
    <ModalFrame isOpen onClose={onClose} title={disease}>
      <div className="space-y-5">
        <p className="text-sm text-ink-muted">{info.meaning}</p>

        <section>
          <h3 className="text-ink font-medium mb-2">可以做什麼</h3>
          <ul className="space-y-1.5 text-ink">
            {info.actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-ink font-medium mb-2">什麼情況要看醫生</h3>
          <p className="text-ink">{info.seeDoctor}</p>
        </section>

        <section>
          <h3 className="text-ink font-medium mb-2">最近 8 週</h3>
          {/* 折線用 currentColor，服務色從 serviceTheme 取，不寫死在元件裡。 */}
          <div className={SERVICE_THEME.littleguard.ink}>
            <Sparkline values={cell.spark} label={`${disease}最近 8 週的就診率變化`} />
          </div>
          <p className={`text-sm mt-1 ${copy.tone}`}>{copy.label}</p>
        </section>

        <dl className="text-sm text-ink-muted space-y-1">
          <div className="flex justify-between gap-3">
            <dt>這一週</dt>
            <dd className="tabular-nums">
              {formatRate(cell.rate)}（{cell.visits} 人次）
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>前 8 週中位數</dt>
            <dd className="tabular-nums">{formatRate(cell.trendBase)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>全國同一週</dt>
            <dd className="tabular-nums">{formatRate(national)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>統計基數</dt>
            <dd className="tabular-nums">{cell.denom.toLocaleString('zh-TW')} 次門診</dd>
          </div>
        </dl>

        {/* 「/萬」與「統計基數」都是統計用詞，不解釋的話上面那四行等於沒給。 */}
        <p className="text-sm text-ink-faint">
          「/萬」是每一萬次健保門診裡有幾次是這個病，統計基數就是那一週的門診總次數。
        </p>

        {cell.reliability !== 'ok' && (
          <p className="text-sm text-ink-faint">
            這個縣市的這個年齡層每週就診人數偏少，數字容易上下跳動，看趨勢就好。
          </p>
        )}

        <a href={info.sourceUrl} target="_blank" rel="noreferrer" className="btn-secondary w-full">
          疾管署的{disease}說明
        </a>
      </div>
    </ModalFrame>
  );
}
