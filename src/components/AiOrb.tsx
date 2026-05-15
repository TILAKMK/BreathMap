'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AiOrb() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full py-16 overflow-hidden">
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
            AI ENVIRONMENT ASSISTANT
          </h2>
          <p className="text-gray-300 text-lg">
            Your intelligent environmental companion
          </p>
        </motion.div>

        {/* Orb container */}
        <div className="flex justify-center items-center min-h-96">
          <motion.div
            className="relative"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {/* Outer glowing rings */}
            <motion.div
              className="absolute inset-0 rounded-full border border-green-400/30"
              style={{
                width: '280px',
                height: '280px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />

            <motion.div
              className="absolute inset-0 rounded-full border border-cyan-400/20"
              style={{
                width: '340px',
                height: '340px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />

            <motion.div
              className="absolute inset-0 rounded-full border border-purple-400/10"
              style={{
                width: '400px',
                height: '400px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            />

            {/* Core orb */}
            <motion.div
              className="relative w-48 h-48 mx-auto"
              animate={{
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Outer glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-cyan-400 rounded-full blur-3xl opacity-40" />

              {/* Inner gradient */}
              <div className="absolute inset-2 bg-gradient-to-br from-green-500 via-cyan-500 to-purple-600 rounded-full blur-2xl opacity-60" />

              {/* Core */}
              <motion.div
                className="absolute inset-4 bg-gradient-to-b from-white to-green-300 rounded-full shadow-2xl"
                animate={{
                  boxShadow: isHovered
                    ? [
                        '0 0 30px rgba(0, 255, 65, 0.8), 0 0 60px rgba(0, 212, 255, 0.4)',
                        '0 0 40px rgba(0, 212, 255, 0.8), 0 0 80px rgba(143, 63, 151, 0.4)',
                        '0 0 30px rgba(0, 255, 65, 0.8), 0 0 60px rgba(0, 212, 255, 0.4)',
                      ]
                    : '0 0 20px rgba(0, 255, 65, 0.5), 0 0 40px rgba(0, 212, 255, 0.2)',
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              />

              {/* Floating particles inside */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: Math.cos((i / 5) * Math.PI * 2) * 40,
                    y: Math.sin((i / 5) * Math.PI * 2) * 40,
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>

            {/* Text below orb */}
            <motion.div
              className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center w-80"
              animate={{
                opacity: isHovered ? 1 : 0.6,
              }}
            >
              <p className="text-green-400 font-semibold">
                {isHovered ? 'AI Ready to Analyze' : 'Monitoring...'}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Features grid below orb */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {[
            {
              icon: '🔍',
              title: 'Real-time Analysis',
              desc: 'Instant environmental assessment',
            },
            {
              icon: '🧠',
              title: 'AI Powered',
              desc: 'Machine learning predictions',
            },
            {
              icon: '⚡',
              title: 'Live Updates',
              desc: 'Continuous atmosphere monitoring',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="glass-dark rounded-xl p-6 text-center hover:glass-strong transition-all"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-green-400 font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
