'use client';

import { motion } from 'framer-motion';

export function LiveSoundWaveform() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
         {[...Array(24)].map((_, i) => (
           <motion.div
             key={i}
             className="w-[2px] bg-cyan-500/40 rounded-full"
             animate={{
               height: [8, 20, 8, 35, 12, 8],
               opacity: [0.3, 1, 0.3, 0.8, 0.4, 0.3],
               backgroundColor: i % 6 === 0 ? '#22d3ee' : 'rgba(34, 211, 238, 0.4)'
             }}
             transition={{
               duration: 1.5 + (i % 3) * 0.2,
               repeat: Infinity,
               delay: i * 0.04,
               ease: 'easeInOut'
             }}
           />
         ))}
      </div>
      <span className="text-[8px] text-cyan-500/40 font-bold tracking-[0.4em] uppercase">Atmospheric Resonance</span>
    </div>
  );
}
