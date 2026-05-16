'use client';

import { useEffect, useRef } from 'react';
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export function AnimatedWindParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { weather } = useEnvironmentalData();
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const windSpeed = weather?.windSpeed || 5;
    const windStrength = windSpeed / 2; // Normalize wind speed

    const createParticle = (): Particle => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * windStrength + windStrength * 0.5,
        vy: (Math.random() - 0.5) * windStrength * 0.3,
        life: 1,
        maxLife: 1,
        size: Math.random() * 2 + 1,
      };
    };

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particlesRef.current.push(createParticle());
    }

    const animate = () => {
      // Clear canvas with fade
      ctx.fillStyle = 'rgba(5, 8, 22, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        // Draw particle
        ctx.fillStyle = `rgba(34, 211, 238, ${(p.life / p.maxLife) * 0.3})`;
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 2;

        ctx.beginPath();
        const radius = Math.max(0, p.size * (p.life / p.maxLife));
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Remove dead particles
        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          // Add new particle
          if (particlesRef.current.length < 50) {
            particlesRef.current.push(createParticle());
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [weather]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ opacity: 0.4 }}
    />
  );
}
