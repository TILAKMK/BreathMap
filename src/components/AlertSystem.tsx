'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnvironmentAlert } from '@/types';

interface AlertSystemProps {
  alerts?: EnvironmentAlert[];
  onDismiss?: (id: string) => void;
}

export function AlertSystem({ alerts = [], onDismiss }: AlertSystemProps) {
  // Generate mock alerts if not provided
  const displayAlerts = alerts.length > 0 ? alerts : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
    exit: { opacity: 0 }
  };

  const alertVariants = {
    hidden: { opacity: 0, x: 100, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { type: 'spring' as const, damping: 15 }
    },
    exit: {
      opacity: 0,
      x: 100,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const getAlertColor = (type: EnvironmentAlert['type']) => {
    switch (type) {
      case 'HIGH_TOXICITY':
        return 'from-red-600 to-red-900';
      case 'HEAVY_TRAFFIC':
        return 'from-orange-600 to-orange-900';
      case 'LOW_OXYGEN':
        return 'from-blue-600 to-blue-900';
      case 'NOISE_SPIKE':
        return 'from-yellow-600 to-yellow-900';
      default:
        return 'from-purple-600 to-purple-900';
    }
  };

  const getAlertIcon = (type: EnvironmentAlert['type']) => {
    switch (type) {
      case 'HIGH_TOXICITY':
        return '⚠';
      case 'HEAVY_TRAFFIC':
        return '🚗';
      case 'LOW_OXYGEN':
        return '💨';
      case 'NOISE_SPIKE':
        return '🔊';
      default:
        return '⚡';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-40 max-w-sm space-y-2">
      <AnimatePresence mode="popLayout">
        {displayAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            className={`backdrop-blur-md bg-gradient-to-r ${getAlertColor(
              alert.type
            )} border-l-4 rounded-lg p-4 text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow`}
            variants={alertVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => onDismiss?.(alert.id)}
            whileHover={{ scale: 1.02, x: -4 }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{getAlertIcon(alert.type)}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{alert.type.replace(/_/g, ' ')}</h4>
                <p className="text-xs text-white/80 mt-1">{alert.message}</p>
                <p className="text-xs text-white/60 mt-2">
                  {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                </p>
              </div>
              <motion.button
                className="text-lg opacity-70 hover:opacity-100"
                whileHover={{ rotate: 90 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss?.(alert.id);
                }}
              >
                ✕
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
