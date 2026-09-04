import { useMemo, useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import type { NursingRoom } from '../../types';
import type { ServiceTheme } from '../../common/ui/serviceTheme';
import EmptyState from '../../common/ui/EmptyState';
import {
  CATEGORY_CHIPS,
  CATEGORY_LABEL,
  isInternalVenue,
  needsStaffHelp,
  type RoomCategory,
} from '../utils/roomCategory';
import AreaPicker from './AreaPicker';

/**
 * 一次最多畫幾列。全台 3,852 處，「新光三越」這種關鍵字動輒數十筆，
 * 全畫出來在手機上是滑不完的清單；超過就老實說還有幾處，請家長再具體一點。
 * 和親子好去處的 MAX_RENDERED 同一個數字，兩邊的清單長度感覺才一致。
 */
const MAX_RESULTS = 30;

/**
 * 篩選條件由頁面持有：標記、附近清單與這份結果清單必須是同一批哺乳室，
 * 三個地方各自篩一次就會各自漂走。
 */
export interface RoomFilters {
  city: string | null;
  district: string | null;
  category: RoomCategory | null;
  excludeInternal: boolean;
}

export const NO_FILTERS: RoomFilters = {
  city: null,
  district: null,
  category: null,
  excludeInternal: false,
};

interface RoomSearchProps {
  /** 已經套過 filters 的哺乳室，並且已按距離或區域排好序。 */
  rooms: readonly NursingRoom[];
  /**
   * 區域選單用來算縣市與各行政區筆數的來源：套過類型與內部場所，但沒套區域。
   * 傳已篩好的 rooms 會讓家長選了臺北市之後再也選不到別的縣市。
   */
  areaRooms: readonly NursingRoom[];
  theme: ServiceTheme;
  filters: RoomFilters;
  onFiltersChange: (filters: RoomFilters) => void;
  /** 交還給頁面的 selectedRoom：選定的哺乳室同時開詳情、帶動地圖。 */
  onSelect: (room: NursingRoom) => void;
}

/**
 * 哺乳室的搜尋與篩選。
 *
 * 地圖能做的是「附近有什麼」，不能做「我現在在的這間百貨」，也不能做「我明天
 * 要去的那一區有沒有」。家長站在特定賣場裡，最快的路徑是打出店名；在家排明天
 * 的行程時，要的是區域加場所類型。兩條路都收在同一張卡片裡，因為它們回答的是
 * 同一個問題的兩種問法。
 *
 * 關鍵字比對名稱、地址、縣市與鄉鎮市區四個欄位：家長記得的常常是路名或區名，
 * 甚至只記得「大遠百」而地址才寫著它所在的路。3,852 筆用最單純的
 * filter 就夠（實測整份掃完不到 1 ms），不需要 debounce 之類的機制。
 *
 * 場所類型只能單選：多選要另外給一組圖例說明「現在選了哪三類」，而那個圖例
 * 沒有人會讀。再按一次同一顆就是取消。
 */
export default function RoomSearch({
  rooms,
  areaRooms,
  theme,
  filters,
  onFiltersChange,
  onSelect,
}: RoomSearchProps) {
  const [query, setQuery] = useState('');
  const [areaOpen, setAreaOpen] = useState(false);
  const keyword = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (keyword === '') return rooms;
    return rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(keyword) ||
        room.address.toLowerCase().includes(keyword) ||
        room.city.toLowerCase().includes(keyword) ||
        (room.district?.toLowerCase().includes(keyword) ?? false),
    );
  }, [rooms, keyword]);

  const { city, district, category, excludeInternal } = filters;
  const hasFilter = city !== null || district !== null || category !== null || excludeInternal;

  /*
    只選了縣市就不列清單：那只是把地圖框到那個縣市，而臺北市有 611 處，
    沒有人會讀那份清單。關鍵字、行政區、場所類型與排除內部場所反過來都是
    「我想翻一份名單」的意思，所以它們會把清單叫出來——即使剩下的筆數還很大，
    單獨按排除內部場所就還剩 3,378 處。那種情況下清單有沒有用取決於排序：
    定位過就是最近的幾處；沒定位是照行政區排的前 30 處，標題會老實寫出共有
    幾處，請家長再縮一次。
  */
  const showList = keyword !== '' || district !== null || category !== null || excludeInternal;

  // `.chip-on` 的珊瑚紅是 LittleSteps 的品牌色，這裡換成 BabyOasis 的靖藍，
  // 做法比照 LittleGuard 的 CountyPicker。
  const chipClass = (isOn: boolean) =>
    `chip shrink-0 ${isOn ? `chip-on ${theme.fill} ${theme.fillText} border-transparent` : ''}`;

  const clearAll = () => {
    setQuery('');
    onFiltersChange(NO_FILTERS);
  };

  return (
    <div className="pointer-events-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜尋場所、地址或區域"
          aria-label="搜尋哺乳室"
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

      {/* 橫向捲動而不是換行：chip 列換行會把地圖推掉半個畫面。 */}
      <div className="row-bleed flex gap-2 py-1">
        <button
          type="button"
          onClick={() => setAreaOpen(true)}
          aria-haspopup="dialog"
          className={chipClass(city !== null)}
        >
          {city === null ? '全部縣市' : district === null ? city : `${city} ${district}`}
        </button>
        {CATEGORY_CHIPS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onFiltersChange({ ...filters, category: category === id ? null : id })}
            aria-pressed={category === id}
            className={chipClass(category === id)}
          >
            {CATEGORY_LABEL[id]}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onFiltersChange({ ...filters, excludeInternal: !excludeInternal })}
          aria-pressed={excludeInternal}
          className={chipClass(excludeInternal)}
        >
          排除內部場所
        </button>
      </div>

      {showList &&
        (matches.length === 0 ? (
          <div className="mt-2">
            {/* 條件篩掉的和關鍵字打錯的，要講不一樣的話：前者給得起一條退路。 */}
            {hasFilter ? (
              <EmptyState
                theme={theme}
                title="這些條件下沒有哺乳室"
                description="試著放寬條件，或換個關鍵字。"
                action={{ label: '清除篩選', onClick: clearAll }}
              />
            ) : (
              <EmptyState
                theme={theme}
                title="找不到符合的哺乳室"
                description="換個關鍵字，或改用路名、區域名稱找找看。"
              />
            )}
          </div>
        ) : (
          /* 38vh 是刻意壓低的上限：底部的附近清單最高 45vh，定位鈕與地圖的
             資料來源標註也都在下緣，結果清單不能長到蓋住它們。 */
          <div className="mt-2 bg-white rounded-2xl shadow-soft max-h-[38vh] overflow-y-auto">
            <p className="sticky top-0 bg-white px-4 pt-3 pb-1 text-xs text-ink-faint">
              共 {matches.length} 處
              {matches.length > MAX_RESULTS && `，先顯示 ${MAX_RESULTS} 處`}
            </p>
            <ul className="px-2 pb-2">
              {matches.slice(0, MAX_RESULTS).map((room) => (
                <li key={room.id}>
                  <button
                    type="button"
                    onClick={() => {
                      // 選定後清掉關鍵字，結果清單才會收起來。留著的話家長關掉
                      // 詳情面板，看到的是清單依舊蓋住地圖與剛飛過去的那個點。
                      setQuery('');
                      onSelect(room);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-ink/5 active:bg-ink/10 transition-colors text-left"
                  >
                    <MapPin className={`w-4 h-4 shrink-0 ${theme.ink}`} />
                    <div className="min-w-0 flex-1">
                      {/* 名稱自己截斷，標籤留在旁邊不被截掉：整行 truncate 的
                          話，「大葉高島屋百貨股份有限公司」這種長名字會把後面
                          的標籤一起吃掉——而需要標籤的正是這些長名字。 */}
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-ink truncate">{room.name}</span>
                        {/* 最多一個標籤。兩個一起掛的時候「進不去」比「要問人」
                            重要得多，後者只是多走一趟服務台。 */}
                        {isInternalVenue(room) ? (
                          <span className="tag shrink-0 bg-butter-light text-butter-dark">
                            內部場所
                          </span>
                        ) : needsStaffHelp(room) ? (
                          <span className="tag shrink-0 bg-ink/5 text-ink-muted">需洽服務台</span>
                        ) : null}
                      </p>
                      {/* 地址本身就以縣市區起頭，比再拼一次縣市有用；同名的分館
                          （例如天母兩館）只有樓層分得開，有就一起寫上。 */}
                      <p className="text-sm text-ink-muted truncate">
                        {room.address}
                        {room.floor ? `｜${room.floor}` : ''}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
              {matches.length > MAX_RESULTS && (
                <li className="px-3 py-2 text-sm text-ink-muted text-center">
                  還有 {matches.length - MAX_RESULTS} 處，再加上關鍵字或縮小區域。
                </li>
              )}
            </ul>
          </div>
        ))}

      {areaOpen && (
        <AreaPicker
          rooms={areaRooms}
          city={city}
          district={district}
          onSelect={(nextCity, nextDistrict) =>
            onFiltersChange({ ...filters, city: nextCity, district: nextDistrict })
          }
          onClose={() => setAreaOpen(false)}
        />
      )}
    </div>
  );
}
