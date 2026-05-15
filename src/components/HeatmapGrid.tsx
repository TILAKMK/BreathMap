'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { getHeatmapColor } from '@/utils/aqi';

interface HeatmapGridProps {
  gridSize?: number;
  data?: number[][]; // 0-100 intensity values
}

export function HeatmapGrid({ gridSize = 10, data }: HeatmapGridProps) {
  // Generate random data if not provided
  const heatmapData = data || Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => Math.random() * 100)
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.02 }
    }
  };

  const cellVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div
      className="inline-grid gap-1 p-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl"
      style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {heatmapData.map((row, y) =>
        row.map((intensity, x) => (
          <motion.div
            key={`${x}-${y}`}
            className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer relative group"
            style={{ backgroundColor: getHeatmapColor(intensity) }}
            variants={cellVariants}
            whileHover={{
              scale: 1.2,
              boxShadow: `0 0 20px ${getHeatmapColor(intensity)}`
            }}
            animate={{
              boxShadow: [
                `0 0 10px ${getHeatmapColor(intensity)}`,
                `0 0 20px ${getHeatmapColor(intensity)}`,
                `0 0 10px ${getHeatmapColor(intensity)}`
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {/* Tooltip */}
            <motion.div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              {Math.round(intensity)}%
            </motion.div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
