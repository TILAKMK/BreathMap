'use client';

import { motion } from 'framer-motion';
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';

export default function MinimalDashboard() {
  const envData = useEnvironmentalData();

  if (envData.loading) {
    return (
      <div className="relative w-full min-h-screen bg-gradient-to-br from-[#050816] via-[#0a0e27] to-[#050816] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <div className="w-12 h-12 rounded-full border-2 border-[#00F5D4] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-[#94A3B8]">Detecting your location...</p>
        </motion.div>
      </div>
    );
  }

  if (envData.error) {
    return (
      <div className="relative w-full min-h-screen bg-gradient-to-br from-[#050816] via-[#0a0e27] to-[#050816] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{envData.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#00F5D4] text-[#050816] font-semibold rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#00F5D4'; // Good
    if (aqi <= 100) return '#fbbf24'; // Moderate
    if (aqi <= 150) return '#f97316'; // Unhealthy for sensitive
    if (aqi <= 200) return '#ef4444'; // Unhealthy
    if (aqi <= 300) return '#d946ef'; // Very unhealthy
    return '#7c2d12'; // Hazardous
  };

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#050816] via-[#0a0e27] to-[#050816] overflow-hidden">
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {envData.locationName}
          </h2>
          <p className="text-[#94A3B8]">Real-time environmental analysis</p>
        </motion.div>

        {/* Main AQI Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 p-8 rounded-2xl border border-[#94A3B8]/20 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl hover:border-[#00F5D4]/30 transition-all duration-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* AQI Display */}
            <div className="text-center md:text-left">
              <p className="text-[#94A3B8] text-sm uppercase tracking-wider mb-4">
                Air Quality Index
              </p>
              <div className="flex items-baseline gap-4 mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-6xl md:text-7xl font-bold"
                  style={{ color: getAQIColor(envData.aqi?.aqi || 0) }}
                >
                  {envData.aqi?.aqi || 0}
                </motion.div>
                <div className="text-[#94A3B8]">
                  <p className="text-sm">AQI</p>
                  <p className="text-xl font-semibold text-white">
                    {getAQILabel(envData.aqi?.aqi || 0)}
                  </p>
                </div>
              </div>

              {/* Air Freshness */}
              {envData.airFreshness && (
                <div>
                  <p className="text-[#94A3B8] text-sm uppercase tracking-wider mb-2">
                    Air Freshness
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-4 border-[#00F5D4]/30 flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#00F5D4]">
                        {envData.airFreshness.score}%
                      </span>
                    </div>
                    <span className="text-lg font-medium text-white">
                      {envData.airFreshness.level}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Pollutants */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: 'PM2.5',
                  value: `${envData.aqi?.pm25.toFixed(1) || 0} μg/m³`,
                },
                {
                  label: 'PM10',
                  value: `${envData.aqi?.pm10.toFixed(1) || 0} μg/m³`,
                },
                {
                  label: 'NO₂',
                  value: `${envData.aqi?.no2.toFixed(1) || 0} ppb`,
                },
                { label: 'O₃', value: `${envData.aqi?.o3.toFixed(1) || 0} ppb` },
              ].map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="p-4 rounded-xl bg-white/[0.03] border border-[#94A3B8]/10 hover:border-[#00F5D4]/20 transition-all"
                >
                  <p className="text-[#94A3B8] text-xs uppercase tracking-wider mb-2">
                    {metric.label}
                  </p>
                  <p className="text-white font-semibold">{metric.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Weather & Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Weather */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl border border-[#94A3B8]/20 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl hover:border-[#00F5D4]/30 transition-all"
          >
            <p className="text-[#94A3B8] text-xs uppercase tracking-wider mb-4">
              Weather
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-[#94A3B8] mb-1">Temperature</p>
                <p className="text-3xl font-bold text-white">
                  {envData.weather?.temperature}°C
                </p>
              </div>
              <div>
                <p className="text-sm text-[#94A3B8] mb-1">Condition</p>
                <p className="text-lg text-white">{envData.weather?.condition}</p>
              </div>
              <div>
                <p className="text-sm text-[#94A3B8] mb-1">Humidity</p>
                <p className="text-lg text-white">{envData.weather?.humidity}%</p>
              </div>
            </div>
          </motion.div>

          {/* CO2 Exposure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl border border-[#94A3B8]/20 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl hover:border-[#00F5D4]/30 transition-all"
          >
            <p className="text-[#94A3B8] text-xs uppercase tracking-wider mb-4">
              Estimated CO₂
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-3xl font-bold text-white">
                  {envData.co2Exposure?.estimate} ppm
                </p>
                <p className="text-sm text-[#94A3B8] mt-2">
                  {envData.co2Exposure?.severity} Exposure
                </p>
              </div>
              <p className="text-xs text-[#94A3B8] italic">
                *AI Estimated based on live pollution data
              </p>
            </div>
          </motion.div>

          {/* Wind Speed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl border border-[#94A3B8]/20 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl hover:border-[#00F5D4]/30 transition-all"
          >
            <p className="text-[#94A3B8] text-xs uppercase tracking-wider mb-4">
              Wind & Pressure
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-[#94A3B8] mb-1">Wind Speed</p>
                <p className="text-2xl font-bold text-white">
                  {envData.weather?.windSpeed} km/h
                </p>
              </div>
              <div>
                <p className="text-sm text-[#94A3B8] mb-1">Pressure</p>
                <p className="text-xl font-semibold text-white">
                  {envData.weather?.pressure} mb
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Last Update */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-[#94A3B8] text-sm"
        >
          <p>
            Last updated:{' '}
            {envData.lastUpdate?.toLocaleTimeString() || 'Loading...'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
