'use client';

import { motion } from 'framer-motion';
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';

export function FloatingAnalyticsOverlay() {
  const { aqi, weather, airFreshness, co2Exposure, locationName } = useEnvironmentalData();

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-[#00F5D4]';
    if (aqi <= 100) return 'text-[#FFEB3B]';
    if (aqi <= 150) return 'text-[#FF9800]';
    if (aqi <= 200) return 'text-[#FF5252]';
    return 'text-[#9C27B0]';
  };

  const getAQIBg = (aqi: number) => {
    if (aqi <= 50) return 'from-[#00F5D4]/20 to-[#00F5D4]/5';
    if (aqi <= 100) return 'from-[#FFEB3B]/20 to-[#FFEB3B]/5';
    if (aqi <= 150) return 'from-[#FF9800]/20 to-[#FF9800]/5';
    if (aqi <= 200) return 'from-[#FF5252]/20 to-[#FF5252]/5';
    return 'from-[#9C27B0]/20 to-[#9C27B0]/5';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (!aqi || !weather) return null;

  return (
    <motion.div
      className="fixed bottom-8 left-8 z-40 space-y-4 w-96"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main AQI Card */}
      <motion.div
        variants={itemVariants}
        className={`bg-gradient-to-br ${getAQIBg(aqi.aqi)} backdrop-blur-lg rounded-2xl p-6 border border-[#00F5D4]/30`}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[#94A3B8] text-sm mb-1">Air Quality Index</p>
            <h2 className={`text-5xl font-bold ${getAQIColor(aqi.aqi)}`}>{aqi.aqi}</h2>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className={`w-16 h-16 rounded-full border-2 ${getAQIColor(aqi.aqi).replace('text-', 'border-')} flex items-center justify-center`}
          >
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAQIBg(aqi.aqi)}`} />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#00F5D4]/20">
          <div>
            <p className="text-[#94A3B8] text-xs mb-1">PM2.5</p>
            <p className="text-white font-semibold">{aqi.pm25.toFixed(1)} μg/m³</p>
          </div>
          <div>
            <p className="text-[#94A3B8] text-xs mb-1">PM10</p>
            <p className="text-white font-semibold">{aqi.pm10.toFixed(1)} μg/m³</p>
          </div>
          <div>
            <p className="text-[#94A3B8] text-xs mb-1">NO₂</p>
            <p className="text-white font-semibold">{aqi.no2.toFixed(1)} ppb</p>
          </div>
          <div>
            <p className="text-[#94A3B8] text-xs mb-1">O₃</p>
            <p className="text-white font-semibold">{aqi.o3.toFixed(1)} ppb</p>
          </div>
        </div>
      </motion.div>

      {/* Weather Card */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 backdrop-blur-lg rounded-2xl p-5 border border-blue-400/30"
      >
        <p className="text-[#94A3B8] text-sm mb-3">Weather Conditions</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[#94A3B8] text-xs mb-1">Temperature</p>
            <p className="text-white font-semibold">{weather.temperature}°C</p>
          </div>
          <div>
            <p className="text-[#94A3B8] text-xs mb-1">Humidity</p>
            <p className="text-white font-semibold">{weather.humidity}%</p>
          </div>
          <div>
            <p className="text-[#94A3B8] text-xs mb-1">Wind</p>
            <p className="text-white font-semibold">{weather.windSpeed.toFixed(1)} km/h</p>
          </div>
        </div>
      </motion.div>

      {/* Air Freshness Card */}
      {airFreshness && (
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-green-500/20 to-green-500/5 backdrop-blur-lg rounded-2xl p-5 border border-green-400/30"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#94A3B8] text-sm mb-1">Air Freshness</p>
              <p className="text-white text-lg font-semibold">{airFreshness.level}</p>
            </div>
            <div className="text-right">
              <p className="text-green-400 text-3xl font-bold">{airFreshness.score}%</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* CO2 Exposure Card */}
      {co2Exposure && (
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 backdrop-blur-lg rounded-2xl p-5 border border-orange-400/30"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#94A3B8] text-sm mb-1">CO₂ Exposure</p>
              <p className="text-white font-semibold">{co2Exposure.estimate.toFixed(0)} ppm</p>
            </div>
            <div className="text-right">
              <p className="text-orange-400 text-sm">{co2Exposure.severity}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
