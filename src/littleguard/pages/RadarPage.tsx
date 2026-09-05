import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import AppBar from '../../common/ui/AppBar';
import AppHomeButton from '../../common/components/AppHomeButton';
import AccountButton from '../../common/components/AccountButton';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { stagger } from '../../common/ui/motion';
import { useCentreSelectedChip } from '../../common/ui/useCentreSelectedChip';
import { useOptionalChildStore } from '../../common/contexts/ChildStoreContext';
import { readPreferences, savePreferences } from '../../common/preferences';
import { isPregnancyProfile } from '../../common/pregnancy';
import { calculateAge } from '../../common/utils/dateHelpers';
import type { ChildProfile, RadarData } from '../../types';
import { DISEASE_PART_OF } from '../data/diseases';
import CountyPicker from '../components/CountyPicker';
import DiseaseDrawer from '../components/DiseaseDrawer';
import DiseaseRow from '../components/DiseaseRow';
import { AGE_LABEL, formatWeekRange, freshnessOf, summariseBoard } from '../utils/radar';

/** 沒記到上次選的縣市時的起點；台北市是最多人一眼認得的那個。 */
const DEFAULT_COUNTY = '台北市';

/** 同理，沒記錄、也推不出孩子年齡時的年齡層起點。 */
const DEFAULT_AGE = '0~2';

/** 年齡層字串的形狀，例如 `0~2`。掛在模組層，免得每次 render 重建一個。 */
const AGE_BAND_RANGE = /^(\d+)~(\d+)$/;

/**
 * 從生日推出年齡層。
 *
 * 年齡層怎麼切是上游資料自己講的，所以照它給的字串算，不在這裡寫死名單——上游
 * 哪天多切一段，家長的孩子照樣對得上。孕期檔案還沒有出生的孩子，不參與推論。
 *
 * 推出來的值只活在記憶體裡，不會寫進裝置：那是孩子的資料（見
 * common/preferences 的邊界說明）。
 */
function bandForChild(child: ChildProfile | undefined, bands: readonly string[]): string | null {
  if (!child || isPregnancyProfile(child)) return null;
  const years = Math.floor(calculateAge(child.birthday) / 12);
  return (
    bands.find((band) => {
      const range = AGE_BAND_RANGE.exec(band);
      return range !== null && years >= Number(range[1]) && years <= Number(range[2]);
    }) ?? null
  );
}

const NIDSS = 'https://nidss.cdc.gov.tw/';

/**
 * 標題列右側。另外五個服務都有這兩顆，這一頁漏了。
 *
 * 「所有服務」那顆是唯一回得去入口頁的路：入口頁是唯一列出六個服務的地方，
 * 而沒有任何子應用會連到自己的手足，所以少了它，家長只剩瀏覽器的上一頁可以
 * 離開這一頁。帳號那顆一起補——這一頁確實不讀孩子的資料，但登出與切換寶寶
 * 現在全靠各服務 AppBar 上的這顆（見 Sidebar.tsx 的註解），少一個服務就是
 * 少一個出口。
 */
const HeaderActions = () => (
  <>
    <AccountButton
      service="littleguard"
      className="bg-guard-light hover:bg-guard/40 text-guard-ink"
    />
    <AppHomeButton className="bg-guard-light hover:bg-guard/40 text-guard-ink" />
  </>
);

/**
 * 疫情雷達：一頁、板優先、免打字。
 *
 * 語氣是這一頁最重要的約束——它要讓家長多留意，不是讓家長緊張。所以：卡片順
 * 序固定（不把「變多」排到最前面，那會讓每次打開都像在看壞消息排行榜）、狀態
 * 是文字不是箭頭、顏色最強只到 butter-dark、資料過期就收起狀態而不是顯示一個
 * 可能已經錯的判斷。
 *
 * 不需要登入，板上的資料全部公開。唯一用到孩子的地方是年齡層的預設值：已登入
 * 且有寶寶檔案時照生日推，家長就不必每次自己點。那是記憶體裡的一次計算，不寫
 * 進裝置，也不影響任何一列的內容。
 */
export default function RadarPage() {
  const theme = SERVICE_THEME.littleguard;
  const [data, setData] = useState<RadarData | null>(null);
  const [failed, setFailed] = useState(false);
  // 上次選的縣市與年齡層。只讀一次：讀完之後，畫面上的選擇才是唯一的真相。
  const [stored] = useState(readPreferences);
  const [picked, setPicked] = useState<string | null>(stored.guardCounty);
  const [pickedAge, setPickedAge] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const currentChild = useOptionalChildStore()?.currentChild;

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
  // 「現在抓不到資料」——那個錯誤畫面救不了一個只是名字對不上的預設值。上次存
  // 的縣市走同一條路：對不上今天的資料就當沒存過。
  const chosen = picked !== null && counties.includes(picked) ? picked : null;
  const county = chosen ?? (counties.includes(DEFAULT_COUNTY) ? DEFAULT_COUNTY : (counties[0] ?? ''));

  /*
    年齡層的優先順序：這次點的 > 孩子的生日 > 上次點的 > 預設。

    生日贏過上次點的，因為孩子的年齡是更好的答案，而且它自己會變；這次點的又
    贏過生日，因為那是家長剛剛的動作。上次存的一樣要對得上今天的資料——對不上
    的話 cells 會是 undefined，整頁會變成「現在抓不到資料」。
  */
  const bands = data?.ageBands ?? [];
  const storedAge =
    stored.guardAgeBand !== null && bands.includes(stored.guardAgeBand) ? stored.guardAgeBand : null;
  const age = pickedAge ?? bandForChild(currentChild, bands) ?? storedAge ?? DEFAULT_AGE;

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

  /*
    選了就記起來，下次打開直接停在這裡——這一頁是每週的習慣，兩顆籌碼一年要點
    五十二次。只記家長自己點的：從生日推出來的年齡層是孩子的資料，不進裝置。
  */
  const chooseCounty = (next: string) => {
    setPicked(next);
    savePreferences({ guardCounty: next });
  };

  const chooseAge = (next: string) => {
    setPickedAge(next);
    savePreferences({ guardAgeBand: next });
  };

  if (failed || (data && !cells)) {
    return (
      <div className={`screen ${theme.pageBg}`}>
        <AppBar theme={theme} title={theme.name} subtitle={theme.role} actions={<HeaderActions />} />
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
      <AppBar theme={theme} title={theme.name} subtitle={theme.role} actions={<HeaderActions />} />
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

            <CountyPicker counties={counties} selected={county} onSelect={chooseCounty} />

            <section className="space-y-2">
              <h2 className="text-sm font-medium text-ink-muted">孩子的年齡</h2>
              {/* data-testid：這一列刻意橫向捲動，E2E 要單獨量它，而不是算成整頁的水平
                  溢出；捲動容器沒有角色也沒有可及名稱可選（docs/E2E_TEST_PLAN.md §6）。 */}
              <div
                ref={scrollerRef}
                data-testid="scroll-row-guard-age-bands"
                className="row-bleed flex gap-2 py-1"
              >
                {data.ageBands.map((band) => {
                  const isSelected = band === age;
                  return (
                    <button
                      key={band}
                      ref={isSelected ? selectedRef : undefined}
                      type="button"
                      onClick={() => chooseAge(band)}
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
