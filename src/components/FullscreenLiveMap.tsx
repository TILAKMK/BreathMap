'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';
import { motion } from 'framer-motion';

// Leaflet default icon fix
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

export function FullscreenLiveMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { location, aqi } = useEnvironmentalData();

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    try {
      // Create map with CartoDB dark tiles (no token needed)
      const map = L.map(containerRef.current, {
        center: [location?.latitude || 12.2958, location?.longitude || 76.6394],
        zoom: 12,
        zoomControl: true,
        attributionControl: true,
        dragging: true,
        scrollWheelZoom: true,
      });

      // CartoDB Dark tile layer
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20,
        }
      ).addTo(map);

      mapRef.current = map;
      
      // Wait for map to be fully ready
      setTimeout(() => setMapLoaded(true), 500);

      if (location) {
        // Add pulsing location marker
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
          className: 'custom-marker-icon',
        });

        const marker = L.marker([location.latitude, location.longitude], { icon })
          .addTo(map);

        markerRef.current = marker;

        // Add AQI-based circle indicator
        const aqiColor = !aqi
          ? '#00c8ff'
          : aqi.aqi <= 50
          ? '#00ff88'
          : aqi.aqi <= 100
          ? '#ffaa00'
          : aqi.aqi <= 150
          ? '#ff7700'
          : '#ff3535';

        const circle = L.circle([location.latitude, location.longitude], {
          color: aqiColor,
          fillColor: aqiColor,
          fillOpacity: 0.1,
          weight: 2,
          radius: 500,
          dashArray: '5, 5',
        }).addTo(map);

        circleRef.current = circle;
      }

      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, []);

  // Update marker and circle when location changes
  useEffect(() => {
    if (!mapRef.current || !location) return;

    mapRef.current.panTo([location.latitude, location.longitude], { animate: true, duration: 1 });

    if (circleRef.current && aqi) {
      const aqiColor = aqi.aqi <= 50
        ? '#00ff88'
        : aqi.aqi <= 100
        ? '#ffaa00'
        : aqi.aqi <= 150
        ? '#ff7700'
        : '#ff3535';

      circleRef.current.setStyle({
        color: aqiColor,
        fillColor: aqiColor,
      });
    }
  }, [location, aqi]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Map Container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full" 
        style={{ zIndex: 1 }}
      />

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.4)_100%)]" />
        
        {/* Grid overlay - subtle */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: 'linear-gradient(#00c8ff 1px, transparent 1px), linear-gradient(90deg, #00c8ff 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Loading state */}
      {!mapLoaded && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <div className="text-center">
            <div className="text-4xl mb-4">🛰️</div>
            <p className="text-cyan-400 font-bold text-sm uppercase tracking-[0.2em] mb-2">
              Initializing Live Map
            </p>
            <div className="flex gap-1 justify-center">
              <motion.div
                className="w-2 h-2 bg-cyan-400 rounded-full"
                animate={{ scale: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="w-2 h-2 bg-cyan-400 rounded-full"
                animate={{ scale: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-cyan-400 rounded-full"
                animate={{ scale: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Map Info HUD */}
      {mapLoaded && location && (
        <motion.div
          className="absolute bottom-8 left-8 z-20 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-lg px-4 py-3 text-xs text-cyan-400 font-mono">
            <p className="font-bold">Coordinates: {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°</p>
            <p className="text-white/60 mt-1">Accuracy: ±{Math.round(location.accuracy)}m</p>
          </div>
        </motion.div>
      )}

      <style jsx global>{`
        @keyframes mapPulse {
          0% { transform: scale(0.8); opacity: 0.4; }
          50% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(0.8); opacity: 0.4; }
        }
        .leaflet-control-container { z-index: 15 !important; }
        .custom-marker-icon { filter: drop-shadow(0 0 10px rgba(0, 200, 255, 0.5)) !important; }
      `}</style>
    </div>
  );
}

export default FullscreenLiveMap;
