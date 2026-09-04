import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import {
  Navigation,
  MapPin,
  Phone,
  Clock,
  X,
  Baby,
  Armchair,
  Droplet,
  Refrigerator,
  Microwave,
  Zap,
  Wind,
  BedDouble
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NursingRoom } from '../../types';
import AppHomeButton from '../../common/components/AppHomeButton';
import AccountButton from '../../common/components/AccountButton';
import AppBar from '../../common/ui/AppBar';
import EmptyState from '../../common/ui/EmptyState';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { sheet, tap } from '../../common/ui/motion';
import { createSpatialIndex, distanceBetween, type Located } from '../utils/spatialIndex';
import RoomSearch, { NO_FILTERS, type RoomFilters } from '../components/RoomSearch';
import { categoryOf, isInternalVenue } from '../utils/roomCategory';
import type { MrtStation } from '../data/mrtStations';

// Import leaflet CSS
import 'leaflet/dist/leaflet.css';
import { useToast } from '../../common/ui/toast';

// 兩種圖示都不隨資料變化，模組層建立一次即可。先前是每個 marker 各呼叫一次
// createCustomIcon，全國資料下等於每次 render 產生近四千顆內容相同的 divIcon。
//
// Hex is unavoidable here — Leaflet builds these from an HTML string, outside
// Tailwind's reach. The values are the `primary` and `secondary-dark` tokens.
//
// The glyph used to be a music note (`M9 18V5l12-2v13` plus two circles), which
// had nothing to do with a nursing room. It is a droplet now.
const ROOM_ICON = L.divIcon({
  html: `<div style="background: linear-gradient(135deg, #FFB3B3, #F08287); width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(63,58,56,0.28); display: flex; align-items: center; justify-content: center;">
         <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>
       </div>`,
  // className 要留空字串，不能整個省略：省略時 Leaflet 會套上預設的
  // leaflet-div-icon，而 leaflet.css 那條規則會在圓點後面畫一個白底方框。
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const USER_ICON = L.divIcon({
  html: `<div style="background: #2A7288; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(63,58,56,0.28);"></div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// 選定捷運站的位置。空心環而不是實心點：它標的是「你要去的地方」，不是一筆
// 哺乳室也不是你現在的位置，三者在同一張地圖上必須分得出來。
//
// Hex is unavoidable here too; the value is the `secondary-dark` token.
const STATION_ICON = L.divIcon({
  html: `<div style="width: 26px; height: 26px; border-radius: 50%; border: 5px solid #2A7288; background: white; box-shadow: 0 2px 8px rgba(63,58,56,0.28);"></div>`,
  className: '',
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

// Component to handle user location
interface LocationMarkerProps {
  position: [number, number] | null;
}

const LocationMarker = ({ position }: LocationMarkerProps) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { duration: 1 });
    }
  }, [position, map]);

  if (!position) return null;

  return (
    <Marker position={position} icon={USER_ICON}>
      <Popup>你的位置</Popup>
    </Marker>
  );
};

/**
 * 定位鈕。轉不轉圈由頁面決定，不是自己數秒。
 *
 * 先前這裡開一個兩秒的 setTimeout 停止轉圈：定位其實還在跑（或永遠不會回來），
 * 圖示卻停了，家長只能一直重按。轉圈必須跟著真正的定位結果走。
 */
const LocateButton = ({
  onLocate,
  isLocating,
}: {
  onLocate: () => void;
  isLocating: boolean;
}) => (
  <motion.button
    onClick={onLocate}
    disabled={isLocating}
    aria-busy={isLocating}
    whileTap={tap}
    aria-label="定位我的位置"
    className="absolute bottom-32 right-4 z-[1000] w-14 h-14 flex items-center justify-center bg-white rounded-full shadow-soft hover:shadow-soft-lg transition-shadow"
  >
    <Navigation className={`w-6 h-6 text-secondary-dark ${isLocating ? 'animate-spin' : ''}`} />
  </motion.button>
);

// Facility icons mapping
const getFacilityIcon = (facility: string) => {
  const iconMap: { [key: string]: JSX.Element } = {
    privateCurtain: <Baby className="w-4 h-4" />,
    nursingChair: <Armchair className="w-4 h-4" />,
    waterDispenser: <Droplet className="w-4 h-4" />,
    changingTable: <Baby className="w-4 h-4" />,
    washBasin: <Droplet className="w-4 h-4" />,
    refrigerator: <Refrigerator className="w-4 h-4" />,
    microwave: <Microwave className="w-4 h-4" />,
    airConditioning: <Wind className="w-4 h-4" />,
    babyBed: <BedDouble className="w-4 h-4" />,
    socket: <Zap className="w-4 h-4" />,
  };
  return iconMap[facility] || <MapPin className="w-4 h-4" />;
};

const getFacilityLabel = (facility: string): string => {
  const labelMap: { [key: string]: string } = {
    privateCurtain: '獨立空間',
    nursingChair: '哺乳椅',
    waterDispenser: '飲水機',
    changingTable: '尿布台',
    washBasin: '洗手台',
    refrigerator: '冰箱',
    microwave: '微波爐',
    airConditioning: '冷氣',
    babyBed: '嬰兒床',
    socket: '插座',
  };
  return labelMap[facility] || facility;
};

/** 兩張面板各自的標題 id，給 aria-labelledby 指。 */
const ROOM_SHEET_TITLE_ID = 'babyoasis-room-sheet-title';
const NEARBY_SHEET_TITLE_ID = 'babyoasis-nearby-sheet-title';

/**
 * 兩張底部面板共用的對話框行為：Escape 關得掉，開啟時焦點會進到面板裡。
 *
 * 不借 ModalFrame——那是置中的對話框，形狀和貼齊下緣、蓋著地圖的面板不同；
 * 這裡需要的只是它的鍵盤行為。
 */
const useSheetDialog = (onClose: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  // 只在掛載時搶一次焦點。若跟著 onClose 重跑，每次 render 都會把焦點拉回
  // 面板本身，家長就捲不動裡面的清單了。
  useEffect(() => {
    ref.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return ref;
};

// Bottom sheet for selected room
interface RoomDetailSheetProps {
  room: NursingRoom;
  onClose: () => void;
}

/**
 * `AnimatePresence` lives at the call site, not in here. It used to sit inside
 * this component above an early `return null`, so the whole subtree unmounted
 * the instant `room` cleared and the exit animation never ran.
 */
const RoomDetailSheet = ({ room, onClose }: RoomDetailSheetProps) => {
  const theme = SERVICE_THEME.babyoasis;
  const dialogRef = useSheetDialog(onClose);

  // 來源未提供設施細目時 facilities 是 undefined，與「十項設施都沒有」意義不同，
  // 必須分開呈現，否則會把資料闕漏講成場所簡陋。
  const availableFacilities = Object.entries(room.facilities ?? {})
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  return (
    <motion.div
      {...sheet}
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ROOM_SHEET_TITLE_ID}
      tabIndex={-1}
      className="fixed bottom-0 left-0 right-0 z-[2000] bg-white rounded-t-3xl shadow-soft-lg max-h-[70vh] overflow-y-auto focus:outline-none"
    >
      <button
        onClick={onClose}
        aria-label="關閉"
        className="btn-icon absolute top-3 right-3 bg-ink/5 hover:bg-ink/10"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="p-5 pb-8">
        <h2 id={ROOM_SHEET_TITLE_ID} className="text-xl font-bold text-ink mb-4 pr-12">
          {room.name}
        </h2>

        {/* These three icons are the only thing distinguishing address from
            hours from phone, so they carry meaning and stay. */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className={`w-5 h-5 mt-0.5 shrink-0 ${theme.ink}`} />
            <div>
              <p className="text-ink">{room.address}</p>
              {room.floor && <p className="text-sm text-ink-muted">{room.floor}</p>}
            </div>
          </div>

          {room.openingHours && (
            <div className="flex items-start gap-3">
              <Clock className={`w-5 h-5 mt-0.5 shrink-0 ${theme.ink}`} />
              <p className="text-ink">{room.openingHours}</p>
            </div>
          )}

          {room.phone && (
            <div className="flex items-start gap-3">
              <Phone className={`w-5 h-5 mt-0.5 shrink-0 ${theme.ink}`} />
              <a href={`tel:${room.phone}`} className={`underline ${theme.ink}`}>
                {room.phone}
              </a>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="mb-3">設施</h3>
          {room.facilities ? (
            <div className="grid grid-cols-2 gap-2">
              {availableFacilities.map((facility) => (
                <div
                  key={facility}
                  className="flex items-center gap-2 p-3 bg-secondary-light rounded-xl"
                >
                  <span className={theme.ink}>{getFacilityIcon(facility)}</span>
                  <span className="text-sm text-ink">{getFacilityLabel(facility)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-muted">
              此場所未提供設施明細，建議出發前先電話確認。
            </p>
          )}
        </div>

        {room.remarks && (
          <div className="p-4 bg-secondary-soft rounded-xl">
            <p className="text-sm text-ink">{room.remarks}</p>
          </div>
        )}

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${room.latitude},${room.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-primary w-full mt-6 ${theme.fill} ${theme.fillText}`}
        >
          開始導航
        </a>
      </div>
    </motion.div>
  );
};

/** 定位後列出的鄰近筆數，以及超過多遠就不算「附近」。 */
const NEARBY_LIMIT = 8;
const NEARBY_RADIUS_KM = 10;

/**
 * 選了捷運站時的半徑。10 公里在捷運沿線等於整個市區，回答不了「這一站附近」。
 *
 * 800 公尺是量出來的，不是手感：全台 260 站對上這份哺乳室資料，235 站在 800
 * 公尺內至少有一處（154 站在 300 公尺內），平均 7.3 處、中位數 5 處，正好是
 * NEARBY_LIMIT 這個量級。再放寬只會把隔一站的場所混進來，那不是家長問的問題。
 */
const STATION_RADIUS_KM = 0.8;

/** 未定位時的預設視角：涵蓋台灣本島與離島，避免看起來只有臺北有資料。 */
const TAIWAN_CENTER: [number, number] = [23.75, 120.95];
const TAIWAN_ZOOM = 8;

/**
 * 個別標記出現的倍率。同一個值同時給 disableClusteringAtZoom 與選定後的飛行
 * 目標用：飛到比它更遠的倍率，那一筆會被併回叢集裡，家長點了卻看不到自己選的點。
 */
const MARKER_ZOOM = 16;

/**
 * 選定的目標把地圖帶過去——一筆哺乳室，或一個捷運站。
 *
 * MapContainer 的 center/zoom 只是初始值，之後改它不會動；要移動地圖只能像
 * LocationMarker 那樣拿 useMap 的實例。掛在選取本身而不是另開一個「搜尋選中
 * 的那筆」狀態：一個選取只該有一種地圖反應，搜尋結果、附近清單、直接點標記
 * 三條路徑因此完全一致。
 *
 * 只放大不縮小（Math.max）：已經放大到街道層的家長不該因為點一筆而被拉遠。
 */
const PointFocus = ({ point }: { point: { latitude: number; longitude: number } | null }) => {
  const map = useMap();

  useEffect(() => {
    if (!point) return;
    map.flyTo([point.latitude, point.longitude], Math.max(map.getZoom(), MARKER_ZOOM), {
      duration: 1,
    });
  }, [point, map]);

  return null;
};

/**
 * 篩選之後把地圖框到剩下的那些點上。
 *
 * 篩了「臺北市 士林區」卻還停在全台視角，家長看到的只是同一片叢集少了幾顆，
 * 得自己縮放拖曳去找篩選結果在哪裡。這裡直接算出剩下這些點的外接範圍飛過去，
 * 縣市與行政區因此不需要任何中心點座標表——資料本身就有座標。
 *
 * 每一批篩選結果只框一次，這是靠記住上一次框過的那個陣列做到的：篩選條件
 * 沒動、只是關掉了詳情面板時，地圖必須留在家長剛剛看的地方，不能把他拉回
 * 整區的視角。選定某一筆的期間也完全不動，那時 SelectedRoomFocus 正在把
 * 地圖帶到那一筆上，兩個都動會互相搶。
 *
 * maxZoom 用 MARKER_ZOOM，否則只剩一筆時會貼到最大倍率，家長認不出那是哪裡。
 */
const FilteredAreaFocus = ({
  rooms,
  active,
}: {
  rooms: readonly NursingRoom[];
  active: boolean;
}) => {
  const map = useMap();
  const framed = useRef<readonly NursingRoom[] | null>(null);

  useEffect(() => {
    if (rooms === framed.current) return;
    framed.current = rooms;
    if (!active || rooms.length === 0) return;

    let south = rooms[0].latitude;
    let north = south;
    let west = rooms[0].longitude;
    let east = west;
    rooms.forEach((room) => {
      if (room.latitude < south) south = room.latitude;
      if (room.latitude > north) north = room.latitude;
      if (room.longitude < west) west = room.longitude;
      if (room.longitude > east) east = room.longitude;
    });
    map.fitBounds(
      [
        [south, west],
        [north, east],
      ],
      // 上緣要留給標題列與搜尋列，它們是浮在地圖上的。
      { paddingTopLeft: [24, 180], paddingBottomRight: [24, 48], maxZoom: MARKER_ZOOM },
    );
  }, [rooms, active, map]);

  return null;
};

/**
 * 鄰近清單，和詳情面板一樣是對話框：Escape 關得掉、焦點會進來。
 *
 * 標題與「一筆都沒有」的那句話由呼叫端給：同一份清單有兩個原點——「我現在的
 * 位置」與「我要去的那一站」，而 10 公里與 800 公尺講成同一句話會騙人。
 */
const NearbyRoomsSheet = ({
  nearby,
  title,
  emptyText,
  onSelect,
  onClose,
}: {
  nearby: readonly Located<NursingRoom>[];
  title: string;
  emptyText: string;
  onSelect: (room: NursingRoom) => void;
  onClose: () => void;
}) => {
  const theme = SERVICE_THEME.babyoasis;
  const dialogRef = useSheetDialog(onClose);

  return (
    <motion.div
      {...sheet}
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={NEARBY_SHEET_TITLE_ID}
      tabIndex={-1}
      className="fixed bottom-0 left-0 right-0 z-[1500] bg-white rounded-t-3xl shadow-soft-lg max-h-[45vh] overflow-y-auto focus:outline-none"
    >
      <div className="sticky top-0 flex items-center justify-between bg-white px-4 pt-4 pb-2">
        <h2 id={NEARBY_SHEET_TITLE_ID}>{title}</h2>
        <button
          onClick={onClose}
          className="btn-icon bg-ink/5 hover:bg-ink/10"
          aria-label="關閉附近清單"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {nearby.length === 0 ? (
        <p className="px-4 pb-6 text-sm text-ink-muted">{emptyText}</p>
      ) : (
        <ul className="px-2 pb-6">
          {nearby.map(({ item, distanceKm }) => (
            <li key={item.id}>
              <button
                onClick={() => onSelect(item)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-ink/5 active:bg-ink/10 transition-colors text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink truncate">{item.name}</p>
                  <p className="text-sm text-ink-muted truncate">{item.address}</p>
                </div>
                <span className={`text-sm font-semibold whitespace-nowrap ${theme.ink}`}>
                  {distanceKm < 1
                    ? `${Math.round(distanceKm * 1000)} 公尺`
                    : `${distanceKm.toFixed(1)} 公里`}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

/**
 * 定位選項。不給 options 時 timeout 預設是 Infinity：室內收不到 GPS 的話
 * callback 永遠不會回來，家長看到的只有一顆轉不停的鈕。十秒沒結果就當作失敗
 * 講出來，比無聲的等待有用。
 *
 * maximumAge 讓一分鐘內的座標可以直接沿用，連按不必重新定位；哺乳室以街廓為
 * 單位，不值得用 enableHighAccuracy 換耗電與額外的等待。
 */
const GEOLOCATION_OPTIONS: PositionOptions = {
  timeout: 10_000,
  maximumAge: 60_000,
  enableHighAccuracy: false,
};

/** GeolocationPositionError.TIMEOUT。逾時和被拒絕權限要講不一樣的話。 */
const GEOLOCATION_TIMEOUT = 3;

/** 資料還沒到、到了、載不進來——空白的地圖必須讀得出是哪一種。 */
type LoadState = 'loading' | 'ready' | 'failed';

/**
 * 清單排序用的中文定序器。等同 `localeCompare(other, 'zh-Hant')`，但整份
 * 3,852 筆實測 2.6 ms 而不是 21.6 ms：localeCompare 帶 locale 參數時每次
 * 比較都重建一個 collator，而排序會呼叫它四萬次以上。
 */
const COLLATOR = new Intl.Collator('zh-Hant');

const BabyOasisPage = () => {
  const toast = useToast();
  const theme = SERVICE_THEME.babyoasis;
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<NursingRoom | null>(null);
  const [nursingRooms, setNursingRooms] = useState<NursingRoom[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [showNearby, setShowNearby] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [filters, setFilters] = useState<RoomFilters>(NO_FILTERS);
  /*
    選定的捷運站是「定位點」而不是「篩選條件」：它不會拿掉任何一筆哺乳室，
    只是把附近清單與地圖的原點換成那一站。所以它不住在 RoomFilters 裡。

    和定位互斥，因為兩者都在回答「附近有什麼」，而答案只能有一個原點：選了站
    就以站為準，重新定位就把站放掉。留著兩個原點的話，清單標題與距離會各自
    指向不同的地方。
  */
  const [station, setStation] = useState<MrtStation | null>(null);

  // 每次載入配一個序號，只有最新那次能寫進 state：重試時先前那次可能後到，
  // 卸載之後也不該再寫。
  const loadSeq = useRef(0);

  // 全國約 3,900 筆以靜態 JSON 提供，不進 JS bundle，並可獨立於程式碼被快取。
  // 這份 1.1 MB 刻意不放進 PWA 預快取，所以離線或訊號差時載不到是常態路徑，
  // 必須說得出口並且給得起重試，不能只留一張空地圖。
  const loadRooms = useCallback(() => {
    const seq = ++loadSeq.current;
    setLoadState('loading');
    fetch(`${import.meta.env.BASE_URL}data/nursingRooms.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<NursingRoom[]>;
      })
      .then((rooms) => {
        if (seq !== loadSeq.current) return;
        setNursingRooms(rooms);
        setLoadState('ready');
      })
      .catch((error) => {
        console.error('哺乳室資料載入失敗:', error);
        if (seq !== loadSeq.current) return;
        setLoadState('failed');
      });
  }, []);

  useEffect(() => {
    loadRooms();
    return () => {
      loadSeq.current += 1;
    };
  }, [loadRooms]);

  /*
    篩選在這裡做一次就好：標記、附近清單與搜尋結果吃的必須是同一批，各自篩
    一次的話家長會在清單裡看到地圖上沒有的哺乳室。

    預設一個條件都不套。分類是從場所名稱推論出來的，不是國健署發布的欄位，
    預設就藏掉真實存在的哺乳室是更糟的那種錯。
  */
  const isFiltered =
    filters.city !== null ||
    filters.district !== null ||
    filters.category !== null ||
    filters.excludeInternal;

  // 區域選單自己要算有哪些縣市、各行政區幾筆，所以這一層先不套區域。
  const areaRooms = useMemo(() => {
    if (filters.category === null && !filters.excludeInternal) return nursingRooms;
    return nursingRooms.filter(
      (room) =>
        (filters.category === null || categoryOf(room) === filters.category) &&
        (!filters.excludeInternal || !isInternalVenue(room)),
    );
  }, [nursingRooms, filters.category, filters.excludeInternal]);

  const filteredRooms = useMemo(() => {
    if (filters.city === null) return areaRooms;
    return areaRooms.filter(
      (room) =>
        room.city === filters.city &&
        (filters.district === null || room.district === filters.district),
    );
  }, [areaRooms, filters.city, filters.district]);

  // 建索引 0.4 ms，之後每次最近查詢 0.007 ms；逐筆線性掃描則是 0.5 ms。
  const index = useMemo(() => createSpatialIndex(filteredRooms), [filteredRooms]);

  /*
    附近清單與清單排序的原點。選定的捷運站優先於定位，因為它是家長剛剛按下去
    的那個動作；兩者都沒有就沒有原點，清單改用區域排序。
  */
  const origin = useMemo(() => {
    if (station) {
      return {
        lat: station.latitude,
        lng: station.longitude,
        radiusKm: STATION_RADIUS_KM,
        title: `捷運${station.name}站附近`,
        emptyText: `這一站 ${STATION_RADIUS_KM * 1000} 公尺內沒有已登記的哺乳室，可換一站或拖動地圖查看。`,
      };
    }
    if (userLocation) {
      return {
        lat: userLocation[0],
        lng: userLocation[1],
        radiusKm: NEARBY_RADIUS_KM,
        title: '附近的哺乳室',
        emptyText: `${NEARBY_RADIUS_KM} 公里內沒有已登記的哺乳室，可拖動地圖查看其他區域。`,
      };
    }
    return null;
  }, [station, userLocation]);

  const nearby = useMemo(() => {
    if (!origin) return [];
    return index.nearest(origin.lat, origin.lng, NEARBY_LIMIT, origin.radiusKm);
  }, [index, origin]);

  /*
    清單順序。國健署回傳的順序是它自己的查詢順序，讀起來像亂數：同一條路上的
    三筆會散在清單的三個地方。有原點就照距離，沒有就照行政區再照名稱。
  */
  const sortedRooms = useMemo(() => {
    if (origin) {
      // 先把距離算好再排。放在比較函式裡的話，每一筆會被重算 log n 次。
      return filteredRooms
        .map((room) => ({
          room,
          km: distanceBetween(origin.lat, origin.lng, room.latitude, room.longitude),
        }))
        .sort((a, b) => a.km - b.km)
        .map((entry) => entry.room);
    }
    return [...filteredRooms].sort(
      (a, b) =>
        COLLATOR.compare(a.district ?? '', b.district ?? '') ||
        COLLATOR.compare(a.name, b.name),
    );
  }, [filteredRooms, origin]);

  /*
    近四千個 <Marker> 只跟資料有關。先前這串直接寫在 render 裡，而 selectedRoom、
    showNearby、userLocation 都住在同一個元件——點開一筆哺乳室就把全部標記重建
    一次。抽成只依 filteredRooms 的 memo 之後，選取只動面板與地圖視角。
  */
  const markers = useMemo(
    () =>
      filteredRooms.map((room) => (
        <Marker
          key={room.id}
          position={[room.latitude, room.longitude]}
          icon={ROOM_ICON}
          eventHandlers={{ click: () => setSelectedRoom(room) }}
        />
      )),
    [filteredRooms],
  );

  // 身分穩定的關閉函式：面板的 Escape 監聽掛在它上面，每次 render 換一個新的
  // 就等於每次 render 重掛一次監聽。
  const closeRoom = useCallback(() => setSelectedRoom(null), []);
  const closeNearby = useCallback(() => setShowNearby(false), []);

  /* 選了站就開清單，取消就收起來——按下去之後畫面必須有反應。 */
  const handleStation = useCallback((next: MrtStation | null) => {
    setStation(next);
    setShowNearby(next !== null);
  }, []);

  const handleLocate = () => {
    if (!('geolocation' in navigator)) {
      toast.show('您的瀏覽器不支援定位功能');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        // 重新定位就放掉捷運站：兩者都是「附近」的原點，只能有一個。
        setStation(null);
        setShowNearby(true);
      },
      (error) => {
        setIsLocating(false);
        console.error('定位失敗:', error);
        toast.show(
          error.code === GEOLOCATION_TIMEOUT
            ? '定位逾時，室內收訊差時常會這樣，請靠近窗邊或到戶外再試一次'
            : '無法取得您的位置，請確認已開啟定位權限',
        );
      },
      GEOLOCATION_OPTIONS,
    );
  };

  return (
    /* h-dscreen, not h-screen: 100vh counts the browser chrome that is
       physically covering the bottom of a phone screen, which pushed the
       locate button and sheet handles under it. */
    <div className="relative h-dscreen w-full overflow-hidden">
      {/* Sits above Leaflet's panes, hence the z-[1000]. */}
      <div className="absolute top-0 left-0 right-0 z-[1000]">
        <AppBar
          theme={theme}
          title={theme.name}
          subtitle={
            loadState === 'ready'
              ? isFiltered
                ? `篩選後 ${filteredRooms.length} 處`
                : `全台 ${nursingRooms.length} 處哺乳室`
              : loadState === 'failed'
                ? '資料載入失敗'
                : '正在載入資料…'
          }
          actions={
            <>
              <AccountButton service="babyoasis" />
              <AppHomeButton />
            </>
          }
        />

        {/* 搜尋列掛在標題列下方，畫面下緣要留給定位鈕與地圖的資料來源標註。
            外層不吃指標事件，否則搜尋列旁邊的透明留白會把地圖的拖曳攔下來。 */}
        <div className="max-w-2xl mx-auto px-4 pt-3 pointer-events-none">
          {loadState === 'ready' ? (
            <RoomSearch
              rooms={sortedRooms}
              areaRooms={areaRooms}
              theme={theme}
              filters={filters}
              onFiltersChange={setFilters}
              station={station}
              onStationChange={handleStation}
              onSelect={setSelectedRoom}
            />
          ) : (
            /* 資料沒到就不給搜尋框：對空陣列搜尋每次都回「找不到符合的哺乳室」，
               等於把「還在載入」和「載入失敗」都說成這一帶沒有哺乳室。 */
            <div className="pointer-events-auto">
              {loadState === 'failed' ? (
                <EmptyState
                  theme={theme}
                  title="哺乳室資料載入失敗"
                  description="地圖上還沒有任何哺乳室。請確認網路連線後再試一次。"
                  action={{ label: '重新載入', onClick: loadRooms }}
                />
              ) : (
                <div className="panel" role="status">
                  <p className="text-sm text-ink-muted">正在載入全台哺乳室資料…</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={userLocation || TAIWAN_CENTER}
        zoom={userLocation ? 15 : TAIWAN_ZOOM}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='地圖 &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors ｜ 哺乳室資料：<a href="https://data.gov.tw/dataset/23750">衛生福利部國民健康署</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        <LocationMarker position={userLocation} />

        {/* 選定的那一站。空心環標的是「你要去的地方」，不是一筆哺乳室。 */}
        {station && (
          <Marker
            position={[station.latitude, station.longitude]}
            icon={STATION_ICON}
            title={`捷運${station.name}站`}
          />
        )}

        {/* 選了哪一筆、或哪一站，地圖就跟過去 */}
        <PointFocus point={selectedRoom} />
        <PointFocus point={station} />

        {/* 篩了條件就把視角帶到剩下的那些點上；選定某一筆、或選定某一站時，
            讓給上面那兩個——那時家長看的是那個點，不是整個篩選範圍。 */}
        <FilteredAreaFocus
          rooms={filteredRooms}
          active={
            isFiltered &&
            selectedRoom === null &&
            station === null &&
            filteredRooms.length > 0 &&
            filteredRooms.length < nursingRooms.length
          }
        />

        {/*
          全台近四千個點必須分群，否則低倍率下會糊成一片而且互相遮蔽。
          maxClusterRadius 由 50 放大到 80（Leaflet 預設值）：先前的值是為
          僅臺北 306 筆調的，在全國尺度下會分出過多小群。放到第 16 級後
          改顯示個別標記，此時同一條街的點已經分得開。
        */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={80}
          disableClusteringAtZoom={MARKER_ZOOM}
          showCoverageOnHover={false}
        >
          {markers}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Locate me button */}
      <LocateButton onLocate={handleLocate} isLocating={isLocating} />

      {/* 附近清單：以定位或選定的捷運站為原點，用空間索引取最近幾筆並顯示實際
          距離。資料還沒到就先不開——那時清單只會說「沒有已登記的哺乳室」，
          等於謊報。 */}
      <AnimatePresence>
        {showNearby && origin && !selectedRoom && loadState === 'ready' && (
          <NearbyRoomsSheet
            nearby={nearby}
            title={origin.title}
            emptyText={origin.emptyText}
            onSelect={setSelectedRoom}
            onClose={closeNearby}
          />
        )}
      </AnimatePresence>

      {/* Room detail bottom sheet */}
      <AnimatePresence>
        {selectedRoom && <RoomDetailSheet room={selectedRoom} onClose={closeRoom} />}
      </AnimatePresence>
    </div>
  );
};

export default BabyOasisPage;
