'use client';

import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: '📍',
    title: 'Real-Time Location Tracking',
    description: 'GPS-enabled live tracking of your environmental surroundings'
  },
  {
    icon: '📊',
    title: 'Live AQI Data',
    description: 'Real-time air quality index from multiple certified sources'
  },
  {
    icon: '💨',
    title: 'CO₂ Estimation',
    description: 'AI-powered CO₂ density calculation based on environmental factors'
  },
  {
    icon: '🌳',
    title: 'Oxygen Analysis',
    description: 'Breath freshness score calculated from green cover and vegetation'
  },
  {
    icon: '🔊',
    title: 'Sound Detection',
    description: 'Microphone-based pollution analysis with real-time waveform'
  },
  {
    icon: '🤖',
    title: 'AI Safety Score',
    description: '0-100 breathability score powered by machine learning'
  }
];

export function FeaturesGrid() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.section
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
        variants={itemVariants}
      >
        How It Works
      </motion.h2>

      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all group"
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              y: -10,
              borderColor: 'rgba(0, 255, 65, 0.4)'
            }}
          >
            <motion.div
              className="text-5xl mb-4"
              animate={{
                scale: [1, 1.1, 1],
                y: [0, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
            >
              {feature.icon}
            </motion.div>

            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {feature.description}
            </p>

            {/* Animated border on hover */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/20 via-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
