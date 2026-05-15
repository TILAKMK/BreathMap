'use client';

import { motion } from 'framer-motion';

const predictions = [
  {
    time: 'Now',
    aqi: 23,
    condition: 'Good',
    icon: '🟢',
  },
  {
    time: '2h later',
    aqi: 35,
    condition: 'Good',
    icon: '🟢',
  },
  {
    time: '6h later',
    aqi: 52,
    condition: 'Moderate',
    icon: '🟡',
  },
  {
    time: '12h later',
    aqi: 75,
    condition: 'Moderate',
    icon: '🟡',
  },
  {
    time: '24h later',
    aqi: 42,
    condition: 'Good',
    icon: '🟢',
  },
];

export function PredictionTimeline() {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-4xl px-4">
      <motion.div
        className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-[#00F5D4]/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-white font-semibold mb-4">AQI Prediction - Next 24 Hours</h3>

        <div className="flex justify-between items-end gap-2">
          {predictions.map((pred, i) => (
            <motion.div
              key={i}
              className="flex-1 flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              {/* Bar chart */}
              <div className="w-full flex items-end justify-center mb-2 h-24">
                <motion.div
                  className="flex-1 max-w-8 bg-gradient-to-t from-[#00F5D4] to-[#00F5D4]/50 rounded-t-lg"
                  style={{
                    height: `${(pred.aqi / 100) * 100}%`,
                  }}
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              </div>

              {/* Time label */}
              <p className="text-[#94A3B8] text-xs mb-1">{pred.time}</p>

              {/* AQI value */}
              <p className="text-white font-bold text-sm mb-1">{pred.aqi}</p>

              {/* Icon and condition */}
              <div className="text-center">
                <p className="text-lg mb-0.5">{pred.icon}</p>
                <p className="text-[#00F5D4] text-xs">{pred.condition}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline info */}
        <div className="mt-4 pt-4 border-t border-[#00F5D4]/20 flex justify-between text-xs text-[#94A3B8]">
          <span>📊 Based on historical patterns & current trends</span>
          <span>🔄 Updates every 6 hours</span>
        </div>
      </motion.div>
    </div>
  );
}
