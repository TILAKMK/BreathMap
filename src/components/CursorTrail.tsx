'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function CursorTrail() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    let movementTimeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);

      clearTimeout(movementTimeout);
      movementTimeout = setTimeout(() => setIsMoving(false), 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(movementTimeout);
    };
  }, []);

  return (
    <>
      {/* Custom cursor */}
      <motion.div
        className="fixed w-8 h-8 rounded-full border-2 border-green-400 pointer-events-none z-50 hidden lg:block"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          boxShadow: isMoving
            ? '0 0 20px rgba(0, 255, 65, 0.6), inset 0 0 20px rgba(0, 255, 65, 0.3)'
            : '0 0 10px rgba(0, 255, 65, 0.3)'
        }}
        transition={{ type: 'spring' as const, damping: 30, stiffness: 200 }}
      />

      {/* Inner glow */}
      <motion.div
        className="fixed w-2 h-2 bg-green-400 rounded-full pointer-events-none z-50 hidden lg:block"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isMoving ? 1.5 : 1,
          opacity: isMoving ? 1 : 0.7
        }}
        transition={{ type: 'spring' as const, damping: 50, stiffness: 300 }}
      />
    </>
  );
}
