'use client';

import { motion } from 'framer-motion';
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';

export function FloatingAnalyticsOverlay() {
  const { aqi, weather, airFreshness } = useEnvironmentalData();

  if (!aqi || !weather) return null;

  const stats = [
    { label: 'Air Quality Index', value: aqi.aqi, unit: 'AQI', color: 'text-cyan-400', sub: 'Atmospheric Health', trend: [20, 25, 22, 30, 28, 35, 32, 40] },
    { label: 'Particulate Matter 2.5', value: aqi.pm25.toFixed(1), unit: 'μg/m³', color: 'text-white', sub: 'Micro-Dust', trend: [10, 12, 11, 15, 14, 18, 16, 20] },
    { label: 'Relative Humidity', value: weather.humidity, unit: '%', color: 'text-white', sub: 'Moisture Level', trend: [50, 52, 51, 55, 54, 58, 56, 60] },
    { label: 'Wind Velocity', value: weather.windSpeed.toFixed(1), unit: 'km/h', color: 'text-white', sub: 'Air Movement', trend: [5, 8, 6, 10, 9, 12, 10, 15] },
    { label: 'Ambient Temp', value: weather.temperature, unit: '°C', color: 'text-white', sub: 'Thermal Data', trend: [20, 21, 20, 22, 21, 23, 22, 24] },
    { label: 'Oxygen Purity', value: airFreshness?.score || 98.2, unit: '%', color: 'text-emerald-400', sub: 'Breathability', trend: [95, 96, 95, 97, 96, 98, 97, 99] },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex flex-col p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/5 transition-colors group relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            {/* Background Glow */}
            <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${stat.color === 'text-cyan-400' ? 'bg-cyan-500' : stat.color === 'text-emerald-400' ? 'bg-emerald-500' : 'bg-white'}`} />

            <div className="flex justify-between items-start mb-6 relative z-10">
              <span className="text-sm text-slate-400 font-bold tracking-[0.2em] uppercase">{stat.label}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.sub}</span>
            </div>
            
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-baseline gap-2">
                <span className={`text-6xl font-black tracking-tighter drop-shadow-md ${stat.color}`}>{stat.value}</span>
                <span className="text-sm text-slate-500 font-bold uppercase tracking-widest">{stat.unit}</span>
              </div>
              
              {/* Mini Trend Sparkline (Enlarged) */}
              <div className="w-full h-12 flex items-end justify-between gap-1 opacity-50 group-hover:opacity-100 transition-opacity mt-4">
                 {stat.trend.map((val, idx) => (
                    <motion.div 
                      key={idx}
                      className={`w-full rounded-t-sm ${stat.color === 'text-cyan-400' ? 'bg-cyan-500' : stat.color === 'text-emerald-400' ? 'bg-emerald-500' : 'bg-white/60'}`}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${(val / Math.max(...stat.trend)) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + idx * 0.05, duration: 0.8 }}
                    />
                 ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
