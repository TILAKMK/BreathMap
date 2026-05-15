'use client';

import { motion } from 'framer-motion';
import { EarthVisualization } from './EarthVisualization';

export function CinematicHeroV2() {
  return (
    <div className="relative w-full min-h-screen bg-[#050816] overflow-hidden flex items-center justify-center">
      {/* Background Depth */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,14,39,1)_0%,rgba(5,8,22,1)_100%)]" />
        
        {/* Subtle Ambient Glows */}
        <motion.div
          className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px]"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-emerald-900/5 rounded-full blur-[120px]"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Subtle 3D Earth - Positioned behind text but clearly visible */}
      <div className="absolute inset-0 z-10 flex items-center justify-center opacity-40 mix-blend-screen pointer-events-none">
        <div className="w-full max-w-4xl h-[600px]">
          <EarthVisualization />
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-20 text-center px-4 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* Top HUD Line */}
        <motion.div 
          className="flex items-center justify-center gap-4 mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
          <span className="text-cyan-400/60 text-[10px] tracking-[0.4em] font-medium uppercase">
            System Initialization v4.0
          </span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500/50" />
        </motion.div>

        {/* Main heading */}
        <div className="mb-8 relative">
          <motion.h1
            className="text-7xl md:text-8xl font-bold tracking-tighter"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">BREATH</span>
            <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(0,245,212,0.3)]">MAP</span>
          </motion.h1>
          <motion.div 
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
            initial={{ width: 0 }}
            animate={{ width: '80%' }}
            transition={{ delay: 1.2, duration: 1.5 }}
          />
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-lg text-slate-400 font-light tracking-wide max-w-2xl mx-auto mb-16 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Advanced Environmental Command & Control. 
          Real-time atmospheric intelligence through holographic data visualization.
        </motion.p>

        {/* Premium CTA */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          <motion.button
            className="group relative px-10 py-4 overflow-hidden rounded-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <div className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/30 group-hover:bg-cyan-500/20 transition-all duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
            <span className="relative text-cyan-400 font-bold tracking-widest text-sm uppercase">
              Enter Command Center
            </span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Bottom HUD Elements */}
      <motion.div 
        className="absolute bottom-12 left-12 flex flex-col gap-2"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="text-[10px] text-cyan-500/40 tracking-widest uppercase">Global Node Alpha-7</div>
        <div className="text-[10px] text-slate-500 tracking-widest uppercase">Scanning Frequency: 4.2 GHz</div>
      </motion.div>

      <motion.div 
        className="absolute bottom-12 right-12 text-right flex flex-col gap-2"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="text-[10px] text-cyan-500/40 tracking-widest uppercase">Telemetry Active</div>
        <div className="text-[10px] text-slate-500 tracking-widest uppercase">Live Data Stream: Verified</div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        animate={{
          y: [0, 8, 0],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0" />
        <span className="text-[10px] text-cyan-500/50 tracking-[0.3em] uppercase">Scroll</span>
      </motion.div>
    </div>
  );
}
