'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function AIScanMode() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          setIsScanning(false);
          return 0;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  };

  return (
    <motion.div
      className="w-64 flex flex-col gap-2"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* HUD Header */}
      <div className="flex items-center justify-end gap-2 mb-2 px-2">
        <span className="text-[10px] text-cyan-500/60 font-bold tracking-[0.2em] uppercase">AI Neural Core</span>
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
      </div>

      <div className="bg-black/40 backdrop-blur-md border border-white/5 p-4 relative overflow-hidden group">
        {/* Holographic Glow */}
        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Scan Visualization */}
        <div className="relative h-24 bg-black/40 border border-cyan-500/20 mb-4 overflow-hidden">
          {/* Grid */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="absolute inset-0 border-b border-cyan-500" style={{ top: `${(i+1)*25}%` }} />
            ))}
          </div>

          {/* Scanning Line */}
          {isScanning && (
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-10"
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {/* Holographic Content */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              className="w-12 h-12 border border-cyan-500/30 rounded-full"
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute text-[8px] text-cyan-500/40 uppercase tracking-tighter">Atmosphere.Scan</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-[8px] uppercase tracking-widest text-slate-500">
            <span>Neural Sync</span>
            <span className="text-cyan-400">{scanProgress}%</span>
          </div>
          <div className="h-[2px] bg-white/5 w-full">
            <motion.div 
              className="h-full bg-cyan-500"
              animate={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>

        {/* Action */}
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="w-full py-2 bg-cyan-500/10 border border-cyan-500/30 text-[10px] text-cyan-400 font-bold uppercase tracking-[0.2em] hover:bg-cyan-500/20 transition-all disabled:opacity-30"
        >
          {isScanning ? 'Syncing...' : 'Initiate Scan'}
        </button>
      </div>

      {/* Subtle status */}
      <div className="flex justify-between px-2 mt-1">
        <span className="text-[7px] text-slate-700 uppercase tracking-widest">Core: Stable</span>
        <span className="text-[7px] text-slate-700 uppercase tracking-widest">Auth: Root</span>
      </div>
    </motion.div>
  );
}
