import { motion } from 'framer-motion';
import { goTo } from '../../common/navigate';
import { fadeInUp, tap } from '../../common/ui/motion';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import {
  DAILY_ACTIVITY,
  DAILY_ACTIVITY_SOURCE,
  OUTING_SOURCES,
  OUTING_STAGES,
  PLACE_TYPES,
  type OutingSourceId,
  type OutingStage,
  type OutingStageId,
  type PlaceAction,
} from '../data/outingStages';
import type { ParkFilter } from '../parks';
import type { StageGuess } from '../stageForChild';

interface StageGuideProps {
  stage: OutingStageId | null;
  onChooseStage: (stage: OutingStageId) => void;
  /** Opens one of the page's own registers. */
  onOpenRegister: (view: 'centre' | 'restaurant') => void;
  /** Opens the park list, narrowed to what the stage asks of a park. */
  onOpenParks: (filter: ParkFilter) => void;
  /**
   * Set when the stage on screen was preselected from a child's records and
   * the parent has not chosen one themselves. The page says which it was.
   */
  guess?: { childName: string; basis: StageGuess['basis'] };
}

/**
 * The recommendation view: one question, then where to go.
 *
 * The question comes first and stays on screen. The stage chips wrap rather
 * than scroll — five short labels fit in two rows at 320px, and a choice
 * hidden off the edge of a scrolling row is a choice a parent does not know
 * they have.
 *
 * Under it the page answers in the order a parent decides: what the child
 * needs, where to get it, how long to stay, what to watch for. Sources sit at
 * the end with the date each was read, and each health sentence names the one
 * it rests on.
 */
export default function StageGuide({
  stage,
  onChooseStage,
  onOpenRegister,
  onOpenParks,
  guess,
}: StageGuideProps) {
  const theme = SERVICE_THEME.littleouting;
  const current = OUTING_STAGES.find((entry) => entry.id === stage);

  return (
    <div className="space-y-5">
      {/* A panel, so the question reads as its own block: bare, these chips sat
          directly under the tab chips and the two rows looked like one. */}
      <section className="panel space-y-3">
        <div>
          <h2 className="text-ink">孩子現在會什麼？</h2>
          <p className="text-sm text-ink-muted mt-1">
            {guess
              ? guess.basis === 'records'
                ? `依${guess.childName}已經勾選的紀錄先選了一格，可以自己改。`
                : `依${guess.childName}的月齡先選了一格，可以自己改。`
              : '適合去哪裡，看的是孩子怎麼移動，不是幾個月大。'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {OUTING_STAGES.map((entry) => {
            const isSelected = entry.id === stage;
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => onChooseStage(entry.id)}
                aria-pressed={isSelected}
                className={`chip ${
                  isSelected ? `chip-on ${theme.fill} ${theme.fillText} border-transparent` : ''
                }`}
              >
                {entry.label}
              </button>
            );
          })}
        </div>
      </section>

      {current ? (
        <StageAnswer
          key={current.id}
          stage={current}
          onOpenRegister={onOpenRegister}
          onOpenParks={onOpenParks}
        />
      ) : (
        <p className="text-sm text-ink-muted leading-relaxed px-1">
          選一格，下面會列出這個階段適合去的地方、可以待多久，以及要注意什麼。
        </p>
      )}

      <section className="panel space-y-2">
        <h2 className="text-ink">孩子每天需要的活動量</h2>
        <p className="text-sm text-ink-muted leading-relaxed">
          常說的「放電」指的就是這個。活動是每天的需要，像睡覺和吃飯；還不會走的孩子也一樣。
        </p>
        <dl className="space-y-2 text-sm">
          {DAILY_ACTIVITY.map((row) => (
            <div key={row.age}>
              <dt className="font-semibold text-ink">{row.age}</dt>
              <dd className="text-ink-muted leading-relaxed">{row.amount}</dd>
            </div>
          ))}
        </dl>
        <Cited sources={[DAILY_ACTIVITY_SOURCE]} />
      </section>

      <p className="text-xs text-ink-faint leading-relaxed">
        這裡的階段只用來挑場地，不是發展評估，每個孩子的進度不同；早產兒請用矯正年齡看。孩子有慢性病，或正在接受早期療育，外出的場地與活動量請先問兒科醫師或治療師。內容整理自公開資料，不是醫療建議。
      </p>
    </div>
  );
}

function StageAnswer({
  stage,
  onOpenRegister,
  onOpenParks,
}: {
  stage: OutingStage;
  onOpenRegister: (view: 'centre' | 'restaurant') => void;
  onOpenParks: (filter: ParkFilter) => void;
}) {
  const theme = SERVICE_THEME.littleouting;
  const leavesApp = stage.places.some((place) => PLACE_TYPES[place.type].action.kind === 'map');
  const cited = [
    ...new Set([
      ...stage.needs.sources,
      ...stage.pacing.sources,
      ...stage.safety.flatMap((item) => item.sources),
    ]),
  ];

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-5">
      <section className={`panel ${theme.tint} space-y-2`}>
        <div className="flex items-baseline gap-2 flex-wrap">
          <h2 className={theme.ink}>{stage.label}</h2>
          <span className="text-xs text-ink-muted">{stage.typicalAge}</span>
        </div>
        <p className="text-sm text-ink-muted">{stage.criterion}</p>
        <p className="text-ink leading-relaxed">{stage.needs.text}</p>
        <Cited sources={stage.needs.sources} />
      </section>

      <section className="space-y-3">
        <h2 className="text-ink">適合去的地方</h2>
        <ol className="space-y-3">
          {stage.places.map((place) => {
            const type = PLACE_TYPES[place.type];
            return (
              <li key={place.type} className="card">
                <h3 className="text-ink">{type.label}</h3>
                <p className="text-sm text-ink-muted leading-relaxed mt-1">{place.why}</p>
                <PlaceLink
                  action={type.action}
                  onOpenRegister={onOpenRegister}
                  onOpenParks={onOpenParks}
                />
              </li>
            );
          })}
        </ol>
        {leavesApp && (
          <p className="text-xs text-ink-faint leading-relaxed">
            圖書館和動物園這裡沒有資料，所以連到地圖搜尋。搜到的結果不是我們查證過的名單。
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-ink">待多久</h2>
        <div className="card">
          <p className="text-sm text-ink leading-relaxed">{stage.pacing.text}</p>
          <Cited sources={stage.pacing.sources} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-ink">這個階段要注意</h2>
        <ul className="space-y-3">
          {stage.safety.map((item) => (
            <li key={item.text} className="card">
              <p className="text-sm text-ink leading-relaxed">{item.text}</p>
              <Cited sources={item.sources} />
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => {
            goTo('littleguard');
          }}
          className={`btn-ghost -ml-4 text-sm ${theme.ink}`}
        >
          看你住的縣市的腸病毒門診人次
        </button>
      </section>

      <section className="space-y-2">
        <h2 className="text-ink">出處</h2>
        <ul className="space-y-2">
          {cited.map((id) => {
            const source = OUTING_SOURCES[id];
            return (
              <li key={id} className="text-sm">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center min-h-tap font-medium underline underline-offset-2 ${theme.ink}`}
                >
                  {source.title}
                </a>
                <p className="text-xs text-ink-faint">
                  {source.publisher} · 查證於 {source.verifiedOn}
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </motion.div>
  );
}

/** Which source a sentence rests on, by short name. Nothing when it has none. */
function Cited({ sources }: { sources: OutingSourceId[] }) {
  if (sources.length === 0) return null;
  return (
    <p className="text-xs text-ink-faint mt-1">
      出處：{sources.map((id) => OUTING_SOURCES[id].short).join('、')}
    </p>
  );
}

function PlaceLink({
  action,
  onOpenRegister,
  onOpenParks,
}: {
  action: PlaceAction;
  onOpenRegister: (view: 'centre' | 'restaurant') => void;
  onOpenParks: (filter: ParkFilter) => void;
}) {
  const className = 'btn-secondary w-full mt-3 text-sm';

  if (action.kind === 'map') {
    return (
      <motion.a
        whileTap={tap}
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(action.query)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {action.label}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      whileTap={tap}
      onClick={() => {
        if (action.kind === 'register') onOpenRegister(action.view);
        else if (action.kind === 'parks') onOpenParks(action.filter);
        else goTo(action.page);
      }}
      className={className}
    >
      {action.label}
    </motion.button>
  );
}
