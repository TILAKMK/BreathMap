'use client';

import { motion } from 'framer-motion';

export function RadarScan() {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-xl" />
      
      {/* Radar Circles */}
      <div className="absolute inset-0 border border-cyan-500/10 rounded-full" />
      <div className="absolute inset-4 border border-cyan-500/10 rounded-full" />
      <div className="absolute inset-8 border border-cyan-500/10 rounded-full" />
      
      {/* Rotating Beam */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-1/2 bg-gradient-to-t from-transparent via-cyan-500/50 to-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1/2 bg-cyan-500/5 origin-bottom -rotate-12 blur-sm" />
      </motion.div>

      {/* Center Point */}
      <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)] z-10" />

      {/* Label */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-center w-full">
        <span className="text-[8px] text-cyan-500/30 font-bold tracking-[0.3em] uppercase whitespace-nowrap">Tracking Active</span>
      </div>
    </div>
  );
}
