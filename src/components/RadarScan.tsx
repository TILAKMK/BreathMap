'use client';

import { motion } from 'framer-motion';

export function RadarScan() {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* HUD Header */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1 justify-end">
          <h2 className="text-xs font-black text-white tracking-[0.3em] uppercase">Sector Radar Tracking</h2>
          <div className="w-2 h-2 bg-emerald-500 rounded-sm animate-pulse" />
        </div>
        <p className="text-[9px] text-slate-500 tracking-wider uppercase font-medium text-right">Proximity Atmospheric Objects</p>
      </div>

      <div className="bg-white/[0.02] border border-white/5 p-4 relative overflow-hidden flex items-center justify-center">
         <div className="relative w-48 h-48">
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-2xl" />
            
            {/* Radar Circles */}
            <div className="absolute inset-0 border border-emerald-500/20 rounded-full" />
            <div className="absolute inset-8 border border-emerald-500/10 rounded-full" />
            <div className="absolute inset-16 border border-emerald-500/5 rounded-full" />
            
            {/* Grid Cross */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-emerald-500/10" />
            <div className="absolute left-1/2 top-0 w-[1px] h-full bg-emerald-500/10" />

            {/* Rotating Beam */}
            <motion.div
              className="absolute inset-0 z-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-1/2 bg-gradient-to-t from-transparent via-emerald-500/50 to-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1/2 bg-emerald-500/5 origin-bottom -rotate-12 blur-md"
                style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
              />
            </motion.div>

            {/* Radar Hits (Points) */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,1)] z-10"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 35}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 1,
                }}
              />
            ))}

            {/* Center Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] z-30" />
         </div>

         {/* Radar Data Stats (Floating) */}
         <div className="absolute top-4 left-4 flex flex-col gap-1">
            <span className="text-[7px] text-emerald-500/60 font-bold uppercase tracking-widest">Sweep: 12.4s</span>
            <span className="text-[7px] text-emerald-500/60 font-bold uppercase tracking-widest">Range: 50km</span>
         </div>
         <div className="absolute bottom-4 right-4 text-right">
            <span className="text-[7px] text-emerald-500/40 font-bold uppercase tracking-widest block">Sector: Alpha-9</span>
            <span className="text-[7px] text-slate-600 font-bold uppercase tracking-widest">Mode: Passive</span>
         </div>
      </div>
    </div>
  );
}
