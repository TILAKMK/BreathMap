'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  isComplete?: boolean;
}

export function LoadingAnimation({ isComplete = false }: LoadingAnimationProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isComplete) {
      setProgress(100);
    } else {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 30;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      transition={{ delay: isComplete ? 0.5 : 0 }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        {/* Pulsing orb */}
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 mx-auto mb-8 relative"
          animate={{
            scale: [1, 1.2, 1],
            boxShadow: [
              '0 0 20px rgba(0, 255, 65, 0.5)',
              '0 0 40px rgba(0, 255, 65, 0.8)',
              '0 0 20px rgba(0, 255, 65, 0.5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-white/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        {/* Text */}
        <motion.h2 variants={textVariants} className="text-3xl font-bold text-white mb-2">
          SCANNING ATMOSPHERE
        </motion.h2>

        <motion.p
          variants={textVariants}
          className="text-white/60 text-sm mb-8 tracking-widest"
        >
          Analyzing environmental data in real-time...
        </motion.p>

        {/* Progress bar */}
        <motion.div
          variants={textVariants}
          className="w-64 h-1 bg-white/10 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        <motion.p variants={textVariants} className="text-white/40 text-xs mt-4">
          {Math.round(progress)}%
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
