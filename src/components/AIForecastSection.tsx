'use client';

import { AQIData, WeatherData } from '@/lib/realTimeApis';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';

interface AIForecastSectionProps {
  aqi: AQIData | null;
  weather: WeatherData | null;
}

export function AIForecastSection({ aqi, weather }: AIForecastSectionProps) {
  // Generate forecast data (mock)
  const forecast30min = aqi ? Math.max(20, aqi.aqi + Math.random() * 20 - 10) : 75;
  const trend = Math.random() > 0.5 ? 'rising' : Math.random() > 0.5 ? 'falling' : 'stable';
  const confidence = Math.floor(Math.random() * 20 + 75);
  const anomalyDetected = Math.random() > 0.85;

  // Health advisories
  const activities = [
    {
      name: 'Running',
      icon: '🏃',
      safe: aqi && aqi.aqi <= 100,
      advice: aqi && aqi.aqi <= 100 ? 'Safe for outdoor running' : 'Avoid outdoor running today',
    },
    {
      name: 'Cycling',
      icon: '🚴',
      safe: aqi && aqi.aqi <= 150,
      advice: aqi && aqi.aqi <= 150 ? 'Good conditions for cycling' : 'Consider indoor cycling',
    },
    {
      name: 'Outdoor Activities',
      icon: '🌳',
      safe: aqi && aqi.aqi <= 75,
      advice: aqi && aqi.aqi <= 75 ? 'Perfect for outdoor activities' : 'Limit outdoor exposure',
    },
  ];

  const healthAdvice = [
    {
      icon: '💧',
      title: 'Stay Hydrated',
      description: 'Increase water intake to support respiratory system',
    },
    {
      icon: '🫁',
      title: 'Monitor Breathing',
      description: 'Pay attention to breathing patterns, especially during exercise',
    },
    {
      icon: '🏠',
      title: 'Indoor Air Quality',
      description: 'Consider using air purifiers indoors',
    },
    {
      icon: '😷',
      title: 'Respiratory Protection',
      description: aqi && aqi.aqi > 150 ? 'Consider wearing N95 masks outdoors' : 'Standard masks not necessary',
    },
  ];

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
    >
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-3">
          AI Intelligence System
        </h2>
        <p className="text-sm text-cyan-400 uppercase tracking-[0.2em] font-bold">
          Forecast analysis and health recommendations
        </p>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: AI Forecast */}
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-10 shadow-2xl">
            <h3 className="text-sm font-black text-cyan-400 uppercase tracking-[0.2em] mb-8">
              30-Minute AQI Forecast
            </h3>

            {/* Forecast Number */}
            <div className="mb-8">
              <p className="text-xs text-white/40 uppercase tracking-[0.1em] font-bold mb-3">Predicted AQI</p>
              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-black text-cyan-400">{forecast30min.toFixed(0)}</span>
                <div className="flex items-center gap-2">
                  {trend === 'rising' && (
                    <>
                      <TrendingUp className="w-6 h-6 text-orange-400" />
                      <span className="text-lg font-black text-orange-400 uppercase tracking-[0.1em]">Rising</span>
                    </>
                  )}
                  {trend === 'falling' && (
                    <>
                      <TrendingDown className="w-6 h-6 text-emerald-400" />
                      <span className="text-lg font-black text-emerald-400 uppercase tracking-[0.1em]">Falling</span>
                    </>
                  )}
                  {trend === 'stable' && (
                    <span className="text-lg font-black text-white uppercase tracking-[0.1em]">Stable</span>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-white/10 mb-8" />

            {/* Anomaly Status */}
            <div className="mb-8">
              <p className="text-xs text-white/40 uppercase tracking-[0.1em] font-bold mb-3">System Status</p>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${anomalyDetected ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
                {anomalyDetected ? (
                  <span className="text-lg font-black text-red-400 uppercase tracking-[0.1em]">🚨 Anomaly Detected</span>
                ) : (
                  <span className="text-lg font-black text-emerald-400 uppercase tracking-[0.1em]">✅ Normal</span>
                )}
              </div>
            </div>

            {/* Confidence Bar */}
            <div>
              <p className="text-xs text-white/40 uppercase tracking-[0.1em] font-bold mb-3">Prediction Confidence</p>
              <div className="w-full h-3 bg-black/40 border border-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${confidence}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-white/60 mt-2 font-mono text-right">{confidence}% Confidence</p>
            </div>
          </div>
        </motion.div>

        {/* Right: Health Advisory */}
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {/* Activity Badges */}
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-10 shadow-2xl">
            <h3 className="text-sm font-black text-cyan-400 uppercase tracking-[0.2em] mb-8">
              Activity Recommendations
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {activities.map((activity, idx) => (
                <motion.div
                  key={activity.name}
                  className={`p-4 rounded-lg border ${
                    activity.safe
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-black text-white mb-1">{activity.name}</p>
                      <p className={`text-xs font-bold uppercase tracking-[0.1em] ${activity.safe ? 'text-emerald-300' : 'text-red-300'}`}>
                        {activity.advice}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Health Advice Cards */}
          <div>
            <h3 className="text-sm font-black text-cyan-400 uppercase tracking-[0.2em] mb-4">
              Health Advisory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {healthAdvice.map((advice, idx) => (
                <motion.div
                  key={advice.title}
                  className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-5 hover:border-cyan-500/30 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <p className="text-2xl mb-2">{advice.icon}</p>
                  <p className="text-xs font-black text-white uppercase tracking-[0.1em] mb-2">{advice.title}</p>
                  <p className="text-xs text-white/50">{advice.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AIForecastSection;
