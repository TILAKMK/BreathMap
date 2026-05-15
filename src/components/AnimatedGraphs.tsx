'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dynamic from 'next/dynamic';

// Dynamically import heavy chart components
const DynamicLineChart = dynamic(() => Promise.resolve(LineChart), { ssr: false });
const DynamicLine = dynamic(() => Promise.resolve(Line), { ssr: false });
const DynamicXAxis = dynamic(() => Promise.resolve(XAxis), { ssr: false });
const DynamicYAxis = dynamic(() => Promise.resolve(YAxis), { ssr: false });
const DynamicCartesianGrid = dynamic(() => Promise.resolve(CartesianGrid), { ssr: false });
const DynamicTooltip = dynamic(() => Promise.resolve(Tooltip), { ssr: false });
const DynamicResponsiveContainer = dynamic(() => Promise.resolve(ResponsiveContainer), { ssr: false });

const data = [
  { time: '00:00', aqi: 120, co2: 410, noise: 45 },
  { time: '04:00', aqi: 95, co2: 400, noise: 35 },
  { time: '08:00', aqi: 140, co2: 430, noise: 60 },
  { time: '12:00', aqi: 165, co2: 450, noise: 75 },
  { time: '16:00', aqi: 155, co2: 445, noise: 70 },
  { time: '20:00', aqi: 130, co2: 420, noise: 55 },
  { time: '24:00', aqi: 110, co2: 410, noise: 40 },
];

export default function AnimatedGraphs() {
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
            ENVIRONMENTAL TRENDS
          </h2>
          <p className="text-gray-300 text-lg">
            24-hour atmospheric analysis and forecasts
          </p>
        </motion.div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AQI Chart */}
          <motion.div
            className="glass-strong rounded-2xl p-8 border border-green-400/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/5 to-orange-600/5 rounded-2xl -z-10" />
            <h3 className="text-xl font-bold text-red-400 mb-6">AQI Trend (24h)</h3>
            <div className="h-64 relative">
              <svg
                className="w-full h-full opacity-10 absolute inset-0"
                viewBox="0 0 400 200"
              >
                <path
                  d="M 0 100 Q 50 80 100 90 T 200 100 T 300 85 T 400 95"
                  fill="none"
                  stroke="#ff0000"
                  strokeWidth="2"
                />
              </svg>
              <motion.div
                className="absolute inset-0 flex items-end justify-around"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {data.map((d, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col items-center"
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: '100%', opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.08,
                    }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="w-6 bg-gradient-to-t from-red-500 to-orange-400 rounded-t-lg relative group"
                      style={{
                        height: `${(d.aqi / 200) * 100}%`,
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {d.aqi}
                      </div>
                    </motion.div>
                    <span className="text-xs text-gray-500 mt-2">{d.time}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* CO2 Chart */}
          <motion.div
            className="glass-strong rounded-2xl p-8 border border-green-400/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-purple-600/5 rounded-2xl -z-10" />
            <h3 className="text-xl font-bold text-purple-400 mb-6">CO₂ Levels (24h)</h3>
            <div className="h-64 relative">
              <svg
                className="w-full h-full opacity-10 absolute inset-0"
                viewBox="0 0 400 200"
              >
                <path
                  d="M 0 120 Q 50 100 100 110 T 200 115 T 300 105 T 400 120"
                  fill="none"
                  stroke="#9333ea"
                  strokeWidth="2"
                />
              </svg>
              <motion.div
                className="absolute inset-0 flex items-end justify-around"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                {data.map((d, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col items-center"
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: '100%', opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.08 + 0.1,
                    }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="w-6 bg-gradient-to-t from-purple-500 to-pink-400 rounded-t-lg relative group"
                      style={{
                        height: `${(d.co2 / 500) * 100}%`,
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {d.co2}
                      </div>
                    </motion.div>
                    <span className="text-xs text-gray-500 mt-2">{d.time}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Noise Level Chart */}
          <motion.div
            className="glass-strong rounded-2xl p-8 border border-green-400/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-cyan-600/5 rounded-2xl -z-10" />
            <h3 className="text-xl font-bold text-blue-400 mb-6">Noise Levels (24h)</h3>
            <div className="h-64 relative">
              <motion.div
                className="absolute inset-0 flex items-end justify-around"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                {data.map((d, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col items-center"
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: '100%', opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.08 + 0.2,
                    }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="w-6 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg relative group"
                      style={{
                        height: `${(d.noise / 100) * 100}%`,
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {d.noise}dB
                      </div>
                    </motion.div>
                    <span className="text-xs text-gray-500 mt-2">{d.time}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Summary Stats */}
          <motion.div
            className="glass-strong rounded-2xl p-8 border border-green-400/30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-green-600/5 rounded-2xl -z-10" />
            <h3 className="text-xl font-bold text-green-400 mb-6">Summary Stats</h3>
            <div className="space-y-4">
              {[
                { label: 'Average AQI', value: '133', unit: 'ppm', color: 'text-red-400' },
                { label: 'Peak CO₂', value: '450', unit: 'ppm', color: 'text-purple-400' },
                { label: 'Max Noise', value: '75', unit: 'dB', color: 'text-blue-400' },
                { label: 'Status', value: 'CRITICAL', unit: '', color: 'text-red-500' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="flex justify-between items-center pb-4 border-b border-gray-700 last:border-b-0"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="text-gray-300">{stat.label}</span>
                  <span className={`font-bold ${stat.color}`}>
                    {stat.value}
                    {stat.unit && <span className="text-xs ml-1">{stat.unit}</span>}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
