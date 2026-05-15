'use client';

import { motion } from 'framer-motion';

export function RadarScan() {
  return (
    <div className="fixed bottom-8 right-8 z-40">
      {/* Outer container */}
      <div className="relative w-40 h-40">
        {/* Radar background */}
        <div className="absolute inset-0 rounded-full border-2 border-[#00F5D4]/30 bg-black/40 backdrop-blur-sm">
          {/* Radar grid circles */}
          <div className="absolute inset-0 rounded-full border border-[#00F5D4]/20" style={{ scale: 0.75 }} />
          <div className="absolute inset-0 rounded-full border border-[#00F5D4]/10" style={{ scale: 0.5 }} />
          <div className="absolute inset-0 rounded-full border border-[#00F5D4]/5" style={{ scale: 0.25 }} />

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-[#00F5D4] rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-[#00F5D4]" />

          {/* Scanning lines */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{
              background: `conic-gradient(from 0deg, rgba(0, 245, 212, 0.8), rgba(0, 245, 212, 0.2), transparent)`,
            }}
          />

          {/* Animated ping dots */}
          {[0, 120, 240].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#00F5D4] rounded-full"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: `0 -50px`,
              }}
              animate={{
                rotate: 360,
                opacity: [1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeOut',
                delay: i * 1,
              }}
              initial={{ rotate: angle, x: -2, y: -50, opacity: 1 }}
            />
          ))}
        </div>

        {/* Label */}
        <div className="absolute -bottom-8 left-0 right-0 text-center">
          <p className="text-xs text-[#00F5D4] font-semibold">LIVE SCAN</p>
        </div>
      </div>
    </div>
  );
}
