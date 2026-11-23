import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import EmptyState from '../../common/ui/EmptyState';
import { stagger, listItem, tap } from '../../common/ui/motion';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { useToast } from '../../common/ui/toast';
import { useCentreSelectedChip } from '../../common/ui/useCentreSelectedChip';
import {
  PARK_FILTERS,
  distanceKm,
  formatArea,
  formatDistance,
  matchesParkFilter,
  type ParkData,
  type ParkFilter,
  type ParkVenue,
} from '../parks';

interface ParkListProps {
  /** Counties in display order; only those present in the data are shown. */
  cityOrder: string[];
  /** The county chip, shared with the other registers, or the all-counties value. */
  pickedCity: string;
  allCities: string;
  onChooseCity: (city: string) => void;
  filter: ParkFilter;
  onChooseFilter: (filter: ParkFilter) => void;
}

/** As many cards as the other registers draw at once. */
const MAX_RENDERED = 30;

type Position = { lat: number; lng: number };

/**
 * The park register: OpenStreetMap parks and playgrounds, by county or by
 * distance.
 *
 * Two ways to narrow it, because parents arrive in two states. Someone
 * planning from the sofa picks a county, as on the family-centre tab, and the
 * largest parks come first. Someone already out taps "nearest to me" and the
 * list re-sorts by distance; the county chip is then ignored, since the
 * nearest park to a parent in Banqiao may well be across the river in Taipei.
 *
 * The position is asked for only on that tap and is never stored. It lives in
 * this component's state and is gone when the tab is left.
 *
 * Every line on a card is something the map states: the name, the outline's
 * area, a playground mapped inside. "No playground mapped" is not "no
 * playground", so a park without one says nothing rather than "none".
 */
export default function ParkList({
  cityOrder,
  pickedCity,
  allCities,
  onChooseCity,
  filter,
  onChooseFilter,
}: ParkListProps) {
  const theme = SERVICE_THEME.littleouting;
  const toast = useToast();
  const [data, setData] = useState<ParkData | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`${import.meta.env.BASE_URL}data/outingParks.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ParkData>;
      })
      .then((loaded) => {
        if (active) setData(loaded);
      })
      .catch((error) => {
        console.error('公園資料載入失敗:', error);
        if (active) setLoadFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const cities = useMemo(() => {
    const present = new Set(data?.venues.map((venue) => venue.city));
    return cityOrder.filter((name) => present.has(name));
  }, [data, cityOrder]);

  // A remembered county that this dataset does not have is "all counties",
  // for the same reason as on the other registers: a filtered list with no
  // chip that looks selected.
  const city = cities.includes(pickedCity) ? pickedCity : allCities;
  const { scrollerRef, selectedRef } = useCentreSelectedChip(city);

  const visible = useMemo(() => {
    if (!data) return [];
    const matching = data.venues.filter((venue) => matchesParkFilter(venue, filter));

    if (position) {
      return matching
        .map((venue) => ({ venue, km: distanceKm(position, venue) }))
        .sort((a, b) => a.km - b.km);
    }
    return matching
      .filter((venue) => city === allCities || venue.city === city)
      .sort((a, b) => (b.areaM2 ?? 0) - (a.areaM2 ?? 0))
      .map((venue) => ({ venue, km: null as number | null }));
  }, [data, filter, position, city, allCities]);

  const locate = () => {
    // Truthiness, not `'geolocation' in navigator`: a browser with location
    // switched off keeps the property and sets it to null.
    const geolocation = navigator.geolocation;
    if (!geolocation) {
      toast.show('您的瀏覽器不支援定位功能');
      return;
    }
    setLocating(true);
    geolocation.getCurrentPosition(
      (found) => {
        setLocating(false);
        setPosition({ lat: found.coords.latitude, lng: found.coords.longitude });
      },
      () => {
        setLocating(false);
        toast.show('沒辦法取得位置，請直接選縣市');
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  };

  if (loadFailed) {
    return (
      <EmptyState
        theme={theme}
        title="公園資料載入失敗"
        description="請確認網路連線後重新整理頁面。"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PARK_FILTERS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => onChooseFilter(entry.id)}
            aria-pressed={filter === entry.id}
            className={`chip ${
              filter === entry.id ? `chip-on ${theme.fill} ${theme.fillText} border-transparent` : ''
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      {position ? (
        <div className="card flex items-center justify-between gap-3">
          <p className="text-sm text-ink">依離你的距離排序。</p>
          <button type="button" onClick={() => setPosition(null)} className="btn-ghost -mr-4 text-sm">
            改用縣市
          </button>
        </div>
      ) : (
        <>
          <motion.button
            type="button"
            whileTap={tap}
            onClick={locate}
            disabled={locating}
            className="btn-secondary w-full text-sm"
          >
            {locating ? '定位中…' : '用我的位置找最近的'}
          </motion.button>

          {/* data-testid: this row scrolls sideways on purpose, and the e2e
              layout check measures it apart from the page (E2E_TEST_PLAN §6). */}
          <div
            ref={scrollerRef}
            data-testid="scroll-row-outing-park-cities"
            className="row-bleed flex gap-2 pb-1"
          >
            {[allCities, ...cities].map((value) => (
              <button
                key={value}
                ref={city === value ? selectedRef : undefined}
                type="button"
                onClick={() => onChooseCity(value)}
                aria-pressed={city === value}
                className={`chip shrink-0 ${
                  city === value ? `chip-on ${theme.fill} ${theme.fillText} border-transparent` : ''
                }`}
              >
                {value === allCities ? '全部縣市' : value}
              </button>
            ))}
          </div>
        </>
      )}

      {!data ? (
        <p className="text-sm text-ink-muted">正在載入公園資料…</p>
      ) : visible.length === 0 ? (
        <EmptyState
          theme={theme}
          title="找不到符合的公園"
          description="換一個條件，或把縣市切回「全部縣市」。"
        />
      ) : (
        <>
          <p className="text-xs text-ink-faint">
            共 {visible.length.toLocaleString('en-US')} 處
            {visible.length > MAX_RENDERED && `，先顯示 ${MAX_RENDERED} 處`}
          </p>
          <motion.ul variants={stagger} initial="hidden" animate="visible" className="space-y-3">
            {visible.slice(0, MAX_RENDERED).map(({ venue, km }) => (
              <ParkCard key={venue.id} venue={venue} km={km} />
            ))}
          </motion.ul>
          {visible.length > MAX_RENDERED && !position && (
            <p className="text-sm text-ink-muted text-center py-2">
              還有 {(visible.length - MAX_RENDERED).toLocaleString('en-US')} 處。選一個縣市，或用你的位置找最近的。
            </p>
          )}
        </>
      )}

      {data && (
        <p className="text-xs text-ink-faint leading-relaxed">
          公園與遊戲場資料：{data.attribution}，{data.builtOn} 取得。這是志願者繪製的地圖，沒有標出遊戲場不代表沒有；面積是地圖上輪廓的大小。出發前請用地圖確認。
        </p>
      )}
    </div>
  );
}

function ParkCard({ venue, km }: { venue: ParkVenue; km: number | null }) {
  const theme = SERVICE_THEME.littleouting;
  const facts = [
    venue.kind === 'playground' ? '遊戲場' : null,
    venue.areaM2 !== undefined ? formatArea(venue.areaM2) : null,
    (venue.playgrounds ?? 0) > 0 ? `地圖上標了 ${venue.playgrounds} 處遊戲場` : null,
  ].filter(Boolean);

  return (
    <motion.li variants={listItem} className="card">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-ink min-w-0">{venue.name}</h3>
        {km !== null && (
          <span className={`text-sm font-medium shrink-0 ${theme.ink}`}>{formatDistance(km)}</span>
        )}
      </div>
      <p className="text-sm text-ink-muted mt-0.5">
        {[venue.city, ...facts].join(' · ')}
      </p>
      <motion.a
        whileTap={tap}
        href={`https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-secondary w-full mt-3 text-sm"
      >
        地圖與導航
      </motion.a>
    </motion.li>
  );
}
