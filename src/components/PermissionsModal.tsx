'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Mic } from 'lucide-react';
import { useState } from 'react';

interface PermissionsModalProps {
  isOpen: boolean;
  onAllow: () => Promise<void>;
  onSkip: () => void;
  isLoading?: boolean;
}

export function PermissionsModal({ isOpen, onAllow, onSkip, isLoading }: PermissionsModalProps) {
  const [error, setError] = useState<string | null>(null);

  const handleAllow = async () => {
    setError(null);
    try {
      await onAllow();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to grant permissions');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-black/80 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl p-12 w-full max-w-lg shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                BREATHMAP INITIALIZATION
              </h2>
              <p className="text-sm text-cyan-400 uppercase tracking-[0.2em] font-bold">
                Permission Request
              </p>
            </div>

            {/* Permissions List */}
            <div className="space-y-4 mb-8">
              {/* Location */}
              <motion.div
                className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                whileHover={{ x: 4 }}
              >
                <div className="flex-shrink-0 mt-1">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">📍 Precise Location</p>
                  <p className="text-xs text-white/60">
                    Real-time air quality at your exact position
                  </p>
                </div>
              </motion.div>

              {/* Microphone */}
              <motion.div
                className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                whileHover={{ x: 4 }}
              >
                <div className="flex-shrink-0 mt-1">
                  <Mic className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">🎤 Microphone</p>
                  <p className="text-xs text-white/60">
                    Atmospheric resonance analysis in your environment
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-xs text-red-200"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <motion.button
                onClick={handleAllow}
                disabled={isLoading}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold uppercase tracking-[0.1em] rounded-lg transition-all text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? 'Initializing...' : 'Grant Access'}
              </motion.button>

              <motion.button
                onClick={onSkip}
                disabled={isLoading}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white/70 hover:text-white font-bold uppercase tracking-[0.1em] rounded-lg transition-all text-xs border border-white/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Skip
              </motion.button>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-white/40 text-center mt-6 uppercase tracking-[0.1em] font-bold">
              You can change permissions in your browser settings anytime
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PermissionsModal;
