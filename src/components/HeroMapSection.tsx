'use client';

import dynamic from 'next/dynamic';
import { AQIData, WeatherData, LocationData } from '@/lib/realTimeApis';
import { motion } from 'framer-motion';

const FullscreenLiveMap = dynamic(() => import('./FullscreenLiveMap').then((mod) => ({ default: mod.FullscreenLiveMap })), { ssr: false });
const FloatingAnalyticsOverlay = dynamic(() => import('./FloatingAnalyticsOverlay').then((mod) => ({ default: mod.FloatingAnalyticsOverlay })), { ssr: false });
const RadarScan = dynamic(() => import('./RadarScan').then((mod) => ({ default: mod.RadarScan })), { ssr: false });
const AIScanMode = dynamic(() => import('./AIScanMode').then((mod) => ({ default: mod.AIScanMode })), { ssr: false });

interface HeroMapSectionProps {
  aqi: AQIData | null;
  weather: WeatherData | null;
  location: LocationData | null;
  locationName: string;
}

export function HeroMapSection({ aqi, weather, location, locationName }: HeroMapSectionProps) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Fullscreen Map */}
      <div className="absolute inset-0 z-10">
        <FullscreenLiveMap />
      </div>

      {/* Atmospheric Overlay Vignette */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(2,4,8,0.6)_100%)]" />

      {/* Left Overlay: Environment Stats Card */}
      <motion.div
        className="absolute left-8 top-32 bottom-32 w-80 z-30 pointer-events-auto"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="h-full bg-black/60 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl p-8 shadow-2xl overflow-y-auto">
          <h3 className="text-xs text-cyan-400 uppercase tracking-[0.2em] font-black mb-6">ENVIRONMENT STATS</h3>
          
          <div className="space-y-4">
            {/* AQI */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-[0.1em] font-bold mb-1">Air Quality Index</p>
                <p className="text-4xl font-black text-cyan-400">{aqi?.aqi || '—'}</p>
              </div>
              <div className={`w-2 h-12 rounded-full ${
                !aqi ? 'bg-white/30' : aqi.aqi <= 50 ? 'bg-emerald-500' : aqi.aqi <= 100 ? 'bg-yellow-400' : aqi.aqi <= 150 ? 'bg-orange-400' : 'bg-red-500'
              }`} />
            </div>

            <div className="w-full h-px bg-white/10" />

            {/* PM2.5 */}
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-white/50 uppercase tracking-[0.1em] font-bold">PM2.5</span>
              <span className="text-2xl font-black text-white">{aqi?.pm25.toFixed(1) || '—'} <span className="text-xs text-white/50">μg/m³</span></span>
            </div>

            {/* Temperature */}
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-white/50 uppercase tracking-[0.1em] font-bold">Temperature</span>
              <span className="text-2xl font-black text-white">{weather?.temperature || '—'} <span className="text-xs text-white/50">°C</span></span>
            </div>

            {/* Humidity */}
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-white/50 uppercase tracking-[0.1em] font-bold">Humidity</span>
              <span className="text-2xl font-black text-white">{weather?.humidity || '—'} <span className="text-xs text-white/50">%</span></span>
            </div>

            {/* Wind Speed */}
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-white/50 uppercase tracking-[0.1em] font-bold">Wind Speed</span>
              <span className="text-2xl font-black text-white">{weather?.windSpeed.toFixed(1) || '—'} <span className="text-xs text-white/50">km/h</span></span>
            </div>

            {/* Oxygen Level */}
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-white/50 uppercase tracking-[0.1em] font-bold">Oxygen Level</span>
              <span className="text-2xl font-black text-emerald-400">20.6 <span className="text-xs text-white/50">%</span></span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Overlay: AI Neural Core + Radar */}
      <motion.div
        className="absolute right-8 top-32 bottom-32 w-80 z-30 pointer-events-auto flex flex-col gap-6"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* AI Scan Mode */}
        <div className="flex-1 min-h-0">
          <AIScanMode />
        </div>

        {/* Radar Scan */}
        <div className="flex-1 min-h-0">
          <RadarScan />
        </div>
      </motion.div>

      {/* Bottom Overlay: Data Source Info */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-8 py-3 text-center">
          <p className="text-xs text-white/60 uppercase tracking-[0.2em] font-bold">
            Data Source: Sentinel-5P • Update Frequency: 60s • Coordinates: {location?.latitude.toFixed(2)}°, {location?.longitude.toFixed(2)}°
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default HeroMapSection;
