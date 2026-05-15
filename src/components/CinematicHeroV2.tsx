'use client';

import { motion } from 'framer-motion';

export function CinematicHeroV2() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#050816] to-[#0a0e27] overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 245, 212, 0.15), transparent)',
            left: '10%',
            top: '20%',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-72 h-72 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 212, 0.1), transparent)',
            right: '15%',
            bottom: '20%',
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-5xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Badge */}
        <motion.div
          className="inline-block mb-8 px-4 py-2 rounded-full bg-[#00F5D4]/10 border border-[#00F5D4]/50 backdrop-blur-sm"
          animate={{
            boxShadow: ['0 0 20px rgba(0, 245, 212, 0.3)', '0 0 40px rgba(0, 245, 212, 0.6)', '0 0 20px rgba(0, 245, 212, 0.3)'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          <span className="text-[#00F5D4] text-sm font-semibold">🌍 LIVE ENVIRONMENTAL INTELLIGENCE</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          <span className="bg-gradient-to-r from-white via-white to-[#00F5D4] bg-clip-text text-transparent">
            The Atmosphere
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#00F5D4] to-white bg-clip-text text-transparent">
            Comes Alive
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl text-[#94A3B8] mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          Real-time environmental intelligence system. Watch the air quality, weather, pollution, and wind patterns unfold before your eyes.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-[#00F5D4] to-[#00FFD4] text-black font-bold rounded-xl text-lg"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 0 30px rgba(0, 245, 212, 0.6)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            Start Monitoring Now
          </motion.button>

          <motion.button
            className="px-8 py-4 bg-transparent border-2 border-[#00F5D4] text-[#00F5D4] font-bold rounded-xl text-lg hover:bg-[#00F5D4]/10"
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{ scale: 0.95 }}
          >
            View Live Map
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      >
        <div className="text-[#00F5D4] text-center">
          <p className="text-sm mb-2">Scroll to explore</p>
          <div className="text-2xl">↓</div>
        </div>
      </motion.div>
    </div>
  );
}
