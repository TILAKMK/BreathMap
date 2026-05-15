'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PollutionSpot {
  id: string;
  x: number;
  y: number;
  intensity: number;
  label: string;
}

export default function CinematicMap() {
  const [pollutionSpots] = useState<PollutionSpot[]>([
    { id: '1', x: 30, y: 25, intensity: 85, label: 'Mumbai' },
    { id: '2', x: 55, y: 35, intensity: 72, label: 'Delhi' },
    { id: '3', x: 45, y: 60, intensity: 45, label: 'Bangalore' },
    { id: '4', x: 70, y: 50, intensity: 65, label: 'Shanghai' },
    { id: '5', x: 20, y: 70, intensity: 55, label: 'Lagos' },
    { id: '6', x: 65, y: 30, intensity: 78, label: 'Beijing' },
  ]);

  return (
    <div className="relative w-full py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 glow-text">
            GLOBAL ATMOSPHERIC SCAN
          </h2>
          <p className="text-gray-300 text-lg">
            Live pollution hotspot detection across the globe
          </p>
        </motion.div>

        {/* Map container */}
        <motion.div
          className="glass-strong rounded-2xl p-8 border border-green-400/30 overflow-hidden relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-cyan-600/5 -z-10" />

          {/* SVG Map background */}
          <svg
            className="w-full h-96 opacity-20 absolute inset-0"
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="mapgrid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#00ff41" strokeWidth="0.1" />
              </pattern>
            </defs>
            <rect width="100" height="60" fill="url(#mapgrid)" />
          </svg>

          {/* Map content */}
          <div className="relative w-full h-96">
            {/* Animated scan grid */}
            <motion.div
              className="absolute inset-0 border border-green-400/20 rounded-lg"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(0, 255, 65, 0.3)',
                  '0 0 0 20px rgba(0, 255, 65, 0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Pollution spots with halos */}
            {pollutionSpots.map((spot, idx) => (
              <motion.div
                key={spot.id}
                className="absolute group"
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Pulsing outer rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border border-green-400/50"
                    style={{
                      width: `${40 + i * 30}px`,
                      height: `${40 + i * 30}px`,
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={{
                      opacity: [0.8, 0],
                      scale: [1, 1.5],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                    }}
                  />
                ))}

                {/* Heat intensity glow */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: '16px',
                    height: '16px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(circle, rgba(${
                      spot.intensity > 70 ? '255, 0, 0' : '255, 255, 0'
                    }, ${(spot.intensity / 100) * 0.8}) 0%, transparent 70%)`,
                    boxShadow: `0 0 ${spot.intensity / 3}px rgba(${
                      spot.intensity > 70 ? '255, 0, 0' : '255, 255, 0'
                    }, 0.8)`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />

                {/* Center dot */}
                <div className="absolute w-2 h-2 bg-white rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

                {/* Tooltip on hover */}
                <motion.div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-black/80 px-3 py-2 rounded-lg text-xs whitespace-nowrap text-green-400 border border-green-400/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  whileHover={{ y: -5 }}
                >
                  <div className="font-bold">{spot.label}</div>
                  <div>AQI: {spot.intensity}</div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-6 mt-8 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-300">Critical (70-100)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-gray-300">Warning (40-70)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-300">Normal (0-40)</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
