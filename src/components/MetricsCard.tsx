'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { EnvironmentalMetrics } from '@/types';
import { AQI_CATEGORIES } from '@/utils/aqi';
import { cn } from '@/lib/cn';

interface MetricsCardProps {
  metrics: EnvironmentalMetrics | null;
  loading?: boolean;
}

export function MetricsCard({ metrics, loading }: MetricsCardProps) {
  const breathabilityCategory = metrics
    ? Object.entries(AQI_CATEGORIES).find(
        ([, cat]) => metrics.aqi >= cat.min && metrics.aqi <= cat.max
      )?.[1]
    : null;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  if (loading || !metrics) {
    return (
      <motion.div
        className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 min-w-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="h-40 bg-gradient-to-r from-white/5 to-transparent rounded animate-pulse" />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="backdrop-blur-md bg-gradient-to-br from-white/15 to-white/5 border border-white/20 rounded-2xl p-6 min-w-80 hover:border-white/40 transition-all"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
    >
      <motion.div variants={itemVariants} className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-white/80">AIR QUALITY INDEX</h3>
          <motion.div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: breathabilityCategory?.color }}
            animate={{ boxShadow: ['0 0 10px currentColor', '0 0 20px currentColor'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <motion.p
          className="text-4xl font-bold"
          style={{ color: breathabilityCategory?.color }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {Math.round(metrics.aqi)}
        </motion.p>
        <p className="text-xs text-white/60 mt-1">{breathabilityCategory?.label}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        <MetricRow label="CO₂ Density" value={`${metrics.co2Density} ppm`} maxValue={600} currentValue={metrics.co2Density} />
        <MetricRow label="Oxygen Level" value={`${metrics.oxygenLevel.toFixed(1)}%`} maxValue={21} currentValue={metrics.oxygenLevel} />
        <MetricRow label="Sound Pollution" value={`${Math.round(metrics.soundPollution)} dB`} maxValue={100} currentValue={metrics.soundPollution} />
        <MetricRow label="Breathability" value={`${Math.round(metrics.breathabilityScore)}/100`} maxValue={100} currentValue={metrics.breathabilityScore} />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-4 pt-4 border-t border-white/10"
      >
        <p className="text-xs font-semibold text-white/70 mb-1">STATUS</p>
        <p className="text-sm font-bold text-white">
          {metrics.breathabilityStatus === 'HIGHLY_BREATHABLE' && '✓ HIGHLY BREATHABLE'}
          {metrics.breathabilityStatus === 'MODERATE_RISK' && '⚠ MODERATE RISK'}
          {metrics.breathabilityStatus === 'TOXIC_ENVIRONMENT' && '✕ TOXIC ENVIRONMENT'}
        </p>
      </motion.div>
    </motion.div>
  );
}

interface MetricRowProps {
  label: string;
  value: string;
  maxValue: number;
  currentValue: number;
}

function MetricRow({ label, value, maxValue, currentValue }: MetricRowProps) {
  const percentage = (currentValue / maxValue) * 100;

  return (
    <motion.div whileHover={{ x: 2 }}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-white/60">{label}</span>
        <span className="text-sm font-bold text-white">{value}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}
