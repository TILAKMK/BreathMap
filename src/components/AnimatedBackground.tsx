'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
}

interface AnimatedBackgroundProps {
  intensity?: number; // 0-100, affects particle speed and color
  pollutionLevel?: 'safe' | 'moderate' | 'danger' | 'toxic';
}

export function AnimatedBackground({ intensity = 50, pollutionLevel = 'moderate' }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number | null>(null);

  const getBackgroundGradient = () => {
    const baseGradients: Record<string, string> = {
      safe: 'from-black via-blue-950 to-blue-900',
      moderate: 'from-black via-slate-950 to-slate-900',
      danger: 'from-black via-red-950 to-red-900',
      toxic: 'from-black via-purple-950 to-purple-900'
    };
    return baseGradients[pollutionLevel] || baseGradients.moderate;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    const particleCount = 100 + (intensity * 2);
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      velocityX: (Math.random() - 0.5) * 2,
      velocityY: (Math.random() - 0.5) * 2 * (intensity / 50)
    }));

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.opacity += (Math.random() - 0.5) * 0.05;
        particle.opacity = Math.max(0.1, Math.min(0.8, particle.opacity));

        // Wrap around
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.fillStyle = `rgba(0, 255, 65, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [intensity, pollutionLevel]);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br ${getBackgroundGradient()} overflow-hidden`}>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />
      {/* Animated glow overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(0, 255, 65, 0.1) 0%, transparent 70%)',
            'radial-gradient(circle at 50% 50%, rgba(0, 255, 65, 0.15) 0%, transparent 70%)',
            'radial-gradient(circle at 50% 50%, rgba(0, 255, 65, 0.1) 0%, transparent 70%)'
          ]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  );
}
