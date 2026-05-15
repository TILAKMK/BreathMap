'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';
import { motion } from 'framer-motion';

// Use a public Mapbox token - alternatively you can use a tile provider without auth
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';

interface MapContainer {
  map: mapboxgl.Map | null;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function FullscreenLiveMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { location, aqi, weather, loading } = useEnvironmentalData();

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return;

    // Use a free tile provider (OpenStreetMap) instead of Mapbox
    mapboxgl.accessToken = MAPBOX_TOKEN;

    try {
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [location?.longitude || -122.4194, location?.latitude || 37.7749],
        zoom: 12,
        pitch: 45,
        bearing: 0,
      });

      mapRef.current = map;

      map.on('load', () => {
        setMapLoaded(true);

        // Add location marker with pulse effect
        if (location) {
          const el = document.createElement('div');
          el.className = 'location-marker';
          el.style.cssText = `
            width: 32px;
            height: 32px;
            background: radial-gradient(circle, #22d3ee 0%, rgba(34, 211, 238, 0.2) 100%);
            border: 2px solid #22d3ee;
            border-radius: 50%;
            box-shadow: 0 0 15px rgba(34, 211, 238, 0.5), inset 0 0 5px rgba(34, 211, 238, 0.5);
            animation: pulse 3s infinite;
          `;

          new mapboxgl.Marker(el)
            .setLngLat([location.longitude, location.latitude])
            .addTo(map);
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
      // Fallback: use open-street-map instead
      useOpenStreetMapFallback();
    }
  }, [location, aqi]);

  // Update map data in real-time
  useEffect(() => {
    if (!mapRef.current || !aqi) return;

    // Update AQI heatmap color dynamically
    updateAQIHeatmapColor(mapRef.current, aqi.aqi);
  }, [aqi]);

  const useOpenStreetMapFallback = () => {
    // Fallback implementation using canvas-based map or static map
    if (!containerRef.current) return;

    containerRef.current.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0a0e27 0%, #050816 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      ">
        <div style="
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(0, 245, 212, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse 3s infinite;
          opacity: 0.6;
        "></div>
        <div style="
          position: relative;
          z-index: 10;
          text-align: center;
        ">
          <div style="
            color: #00F5D4;
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 16px;
          ">📍</div>
          <div style="
            color: #FFFFFF;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
          ">Live Map Experience</div>
          <div style="
            color: #94A3B8;
            font-size: 14px;
          ">Environmental scanning active...</div>
        </div>
      </div>
    `;
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-[#0a0e27] to-[#050816] overflow-hidden">
      {/* Map Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
        style={{ minHeight: '100vh' }}
      />

      {/* Animated Pulse Ring */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          borderRadius: '50%',
          border: '1px solid rgba(34, 211, 238, 0.3)',
          width: '200px',
          height: '200px',
          left: location ? `calc(50% + ${location.longitude}px)` : '50%',
          top: location ? `calc(50% + ${location.latitude}px)` : '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Loading State */}
      {loading && (
        <motion.div
          className="absolute inset-0 bg-black/40 flex items-center justify-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-12 h-12 border-3 border-[#00F5D4] border-t-transparent rounded-full mb-4"
            />
            <p className="text-white text-lg">Scanning environment...</p>
          </div>
        </motion.div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            box-shadow: 0 0 20px #00F5D4, inset 0 0 10px rgba(0, 245, 212, 0.5);
          }
          50% {
            opacity: 0.8;
            box-shadow: 0 0 40px #00F5D4, inset 0 0 20px rgba(0, 245, 212, 0.8);
          }
        }
      `}</style>
    </div>
  );
}

function addAQIHeatmapLayer(map: mapboxgl.Map, aqi: number) {
  // Get AQI color based on value
  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return '#00F5D4'; // Green - Good
    if (aqi <= 100) return '#FFEB3B'; // Yellow - Moderate
    if (aqi <= 150) return '#FF9800'; // Orange - Warning
    if (aqi <= 200) return '#FF5252'; // Red - Bad
    return '#9C27B0'; // Purple - Very Bad
  };

  try {
    if (map.getSource('aqi-source')) {
      map.removeSource('aqi-source');
    }

    const circleRadius = Math.min(Math.max(aqi / 10, 500), 2000);

    map.addSource('aqi-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [map.getCenter().lng, map.getCenter().lat],
            },
            properties: { aqi },
          },
        ],
      },
    });

    if (map.getLayer('aqi-layer')) {
      map.removeLayer('aqi-layer');
    }

    map.addLayer({
      id: 'aqi-layer',
      type: 'circle',
      source: 'aqi-source',
      paint: {
        'circle-radius': circleRadius,
        'circle-color': getAQIColor(aqi),
        'circle-opacity': 0.2,
        'circle-stroke-width': 3,
        'circle-stroke-color': getAQIColor(aqi),
        'circle-stroke-opacity': 0.8,
      },
    });
  } catch (error) {
    console.error('Error adding AQI layer:', error);
  }
}

function updateAQIHeatmapColor(map: mapboxgl.Map, aqi: number) {
  try {
    const getAQIColor = (aqi: number): string => {
      if (aqi <= 50) return '#00F5D4';
      if (aqi <= 100) return '#FFEB3B';
      if (aqi <= 150) return '#FF9800';
      if (aqi <= 200) return '#FF5252';
      return '#9C27B0';
    };

    const color = getAQIColor(aqi);
    const layer = map.getLayer('aqi-layer');

    if (layer) {
      map.setPaintProperty('aqi-layer', 'circle-color', color);
      map.setPaintProperty('aqi-layer', 'circle-stroke-color', color);
    }
  } catch (error) {
    console.error('Error updating AQI color:', error);
  }
}
