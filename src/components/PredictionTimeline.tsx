'use client';

import { motion } from 'framer-motion';

export function PredictionTimeline() {
  const data = [
    { time: '00:00', aqi: 42 },
    { time: '04:00', aqi: 38 },
    { time: '08:00', aqi: 45 },
    { time: '12:00', aqi: 52 },
    { time: '16:00', aqi: 48 },
    { time: '20:00', aqi: 40 },
    { time: '24:00', aqi: 35 },
  ];

  const maxAQI = Math.max(...data.map((d) => d.aqi));

  return (
    <motion.div
      className="w-full bg-black/40 backdrop-blur-md border border-white/5 p-4 relative overflow-hidden"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* HUD Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[10px] text-cyan-500/60 font-bold tracking-[0.2em] uppercase">Atmospheric Timeline</span>
        </div>
        <div className="text-[8px] text-slate-500 tracking-[0.3em] uppercase">Forecast Mode: Active</div>
      </div>

      {/* Graph Visualization */}
      <div className="relative h-16 w-full flex items-end justify-between px-4">
        {/* Horizontal Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between opacity-5">
          <div className="w-full h-[1px] bg-white" />
          <div className="w-full h-[1px] bg-white" />
          <div className="w-full h-[1px] bg-white" />
        </div>

        {/* Bars/Points */}
        {data.map((item, i) => (
          <div key={i} className="relative flex flex-col items-center group">
            <motion.div
              className="w-[2px] bg-gradient-to-t from-cyan-500/20 to-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
              initial={{ height: 0 }}
              animate={{ height: `${(item.aqi / maxAQI) * 100}%` }}
              transition={{ delay: i * 0.1 + 0.5, duration: 1 }}
            />
            <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-cyan-400 font-mono">{item.aqi}</span>
            </div>
            <span className="text-[8px] text-slate-600 mt-2 font-medium">{item.time}</span>
          </div>
        ))}

        {/* Connected Line (Visual decoration) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none">
          <motion.path
            d={`M 0 50 Q 100 20 200 40 T 400 30 T 600 50 T 800 20 T 1000 40`}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, delay: 1 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Footer Info */}
      <div className="mt-4 px-2 flex justify-between border-t border-white/5 pt-2">
        <div className="text-[7px] text-slate-700 uppercase tracking-widest">Data Source: Sentinel-5P</div>
        <div className="text-[7px] text-slate-700 uppercase tracking-widest">Update Frequency: 60s</div>
      </div>
    </motion.div>
  );
}
