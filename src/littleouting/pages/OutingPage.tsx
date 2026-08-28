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
  const [view, setView] = useState<View>('centre');
  const [city, setCity] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [centres, setCentres] = useState<Venue[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);

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

  const visible = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return source.filter((venue) => {
      if (city !== 'all' && venue.city !== city) return false;
      if (keyword === '') return true;
      // 家長記得的常常是路名或區名，不是館名，所以地址也要搜。
      return (
        venue.name.toLowerCase().includes(keyword) ||
        venue.address.toLowerCase().includes(keyword) ||
        venue.district.includes(keyword)
      );
    });
  }, [source, city, query]);

  const access = city !== 'all' ? CENTRE_ACCESS[city] : undefined;

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
              onClick={() => {
                setView(id);
                setQuery('');
              }}
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

              <div className="row-bleed flex gap-2 pb-1">
                {(['all', ...cities]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCity(value)}
                    aria-pressed={city === value}
                    className={`chip shrink-0 ${
                      city === value ? `chip-on ${theme.fill} ${theme.fillText} border-transparent` : ''
                    }`}
                  >
                    {value === 'all' ? '全部縣市' : value}
                  </button>
                ))}
              </div>

              {/* 各縣市的收費與預約規則差很多，選了縣市就把已查證的規則講清楚。 */}
              {view === 'centre' && city !== 'all' && (
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

              <p className="text-xs text-ink-faint">
                共 {visible.length} 處
                {visible.length > MAX_RENDERED && `，先顯示 ${MAX_RENDERED} 處`}
              </p>

              {loadFailed && view === 'centre' ? (
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
