'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SoundWaveVisualizerProps {
  frequency?: number[];
  decibel?: number;
  isListening?: boolean;
}

export function SoundWaveVisualizer({
  frequency = Array.from({ length: 64 }, () => Math.random() * 100),
  decibel = 60,
  isListening = true
}: SoundWaveVisualizerProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.05 }
    }
  };

  const barVariants = {
    hidden: { height: 0 },
    visible: { height: 'auto' }
  };

  const getBarColor = (index: number) => {
    const ratio = index / frequency.length;
    if (ratio < 0.33) return '#00FF41'; // Green
    if (ratio < 0.66) return '#FFFF00'; // Yellow
    return '#FF0000'; // Red
  };

  return (
    <motion.div
      className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3 className="text-sm font-semibold text-white/80 mb-4">
        SOUND ENVIRONMENT ANALYZER
      </motion.h3>

      {/* Deci bel display */}
      <motion.div
        className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10"
        animate={{
          borderColor: decibel > 80 ? 'rgb(255, 0, 0)' : 'rgb(255, 255, 255)'
        }}
      >
        <div className="flex justify-between items-center">
          <span className="text-xs text-white/60">SOUND LEVEL</span>
          <motion.span
            className="text-2xl font-bold"
            animate={{ color: decibel > 80 ? '#FF0000' : '#00FF41' }}
          >
            {decibel} dB
          </motion.span>
        </div>
      </motion.div>

      {/* Frequency bars */}
      <motion.div
        className="flex items-end justify-center gap-0.5 h-32 mb-4"
        variants={containerVariants}
      >
        {frequency.map((value, index) => (
          <motion.div
            key={index}
            className="flex-1 rounded-t bg-gradient-to-t from-white/40 to-white/60 relative group"
            style={{
              backgroundColor: getBarColor(index),
              height: `${isListening ? value : Math.random() * 100}%`,
              minHeight: '4px'
            }}
            variants={barVariants}
            animate={{
              height: `${isListening ? value : Math.random() * 100}%`,
              boxShadow: `0 0 10px ${getBarColor(index)}`
            }}
            transition={{
              height: { duration: 0.1 },
              boxShadow: { duration: 0.3, repeat: Infinity }
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: `0 0 20px ${getBarColor(index)}`
            }}
          />
        ))}
      </motion.div>

      {/* Status indicator */}
      <motion.div className="flex items-center gap-2 text-xs text-white/60">
        <motion.div
          className="w-2 h-2 rounded-full bg-green-400"
          animate={{
            scale: isListening ? [1, 1.5, 1] : 1,
            opacity: isListening ? 1 : 0.5
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        {isListening ? 'Listening to environment...' : 'Microphone not active'}
      </motion.div>
    </motion.div>
  );
}
