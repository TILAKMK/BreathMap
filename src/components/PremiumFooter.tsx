'use client';

import { motion } from 'framer-motion';

export default function PremiumFooter() {
  return (
    <footer className="relative w-full border-t border-green-400/20 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-black/80 -z-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl breathing-fog" />

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-black bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              BREATHMAP
            </h3>
            <p className="text-gray-400 text-sm">
              AI-powered environmental intelligence for a sustainable future
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-green-400 font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Features', 'Pricing', 'Security', 'Roadmap'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-green-400 font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-green-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-green-400 font-bold mb-4">Follow</h4>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'GitHub', 'Discord'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-lg glass-dark border border-green-400/30 flex items-center justify-center hover:border-green-400 hover:glow-sm transition-all text-gray-400 hover:text-green-400 text-xs"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-green-400/10 my-8" />

        {/* Bottom section */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p>© 2024 BreathMap AI. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-green-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-green-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-green-400 transition-colors">
              Cookie Policy
            </a>
          </div>
        </motion.div>

        {/* Floating status indicator */}
        <motion.div
          className="fixed bottom-8 right-8 glass-dark rounded-full px-6 py-3 border border-green-400/50 flex items-center gap-2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-xs font-semibold">LIVE</span>
        </motion.div>
      </div>
    </footer>
  );
}
