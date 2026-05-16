'use client';

import { AQIData } from '@/lib/realTimeApis';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
import { useMemo } from 'react';

interface AnalyticsGridSectionProps {
  aqi: AQIData | null;
}

export function AnalyticsGridSection({ aqi }: AnalyticsGridSectionProps) {
  // Generate mock timeline data (24 hours)
  const timelineData = useMemo(() => {
    const base = aqi?.aqi || 75;
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, '0')}:00`,
      aqi: Math.max(20, base + Math.sin(i / 24 * Math.PI * 2) * 30 + Math.random() * 20),
    }));
  }, [aqi?.aqi]);

  // Pollutant radar data
  const pollutantData = useMemo(() => [
    { name: 'PM2.5', value: Math.min(100, (aqi?.pm25 || 0) / 3) },
    { name: 'PM10', value: Math.min(100, (aqi?.pm10 || 0) / 4) },
    { name: 'NO2', value: Math.min(100, (aqi?.no2 || 0) * 2) },
    { name: 'O3', value: Math.min(100, (aqi?.o3 || 0) / 2) },
    { name: 'SO2', value: Math.min(100, (aqi?.so2 || 0) * 5) },
    { name: 'CO', value: Math.min(100, (aqi?.co || 0) / 5) },
  ], [aqi]);

  // CO2 vs O2 data
  const balanceData = useMemo(() => {
    const base = aqi?.aqi || 75;
    return Array.from({ length: 12 }, (_, i) => ({
      time: `${String(i * 2).padStart(2, '0')}:00`,
      co2: 400 + Math.sin(i / 12 * Math.PI * 2) * 50 + Math.random() * 30,
      o2: 20.95 - (base / 1000) * 0.5 + Math.random() * 0.1,
    }));
  }, [aqi?.aqi]);

  const chartConfig = {
    stroke: '#00c8ff',
    fill: '#00c8ff',
    dot: false,
  };

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
          Analytics Grid
        </h2>
        <p className="text-sm text-cyan-400 uppercase tracking-[0.2em] font-bold">
          24-hour environmental trends and pollutant analysis
        </p>
      </div>

      {/* Three-Column Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart 1: AQI Timeline (40% width equivalent) */}
        <motion.div
          className="lg:col-span-1.2 bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-black text-cyan-400 uppercase tracking-[0.2em] mb-2">AQI Timeline</h3>
          <p className="text-xs text-white/40 uppercase tracking-[0.1em] mb-6 font-bold">24-hour trend</p>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timelineData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="aqi-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00c8ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00c8ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="hour" stroke="rgba(255,255,255,0.3)" style={{ fontSize: '10px' }} />
              <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(0,200,255,0.3)' }}
                labelStyle={{ color: '#00c8ff' }}
              />
              <Area type="monotone" dataKey="aqi" stroke="#00c8ff" fill="url(#aqi-gradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Chart 2: Pollutant Radar (30% width equivalent) */}
        <motion.div
          className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-sm font-black text-cyan-400 uppercase tracking-[0.2em] mb-2">Pollutant Radar</h3>
          <p className="text-xs text-white/40 uppercase tracking-[0.1em] mb-6 font-bold">Concentration levels</p>
          
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={pollutantData}>
              <PolarGrid stroke="rgba(0,200,255,0.2)" />
              <PolarAngleAxis dataKey="name" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '10px' }} />
              <PolarRadiusAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: '10px' }} />
              <Radar name="Concentration" dataKey="value" stroke="#00c8ff" fill="#00c8ff" fillOpacity={0.25} />
              <Tooltip 
                contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(0,200,255,0.3)' }}
                labelStyle={{ color: '#00c8ff' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Chart 3: CO2 vs O2 Balance (30% width equivalent) */}
        <motion.div
          className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-black text-cyan-400 uppercase tracking-[0.2em] mb-2">Atmospheric Balance</h3>
          <p className="text-xs text-white/40 uppercase tracking-[0.1em] mb-6 font-bold">CO2 vs O2</p>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={balanceData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="co2-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7e00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff7e00" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="o2-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" style={{ fontSize: '10px' }} />
              <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: '10px' }} yAxisId="left" />
              <YAxis stroke="rgba(255,255,255,0.3)" style={{ fontSize: '10px' }} yAxisId="right" orientation="right" />
              <Tooltip 
                contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(0,200,255,0.3)' }}
                labelStyle={{ color: '#00c8ff' }}
              />
              <Area yAxisId="left" type="monotone" dataKey="co2" stroke="#ff7e00" fill="url(#co2-gradient)" strokeWidth={2} />
              <Area yAxisId="right" type="monotone" dataKey="o2" stroke="#00ff88" fill="url(#o2-gradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Note about dual axes */}
      <div className="mt-8 flex gap-6 justify-center text-xs text-white/40 uppercase tracking-[0.1em] font-bold">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span>CO2 (ppm) — Left Axis</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>O2 (%) — Right Axis</span>
        </div>
      </div>
    </motion.div>
  );
}

export default AnalyticsGridSection;
