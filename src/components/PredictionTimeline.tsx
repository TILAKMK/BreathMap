'use client';

import { motion } from 'framer-motion';

export function PredictionTimeline() {
  const data = [
    { time: '00:00', aqi: 42, temp: 22, wind: 12 },
    { time: '04:00', aqi: 38, temp: 20, wind: 10 },
    { time: '08:00', aqi: 45, temp: 21, wind: 15 },
    { time: '12:00', aqi: 52, temp: 24, wind: 18 },
    { time: '16:00', aqi: 48, temp: 25, wind: 16 },
    { time: '20:00', aqi: 40, temp: 23, wind: 14 },
    { time: '24:00', aqi: 35, temp: 21, wind: 11 },
  ];

  const maxAQI = Math.max(...data.map((d) => d.aqi));

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
         <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-cyan-500 rounded-sm" />
               <span className="text-[10px] text-white font-black tracking-[0.2em] uppercase">Atmospheric Projection Matrix</span>
            </div>
            <div className="h-3 w-[1px] bg-white/10" />
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">24-Hour Forecast Cycle</span>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40" />
               <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">AQI Trend</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
               <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Confidence: High</span>
            </div>
         </div>
      </div>

      {/* Main Timeline Visualization */}
      <div className="relative h-24 w-full flex items-end justify-between px-12">
        {/* Horizontal Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between opacity-[0.03] pointer-events-none">
          <div className="w-full h-[1px] bg-white" />
          <div className="w-full h-[1px] bg-white" />
          <div className="w-full h-[1px] bg-white" />
          <div className="w-full h-[1px] bg-white" />
        </div>

        {/* Data Columns */}
        {data.map((item, i) => (
          <div key={i} className="relative flex flex-col items-center group">
            {/* Wind Vector (Decoration) */}
            <motion.div 
               className="absolute -top-12 w-[1px] bg-cyan-500/20"
               initial={{ height: 0 }}
               animate={{ height: item.wind * 2 }}
            />
            
            {/* AQI Bar */}
            <div className="relative w-12 flex flex-col items-center">
              <motion.div
                className="w-1 bg-gradient-to-t from-cyan-500/10 to-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)] rounded-t-full"
                initial={{ height: 0 }}
                animate={{ height: `${(item.aqi / maxAQI) * 60}px` }}
                transition={{ delay: i * 0.05, duration: 1 }}
              />
              {/* Secondary Value (Temp) */}
              <motion.div 
                className="absolute w-6 h-[1px] bg-emerald-500/40"
                style={{ bottom: `${(item.temp / 30) * 100}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            </div>

            {/* Hover Tooltip Placeholder */}
            <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/80 border border-cyan-500/30 px-3 py-2 rounded-sm backdrop-blur-md z-50 pointer-events-none">
               <p className="text-[8px] text-cyan-400 font-black uppercase mb-1">T-{item.time}</p>
               <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <span className="text-[7px] text-slate-500 uppercase">AQI: {item.aqi}</span>
                  <span className="text-[7px] text-slate-500 uppercase">Temp: {item.temp}°C</span>
               </div>
            </div>

            {/* X-Axis Label */}
            <div className="mt-4 flex flex-col items-center">
               <span className="text-[9px] font-mono font-black text-white/80 group-hover:text-cyan-400 transition-colors">{item.time}</span>
               <div className="w-[1px] h-2 bg-white/10 mt-1" />
            </div>
          </div>
        ))}

        {/* Decorative Connected Area */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]" preserveAspectRatio="none">
          <motion.path
            d={`M 0 80 Q 10% 40, 20% 60 T 40% 30 T 60% 50 T 80% 20 T 100% 40 L 100 100 L 0 100 Z`}
            fill="url(#area-gradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          />
          <defs>
            <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Footer Metrics */}
      <div className="flex justify-between items-center px-4 pt-2">
         <div className="flex gap-8">
            <div className="flex flex-col">
               <span className="text-[7px] text-slate-600 uppercase font-black tracking-widest">Mean Projection</span>
               <span className="text-[10px] text-white font-mono">42.85 index</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[7px] text-slate-600 uppercase font-black tracking-widest">Anomaly Risk</span>
               <span className="text-[10px] text-emerald-500 font-mono">Low (< 4%)</span>
            </div>
         </div>
         <div className="text-[7px] text-slate-700 uppercase tracking-[0.4em]">Predictive Engine: Neural-X v9.1</div>
      </div>
    </div>
  );
}
