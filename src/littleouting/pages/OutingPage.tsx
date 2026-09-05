import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import type { Venue, VenueKind } from '../../types';
import AppBar from '../../common/ui/AppBar';
import AppHomeButton from '../../common/components/AppHomeButton';
import AccountButton from '../../common/components/AccountButton';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { fadeInUp, stagger, tap } from '../../common/ui/motion';
import { useCentreSelectedChip } from '../../common/ui/useCentreSelectedChip';
import { readPreferences, savePreferences } from '../../common/preferences';
import { CENTRE_ACCESS, CENTRE_ACCESS_UNVERIFIED, CENTRE_DATA_ATTRIBUTION } from '../data/centreAccess';
import { restaurants } from '../data/restaurants';
import { outingChecklist } from '../data/outingChecklist';
import VenueCard from '../components/VenueCard';

/** 縣市排序：六都在前，其餘依館數多寡，離島最後——和家長心裡的順序一致。 */
const CITY_ORDER = [
  '臺北市', '新北市', '桃園市', '臺中市', '臺南市', '高雄市',
  '基隆市', '新竹市', '新竹縣', '苗栗縣', '彰化縣', '南投縣',
  '雲林縣', '嘉義市', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
  '臺東縣', '澎湖縣', '金門縣', '連江縣',
];

/**
 * 一次最多畫幾張卡。全部縣市有 247 處，全畫出來手機會卡，而且家長也不會
 * 一路滑到底——超過就提示縮小範圍，比無限長的清單有用。
 */
const MAX_RENDERED = 30;

type View = VenueKind | 'checklist';

const VIEWS: { id: View; label: string }[] = [
  { id: 'centre', label: '親子館' },
  { id: 'restaurant', label: '親子餐廳' },
  { id: 'checklist', label: '出發前' },
];

/** 縣市籌碼裡的「全部縣市」。 */
const ALL_CITIES = 'all';

/**
 * 親子好去處：找地方帶孩子出門。
 *
 * 兩種資料刻意分開呈現，因為來源的可信度差很多：
 *
 *   親子館是衛福部社家署的全國名冊，234 間齊全、可重新產生、有授權可標示。
 *   親子餐廳沒有任何官方名單，也沒有任何認證制度——觀光署的全國餐廳資料裡
 *   雖然有「Kids Friendly」這個欄位，實測 3,632 筆全是空的。所以餐廳那一頁
 *   是 12 家逐家查證過的精選，明講不是完整名單，不能用名冊的口氣呈現。
 *
 * 沒有地圖，也沒有「找最近的」。任何官方親子館資料都沒有經緯度，而本專案
 * 早先實測過免費地理編碼服務對台灣門牌的準確度（中位數誤差 830 公尺、p75
 * 7.2 公里），結論是不可用。與其畫一張位置錯的地圖，不如老實用縣市瀏覽。
 *
 * 第三頁是出發前檢查清單。它不會過期，而清單上每一項都對應一種「白跑一趟」。
 */
export default function OutingPage() {
  const theme = SERVICE_THEME.littleouting;
  /* 上次停在哪一頁、篩到哪個縣市。只讀一次；搜尋字串刻意不記，那是一次性的
     問句，不是「我家在哪」。分頁 id 對不上今天的 VIEWS 就當沒存過。 */
  const [stored] = useState(readPreferences);
  const [view, setView] = useState<View>(
    () => VIEWS.find((entry) => entry.id === stored.outingTab)?.id ?? 'centre',
  );
  const [pickedCity, setPickedCity] = useState<string>(stored.outingCity ?? ALL_CITIES);
  const [query, setQuery] = useState('');
  const [centres, setCentres] = useState<Venue[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  /* 名冊還在路上時，畫面不能先講「共 0 處 / 找不到符合的場地」——那是在回答
     一個還沒問完的問題。 */
  const [loading, setLoading] = useState(true);

  // 名冊約 118 KB，和哺乳室資料一樣放靜態 JSON，不進 JS bundle。
  useEffect(() => {
    let active = true;
    fetch(`${import.meta.env.BASE_URL}data/familyCentres.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Venue[]>;
      })
      .then((rows) => {
        if (active) setCentres(rows);
      })
      .catch((error) => {
        console.error('親子館資料載入失敗:', error);
        if (active) setLoadFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const source = view === 'restaurant' ? restaurants : centres;

  const cities = useMemo(() => {
    const present = new Set(source.map((v) => v.city));
    return CITY_ORDER.filter((c) => present.has(c));
  }, [source]);

  /* 記著的縣市不一定還在這一頁的名冊裡（餐廳只有 6 個縣市有，上游也可能改
     字），名冊還在路上時更是一顆籌碼都還沒有。畫面上被選中的縣市一律只能是
     籌碼列上真的有的那幾個，其餘當「全部縣市」——否則家長會拿到一份被篩過的
     清單，卻找不到任何一顆看起來被選中的籌碼。 */
  const city = cities.includes(pickedCity) ? pickedCity : ALL_CITIES;

  /* 記著的縣市在 22 顆籌碼裡多半不是第一顆，重新整理之後它會落在畫面外——家長
     看到一份被篩過的清單，卻沒有一顆籌碼看起來被選中。和 LittleGuard 的縣市列
     用同一個 hook 把它捲進來。 */
  const { scrollerRef, selectedRef } = useCentreSelectedChip(city);

  const visible = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return source.filter((venue) => {
      if (city !== ALL_CITIES && venue.city !== city) return false;
      if (keyword === '') return true;
      // 家長記得的常常是路名或區名，不是館名，所以地址也要搜。
      return (
        venue.name.toLowerCase().includes(keyword) ||
        venue.address.toLowerCase().includes(keyword) ||
        venue.district.includes(keyword)
      );
    });
  }, [source, city, query]);

  const centresLoading = view === 'centre' && loading;

  const access = city !== ALL_CITIES ? CENTRE_ACCESS[city] : undefined;

  /* 選了就記起來，下次打開直接是這裡。 */
  const chooseView = (next: View) => {
    setView(next);
    setQuery('');
    // 縣市也要跟著回「全部縣市」：餐廳只有 6 個縣市有，留著親子館那邊選的縣
    // 市，22 縣市裡有 16 個會得到一張空清單，而餐廳這一頁連那顆被選中的縣市
    // 籌碼都畫不出來，家長看不到自己在篩什麼。
    setPickedCity(ALL_CITIES);
    savePreferences({ outingTab: next, outingCity: ALL_CITIES });
  };

  const chooseCity = (next: string) => {
    setPickedCity(next);
    savePreferences({ outingCity: next });
  };

  return (
    <div className={`min-h-dscreen ${theme.pageBg}`}>
      <AppBar
        theme={theme}
        title={theme.name}
        subtitle={theme.role}
        actions={
          <>
            <AccountButton service="littleouting" className="bg-outing-light hover:bg-outing/40 text-outing-ink" />
            <AppHomeButton className="bg-outing-light hover:bg-outing/40 text-outing-ink" />
          </>
        }
      />

      <main className="screen-body space-y-4">
        {/* 三個分頁：兩種場地 + 不會過期的檢查清單 */}
        <div className="flex gap-2">
          {VIEWS.map(({ id, label }) => (
            <motion.button
              key={id}
              type="button"
              whileTap={tap}
              onClick={() => chooseView(id)}
              aria-pressed={view === id}
              className={`chip flex-1 justify-center ${
                view === id ? `chip-on ${theme.fill} ${theme.fillText} border-transparent` : ''
              }`}
            >
              {label}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {view === 'checklist' ? (
            <motion.div key="checklist" variants={fadeInUp} initial="hidden" animate="visible" className="space-y-3">
              <p className="text-sm text-ink-muted leading-relaxed">
                帶孩子出門白跑一趟，多半不是因為運氣差，而是其中一項沒先問。
                出門前花兩分鐘對一遍。
              </p>
              {outingChecklist.map((item) => (
                <div key={item.id} className="card">
                  <h3 className="text-ink mb-1">{item.question}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{item.why}</p>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div key={view} variants={fadeInUp} initial="hidden" animate="visible" className="space-y-4">
              {view === 'restaurant' && (
                <div className={`panel ${theme.tint}`}>
                  <h2 className={`mb-1 ${theme.ink}`}>這是精選，不是完整名單</h2>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    全台沒有官方的親子餐廳名單，也沒有任何認證制度，所以這裡是
                    {restaurants.length} 家逐家查證過的餐廳。餐廳會改時間、改低消、也會倒，
                    每張卡片都標了查證日期，出發前請再確認一次。
                  </p>
                </div>
              )}

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={view === 'centre' ? '搜尋館名、地址或區域' : '搜尋餐廳、地址或區域'}
                  aria-label={view === 'centre' ? '搜尋親子館' : '搜尋親子餐廳'}
                  className="w-full min-h-tap pl-11 pr-14 py-3 bg-white rounded-2xl shadow-soft text-sm text-ink placeholder-ink-faint [&::-webkit-search-cancel-button]:appearance-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="清除搜尋"
                    className="btn-icon absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* data-testid：這一列刻意橫向捲動，E2E 要單獨量它，而不是算成整頁的水平
                  溢出；捲動容器沒有角色也沒有可及名稱可選（docs/E2E_TEST_PLAN.md §6）。 */}
              <div
                ref={scrollerRef}
                data-testid="scroll-row-outing-cities"
                className="row-bleed flex gap-2 pb-1"
              >
                {([ALL_CITIES, ...cities]).map((value) => (
                  <button
                    key={value}
                    ref={city === value ? selectedRef : undefined}
                    type="button"
                    onClick={() => chooseCity(value)}
                    aria-pressed={city === value}
                    className={`chip shrink-0 ${
                      city === value ? `chip-on ${theme.fill} ${theme.fillText} border-transparent` : ''
                    }`}
                  >
                    {value === ALL_CITIES ? '全部縣市' : value}
                  </button>
                ))}
              </div>

              {/* 各縣市的收費與預約規則差很多，選了縣市就把已查證的規則講清楚。 */}
              {view === 'centre' && city !== ALL_CITIES && (
                <div className="card bg-white">
                  <h3 className={`mb-2 ${theme.ink}`}>{city}的使用規則</h3>
                  {access ? (
                    <dl className="space-y-1.5 text-sm">
                      {(
                        [
                          ['費用', access.fee],
                          ['年齡對象', access.ageLimit],
                          ['預約方式', access.booking],
                          ['戶籍限制', access.residency],
                        ] as const
                      ).map(([label, rule]) => (
                        <div key={label} className="flex gap-2">
                          <dt className="text-ink-muted shrink-0">{label}</dt>
                          <dd className="text-ink">{rule.value}</dd>
                        </div>
                      ))}
                      {access.notes && (
                        <p className="text-ink-muted leading-relaxed pt-1">{access.notes}</p>
                      )}
                    </dl>
                  ) : (
                    <p className="text-sm text-ink-muted">{CENTRE_ACCESS_UNVERIFIED}</p>
                  )}
                </div>
              )}

              {!centresLoading && (
                <p className="text-xs text-ink-faint">
                  共 {visible.length} 處
                  {visible.length > MAX_RENDERED && `，先顯示 ${MAX_RENDERED} 處`}
                </p>
              )}

              {centresLoading ? (
                <p className="text-sm text-ink-muted">正在載入親子館名冊…</p>
              ) : loadFailed && view === 'centre' ? (
                <EmptyState
                  theme={theme}
                  title="親子館資料載入失敗"
                  description="請確認網路連線後重新整理頁面。"
                />
              ) : visible.length === 0 ? (
                <EmptyState
                  theme={theme}
                  title="找不到符合的場地"
                  description="換個關鍵字，或把縣市切回「全部縣市」。"
                />
              ) : (
                <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3">
                  {visible.slice(0, MAX_RENDERED).map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                  ))}
                  {visible.length > MAX_RENDERED && (
                    <p className="text-sm text-ink-muted text-center py-2">
                      還有 {visible.length - MAX_RENDERED} 處。選一個縣市，或搜尋區域名稱。
                    </p>
                  )}
                </motion.div>
              )}

              {view === 'centre' && (
                <p className="text-xs text-ink-faint leading-relaxed">{CENTRE_DATA_ATTRIBUTION}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
