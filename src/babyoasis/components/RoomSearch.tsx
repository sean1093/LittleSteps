import { useMemo, useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import type { NursingRoom } from '../../types';
import type { ServiceTheme } from '../../common/ui/serviceTheme';
import EmptyState from '../../common/ui/EmptyState';

/**
 * 一次最多畫幾列。全台 3,852 處，「新光三越」這種關鍵字動輒數十筆，
 * 全畫出來在手機上是滑不完的清單；超過就老實說還有幾處，請家長再具體一點。
 * 和親子好去處的 MAX_RENDERED 同一個數字，兩邊的清單長度感覺才一致。
 */
const MAX_RESULTS = 30;

interface RoomSearchProps {
  rooms: readonly NursingRoom[];
  theme: ServiceTheme;
  /** 交還給頁面的 selectedRoom：選定的哺乳室同時開詳情、帶動地圖。 */
  onSelect: (room: NursingRoom) => void;
}

/**
 * 哺乳室文字搜尋。
 *
 * 地圖能做的是「附近有什麼」，不能做「我現在在的這間百貨」。家長站在特定
 * 賣場裡，最快的路徑是打出店名，而不是縮放拖曳去猜自己在地圖上的哪個點。
 *
 * 比對名稱、地址、縣市與鄉鎮市區四個欄位：家長記得的常常是路名或區名，
 * 甚至只記得「大遠百」而地址才寫著它所在的路。3,852 筆用最單純的
 * filter 就夠（實測整份掃完不到 1 ms），不需要 debounce 之類的機制。
 */
export default function RoomSearch({ rooms, theme, onSelect }: RoomSearchProps) {
  const [query, setQuery] = useState('');
  const keyword = query.trim().toLowerCase();

  const matches = useMemo(() => {
    // 空字串時不掃也不畫：地圖回到原本的樣子，清單完全讓位。
    if (keyword === '') return [];
    return rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(keyword) ||
        room.address.toLowerCase().includes(keyword) ||
        room.city.toLowerCase().includes(keyword) ||
        (room.district?.toLowerCase().includes(keyword) ?? false),
    );
  }, [rooms, keyword]);

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

      {keyword !== '' &&
        (matches.length === 0 ? (
          <div className="mt-2">
            <EmptyState
              theme={theme}
              title="找不到符合的哺乳室"
              description="換個關鍵字，或改用路名、區域名稱找找看。"
            />
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
                    onClick={() => onSelect(room)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-ink/5 active:bg-ink/10 transition-colors text-left"
                  >
                    <MapPin className={`w-4 h-4 shrink-0 ${theme.ink}`} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-ink truncate">{room.name}</p>
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
                  還有 {matches.length - MAX_RESULTS} 處，關鍵字再具體一點。
                </li>
              )}
            </ul>
          </div>
        ))}
    </div>
  );
}
