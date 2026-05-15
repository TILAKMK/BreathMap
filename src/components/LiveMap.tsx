'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';
import { BreathSafetyZone } from '@/types';

interface LiveMapProps {
  center?: [number, number];
  zoom?: number;
  safetyZones?: BreathSafetyZone[];
  userLocation?: { lat: number; lng: number };
}

export function LiveMap({
  center = [0, 20],
  zoom = 3,
  safetyZones = [],
  userLocation
}: LiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Check if we have a valid API key
    const apiKey = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
    if (!apiKey) {
      console.warn('Mapbox API key not found - displaying placeholder map');
      return;
    }

    mapboxgl.accessToken = apiKey;

    // Create map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: center,
      zoom: zoom,
      pitch: 40,
      bearing: 0
    });

    // Add user location marker if available
    if (userLocation) {
      new mapboxgl.Marker({ color: '#00FF41' })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map.current);
    }

    // Add safety zones as circles
    map.current.on('load', () => {
      // Add safety zones layer
      safetyZones.forEach((zone, index) => {
        const circle = {
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [zone.center.lng, zone.center.lat]
          },
          properties: {}
        };

        // Add source
        if (!map.current!.getSource(`zone-${index}`)) {
          map.current!.addSource(`zone-${index}`, {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [circle]
            }
          });
        }

        // Add layer
        if (!map.current!.getLayer(`zone-layer-${index}`)) {
          map.current!.addLayer({
            id: `zone-layer-${index}`,
            type: 'circle',
            source: `zone-${index}`,
            paint: {
              'circle-radius': zone.radius * 100,
              'circle-color': zone.color,
              'circle-opacity': 0.3,
              'circle-stroke-width': 2,
              'circle-stroke-color': zone.color
            }
          });
        }
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [center, zoom, safetyZones, userLocation]);

  return (
    <motion.div
      ref={mapContainer}
      className="w-full h-screen rounded-2xl overflow-hidden border border-white/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
}
