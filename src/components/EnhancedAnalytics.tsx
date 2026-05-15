'use client';

import { motion } from 'framer-motion';
import GlassmorphCard from './GlassmorphCard';

export default function EnhancedAnalytics() {
  const metrics = [
    {
      icon: '🌍',
      title: 'AQI Level',
      value: '145',
      unit: 'ppm',
      change: 12,
      description: 'Air Quality Index - Unhealthy',
      trend: 'up' as const,
      gradient: 'red' as const,
    },
    {
      icon: '⚙️',
      title: 'CO₂ Level',
      value: '425',
      unit: 'ppm',
      change: 5,
      description: 'Carbon Dioxide concentration',
      trend: 'up' as const,
      gradient: 'purple' as const,
    },
    {
      icon: '💨',
      title: 'Oxygen Level',
      value: '20.8',
      unit: '%',
      change: -2,
      description: 'Atmospheric oxygen percentage',
      trend: 'down' as const,
      gradient: 'green' as const,
    },
    {
      icon: '🔊',
      title: 'Noise Pollution',
      value: '68',
      unit: 'dB',
      change: 8,
      description: 'Sound level intensity',
      trend: 'up' as const,
      gradient: 'blue' as const,
    },
    {
      icon: '💨',
      title: 'Wind Speed',
      value: '12.5',
      unit: 'km/h',
      change: -3,
      description: 'Average wind velocity',
      trend: 'down' as const,
      gradient: 'blue' as const,
    },
    {
      icon: '🌡️',
      title: 'Temperature',
      value: '32',
      unit: '°C',
      change: 4,
      description: 'Current air temperature',
      trend: 'up' as const,
      gradient: 'red' as const,
    },
    {
      icon: '👃',
      title: 'Breathability',
      value: '32',
      unit: '%',
      change: -15,
      description: 'Safe air percentage',
      trend: 'down' as const,
      gradient: 'red' as const,
    },
    {
      icon: '💧',
      title: 'Humidity',
      value: '65',
      unit: '%',
      change: 10,
      description: 'Atmospheric moisture level',
      trend: 'up' as const,
      gradient: 'green' as const,
    },
  ];

  return (
    <div className="relative w-full py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 glow-text">
            YOUR ENVIRONMENT
          </h2>
          <p className="text-gray-300 text-lg">
            Real-time atmospheric analysis with AI insights
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {metrics.map((metric, idx) => (
            <GlassmorphCard
              key={idx}
              {...metric}
              delay={idx * 0.1}
            />
          ))}
        </motion.div>

        {/* Bottom insight */}
        <motion.div
          className="mt-16 glass-dark rounded-2xl p-8 border border-green-400/30 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-300 text-lg mb-4">
            ⚠️ <span className="text-red-400 font-bold">CRITICAL ALERT</span>
          </p>
          <p className="text-gray-400">
            Air quality has reached unsafe levels. We recommend staying indoors and using an air purifier.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
