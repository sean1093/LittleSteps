import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import AppBar from '../../common/ui/AppBar';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { stagger } from '../../common/ui/motion';
import { useCentreSelectedChip } from '../../common/ui/useCentreSelectedChip';
import type { RadarData } from '../../types';
import { DISEASE_PART_OF } from '../data/diseases';
import CountyPicker from '../components/CountyPicker';
import DiseaseDrawer from '../components/DiseaseDrawer';
import DiseaseRow from '../components/DiseaseRow';
import { AGE_LABEL, formatWeekRange, freshnessOf, summariseBoard } from '../utils/radar';

/** 全 repo 沒有偏好持久化機制，總得有個起點；台北市是最多人一眼認得的那個。 */
const DEFAULT_COUNTY = '台北市';

const NIDSS = 'https://nidss.cdc.gov.tw/';

/**
 * 疫情雷達：一頁、板優先、免打字。
 *
 * 語氣是這一頁最重要的約束——它要讓家長多留意，不是讓家長緊張。所以：卡片順
 * 序固定（不把「變多」排到最前面，那會讓每次打開都像在看壞消息排行榜）、狀態
 * 是文字不是箭頭、顏色最強只到 butter-dark、資料過期就收起狀態而不是顯示一個
 * 可能已經錯的判斷。
 *
 * 純公開資料：這一頁不讀任何孩子的資料，也不需要登入。
 */
export default function RadarPage() {
  const theme = SERVICE_THEME.littleguard;
  const [data, setData] = useState<RadarData | null>(null);
  const [failed, setFailed] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [age, setAge] = useState('0~2');
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/diseaseRadar.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<RadarData>;
      })
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  const counties = useMemo(() => (data ? Object.keys(data.counties) : []), [data]);
  // 上游哪天把「台北市」寫成「臺北市」，家長該看到的是別的縣市的板，不是一片
  // 「現在抓不到資料」——那個錯誤畫面救不了一個只是名字對不上的預設值。
  const county = picked ?? (counties.includes(DEFAULT_COUNTY) ? DEFAULT_COUNTY : (counties[0] ?? ''));
  const { scrollerRef, selectedRef } = useCentreSelectedChip(age);

  const freshness = data ? freshnessOf(data.weekEnd) : 'fresh';
  const cells = data?.counties[county]?.[age];

  /**
   * 板上有哪幾列由資料自己決定：上游把腸病毒與它的兩種表現各給一支 CSV，三列
   * 並排等於把同一批就診人次數了三次，所以「是別人的一部分」的那幾種不自成一
   * 列，改掛在自己那一列底下。這裡不寫死名單——上游哪天多一種病，它自己就會
   * 出現在板上。
   */
  const board = useMemo(() => {
    if (!data || !cells) return [];
    return data.diseases
      .filter((disease) => !(disease in DISEASE_PART_OF))
      .map((disease) => ({
        disease,
        cell: cells[disease],
        parts: data.diseases
          .filter((part) => DISEASE_PART_OF[part] === disease)
          .map((part) => ({ disease: part, cell: cells[part] })),
      }));
  }, [data, cells]);

  if (failed || (data && !cells)) {
    return (
      <div className={`screen ${theme.pageBg}`}>
        <AppBar theme={theme} title={theme.name} subtitle={theme.role} />
        <div className="screen-body">
          <EmptyState
            theme={theme}
            title="現在抓不到資料"
            description="可以先看疾管署的傳染病統計查詢系統。"
            action={{
              label: '前往疾管署',
              onClick: () => window.open(NIDSS, '_blank', 'noreferrer'),
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`screen ${theme.pageBg}`}>
      <AppBar theme={theme} title={theme.name} subtitle={theme.role} />
      <div className="screen-body space-y-4">
        <p className="text-sm text-ink-muted">
          {data
            ? `${formatWeekRange(data.weekStart, data.weekEnd)} · 疾管署健保門診就診統計`
            : '載入中'}
        </p>

        {freshness === 'stale' && data && (
          <p className={`panel text-sm ${theme.body}`}>
            這份資料有點舊了，最新一週是 {formatWeekRange(data.weekStart, data.weekEnd)}。
          </p>
        )}
        {freshness === 'expired' && (
          <p className={`panel text-sm ${theme.body}`}>
            這份資料超過一個月沒更新，最新情況請看{' '}
            <a href={NIDSS} className={theme.ink} target="_blank" rel="noreferrer">
              疾管署
            </a>
            。
          </p>
        )}

        {data && cells && (
          <>
            {/* 一頁裡唯一的說明書。圖示會落在標題旁邊當裝飾，所以這裡不放。 */}
            <section className="panel space-y-2">
              <h2>怎麼看這個板</h2>
              <p className="text-sm text-ink-muted">
                這裡是全台健保門診的就診統計。選你住的縣市和孩子的年齡，每一列會說這個病最近比前
                8 週多還是少。
              </p>
              <p className="text-sm text-ink-muted">
                它是用來提醒你這幾週多留意的，不是確診數，也不能用來判斷孩子生病了。點一列可以看平常能做什麼、什麼情況要看醫生。身體不舒服請看醫生。
              </p>
            </section>

            <CountyPicker counties={counties} selected={county} onSelect={setPicked} />

            <section className="space-y-2">
              <h2 className="text-sm font-medium text-ink-muted">孩子的年齡</h2>
              <div ref={scrollerRef} className="row-bleed flex gap-2 py-1">
                {data.ageBands.map((band) => {
                  const isSelected = band === age;
                  return (
                    <button
                      key={band}
                      ref={isSelected ? selectedRef : undefined}
                      type="button"
                      onClick={() => setAge(band)}
                      aria-pressed={isSelected}
                      // 同 CountyPicker：蓋掉 .chip-on 的珊瑚紅，換服務自己的靖藍。
                      className={`chip shrink-0 ${
                        isSelected
                          ? `chip-on ${theme.fill} ${theme.fillText} border-transparent`
                          : ''
                      }`}
                    >
                      {AGE_LABEL[band] ?? band}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 每週打開的人要的是一句話。過期的資料撐不起這句話，就不給。 */}
            {freshness !== 'expired' && (
              <p className="panel text-ink font-medium">{summariseBoard(board)}</p>
            )}

            <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-2">
              {board.map((row) => (
                <DiseaseRow
                  key={row.disease}
                  disease={row.disease}
                  cell={row.cell}
                  parts={row.parts}
                  showStatus={freshness !== 'expired'}
                  onOpen={() => setOpen(row.disease)}
                />
              ))}
            </motion.div>

            <p className="text-sm text-ink-faint">
              右邊的人次是這一週該縣市、該年齡層的健保門診就診次數。
            </p>
          </>
        )}
      </div>
      {open && cells && data && (
        <DiseaseDrawer
          disease={open}
          cell={cells[open]}
          parts={board.find((row) => row.disease === open)?.parts}
          data={data}
          county={county}
          age={age}
          showStatus={freshness !== 'expired'}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}
