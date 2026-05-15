'use client';

import { motion } from 'framer-motion';
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';

export function FloatingAnalyticsOverlay() {
  const { aqi, weather, airFreshness, co2Exposure } = useEnvironmentalData();

  if (!aqi || !weather) return null;

  const stats = [
    { label: 'AQI', value: aqi.aqi, unit: 'Index', color: 'text-cyan-400' },
    { label: 'PM2.5', value: aqi.pm25.toFixed(1), unit: 'μg/m³', color: 'text-white' },
    { label: 'TEMP', value: weather.temperature, unit: '°C', color: 'text-white' },
    { label: 'HUMIDITY', value: weather.humidity, unit: '%', color: 'text-white' },
    { label: 'WIND', value: weather.windSpeed.toFixed(1), unit: 'km/h', color: 'text-white' },
    { label: 'OXYGEN', value: airFreshness?.score || 98, unit: '% Richness', color: 'text-emerald-400' },
  ];

  return (
    <motion.div
      className="flex flex-col gap-2 w-48"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* HUD Header */}
      <div className="flex items-center gap-2 mb-2 px-2">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
        <span className="text-[10px] text-cyan-500/60 font-bold tracking-[0.2em] uppercase">Environment</span>
      </div>

      {/* Stats List */}
      <div className="flex flex-col gap-1">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="group relative flex items-center justify-between p-3 bg-black/40 backdrop-blur-md border border-white/5 hover:border-cyan-500/30 transition-all duration-300"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 + 0.5 }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-500/20 group-hover:bg-cyan-500 transition-colors" />
            
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mb-0.5">{stat.label}</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-lg font-mono font-bold ${stat.color}`}>{stat.value}</span>
                <span className="text-[8px] text-slate-600 font-medium">{stat.unit}</span>
              </div>
            </div>

            {/* Micro-sparkline or indicator */}
            <div className="w-8 h-[1px] bg-white/5 overflow-hidden">
               <motion.div 
                 className={`h-full ${stat.color.replace('text-', 'bg-')}/40`}
                 animate={{ x: ['-100%', '100%'] }}
                 transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
               />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-4 px-2">
        <div className="text-[8px] text-slate-600 tracking-widest uppercase mb-1">Status: Operational</div>
        <div className="h-[1px] w-full bg-gradient-to-r from-cyan-500/20 to-transparent" />
      </div>
    </motion.div>
  );
}
