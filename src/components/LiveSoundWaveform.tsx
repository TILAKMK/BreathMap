'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export function LiveSoundWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [soundLevel, setSoundLevel] = useState(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const sourceNode = audioContext.createMediaStreamSource(stream);
        sourceNode.connect(analyser);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray: Uint8Array = new Uint8Array(bufferLength);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;

        setIsListening(true);

        // Start visualization loop
        const draw = () => {
          if (!analyserRef.current || !dataArrayRef.current || !canvasRef.current) return;

          analyserRef.current.getByteFrequencyData(dataArrayRef.current as any);

          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Calculate average sound level
          const average =
            dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length;
          setSoundLevel(average / 255);

          // Clear canvas with fade effect
          ctx.fillStyle = 'rgba(5, 8, 22, 0.1)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw waveform
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#00F5D4';
          ctx.shadowColor = '#00F5D4';
          ctx.shadowBlur = 10;

          ctx.beginPath();
          const sliceWidth = canvas.width / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArrayRef.current[i] / 128.0;
            const y = (v * canvas.height) / 2;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }

            x += sliceWidth;
          }

          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.stroke();

          animationFrameRef.current = requestAnimationFrame(draw);
        };

        draw();
      } catch (error) {
        console.log('Microphone access denied or unavailable');
        setIsListening(false);
      }
    };

    initAudio();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="fixed top-8 left-8 z-40 w-80">
      <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-[#00F5D4]/30">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold text-sm">Sound Pollution</h3>
            <p className="text-[#94A3B8] text-xs">Live microphone analysis</p>
          </div>
          <motion.div
            className="w-3 h-3 bg-[#00F5D4] rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          />
        </div>

        {/* Waveform Canvas */}
        <canvas
          ref={canvasRef}
          width={320}
          height={80}
          className="w-full bg-gradient-to-b from-[#0a0e27] to-[#050816] rounded-lg mb-3"
        />

        {/* Sound Level Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#94A3B8]">Level</span>
            <span className="text-[#00F5D4] font-semibold">{Math.round(soundLevel * 100)}%</span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-[#00F5D4]/20">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00F5D4] to-[#00FFD4]"
              animate={{
                width: `${soundLevel * 100}%`,
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Status */}
        {isListening ? (
          <p className="text-xs text-[#00F5D4] mt-3 text-center">🎤 Listening...</p>
        ) : (
          <p className="text-xs text-[#FF5252] mt-3 text-center">🔇 Microphone inactive</p>
        )}
      </div>
    </div>
  );
}
