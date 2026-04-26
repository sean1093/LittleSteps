import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import {
  Navigation,
  MapPin,
  Phone,
  Clock,
  Star,
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
import { NursingRoom } from '../types';
import { nursingRoomsTaipei } from '../data/nursingRoomsData';

// Import leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (isUserLocation: boolean = false) => {
  const iconHtml = isUserLocation
    ? `<div style="background: #3B82F6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`
    : `<div style="background: linear-gradient(135deg, #EC4899, #F59E0B); width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
       </div>`;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

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
    <Marker position={position} icon={createCustomIcon(true)}>
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

  const availableFacilities = Object.entries(room.facilities)
    .filter(([_, value]) => value === true)
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

            {/* Rating */}
            {room.rating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-gray-900">{room.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-500">({room.reviewCount} 則評論)</span>
              </div>
            )}
          </div>

          {/* Location info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-900">{room.address}</p>
                {room.floor && <p className="text-sm text-gray-600">{room.floor}</p>}
                {room.locationDescription && (
                  <p className="text-sm text-gray-500 mt-1">{room.locationDescription}</p>
                )}
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
            <div className="grid grid-cols-2 gap-3">
              {availableFacilities.map((facility) => (
                <div
                  key={facility}
                  className="flex items-center gap-2 p-3 bg-gradient-to-r from-pink-50 to-amber-50 rounded-xl"
                >
                  <div className="text-primary">
                    {getFacilityIcon(facility)}
                  </div>
                  <span className="text-sm text-gray-700">{getFacilityLabel(facility)}</span>
                </div>
              ))}
            </div>
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

const BabyOasisPage = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<NursingRoom | null>(null);
  const [nursingRooms] = useState<NursingRoom[]>(nursingRoomsTaipei);

  // Default center: Taipei 101
  const defaultCenter: [number, number] = [25.0340, 121.5645];

  const handleLocate = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
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
        <div className="p-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            BabyOasis
          </h1>
          <p className="text-sm text-gray-600 mt-1">找到最近的哺乳室</p>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={userLocation || defaultCenter}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        <LocationMarker position={userLocation} />

        {/* Nursing room markers with clustering */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
        >
          {nursingRooms.map((room) => (
            <Marker
              key={room.id}
              position={[room.latitude, room.longitude]}
              icon={createCustomIcon(false)}
              eventHandlers={{
                click: () => {
                  setSelectedRoom(room);
                },
              }}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-semibold">{room.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{room.address}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Locate me button */}
      <LocateButton onLocate={handleLocate} />

      {/* Room detail bottom sheet */}
      <RoomDetailSheet
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
    </div>
  );
};

export default BabyOasisPage;
