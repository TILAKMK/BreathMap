'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassmorphCardProps {
  icon: string;
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  description?: string;
  trend?: 'up' | 'down' | 'stable';
  delay?: number;
  gradient?: 'green' | 'blue' | 'purple' | 'red';
}

export default function GlassmorphCard({
  icon,
  title,
  value,
  unit,
  change,
  description,
  trend = 'stable',
  delay = 0,
  gradient = 'green',
}: GlassmorphCardProps) {
  const gradientMap = {
    green: 'from-green-400/20 to-green-600/10',
    blue: 'from-blue-400/20 to-cyan-600/10',
    purple: 'from-purple-400/20 to-purple-600/10',
    red: 'from-red-400/20 to-red-600/10',
  };

  const glowMap = {
    green: 'glow-sm',
    blue: 'glow-blue',
    purple: 'hover:glow-lg',
    red: 'glow-red',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`glass-strong rounded-2xl p-6 border border-${gradient}-400/30 group cursor-pointer transition-all duration-300 ${glowMap[gradient]}`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientMap[gradient]} rounded-2xl -z-10`} />

      {/* Header with icon and title */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        {trend === 'up' && (
          <div className="text-green-400 text-sm font-bold">↗ UP</div>
        )}
        {trend === 'down' && (
          <div className="text-red-400 text-sm font-bold">↘ DOWN</div>
        )}
        {trend === 'stable' && (
          <div className="text-gray-400 text-sm font-bold">→ STABLE</div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-gray-300 text-sm font-semibold uppercase tracking-wider mb-3">
        {title}
      </h3>

      {/* Value */}
      <div className="mb-4">
        <motion.div
          className={`text-4xl font-black bg-gradient-to-r ${
            gradient === 'green'
              ? 'from-green-400 to-green-300'
              : gradient === 'blue'
                ? 'from-blue-400 to-cyan-300'
                : gradient === 'purple'
                  ? 'from-purple-400 to-pink-300'
                  : 'from-red-400 to-orange-300'
          } bg-clip-text text-transparent`}
        >
          {value}
          {unit && <span className="text-lg ml-1">{unit}</span>}
        </motion.div>
      </div>

      {/* Change indicator */}
      {change !== undefined && (
        <div className="text-gray-400 text-xs mb-3">
          {change > 0 ? (
            <span className="text-green-400">+{change}%</span>
          ) : change < 0 ? (
            <span className="text-red-400">{change}%</span>
          ) : (
            <span>No change</span>
          )}{' '}
          from last hour
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
      )}

      {/* Hover effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}
