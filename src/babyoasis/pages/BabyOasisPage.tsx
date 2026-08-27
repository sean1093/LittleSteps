import { useState, useEffect, useMemo } from 'react';
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
import { createSpatialIndex } from '../utils/spatialIndex';

// Import leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 兩種圖示都不隨資料變化，模組層建立一次即可。先前是每個 marker 各呼叫一次
// createCustomIcon，全國資料下等於每次 render 產生近四千顆內容相同的 divIcon。
const ROOM_ICON = L.divIcon({
  html: `<div style="background: linear-gradient(135deg, #EC4899, #F59E0B); width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
       </div>`,
  className: 'custom-marker-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const USER_ICON = L.divIcon({
  html: `<div style="background: #3B82F6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
  className: 'custom-marker-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
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

// Component for locate me button
const LocateButton = ({ onLocate }: { onLocate: () => void }) => {
  const [isLocating, setIsLocating] = useState(false);

  const handleClick = () => {
    setIsLocating(true);
    onLocate();
    setTimeout(() => setIsLocating(false), 2000);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isLocating}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="absolute bottom-32 right-4 z-[1000] bg-white rounded-full p-4 shadow-soft hover:shadow-soft-lg transition-all duration-200"
    >
      <Navigation
        className={`w-6 h-6 text-primary ${isLocating ? 'animate-spin' : ''}`}
      />
    </motion.button>
  );
};

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

// Bottom sheet for selected room
interface RoomDetailSheetProps {
  room: NursingRoom | null;
  onClose: () => void;
}

const RoomDetailSheet = ({ room, onClose }: RoomDetailSheetProps) => {
  if (!room) return null;

  // 來源未提供設施細目時 facilities 是 undefined，與「十項設施都沒有」意義不同，
  // 必須分開呈現，否則會把資料闕漏講成場所簡陋。
  const availableFacilities = Object.entries(room.facilities ?? {})
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[2000] bg-white rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 pb-8">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 pr-10">{room.name}</h2>
          </div>

          {/* Location info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-900">{room.address}</p>
                {room.floor && <p className="text-sm text-gray-600">{room.floor}</p>}
              </div>
            </div>

            {room.openingHours && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-gray-900">{room.openingHours}</p>
              </div>
            )}

            {room.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <a
                  href={`tel:${room.phone}`}
                  className="text-primary hover:underline"
                >
                  {room.phone}
                </a>
              </div>
            )}
          </div>

          {/* Facilities */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">設施</h3>
            {room.facilities ? (
              <div className="grid grid-cols-2 gap-3">
                {availableFacilities.map((facility) => (
                  <div
                    key={facility}
                    className="flex items-center gap-2 p-3 bg-gradient-to-r from-pink-50 to-amber-50 rounded-xl"
                  >
                    <div className="text-primary">{getFacilityIcon(facility)}</div>
                    <span className="text-sm text-gray-700">{getFacilityLabel(facility)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                此場所未提供設施明細，建議出發前先電話確認。
              </p>
            )}
          </div>

          {/* Remarks */}
          {room.remarks && (
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-700">{room.remarks}</p>
            </div>
          )}

          {/* Navigate button */}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${room.latitude},${room.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-6 w-full bg-gradient-to-r from-primary to-secondary text-white text-center py-4 rounded-2xl font-semibold hover:shadow-soft-lg transition-all duration-200"
          >
            開始導航
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/** 定位後列出的鄰近筆數，以及超過多遠就不算「附近」。 */
const NEARBY_LIMIT = 8;
const NEARBY_RADIUS_KM = 10;

/** 未定位時的預設視角：涵蓋台灣本島與離島，避免看起來只有臺北有資料。 */
const TAIWAN_CENTER: [number, number] = [23.75, 120.95];
const TAIWAN_ZOOM = 8;

const BabyOasisPage = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<NursingRoom | null>(null);
  const [nursingRooms, setNursingRooms] = useState<NursingRoom[]>([]);
  const [showNearby, setShowNearby] = useState(false);

  // 全國約 3,900 筆以靜態 JSON 提供，不進 JS bundle，並可獨立於程式碼被快取。
  useEffect(() => {
    let active = true;
    fetch(`${import.meta.env.BASE_URL}data/nursingRooms.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<NursingRoom[]>;
      })
      .then((rooms) => {
        if (active) setNursingRooms(rooms);
      })
      .catch((error) => {
        console.error('哺乳室資料載入失敗:', error);
      });
    return () => {
      active = false;
    };
  }, []);

  // 建索引 0.4 ms，之後每次最近查詢 0.007 ms；逐筆線性掃描則是 0.5 ms。
  const index = useMemo(() => createSpatialIndex(nursingRooms), [nursingRooms]);

  const nearby = useMemo(() => {
    if (!userLocation) return [];
    return index.nearest(userLocation[0], userLocation[1], NEARBY_LIMIT, NEARBY_RADIUS_KM);
  }, [index, userLocation]);

  const handleLocate = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setShowNearby(true);
        },
        (error) => {
          console.error('定位失敗:', error);
          alert('無法取得您的位置，請確認已開啟定位權限');
        }
      );
    } else {
      alert('您的瀏覽器不支援定位功能');
    }
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="p-4 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BabyOasis
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {nursingRooms.length ? `全台 ${nursingRooms.length} 處哺乳室` : '找到最近的哺乳室'}
            </p>
          </div>
          <AppHomeButton />
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

        {/*
          全台近四千個點必須分群，否則低倍率下會糊成一片而且互相遮蔽。
          maxClusterRadius 由 50 放大到 80（Leaflet 預設值）：先前的值是為
          僅臺北 306 筆調的，在全國尺度下會分出過多小群。放到第 16 級後
          改顯示個別標記，此時同一條街的點已經分得開。
        */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={80}
          disableClusteringAtZoom={16}
          showCoverageOnHover={false}
        >
          {nursingRooms.map((room) => (
            <Marker
              key={room.id}
              position={[room.latitude, room.longitude]}
              icon={ROOM_ICON}
              eventHandlers={{
                click: () => {
                  setSelectedRoom(room);
                },
              }}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Locate me button */}
      <LocateButton onLocate={handleLocate} />

      {/* 附近清單：定位後用空間索引取最近幾筆，並顯示實際距離 */}
      <AnimatePresence>
        {showNearby && !selectedRoom && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[1500] bg-white rounded-t-3xl shadow-2xl max-h-[45vh] overflow-y-auto"
          >
            <div className="sticky top-0 flex items-center justify-between bg-white px-6 pt-5 pb-3">
              <h2 className="text-lg font-bold text-gray-900">附近的哺乳室</h2>
              <button
                onClick={() => setShowNearby(false)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="關閉附近清單"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {nearby.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-gray-500">
                {NEARBY_RADIUS_KM} 公里內沒有已登記的哺乳室，可拖動地圖查看其他區域。
              </p>
            ) : (
              <ul className="px-4 pb-6">
                {nearby.map(({ item, distanceKm }) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setSelectedRoom(item)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 truncate">{item.address}</p>
                      </div>
                      <span className="text-sm font-semibold text-primary whitespace-nowrap">
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
        )}
      </AnimatePresence>

      {/* Room detail bottom sheet */}
      <RoomDetailSheet
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
    </div>
  );
};

export default BabyOasisPage;
