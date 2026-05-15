'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PollutionTrend } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EnvironmentTimelineProps {
  trends?: PollutionTrend[];
}

export function EnvironmentTimeline({ trends = [] }: EnvironmentTimelineProps) {
  // Generate mock data if not provided
  const timelineData = trends.length > 0 ? trends : Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000),
    aqi: Math.random() * 200 + 30,
    co2: Math.random() * 300 + 300,
    sound: Math.random() * 100 + 30
  }));

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1 }
    }
  };

  const formattedData = timelineData.map((item) => ({
    ...item,
    time: new Date(item.timestamp).getHours() + ':00',
    timestamp: item.timestamp
  }));

  return (
    <motion.div
      className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3 className="text-sm font-semibold text-white/80 mb-4">
        LIVE ENVIRONMENT TIMELINE
      </motion.h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="time" stroke="rgba(255, 255, 255, 0.6)" />
          <YAxis stroke="rgba(255, 255, 255, 0.6)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px'
            }}
            labelStyle={{ color: '#fff' }}
          />
          <Line
            type="monotone"
            dataKey="aqi"
            stroke="#FF0000"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="co2"
            stroke="#00FF41"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="sound"
            stroke="#FFFF00"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF0000' }} />
          <span className="text-xs text-white/60">AQI</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00FF41' }} />
          <span className="text-xs text-white/60">CO₂</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFFF00' }} />
          <span className="text-xs text-white/60">Sound</span>
        </div>
      </div>
    </motion.div>
  );
}
