'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function CinematicHero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current) return;

    const tl = gsap.timeline({ delay: 0.3 });

    // Animate title
    tl.from(titleRef.current, {
      duration: 1.2,
      opacity: 0,
      y: 50,
      ease: 'power3.out',
    }, 0);

    // Animate subtitle
    tl.from(subtitleRef.current, {
      duration: 1,
      opacity: 0,
      y: 30,
      ease: 'power3.out',
    }, 0.3);

    // Animate each word for title
    const words = titleRef.current.querySelectorAll('.word');
    words.forEach((word, index) => {
      tl.from(
        word,
        {
          duration: 0.6,
          opacity: 0,
          y: 20,
          ease: 'back.out',
        },
        0.1 * index
      );
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 gradient-dark" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl breathing-fog" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl breathing-fog animation-delay-2000" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl breathing-fog animation-delay-4000" />
      </div>

      {/* Animated scanning lines */}
      <div className="absolute inset-0 z-5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent scan-line opacity-50" />
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#00ff41" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 md:px-8">
        {/* Floating orb effect */}
        <motion.div
          className="absolute -top-32 left-1/2 w-64 h-64 -translate-x-1/2"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-green-400/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute inset-4 bg-gradient-to-b from-blue-400/10 to-transparent rounded-full blur-2xl" />
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter"
          style={{
            background: 'linear-gradient(135deg, #00ff41 0%, #00d4ff 50%, #8f3f97 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          <span className="word inline-block">SEE</span>
          {' '}
          <span className="word inline-block">THE</span>
          {' '}
          <span className="word inline-block">AIR</span>
          <br />
          <span className="word inline-block">BEFORE</span>
          {' '}
          <span className="word inline-block">YOU</span>
          {' '}
          <span className="word inline-block">BREATHE</span>
          <span className="word inline-block text-green-400">.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          ref={subtitleRef}
          className="text-lg md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          AI-powered real-time environmental intelligence at your fingertips
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {/* Primary button */}
          <motion.button
            className="relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-400 text-black font-bold text-lg rounded-lg overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              START SCANNING
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ▶
              </motion.span>
            </span>
          </motion.button>

          {/* Secondary button */}
          <motion.button
            className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-bold text-lg rounded-lg hover:bg-cyan-400/10 transition-all duration-300 glow-blue"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            EXPLORE LIVE ATMOSPHERE
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-center text-green-400/70 text-sm">
            <p className="mb-2">Scroll to explore</p>
            <div className="text-xl">↓</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
