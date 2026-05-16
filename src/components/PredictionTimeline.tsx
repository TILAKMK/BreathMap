'use client';

import { motion } from 'framer-motion';

export function PredictionTimeline() {
  // Mock data for graphs
  const aqiTrend = [35, 42, 38, 55, 62, 48, 40, 35, 42, 50, 45, 38];
  const pollutionSpikes = [0.2, 0.4, 0.1, 0.8, 0.9, 0.5, 0.3, 0.2, 0.6, 0.4, 0.2, 0.1];
  const forecastLabels = ['-12h', '-10h', '-8h', '-6h', '-4h', '-2h', 'NOW', '+2h', '+4h', '+6h', '+8h', '+10h'];

  const maxAQI = Math.max(...aqiTrend);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
         <div className="flex items-center gap-4">
            <h3 className="text-sm font-black text-white tracking-[0.2em] uppercase glow-text">Atmospheric Analytics Matrix</h3>
            <div className="h-4 w-[1px] bg-white/20" />
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Global Predictive Model v9.2</span>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
               <span className="text-[9px] text-white/60 uppercase font-bold tracking-widest">Live AQI Trend</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
               <span className="text-[9px] text-white/60 uppercase font-bold tracking-widest">Pollution Spikes</span>
            </div>
         </div>
      </div>

      {/* Main Graphs Container */}
      <div className="flex-1 flex gap-8">
         
         {/* Left Graph: Large Area Chart (AQI Trend & Forecast) */}
         <div className="flex-[2] relative flex flex-col">
            <div className="absolute top-0 right-0 text-right">
               <span className="text-[10px] text-white/40 uppercase font-black tracking-widest block">24H Trend Analysis</span>
               <span className="text-lg font-black text-cyan-400">Stable Pattern</span>
            </div>

            <div className="flex-1 relative mt-6 border-b border-white/10">
               {/* Grid Lines */}
               <div className="absolute inset-0 flex flex-col justify-between opacity-[0.05] pointer-events-none">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-full h-[1px] bg-white" />
                  ))}
               </div>

               {/* Area Chart SVG */}
               <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                 <defs>
                    <linearGradient id="aqiArea" x1="0%" y1="0%" x2="0%" y2="100%">
                       <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                       <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                    </linearGradient>
                 </defs>
                 <motion.path
                   d={`M 0 100 ${aqiTrend.map((d, i) => `L ${i * (100 / (aqiTrend.length - 1))}% ${100 - ((d / maxAQI) * 90)}%`).join(' ')} L 100% 100% Z`}
                   fill="url(#aqiArea)"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ duration: 1.5 }}
                 />
                 <motion.path
                   d={`M 0 ${100 - ((aqiTrend[0] / maxAQI) * 90)}% ${aqiTrend.map((d, i) => `L ${i * (100 / (aqiTrend.length - 1))}% ${100 - ((d / maxAQI) * 90)}%`).join(' ')}`}
                   fill="none"
                   stroke="#22d3ee"
                   strokeWidth="2"
                   initial={{ pathLength: 0 }}
                   animate={{ pathLength: 1 }}
                   transition={{ duration: 2, ease: "easeInOut" }}
                 />
               </svg>

               {/* Vertical markers for data points */}
               <div className="absolute inset-0 flex justify-between items-end">
                  {aqiTrend.map((d, i) => (
                     <div key={i} className="relative h-full flex flex-col justify-end group cursor-pointer w-4 items-center">
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 border border-cyan-500/30 p-2 rounded text-center z-10 pointer-events-none">
                           <span className="text-[10px] font-black text-cyan-400 block">{d} AQI</span>
                           <span className="text-[8px] text-white/50">{forecastLabels[i]}</span>
                        </div>
                        <div className="w-[1px] h-full bg-cyan-500/10 group-hover:bg-cyan-500/50 transition-colors" />
                     </div>
                  ))}
               </div>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between mt-2 px-2">
               {forecastLabels.map((label, i) => (
                  <span key={i} className={`text-[9px] font-bold tracking-wider ${label === 'NOW' ? 'text-cyan-400' : 'text-white/30'}`}>{label}</span>
               ))}
            </div>
         </div>

         {/* Right Graph: Pollution Spikes (Bar Chart) */}
         <div className="flex-[1] relative flex flex-col border-l border-white/10 pl-8">
            <div className="absolute top-0 right-0 text-right">
               <span className="text-[10px] text-white/40 uppercase font-black tracking-widest block">Micro-Particulate Activity</span>
               <span className="text-lg font-black text-red-400">0.9 Max</span>
            </div>

            <div className="flex-1 relative mt-6 flex items-end justify-between border-b border-white/10">
               {pollutionSpikes.map((spike, i) => (
                  <div key={i} className="w-full px-1 group h-full flex items-end relative">
                     {/* Spike Bar */}
                     <motion.div
                       className={`w-full rounded-t-sm relative overflow-hidden ${spike > 0.7 ? 'bg-red-500' : spike > 0.4 ? 'bg-orange-500' : 'bg-emerald-500/60'}`}
                       initial={{ height: 0 }}
                       animate={{ height: `${spike * 90}%` }}
                       transition={{ duration: 1, delay: i * 0.05 }}
                     >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                     </motion.div>

                     {/* Hover Value */}
                     <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="text-[8px] text-white bg-black/80 px-1 py-0.5 rounded border border-white/20">{spike.toFixed(2)}</span>
                     </div>
                  </div>
               ))}
            </div>

            <div className="flex justify-between mt-2">
               <span className="text-[8px] text-white/30 font-bold uppercase tracking-widest">Past 12h</span>
               <span className="text-[8px] text-white/30 font-bold uppercase tracking-widest">Current</span>
            </div>
         </div>

      </div>
    </div>
  );
}
