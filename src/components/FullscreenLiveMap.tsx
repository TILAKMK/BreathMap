'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';
import { motion, AnimatePresence } from 'framer-motion';

// Use a public Mapbox token - alternatively you can use a tile provider without auth
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';

export function FullscreenLiveMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { location, aqi, loading } = useEnvironmentalData();

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    try {
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [location?.longitude || -122.4194, location?.latitude || 37.7749],
        zoom: 12,
        pitch: 60,
        bearing: -20,
        antialias: true
      });

      mapRef.current = map;

      map.on('load', () => {
        setMapLoaded(true);

        // Add 3D terrain and buildings for "NASA mission control" feel
        map.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

        // Add atmospheric fog
        map.setFog({
          'range': [0.5, 10],
          'color': '#050816',
          'high-color': '#0a0e27',
          'space-color': '#000000',
          'horizon-blend': 0.1
        });

        // Add location marker with pulse effect
        if (location) {
          addCustomMarker(map, [location.longitude, location.latitude]);
        }

        // Add AQI heatmap layer
        if (aqi) {
          addAQIHeatmapLayer(map, aqi.aqi);
        }
      });

      return () => {
        map.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      useOpenStreetMapFallback();
    }
  }, [location, aqi]);

  const addCustomMarker = (map: mapboxgl.Map, coords: [number, number]) => {
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.cssText = `
      width: 48px;
      height: 48px;
      background: radial-gradient(circle, #22d3ee 0%, transparent 70%);
      border: 1px solid rgba(34, 211, 238, 0.5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
      animation: mapPulse 4s infinite;
    `;
    
    const inner = document.createElement('div');
    inner.style.cssText = `
      width: 8px;
      height: 8px;
      background: #22d3ee;
      border-radius: 50%;
      box-shadow: 0 0 10px #22d3ee;
    `;
    el.appendChild(inner);

    new mapboxgl.Marker(el)
      .setLngLat(coords)
      .addTo(map);
  };

  const useOpenStreetMapFallback = () => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = `
      <div style="width:100%; height:100%; background:#050816; display:flex; align-items:center; justify-content:center;">
        <div style="text-align:center;">
          <div style="color:#22d3ee; font-size:48px; margin-bottom:16px;">🛰️</div>
          <div style="color:white; font-size:24px; font-weight:bold; letter-spacing:0.2em; text-transform:uppercase;">Map Satellite Offline</div>
          <div style="color:#94a3b8; font-size:12px; margin-top:8px; text-transform:uppercase; letter-spacing:0.1em;">Re-establishing Uplink...</div>
        </div>
      </div>
    `;
  };

  return (
    <div className="relative w-full h-full bg-[#050816] overflow-hidden">
      {/* Map Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,8,22,0.4)_100%)]" />
        
        {/* Scanning grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Map Interactive HUD */}
      <AnimatePresence>
        {mapLoaded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
          >
             {/* Center Crosshair */}
             <div className="relative w-64 h-64 border border-cyan-500/10 rounded-full">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-cyan-500/40" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-cyan-500/40" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-cyan-500/40" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-cyan-500/40" />
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes mapPulse {
          0% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 20px rgba(34, 211, 238, 0.3); }
          50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 40px rgba(34, 211, 238, 0.6); }
          100% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 20px rgba(34, 211, 238, 0.3); }
        }
        .mapboxgl-ctrl-bottom-right, .mapboxgl-ctrl-bottom-left { display: none !important; }
      `}</style>
    </div>
  );
}

function addAQIHeatmapLayer(map: mapboxgl.Map, aqi: number) {
  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return '#00F5D4';
    if (aqi <= 100) return '#FFEB3B';
    if (aqi <= 150) return '#FF9800';
    if (aqi <= 200) return '#FF5252';
    return '#9C27B0';
  };

  try {
    if (map.getSource('aqi-source')) map.removeSource('aqi-source');

    map.addSource('aqi-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [map.getCenter().lng, map.getCenter().lat] },
          properties: { aqi }
        }]
      }
    });

    if (map.getLayer('aqi-layer')) map.removeLayer('aqi-layer');

    map.addLayer({
      id: 'aqi-layer',
      type: 'heatmap',
      source: 'aqi-source',
      paint: {
        'heatmap-weight': 1,
        'heatmap-intensity': 3,
        'heatmap-color': [
          'interpolate', ['linear'], ['heatmap-density'],
          0, 'rgba(0,0,0,0)',
          0.2, 'rgba(34,211,238,0.2)',
          0.4, 'rgba(34,211,238,0.4)',
          0.6, getAQIColor(aqi),
          1, getAQIColor(aqi)
        ],
        'heatmap-radius': 100,
        'heatmap-opacity': 0.6
      }
    });
  } catch (e) {
    console.error('Heatmap Error:', e);
  }
}
