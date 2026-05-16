'use client';

import { AQIData } from '@/lib/realTimeApis';
import { motion } from 'framer-motion';

interface PollutantBreakdownSectionProps {
  aqi: AQIData | null;
}

interface Pollutant {
  name: string;
  key: keyof Omit<AQIData, 'timestamp'>;
  unit: string;
  maxValue: number;
  color: string;
  safeLevel: number;
}

export function PollutantBreakdownSection({ aqi }: PollutantBreakdownSectionProps) {
  const pollutants: Pollutant[] = [
    { name: 'NO2', key: 'no2', unit: 'ppb', maxValue: 200, color: 'from-yellow-500 to-orange-500', safeLevel: 53 },
    { name: 'O3', key: 'o3', unit: 'ppb', maxValue: 120, color: 'from-cyan-500 to-blue-500', safeLevel: 70 },
    { name: 'SO2', key: 'so2', unit: 'ppb', maxValue: 100, color: 'from-purple-500 to-indigo-500', safeLevel: 35 },
    { name: 'CO', key: 'co', unit: 'ppm', maxValue: 1000, color: 'from-red-500 to-rose-500', safeLevel: 200 },
    { name: 'PM10', key: 'pm10', unit: 'μg/m³', maxValue: 500, color: 'from-amber-500 to-orange-500', safeLevel: 50 },
    { name: 'PM2.5', key: 'pm25', unit: 'μg/m³', maxValue: 250, color: 'from-rose-500 to-red-500', safeLevel: 25 },
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
          Pollutant Breakdown
        </h2>
        <p className="text-sm text-cyan-400 uppercase tracking-[0.2em] font-bold">
          Real-time pollutant concentration analysis
        </p>
      </div>

      {/* Pollutant Bars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pollutants.map((pollutant, index) => {
          const value = aqi ? aqi[pollutant.key] : 0;
          const percentage = Math.min(100, (value / pollutant.maxValue) * 100);
          const isSafe = value <= pollutant.safeLevel;

          return (
            <motion.div
              key={pollutant.name}
              className="flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-black text-white">{pollutant.name}</h3>
                  <p className="text-xs text-white/40 uppercase tracking-[0.1em] font-bold mt-1">
                    Safe level: &lt; {pollutant.safeLevel}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-cyan-400">{value.toFixed(1)}</p>
                  <p className="text-xs text-white/40 uppercase tracking-[0.1em] font-bold">{pollutant.unit}</p>
                </div>
              </div>

              {/* Bar Container */}
              <div className="w-full h-24 bg-black/30 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden relative">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${pollutant.color} opacity-5`} />

                {/* Animated fill bar */}
                <motion.div
                  className={`h-full bg-gradient-to-r ${pollutant.color} relative flex items-center justify-end pr-4`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/20 to-transparent blur-md" />
                  
                  {/* Status indicator */}
                  <div className="flex items-center gap-2 z-10">
                    <span className={`text-xs font-black tracking-[0.1em] uppercase ${isSafe ? 'text-emerald-200' : 'text-red-200'}`}>
                      {isSafe ? '✓ SAFE' : '⚠ CAUTION'}
                    </span>
                  </div>
                </motion.div>

                {/* Safe level marker line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white/30"
                  style={{ left: `${(pollutant.safeLevel / pollutant.maxValue) * 100}%` }}
                >
                  <div className="absolute -top-2 -left-1.5 text-[10px] text-white/40 font-bold whitespace-nowrap">
                    Safe
                  </div>
                </div>
              </div>

              {/* Percentage display */}
              <div className="mt-3 text-xs text-white/40 uppercase tracking-[0.1em] font-bold">
                {percentage.toFixed(0)}% of max level
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default PollutantBreakdownSection;
