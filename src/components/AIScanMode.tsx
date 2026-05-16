'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function AIScanMode() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleScan = () => {
    if (isScanning) return;
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
    }, 40);

    return () => clearInterval(interval);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_15px_#22d3ee] animate-pulse" />
            <span className="text-sm font-black text-white tracking-[0.3em] uppercase">Neural Array</span>
         </div>
         <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Deep Scan AI</span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12">
         {/* Holographic Orb / Visualizer */}
         <div className="relative h-64 w-64 shrink-0 bg-black/50 border border-cyan-500/20 rounded-2xl overflow-hidden flex items-center justify-center">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

            {/* Scanning Effects */}
            {isScanning && (
              <motion.div
                className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] z-20"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            )}

            <div className="relative w-40 h-40">
               <motion.div 
                  className="absolute inset-0 border border-cyan-500/30 rounded-full"
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
               />
               <motion.div 
                  className="absolute inset-4 border border-dashed border-cyan-500/40 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-black text-cyan-400 uppercase tracking-[0.4em] glow-text">Sync</span>
               </div>
            </div>
         </div>

         {/* Analytics Grid & Trigger */}
         <div className="flex-1 flex flex-col gap-8 w-full">
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 p-6 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-2">Data Nodes</span>
                  <span className="text-3xl font-black text-white tracking-tighter">1,402</span>
               </div>
               <div className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 p-6 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-2">Confidence</span>
                  <span className="text-3xl font-black text-cyan-400 tracking-tighter">99.4%</span>
               </div>
            </div>

            {/* Trigger */}
            <div className="flex flex-col gap-3 mt-auto">
               <div className="h-1 w-full bg-white/10 rounded overflow-hidden">
                  <motion.div 
                     className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                     animate={{ width: `${scanProgress}%` }}
                     transition={{ duration: 0.1 }}
                  />
               </div>
               <button
                 onClick={handleScan}
                 disabled={isScanning}
                 className="w-full py-5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-xs font-black text-cyan-400 uppercase tracking-[0.3em] transition-all disabled:opacity-50"
               >
                 {isScanning ? 'Processing Data Stream...' : 'Initialize Deep Scan'}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
