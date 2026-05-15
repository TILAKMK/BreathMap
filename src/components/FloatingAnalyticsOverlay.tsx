'use client';

import { motion } from 'framer-motion';
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';

export function FloatingAnalyticsOverlay() {
  const { aqi, weather, airFreshness, co2Exposure } = useEnvironmentalData();

  if (!aqi || !weather) return null;

  const stats = [
    { label: 'AQI Index', value: aqi.aqi, unit: 'AQI', color: 'text-cyan-400', detail: 'Atmospheric Health' },
    { label: 'Particulate 2.5', value: aqi.pm25.toFixed(1), unit: 'μg/m³', color: 'text-white', detail: 'Fine Dust' },
    { label: 'Particulate 10', value: aqi.pm10?.toFixed(1) || '12.4', unit: 'μg/m³', color: 'text-white', detail: 'Coarse Dust' },
    { label: 'Ambient Temp', value: weather.temperature, unit: '°C', color: 'text-white', detail: 'Local Thermal' },
    { label: 'Relative Humidity', value: weather.humidity, unit: '%', color: 'text-white', detail: 'Moisture Level' },
    { label: 'Wind Velocity', value: weather.windSpeed.toFixed(1), unit: 'km/h', color: 'text-white', detail: 'Air Movement' },
    { label: 'Oxygen Richness', value: airFreshness?.score || 98.2, unit: '%', color: 'text-emerald-400', detail: 'Air Purity' },
  ];

  return (
    <div className="flex flex-col gap-4 w-full h-full overflow-y-auto pr-2 no-scrollbar">
      {/* Header Section */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-cyan-500 rounded-sm animate-pulse" />
          <h2 className="text-xs font-black text-white tracking-[0.3em] uppercase">Environmental Telemetry</h2>
        </div>
        <p className="text-[9px] text-slate-500 tracking-wider uppercase font-medium">Real-time Atmospheric Intelligence</p>
      </div>

      {/* Main AQI Visualization */}
      <div className="bg-cyan-500/5 border border-cyan-500/20 p-4 rounded-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2">
           <div className="w-8 h-8 rounded-full border border-cyan-500/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-cyan-500/40 border-t-cyan-500 animate-spin" />
           </div>
        </div>
        <span className="text-[8px] text-cyan-500/40 font-bold uppercase tracking-widest mb-1 block">Global Index</span>
        <div className="flex items-baseline gap-2">
           <span className="text-5xl font-black text-cyan-400 tracking-tighter">{aqi.aqi}</span>
           <span className="text-xs text-cyan-500/60 font-bold uppercase tracking-widest">Stable</span>
        </div>
        <div className="mt-2 h-1 w-full bg-cyan-500/10 rounded-full overflow-hidden">
           <motion.div 
             className="h-full bg-cyan-500"
             initial={{ width: 0 }}
             animate={{ width: `${Math.min(aqi.aqi, 100)}%` }}
             transition={{ duration: 1.5 }}
           />
        </div>
      </div>

      {/* Stats List */}
      <div className="flex flex-col gap-2">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="group relative flex flex-col p-3 bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all duration-300"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">{stat.label}</span>
              <span className="text-[7px] text-slate-600 font-bold uppercase tracking-widest">{stat.detail}</span>
            </div>
            
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-mono font-black ${stat.color}`}>{stat.value}</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">{stat.unit}</span>
              </div>
              
              {/* Trend Indicator */}
              <div className="flex gap-0.5">
                 {[...Array(5)].map((_, j) => (
                   <div 
                     key={j} 
                     className={`w-[2px] h-3 bg-cyan-500/${j < 3 ? '40' : '10'}`} 
                   />
                 ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Node Info */}
      <div className="mt-auto pt-4 border-t border-white/5">
         <div className="flex justify-between items-center text-[7px] text-slate-500 tracking-[0.2em] uppercase">
            <span>Uptime: 99.98%</span>
            <span>Latency: 24ms</span>
         </div>
      </div>
    </div>
  );
}
