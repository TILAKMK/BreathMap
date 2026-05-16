'use client';

import dynamic from 'next/dynamic';
import { AQIData } from '@/lib/realTimeApis';
import { motion } from 'framer-motion';

const LiveSoundWaveform = dynamic(() => import('./LiveSoundWaveform').then((mod) => ({ default: mod.LiveSoundWaveform })), { ssr: false });

interface AtmosphericResonanceSectionProps {
  aqi: AQIData | null;
}

export function AtmosphericResonanceSection({ aqi }: AtmosphericResonanceSectionProps) {
  return (
    <motion.div
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
    >
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-3">
          Atmospheric Resonance
        </h2>
        <p className="text-sm text-cyan-400 uppercase tracking-[0.2em] font-bold">
          Real-time atmospheric particle vibration analysis
        </p>
      </div>

      {/* Waveform Container */}
      <div className="w-full h-80 bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 shadow-2xl overflow-hidden flex items-center justify-center">
        <div className="w-full h-full">
          <LiveSoundWaveform />
        </div>
      </div>

      {/* AQI Resonance Indicator */}
      {aqi && (
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4 text-center">
            <p className="text-xs text-white/40 uppercase tracking-[0.1em] font-bold mb-2">PM2.5</p>
            <p className="text-2xl font-black text-cyan-400">{aqi.pm25.toFixed(1)}</p>
          </div>
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4 text-center">
            <p className="text-xs text-white/40 uppercase tracking-[0.1em] font-bold mb-2">PM10</p>
            <p className="text-2xl font-black text-cyan-400">{aqi.pm10.toFixed(1)}</p>
          </div>
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4 text-center">
            <p className="text-xs text-white/40 uppercase tracking-[0.1em] font-bold mb-2">NO2</p>
            <p className="text-2xl font-black text-cyan-400">{aqi.no2.toFixed(1)}</p>
          </div>
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4 text-center">
            <p className="text-xs text-white/40 uppercase tracking-[0.1em] font-bold mb-2">O3</p>
            <p className="text-2xl font-black text-cyan-400">{aqi.o3.toFixed(1)}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default AtmosphericResonanceSection;
