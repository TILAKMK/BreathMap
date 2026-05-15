'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function AIScanMode() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeAnomalies, setActiveAnomalies] = useState(0);

  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          setIsScanning(false);
          setActiveAnomalies(Math.floor(Math.random() * 3));
          return 0;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* HUD Header */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1 justify-end">
          <h2 className="text-xs font-black text-white tracking-[0.3em] uppercase">AI Atmospheric Scan</h2>
          <div className="w-2 h-2 bg-cyan-500 rounded-sm animate-pulse" />
        </div>
        <p className="text-[9px] text-slate-500 tracking-wider uppercase font-medium text-right">Neural Pattern Recognition</p>
      </div>

      <div className="bg-white/[0.02] border border-white/5 p-4 relative overflow-hidden group">
        {/* Holographic Scan visualization */}
        <div className="relative h-40 bg-black/40 border border-cyan-500/20 mb-4 overflow-hidden rounded-sm">
          {/* Scanning Line */}
          {isScanning && (
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20"
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {/* Grid Layer */}
          <div className="absolute inset-0 z-0 opacity-10 flex flex-wrap">
             {[...Array(64)].map((_, i) => (
               <div key={i} className="w-1/8 h-1/8 border border-cyan-500/30" />
             ))}
          </div>

          {/* Points of interest */}
          <div className="absolute inset-0 z-10">
             {[...Array(activeAnomalies + 2)].map((_, i) => (
               <motion.div 
                 key={i}
                 className="absolute w-2 h-2 border border-cyan-500/60 rounded-full flex items-center justify-center"
                 style={{ 
                   left: `${20 + i * 25}%`, 
                   top: `${30 + (i % 2) * 40}%` 
                 }}
                 animate={{ opacity: [0, 1, 0], scale: [1, 1.2, 1] }}
                 transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
               >
                 <div className="w-0.5 h-0.5 bg-cyan-500 rounded-full" />
                 <div className="absolute -top-4 -left-4 text-[6px] text-cyan-500/40 uppercase tracking-tighter">P-{i+102}</div>
               </motion.div>
             ))}
          </div>

          <div className="absolute bottom-2 left-2 flex flex-col gap-1 z-30">
             <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-cyan-500" />
                <span className="text-[7px] text-cyan-500 font-bold uppercase tracking-widest">Active Monitoring</span>
             </div>
             <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-slate-500" />
                <span className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Neural Link v4.2</span>
             </div>
          </div>
        </div>

        {/* Neural Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
           {[
             { label: 'Anomalies', value: activeAnomalies, color: activeAnomalies > 0 ? 'text-cyan-400' : 'text-slate-500' },
             { label: 'Confidence', value: '94.2%', color: 'text-white' },
             { label: 'Data Nodes', value: '1,204', color: 'text-white' },
             { label: 'Sync Status', value: 'Verified', color: 'text-emerald-400' },
           ].map((metric) => (
             <div key={metric.label} className="bg-white/5 p-2 border border-white/5 rounded-sm">
                <p className="text-[7px] text-slate-500 uppercase tracking-widest mb-1">{metric.label}</p>
                <p className={`text-[10px] font-black uppercase tracking-wider ${metric.color}`}>{metric.value}</p>
             </div>
           ))}
        </div>

        {/* Scan Progress */}
        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-[8px] uppercase tracking-widest text-slate-500 font-bold">
            <span>Scan Sequence</span>
            <span className="text-cyan-400">{scanProgress}%</span>
          </div>
          <div className="h-[2px] bg-white/5 w-full relative overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              animate={{ width: `${scanProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="w-full py-3 bg-cyan-500/10 border border-cyan-500/30 text-[9px] text-cyan-400 font-black uppercase tracking-[0.3em] hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all disabled:opacity-30 group"
        >
          <span className="relative z-10">
            {isScanning ? 'Synchronizing Neural Array...' : 'Initialize Deep Atmospheric Scan'}
          </span>
          <div className="absolute inset-0 bg-cyan-500/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
}
