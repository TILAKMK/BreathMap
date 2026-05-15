'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AIBadgeProps {
  score: number; // 0-100
  status: 'HIGHLY_BREATHABLE' | 'MODERATE_RISK' | 'TOXIC_ENVIRONMENT';
}

export function AIBadge({ score, status }: AIBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'HIGHLY_BREATHABLE':
        return 'from-green-500 to-emerald-600';
      case 'MODERATE_RISK':
        return 'from-yellow-500 to-orange-600';
      case 'TOXIC_ENVIRONMENT':
        return 'from-red-500 to-purple-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'HIGHLY_BREATHABLE':
        return '✓';
      case 'MODERATE_RISK':
        return '⚠';
      case 'TOXIC_ENVIRONMENT':
        return '✕';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring' as const, damping: 15 }
    }
  };

  return (
    <motion.div
      className={`backdrop-blur-md bg-gradient-to-br ${getStatusColor()} p-8 rounded-full relative overflow-hidden w-48 h-48 flex items-center justify-center`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.05 }}
    >
      {/* Animated border */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-white/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Inner glow */}
      <motion.div
        className="absolute inset-2 rounded-full border border-white/20"
        animate={{
          boxShadow: [
            'inset 0 0 20px rgba(255, 255, 255, 0.1)',
            'inset 0 0 40px rgba(255, 255, 255, 0.2)',
            'inset 0 0 20px rgba(255, 255, 255, 0.1)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.div
          className="text-6xl font-black text-white mb-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {Math.round(score)}
        </motion.div>
        <motion.p
          className="text-xs font-semibold text-white/90 tracking-widest"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {status === 'HIGHLY_BREATHABLE' && 'BREATHABLE'}
          {status === 'MODERATE_RISK' && 'CAUTION'}
          {status === 'TOXIC_ENVIRONMENT' && 'DANGER'}
        </motion.p>
        <motion.div
          className="text-2xl mt-2"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {getStatusIcon()}
        </motion.div>
      </div>
    </motion.div>
  );
}
