'use client';

import { motion } from 'framer-motion';

export function EnvironmentalFooter() {
  return (
    <motion.footer
      className="w-full py-16 px-8 lg:px-20 bg-black border-t border-white/10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* System Status */}
          <div>
            <h3 className="text-sm font-black text-cyan-400 uppercase tracking-[0.2em] mb-6">
              System Status
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-lg">
                <span className="text-xs text-white/60 uppercase tracking-[0.1em] font-bold">Neural Core</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black text-emerald-400">ACTIVE</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-lg">
                <span className="text-xs text-white/60 uppercase tracking-[0.1em] font-bold">Data Pipeline</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black text-emerald-400">LIVE</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-lg">
                <span className="text-xs text-white/60 uppercase tracking-[0.1em] font-bold">Scan Frequency</span>
                <span className="text-xs font-black text-cyan-400">60s</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-lg">
                <span className="text-xs text-white/60 uppercase tracking-[0.1em] font-bold">Anomaly Threshold</span>
                <span className="text-xs font-black text-cyan-400">150 AQI</span>
              </div>
            </div>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="text-sm font-black text-cyan-400 uppercase tracking-[0.2em] mb-6">
              Data Sources
            </h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-black/40 border border-white/10 rounded-lg">
                <p className="text-xs font-bold text-white mb-1">OpenWeatherMap Air Pollution API</p>
                <p className="text-xs text-white/40">Real-time air quality measurements</p>
              </div>

              <div className="p-3 bg-black/40 border border-white/10 rounded-lg">
                <p className="text-xs font-bold text-white mb-1">Open-Meteo Weather API</p>
                <p className="text-xs text-white/40">Weather and atmospheric data</p>
              </div>

              <div className="p-3 bg-black/40 border border-white/10 rounded-lg">
                <p className="text-xs font-bold text-white mb-1">Sentinel-5P Satellite</p>
                <p className="text-xs text-white/40">Global atmospheric monitoring</p>
              </div>

              <div className="p-3 bg-black/40 border border-white/10 rounded-lg">
                <p className="text-xs font-bold text-white mb-1">IP Geolocation</p>
                <p className="text-xs text-white/40">Location-based services</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

        {/* Copyright Footer */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold mb-4">
            © 2025 BreathMap • Real-Time Environmental Intelligence System
          </p>
          <p className="text-xs text-white/30">
            Made with precision for atmospheric awareness
          </p>
        </motion.div>

        {/* Scroll to top button */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-8 mx-auto block px-6 py-2 bg-black/40 hover:bg-black/60 border border-white/20 hover:border-cyan-500/50 rounded-lg text-xs text-white/60 hover:text-cyan-400 uppercase tracking-[0.1em] font-bold transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ↑ Return to Top
        </motion.button>
      </div>
    </motion.footer>
  );
}

export default EnvironmentalFooter;
