'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-8xl font-black text-transparent bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text mb-4">
            404
          </h1>
          <p className="text-3xl font-bold text-white mb-2">
            Page Not Found
          </p>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            The atmospheric data for this location could not be found. Let's return to the dashboard.
          </p>
          
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all"
            >
              Return to Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
