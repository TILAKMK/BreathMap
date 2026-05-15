'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useLocation } from '@/hooks/useLocation';
import { useAQI } from '@/hooks/useAQI';
import { LoadingAnimation } from './LoadingAnimation';
import { MetricsCard } from './MetricsCard';
import { HeatmapGrid } from './HeatmapGrid';
import { SoundWaveVisualizer } from './SoundWaveVisualizer';
import { EnvironmentTimeline } from './EnvironmentTimeline';
import { CityRanking } from './CityRanking';
import { AIBadge } from './AIBadge';

// Dynamic import for Three.js component
const EarthVisualization = dynamic(
  () => import('./EarthVisualization').then((mod) => mod.EarthVisualization),
  { ssr: false }
);

export function DashboardLayout() {
  const [showLoading, setShowLoading] = useState(true);
  const { location, loading: locationLoading } = useLocation();
  const { metrics, loading: aqiLoading } = useAQI(location?.lat ?? null, location?.lng ?? null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = showLoading || locationLoading || aqiLoading;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="min-h-screen overflow-auto"
      variants={containerVariants}
      initial="hidden"
      animate={isLoading ? 'hidden' : 'visible'}
    >
      <LoadingAnimation isComplete={!isLoading} />

      {/* Hero Section */}
      <motion.section
        variants={itemVariants}
        className="relative h-screen flex flex-col items-center justify-center px-4"
      >
        <motion.div
          className="text-center max-w-4xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight">
            SEE THE AIR{' '}
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              BEFORE YOU BREATHE IT.
            </span>
          </h1>
          <p className="text-xl text-white/60 mb-8">
            Real-time AI-powered environmental intelligence at your fingertips.
          </p>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-white/60 text-center">
            <p className="text-sm mb-2">Scroll to explore</p>
            <div className="w-6 h-10 border border-white/30 rounded-full flex items-center justify-center mx-auto">
              <motion.div
                className="w-1 h-2 bg-white/60 rounded-full"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Earth Visualization Section */}
      <motion.section
        variants={itemVariants}
        className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-white mb-8">GLOBAL ATMOSPHERIC SCAN</h2>
        <EarthVisualization />
      </motion.section>

      {/* Main Dashboard */}
      <motion.section
        variants={itemVariants}
        className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-white mb-8">YOUR ENVIRONMENT</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* AI Badge */}
          <motion.div className="flex items-center justify-center" variants={itemVariants}>
            {metrics && (
              <AIBadge score={metrics.breathabilityScore} status={metrics.breathabilityStatus} />
            )}
          </motion.div>

          {/* Metrics Card */}
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <MetricsCard metrics={metrics} loading={aqiLoading} />
          </motion.div>
        </div>

        {/* Heatmap and other visualizers */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div variants={itemVariants}>
            <HeatmapGrid gridSize={8} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <SoundWaveVisualizer />
          </motion.div>
        </div>

        {/* Timeline and City Ranking */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <EnvironmentTimeline />
          </motion.div>
          <motion.div variants={itemVariants}>
            <CityRanking />
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        variants={itemVariants}
        className="py-8 px-4 border-t border-white/10 text-center text-white/60 text-sm"
      >
        <p>BreathMap AI • Real-time Environmental Intelligence • Making the invisible visible</p>
      </motion.footer>
    </motion.div>
  );
}
