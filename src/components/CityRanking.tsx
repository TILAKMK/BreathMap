'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CityZone } from '@/types';

interface CityRankingProps {
  zones?: CityZone[];
}

export function CityRanking({ zones = [] }: CityRankingProps) {
  // Generate mock data if not provided
  const displayZones = zones.length > 0 ? zones : [
    {
      id: '1',
      name: 'Green Park District',
      location: { lat: 28.7041, lng: 77.1025 },
      averageAQI: 45,
      greenCover: 85,
      population: 50000,
      breathabilityRank: 1
    },
    {
      id: '2',
      name: 'Riverside Valley',
      location: { lat: 28.7,  lng: 77.12 },
      averageAQI: 62,
      greenCover: 65,
      population: 75000,
      breathabilityRank: 2
    },
    {
      id: '3',
      name: 'Downtown Core',
      location: { lat: 28.71, lng: 77.11 },
      averageAQI: 120,
      greenCover: 20,
      population: 150000,
      breathabilityRank: 3
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 max-w-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3 className="text-sm font-semibold text-white/80 mb-4">
        TOP BREATHABLE ZONES
      </motion.h3>

      <motion.div className="space-y-3">
        {displayZones
          .sort((a, b) => a.averageAQI - b.averageAQI)
          .slice(0, 3)
          .map((zone, index) => (
            <motion.div
              key={zone.id}
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3 hover:border-white/20 transition-all cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 4 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-white">#{index + 1}</span>
                    <h4 className="text-sm font-semibold text-white">{zone.name}</h4>
                  </div>
                  <p className="text-xs text-white/60">
                    {zone.population.toLocaleString()} residents
                  </p>
                </div>
                <motion.div
                  className="text-right"
                  animate={{
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="text-lg font-bold text-green-400">✓</p>
                </motion.div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">AQI</span>
                  <span className="text-white font-semibold">{Math.round(zone.averageAQI)}</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((100 - zone.averageAQI / 2), 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>

                <div className="flex justify-between text-xs mt-2">
                  <span className="text-white/60">Green Cover</span>
                  <span className="text-green-400 font-semibold">{zone.greenCover}%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${zone.greenCover}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
      </motion.div>
    </motion.div>
  );
}
