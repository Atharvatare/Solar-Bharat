import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMapPin, HiOutlineGlobeAlt } from 'react-icons/hi2';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const TILE_LAYERS = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri, Maxar, Earthstar Geographics',
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
  },
};

export default function MapWidget({ onLocationSelect, className }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const tileRef = useRef(null);

  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState('');
  const [mapType, setMapType] = useState('satellite');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize map
  useEffect(() => {
    if (mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629], // Center of India
      zoom: 5,
      zoomControl: true,
    });

    tileRef.current = L.tileLayer(TILE_LAYERS.satellite.url, {
      attribution: TILE_LAYERS.satellite.attribution,
      maxZoom: 19,
    }).addTo(map);

    // Click handler
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      placeMarker(map, lat, lng);
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Toggle satellite/street
  useEffect(() => {
    if (!mapInstance.current || !tileRef.current) return;
    tileRef.current.setUrl(TILE_LAYERS[mapType].url);
  }, [mapType]);

  const placeMarker = async (map, lat, lng) => {
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(map);
    }

    map.setView([lat, lng], Math.max(map.getZoom(), 17));
    setCoords({ lat: lat.toFixed(6), lng: lng.toFixed(6) });

    // Reverse geocode
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`
      );
      const data = await res.json();
      const addr = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setAddress(addr);
      onLocationSelect?.({ lat, lng, address: addr });
    } catch {
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      onLocationSelect?.({ lat, lng, address: '' });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=in`
      );
      const data = await res.json();
      if (data[0]) {
        const { lat, lon } = data[0];
        placeMarker(mapInstance.current, parseFloat(lat), parseFloat(lon));
      }
    } catch {
      // Silently fail
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        placeMarker(mapInstance.current, pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        // Fallback: Delhi
        placeMarker(mapInstance.current, 28.6139, 77.2090);
      },
      { timeout: 5000 }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass p-5 rounded-2xl ${className || ''}`}
    >
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex-1 relative">
          <HiOutlineMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search address, city, or pincode..."
            className="input-solar pl-10 text-sm"
          />
        </div>
        <button onClick={handleSearch} className="btn-primary text-sm whitespace-nowrap">
          Search
        </button>
        <button
          onClick={handleUseCurrentLocation}
          className="btn-ghost flex items-center gap-1.5 text-sm whitespace-nowrap"
        >
          <HiOutlineGlobeAlt className="w-4 h-4" />
          My Location
        </button>
      </div>

      {/* Map Container */}
      <div className="relative rounded-xl overflow-hidden border border-navy-200 dark:border-navy-700">
        <div ref={mapRef} style={{ height: 400, width: '100%' }} />

        {/* Map Type Toggle */}
        <div className="absolute top-3 right-3 z-[1000] flex gap-1 p-1 rounded-lg bg-navy-900/80 backdrop-blur-sm">
          {['satellite', 'street'].map((type) => (
            <button
              key={type}
              onClick={() => setMapType(type)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                mapType === type
                  ? 'bg-solar-500 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {type === 'satellite' ? '🛰️ Satellite' : '🗺️ Street'}
            </button>
          ))}
        </div>
      </div>

      {/* Coordinates Display */}
      {coords && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 rounded-xl bg-navy-50 dark:bg-navy-800/50"
        >
          <div className="flex items-start gap-2">
            <HiOutlineMapPin className="w-4 h-4 text-solar-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-navy-900 dark:text-white truncate">{address}</p>
              <p className="text-xs text-navy-500 dark:text-navy-400 font-mono mt-0.5">
                {coords.lat}°N, {coords.lng}°E
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
