import { motion } from 'framer-motion';
import { MapPin, Phone } from 'lucide-react';
import type { Venue } from '../../types';
import { SERVICE_THEME } from '../../common/ui/serviceTheme';
import { listItem, tap } from '../../common/ui/motion';
import { venueTagLabels } from '../data/venueTags';

interface VenueCardProps {
  venue: Venue;
}

/**
 * 一家場館一張卡。
 *
 * 免點擊就看得到的東西，是照「哪個資訊沒有會讓一趟出門白跑」排的：費用與
 * 預約在最前面（訂不到位和低消算錯是家長最常抱怨的兩件事），接著是區域與
 * 設施，最後才是查證日期。
 *
 * 沒有照片。場館照片的著作權不在我們手上，放別人部落格的圖不合適，而放不
 * 準的示意圖比不放更糟。
 *
 * 標籤只列來源寫得出來的。缺一個標籤代表「來源沒寫」，不代表「沒有」——這
 * 和 BabyOasis 對 facilities 為 undefined 的處理是同一個原則。
 */
export default function VenueCard({ venue }: VenueCardProps) {
  const theme = SERVICE_THEME.littleouting;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${venue.name} ${venue.address}`,
  )}`;

  const isFree = venue.tags.includes('free');
  const needsBooking = venue.tags.includes('needsBooking');

  // 費用與預約自成一列，其餘設施才排進標籤區，否則最要緊的兩件事會被淹沒。
  const facilityTags = venue.tags.filter(
    (tag) => tag !== 'free' && tag !== 'needsBooking',
  );

  return (
    <motion.div variants={listItem} className="card">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="text-ink">{venue.name}</h3>
        {isFree ? (
          <span className={`tag shrink-0 ${theme.tint} ${theme.ink}`}>免費</span>
        ) : (
          venue.minSpend !== undefined && (
            <span className="tag shrink-0 bg-butter-light text-butter-dark">
              低消 ${venue.minSpend}
            </span>
          )
        )}
      </div>

      <p className="text-sm text-ink-muted mb-2">
        {venue.city}
        {venue.district}
        {venue.ageYears && ` · 適合 ${venue.ageYears[0]}-${venue.ageYears[1]} 歲`}
      </p>

      {needsBooking && (
        <p className={`text-sm font-medium mb-2 ${theme.ink}`}>需預約</p>
      )}

      {facilityTags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5 mb-3">
          {facilityTags.map((tag) => (
            <li key={tag} className="tag bg-ink/5 text-ink-muted">
              {venueTagLabels[tag]}
            </li>
          ))}
        </ul>
      )}

      {venue.notes && (
        <p className="text-sm text-ink-muted leading-relaxed mb-3">{venue.notes}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <motion.a
          whileTap={tap}
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex-1 min-w-[8rem] text-sm"
        >
          <MapPin className="w-4 h-4" />
          地圖與導航
        </motion.a>
        {venue.phone && (
          <motion.a
            whileTap={tap}
            href={`tel:${venue.phone}`}
            className="btn-secondary flex-1 min-w-[8rem] text-sm whitespace-nowrap"
          >
            <Phone className="w-4 h-4 shrink-0" />
            {venue.phone}
          </motion.a>
        )}
      </div>

      <p className="text-xs text-ink-faint mt-3">
        資料查證於 {venue.verifiedOn}，出發前請再確認
      </p>
    </motion.div>
  );
}
