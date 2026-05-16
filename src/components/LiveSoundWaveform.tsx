'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function LiveSoundWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const frequencyDataRef = useRef<Uint8Array | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const mockDataRef = useRef<number[]>(Array(64).fill(0));

  useEffect(() => {
    // Initialize Web Audio API for microphone input
    const initAudioAnalyzer = async () => {
      try {
        // Check if microphone access is already granted
        const audioStreamActive = localStorage.getItem('breathmap-audio-stream-active') === 'true';
        
        if (audioStreamActive || navigator.mediaDevices) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            }
          }).catch(() => null);

          if (stream) {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.connect(audioContext.destination);

            analyserRef.current = analyser;
            frequencyDataRef.current = new Uint8Array(analyser.frequencyBinCount) as any;
            setIsActive(true);

            return () => {
              stream.getTracks().forEach(track => track.stop());
              audioContext.close();
            };
          }
        }
      } catch (error) {
        console.warn('Microphone initialization failed, using mock data:', error);
      }
    };

    initAudioAnalyzer();

    // Animation loop
    const animate = () => {
      if (analyserRef.current && frequencyDataRef.current) {
        analyserRef.current.getByteFrequencyData(frequencyDataRef.current as any);
        
        // Update mock data with analyser data
        const data = frequencyDataRef.current;
        for (let i = 0; i < 64; i++) {
          const binSize = Math.floor(data.length / 64);
          const sum = data.slice(i * binSize, (i + 1) * binSize).reduce((a, b) => a + b, 0);
          mockDataRef.current[i] = (sum / binSize / 255) * 100;
        }
      } else {
        // Generate smooth mock waveform when microphone not available
        for (let i = 0; i < 64; i++) {
          mockDataRef.current[i] = (Math.sin(Date.now() / 500 + i * 0.1) * 0.5 + 0.5) * 100 * (Math.random() * 0.5 + 0.5);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 bg-black/60 px-8 py-3 rounded-full border border-cyan-500/20 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)]">
      <div className="flex items-end gap-[2px] h-8 w-64 justify-center">
        {[...Array(64)].map((_, i) => (
          <motion.div
            key={i}
            className="w-[2px] rounded-t-full transition-all"
            style={{
              height: `${mockDataRef.current[i] || Math.random() * 30 + 10}%`,
              opacity: Math.max(0.3, (mockDataRef.current[i] || 30) / 100),
              backgroundColor: 
                i % 8 === 0 ? '#10b981' : 
                i % 4 === 0 ? '#22d3ee' : 
                'rgba(34, 211, 238, 0.4)',
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-cyan-500/50" />
        <span className="text-[8px] text-cyan-400 font-bold tracking-[0.5em] uppercase glow-text">
          {isActive ? '🎤 LIVE' : 'Atmospheric Resonance'}
        </span>
        <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-cyan-500/50" />
      </div>
    </div>
  );
}
