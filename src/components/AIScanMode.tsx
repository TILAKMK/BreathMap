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
    <div className="fixed top-8 right-8 z-40">
      <motion.div
        className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-[#00F5D4]/30 w-80"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-1">AI Environmental Scan</h3>
          <p className="text-[#94A3B8] text-sm">Advanced atmospheric analysis</p>
        </div>

        {/* Scan Visualization */}
        <div className="relative h-32 bg-gradient-to-b from-[#0a0e27] to-[#050816] rounded-xl mb-6 overflow-hidden border border-[#00F5D4]/20">
          {/* Grid background */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div key={`h-${i}`} className="border-b border-[#00F5D4]" style={{ height: '20%' }} />
            ))}
            {[...Array(6)].map((_, i) => (
              <div key={`v-${i}`} className="absolute border-l border-[#00F5D4]" style={{ width: '20%', height: '100%' }} />
            ))}
          </div>

          {/* Scanning line */}
          {isScanning && (
            <motion.div
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00F5D4] to-transparent"
              animate={{
                top: ['0%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* Center indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-2 h-2 bg-[#00F5D4] rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          </div>

          {/* Scan points */}
          {isScanning && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-[#00F5D4] rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${scanProgress + Math.random() * 20}%`,
                  }}
                  animate={{
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                />
              ))}
            </>
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-[#94A3B8]">Scan Progress</span>
            <span className="text-[#00F5D4] font-semibold">{scanProgress}%</span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-[#00F5D4]/20">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00F5D4] to-[#00FFD4]"
              animate={{
                width: `${scanProgress}%`,
              }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
          <div className="bg-[#00F5D4]/10 rounded-lg p-3 border border-[#00F5D4]/20">
            <p className="text-[#94A3B8] mb-1">Pollutants</p>
            <p className="text-[#00F5D4] font-semibold">4 types</p>
          </div>
          <div className="bg-[#00F5D4]/10 rounded-lg p-3 border border-[#00F5D4]/20">
            <p className="text-[#94A3B8] mb-1">Zones</p>
            <p className="text-[#00F5D4] font-semibold">3 areas</p>
          </div>
          <div className="bg-[#00F5D4]/10 rounded-lg p-3 border border-[#00F5D4]/20">
            <p className="text-[#94A3B8] mb-1">Coverage</p>
            <p className="text-[#00F5D4] font-semibold">5 km²</p>
          </div>
          <div className="bg-[#00F5D4]/10 rounded-lg p-3 border border-[#00F5D4]/20">
            <p className="text-[#94A3B8] mb-1">Status</p>
            <p className="text-[#00F5D4] font-semibold">Live</p>
          </div>
        </div>

        {/* Scan Button */}
        <motion.button
          onClick={handleScan}
          disabled={isScanning}
          className="w-full py-3 bg-gradient-to-r from-[#00F5D4] to-[#00FFD4] text-black font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isScanning ? 'Scanning...' : 'Start AI Scan'}
        </motion.button>
      </motion.div>
    </div>
  );
}
