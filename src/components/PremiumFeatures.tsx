'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function PremiumFeatures() {
  const [selectedFeature, setSelectedFeature] = useState(0);

  const features = [
    {
      id: 0,
      icon: '🔮',
      title: 'AI ENVIRONMENT ORB',
      description: 'Floating holographic assistant analyzing atmospheric data in real-time',
      details: [
        'Neural network predictions',
        'Real-time atmospheric analysis',
        'Predictive alerts',
        'Multi-sensor fusion',
      ],
    },
    {
      id: 1,
      icon: '🧬',
      title: 'LIVE AIR DNA VISUALIZER',
      description: 'Circular animated environmental scanner showing molecular composition',
      details: [
        'Particle tracking',
        'Molecular visualization',
        '360° environmental scan',
        'Contamination breakdown',
      ],
    },
    {
      id: 2,
      icon: '🌐',
      title: 'GLOBAL AIR PULSE',
      description: 'World map pulsing pollution hotspots with real-time updates',
      details: [
        'Live data streaming',
        'Hotspot detection',
        'Regional analysis',
        'Trend forecasting',
      ],
    },
    {
      id: 3,
      icon: '📡',
      title: 'SCAN MODE',
      description: 'Advanced radar mode for detailed environmental analysis',
      details: [
        'Radar visualization',
        'Multi-layer scanning',
        'Deep analysis mode',
        'Particle detection',
      ],
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
            SPECIAL WOW FEATURES
          </h2>
          <p className="text-gray-300 text-lg">
            Cutting-edge technologies powering the future of environmental intelligence
          </p>
        </motion.div>

        {/* Features showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feature selector */}
          <motion.div
            className="lg:col-span-1 flex flex-col gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {features.map((feature, idx) => (
              <motion.button
                key={feature.id}
                onClick={() => setSelectedFeature(feature.id)}
                className={`text-left p-6 rounded-xl transition-all duration-300 glass-dark border ${
                  selectedFeature === feature.id
                    ? 'border-green-400 glow-sm'
                    : 'border-gray-600 hover:border-green-400'
                }`}
                whileHover={{ x: 10 }}
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="font-bold text-green-400 mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-400">{feature.description}</p>
              </motion.button>
            ))}
          </motion.div>

          {/* Feature detail */}
          <motion.div
            className="lg:col-span-2 glass-strong rounded-2xl p-12 border border-green-400/30 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-cyan-600/5 -z-10" />

            {/* Animated background elements */}
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"
              animate={{
                x: [0, 20, 0],
                y: [0, 10, 0],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Content */}
            <div className="relative z-10">
              {features.map((feature) => (
                selectedFeature === feature.id && (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-6xl mb-6">{feature.icon}</div>
                    <h3 className="text-3xl font-black text-green-400 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Details list */}
                    <div className="space-y-3">
                      {feature.details.map((detail, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-center gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                        >
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          <span className="text-gray-300">{detail}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      className="mt-8 px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-400 text-black font-bold rounded-lg hover:from-green-400 hover:to-cyan-300 transition-all glow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Explore Now
                    </motion.button>
                  </motion.div>
                )
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
