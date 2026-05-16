'use client';

import { motion } from 'framer-motion';

export function RadarScan() {
  const anomalies = [
    { id: 'AN-01', dist: '2.4km', threat: 'Low' },
    { id: 'AN-02', dist: '5.1km', threat: 'Elevated' }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981] animate-pulse" />
            <span className="text-sm font-black text-white tracking-[0.3em] uppercase">Sector Radar</span>
         </div>
         <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active Sweep</span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12">
         {/* Radar Visual */}
         <div className="relative w-64 h-64 flex items-center justify-center shrink-0">
           {/* Rings */}
           <div className="absolute inset-0 border border-emerald-500/20 rounded-full" />
           <div className="absolute inset-8 border border-emerald-500/20 rounded-full" />
           <div className="absolute inset-16 border border-emerald-500/20 rounded-full" />
           <div className="absolute inset-24 border border-emerald-500/20 rounded-full" />
           
           {/* Crosshair */}
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[1px] bg-emerald-500/20" />
              <div className="h-full w-[1px] bg-emerald-500/20 absolute" />
           </div>

           {/* Scanning Beam */}
           <motion.div
             className="absolute inset-0"
             animate={{ rotate: 360 }}
             transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
           >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-1/2 bg-gradient-to-t from-transparent to-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
             <div 
               className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1/2 bg-emerald-500/10 origin-bottom -rotate-12 blur-sm"
               style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
             />
           </motion.div>

           {/* Tactical Hits */}
           {[...Array(3)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,1)] z-10"
               style={{
                 left: `${20 + i * 25}%`,
                 top: `${20 + (i % 2) * 35}%`,
               }}
               animate={{ opacity: [0, 1, 0], scale: [0.8, 1.5, 0.8] }}
               transition={{ duration: 4, repeat: Infinity, delay: i * 1.2 }}
             />
           ))}
           <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_15px_white] z-20" />
         </div>

         {/* Radar Alerts */}
         <div className="flex-1 flex flex-col gap-4 w-full">
            <span className="text-sm text-slate-500 font-bold uppercase tracking-widest border-b border-white/5 pb-2">Detected Anomalies</span>
            <div className="flex flex-col gap-3">
               {anomalies.map((an) => (
                 <div key={an.id} className="flex justify-between items-center bg-white/5 hover:bg-white/10 transition-colors border border-white/10 p-3 rounded-lg">
                    <span className="text-sm text-emerald-400 font-mono font-bold">{an.id}</span>
                    <span className="text-xs text-white/60">{an.dist}</span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${an.threat === 'Elevated' ? 'text-orange-400' : 'text-slate-400'}`}>{an.threat}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
