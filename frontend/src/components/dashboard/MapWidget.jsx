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

// Custom solar marker icon
const solarIcon = L.divIcon({
  className: 'custom-solar-marker',
  html: `<div style="
    width:32px;height:32px;border-radius:50%;
    background:linear-gradient(135deg,#F59E0B,#D97706);
    border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.3);
    display:flex;align-items:center;justify-content:center;
    font-size:16px;
  ">☀️</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20],
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
  hybrid: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Esri, Maxar',
  },
};

export default function MapWidget({ onLocationSelect, className }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const tileRef = useRef(null);
  const labelTileRef = useRef(null);

  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState('');
  const [mapType, setMapType] = useState('satellite');
  const [searchQuery, setSearchQuery] = useState('');
  const [locating, setLocating] = useState(false);
  const [searching, setSearching] = useState(false);

  // Initialize map — auto-detect user location on first load
  useEffect(() => {
    if (mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629], // Center of India
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
    });

    // Add zoom control to bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add attribution control (collapsed)
    L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map);

    tileRef.current = L.tileLayer(TILE_LAYERS.satellite.url, {
      attribution: TILE_LAYERS.satellite.attribution,
      maxZoom: 20,
    }).addTo(map);

    // Add labels overlay for satellite view
    labelTileRef.current = L.tileLayer(
      'https://stamen-tiles.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.png',
      { maxZoom: 20, opacity: 0.7 }
    ).addTo(map);

    // Click handler
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      placeMarker(map, lat, lng);
    });

    mapInstance.current = map;

    // Auto-detect location on first load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.setView([latitude, longitude], 18);
          placeMarker(map, latitude, longitude);
        },
        () => {
          // Keep default India view if denied
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    }

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Toggle map type
  useEffect(() => {
    if (!mapInstance.current || !tileRef.current) return;

    if (mapType === 'street') {
      tileRef.current.setUrl(TILE_LAYERS.street.url);
      if (labelTileRef.current) labelTileRef.current.setOpacity(0);
    } else {
      tileRef.current.setUrl(TILE_LAYERS.satellite.url);
      if (labelTileRef.current) labelTileRef.current.setOpacity(0.7);
    }
  }, [mapType]);

  const placeMarker = async (map, lat, lng) => {
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { icon: solarIcon }).addTo(map);
    }

    map.setView([lat, lng], Math.max(map.getZoom(), 18));
    setCoords({ lat: lat.toFixed(6), lng: lng.toFixed(6) });

    // Reverse geocode with detailed address
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      const addr = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

      // Add popup to marker with address
      markerRef.current.bindPopup(
        `<div style="font-family:Inter,sans-serif;font-size:12px;max-width:220px;">
          <strong style="color:#D97706;">📍 Selected Location</strong><br/>
          <span style="color:#334155;">${addr}</span><br/>
          <small style="color:#94a3b8;">${lat.toFixed(6)}°N, ${lng.toFixed(6)}°E</small>
        </div>`
      ).openPopup();

      setAddress(addr);
      onLocationSelect?.({ lat, lng, address: addr });
    } catch {
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      onLocationSelect?.({ lat, lng, address: '' });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data[0]) {
        const { lat, lon } = data[0];
        placeMarker(mapInstance.current, parseFloat(lat), parseFloat(lon));
      } else {
        // No results found
        setAddress('Location not found. Try a different search.');
      }
    } catch {
      setAddress('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setAddress('Geolocation not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        placeMarker(mapInstance.current, pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) {
          setAddress('Location permission denied. Please allow location access in your browser.');
        } else {
          setAddress('Could not determine location. Please search manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
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
        <button onClick={handleSearch} disabled={searching} className="btn-primary text-sm whitespace-nowrap">
          {searching ? 'Searching...' : 'Search'}
        </button>
        <button
          onClick={handleUseCurrentLocation}
          disabled={locating}
          className="btn-ghost flex items-center gap-1.5 text-sm whitespace-nowrap"
        >
          <HiOutlineGlobeAlt className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
          {locating ? 'Detecting...' : 'My Location'}
        </button>
      </div>

      {/* Map Container */}
      <div className="relative rounded-xl overflow-hidden border border-navy-200 dark:border-navy-700">
        <div ref={mapRef} style={{ height: 450, width: '100%' }} />

        {/* Map Type Toggle */}
        <div className="absolute top-3 right-3 z-[1000] flex gap-1 p-1 rounded-lg bg-navy-900/80 backdrop-blur-sm">
          {[
            { key: 'satellite', label: '🛰️ Satellite' },
            { key: 'street', label: '🗺️ Street' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setMapType(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                mapType === key
                  ? 'bg-solar-500 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Crosshair at center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999] pointer-events-none opacity-30">
          <div className="w-8 h-[1px] bg-white" />
          <div className="w-[1px] h-8 bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
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
              <p className="text-sm font-medium text-navy-900 dark:text-white">{address}</p>
              <p className="text-xs text-navy-500 dark:text-navy-400 font-mono mt-0.5">
                {coords.lat}°N, {coords.lng}°E
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Help text */}
      {!coords && (
        <p className="mt-3 text-xs text-navy-400 dark:text-navy-500 text-center">
          Click on the map to select a location, or use the search bar above
        </p>
      )}
    </motion.div>
  );
}
