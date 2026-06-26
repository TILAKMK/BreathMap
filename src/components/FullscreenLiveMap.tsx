'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

export function FullscreenLiveMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [gpsAllowed, setGpsAllowed] = useState<boolean | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number }>({ lat: 12.2958, lon: 76.6394 });

  // Function to create or update the custom futuristic marker
  const updateMarker = (lat: number, lon: number) => {
    if (!mapRef.current) return;

    const markerHtml = `
      <div style="
        width: 60px;
        height: 60px;
        background: radial-gradient(circle, rgba(0,200,255,0.3) 0%, transparent 70%);
        border: 2px solid rgba(0,200,255,0.6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: mapPulse 2s infinite;
        box-shadow: 0 0 20px rgba(0,200,255,0.3);
      ">
        <div style="
          width: 12px;
          height: 12px;
          background: #00c8ff;
          border-radius: 50%;
          box-shadow: 0 0 15px #00c8ff;
        "></div>
      </div>
    `;

    const icon = L.divIcon({
      html: markerHtml,
      iconSize: [60, 60],
      iconAnchor: [30, 30],
      className: 'custom-marker-icon',
    });

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lon]);
      markerRef.current.setIcon(icon);
    } else {
      markerRef.current = L.marker([lat, lon], { icon }).addTo(mapRef.current);
    }
  };

  // 1. Initial Geolocation Request and Position Watching on Mount
  useEffect(() => {
    let watchId: number | null = null;
    let isFirstLoad = true;

    const setupGeolocation = () => {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            setGpsAllowed(true);
            setCoords({ lat, lon });

            // Sync with global appState
            if (window.appState) {
              window.appState.lat = lat;
              window.appState.lon = lon;
            }

            // Sync coordinate element in standard UI
            const coordsEl = document.getElementById('map-coords');
            if (coordsEl) {
              coordsEl.textContent = `COORDINATES: ${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
            }

            if (mapRef.current) {
              if (isFirstLoad) {
                mapRef.current.setView([lat, lon], 12);
                isFirstLoad = false;
              } else {
                mapRef.current.panTo([lat, lon], { animate: true, duration: 1 });
              }
              updateMarker(lat, lon);
            }

            // Trigger environmental data fetch and update navbar city
            if (typeof window.fetchEnvironmentalData === 'function') {
              window.fetchEnvironmentalData();
            }
          },
          (err) => {
            console.log('Location access denied or failed, switching to manual mode:', err);
            setGpsAllowed(false);

            // Default fallback is Mysore
            const defaultLat = 12.2958;
            const defaultLon = 76.6394;
            setCoords({ lat: defaultLat, lon: defaultLon });

            if (window.appState) {
              window.appState.lat = defaultLat;
              window.appState.lon = defaultLon;
            }

            const coordsEl = document.getElementById('map-coords');
            if (coordsEl) {
              coordsEl.textContent = `COORDINATES: ${defaultLat.toFixed(4)}°, ${defaultLon.toFixed(4)}°`;
            }

            if (mapRef.current) {
              mapRef.current.setView([defaultLat, defaultLon], 12);
              updateMarker(defaultLat, defaultLon);
            }

            if (typeof window.fetchEnvironmentalData === 'function') {
              window.fetchEnvironmentalData();
            }
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      } else {
        setGpsAllowed(false);
      }
    };

    setupGeolocation();

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    try {
      const map = L.map(containerRef.current, {
        center: [coords.lat, coords.lon],
        zoom: 12,
        zoomControl: true,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: true,
      });

      // CartoDB Dark tile layer
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          subdomains: 'abcd',
          maxZoom: 20,
        }
      ).addTo(map);

      mapRef.current = map;
      setTimeout(() => setMapLoaded(true), 500);

      // Render initial marker
      updateMarker(coords.lat, coords.lon);

      return () => {
        if (mapRef.current) {
          mapRef.current.off();
          mapRef.current.remove();
          mapRef.current = null;
          markerRef.current = null;
        }
      };
    } catch (e) {
      console.error('Error initializing map:', e);
    }
  }, []);

  // 3. Update map click handler when gpsAllowed changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      // If GPS is allowed, map click manual selection is disabled
      if (gpsAllowed === true) return;

      const { lat, lng } = e.latlng;
      setCoords({ lat, lon: lng });

      // Save as active location in global appState
      if (window.appState) {
        window.appState.lat = lat;
        window.appState.lon = lng;
      }

      // Update coordinate text in standard UI
      const coordsEl = document.getElementById('map-coords');
      if (coordsEl) {
        coordsEl.textContent = `COORDINATES: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
      }

      // Update marker and center map
      updateMarker(lat, lng);
      map.panTo([lat, lng], { animate: true, duration: 0.5 });

      // Fetch environmental data & update navbar
      if (typeof window.fetchEnvironmentalData === 'function') {
        window.fetchEnvironmentalData();
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [gpsAllowed]);

  // 4. ResizeObserver to handle map invalidation on layout changes (e.g. from display: none to block)
  useEffect(() => {
    if (!containerRef.current || !mapRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      mapRef.current?.invalidateSize();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [mapLoaded]);

  return (
    <div className="relative w-full h-full bg-black/40 overflow-hidden border border-cyan-500/12 rounded-xl backdrop-blur-md">
      {/* Map Element */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full" 
        style={{ zIndex: 1 }}
      />

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />
        
        {/* Futuristic Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.025]" 
          style={{
            backgroundImage: 'linear-gradient(#00c8ff 1px, transparent 1px), linear-gradient(90deg, #00c8ff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Loading HUD */}
      {!mapLoaded && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20 bg-black/50 backdrop-blur-md"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2.2, duration: 0.4 }}
        >
          <div className="text-center">
            <div className="text-4xl mb-3">📡</div>
            <p className="text-cyan-400 font-bold text-xs uppercase tracking-[0.25em] mb-2 font-mono">
              CONNECTING SATELLITE ARRAY
            </p>
            <div className="flex gap-1 justify-center">
              <motion.div
                className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <motion.div
                className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Map Info HUD */}
      {mapLoaded && (
        <motion.div
          className="absolute bottom-4 left-4 z-20 pointer-events-none"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-black/75 backdrop-blur-xl border border-cyan-500/25 rounded-md px-3 py-2 text-[10px] text-cyan-400 font-mono">
            <p className="font-bold">COORD: {coords.lat.toFixed(5)}°, {coords.lon.toFixed(5)}°</p>
            <p className="text-white/50 mt-0.5">STATUS: {gpsAllowed === true ? 'LIVE GPS LINK' : gpsAllowed === false ? 'MANUAL LINK' : 'ESTABLISHING...'}</p>
          </div>
        </motion.div>
      )}

      <style jsx global>{`
        @keyframes mapPulse {
          0% { transform: scale(0.85); opacity: 0.5; }
          50% { transform: scale(1); opacity: 0.95; }
          100% { transform: scale(0.85); opacity: 0.5; }
        }
        .leaflet-control-container { z-index: 15 !important; }
        .custom-marker-icon { filter: drop-shadow(0 0 12px rgba(0, 200, 255, 0.65)) !important; }
        .leaflet-bar {
          background: rgba(4, 18, 32, 0.8) !important;
          border: 1px solid rgba(0, 229, 255, 0.25) !important;
          backdrop-filter: blur(12px);
        }
        .leaflet-bar a {
          color: #00e5ff !important;
          background: transparent !important;
          border-bottom: 1px solid rgba(0, 229, 255, 0.15) !important;
        }
        .leaflet-bar a:hover {
          background: rgba(0, 229, 255, 0.15) !important;
        }
      `}</style>
    </div>
  );
}

export default FullscreenLiveMap;
