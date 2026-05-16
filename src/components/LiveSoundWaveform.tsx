'use client';

import { motion } from 'framer-motion';

export function LiveSoundWaveform() {
  return (
    <div className="flex flex-col items-center gap-2 bg-black/60 px-8 py-3 rounded-full border border-cyan-500/20 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)]">
      <div className="flex items-end gap-[2px] h-8 w-64 justify-center">
         {[...Array(64)].map((_, i) => (
           <motion.div
             key={i}
             className="w-[2px] rounded-t-full"
             animate={{
               height: [
                 `${Math.random() * 40 + 10}%`,
                 `${Math.random() * 80 + 20}%`,
                 `${Math.random() * 30 + 10}%`,
                 `${Math.random() * 100}%`,
                 `${Math.random() * 50 + 10}%`
               ],
               opacity: [0.3, 1, 0.4, 0.9, 0.3],
               backgroundColor: i % 8 === 0 ? '#10b981' : i % 4 === 0 ? '#22d3ee' : 'rgba(34, 211, 238, 0.4)'
             }}
             transition={{
               duration: 1.5 + (Math.random() * 1),
               repeat: Infinity,
               delay: i * 0.02,
               ease: 'easeInOut'
             }}
           />
         ))}
      </div>
      <div className="flex items-center gap-4">
         <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-cyan-500/50" />
         <span className="text-[8px] text-cyan-400 font-bold tracking-[0.5em] uppercase glow-text">Atmospheric Resonance</span>
         <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-cyan-500/50" />
      </div>
    </div>
  );
}
