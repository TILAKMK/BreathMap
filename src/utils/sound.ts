import { SoundAnalysis } from '@/types';

export async function initializeAudioContext(): Promise<AudioContext> {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  return new AudioContextClass();
}

export async function requestMicrophoneAccess(): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    return stream;
  } catch (error) {
    console.error('Microphone access denied:', error);
    throw error;
  }
}

export function analyzeAudio(dataArray: Uint8Array): SoundAnalysis {
  const frequency: number[] = [];
  const amplitude: number[] = [];

  // Convert byte data to frequency spectrum
  for (let i = 0; i < dataArray.length; i += 2) {
    const byte = dataArray[i];
    frequency.push(byte);
    amplitude.push((byte / 255) * 100);
  }

  // Calculate average decibel level
  const average = amplitude.reduce((a, b) => a + b, 0) / amplitude.length;
  const decibel = Math.round(20 * Math.log10(average / 100 + 0.001) + 94); // dB scale

  // Determine noise type
  let noiseType: 'traffic' | 'construction' | 'natural' | 'quiet' = 'quiet';
  if (decibel < 40) noiseType = 'quiet';
  else if (decibel < 70) noiseType = 'natural';
  else if (decibel < 85) noiseType = 'traffic';
  else noiseType = 'construction';

  return {
    frequency,
    amplitude,
    decibel: Math.max(0, Math.min(130, decibel)),
    noiseType
  };
}

export function getNoiseColor(decibel: number): string {
  if (decibel < 40) return '#00FF41'; // Green - quiet
  if (decibel < 60) return '#FFFF00'; // Yellow - moderate
  if (decibel < 80) return '#FF7E00'; // Orange - loud
  if (decibel < 100) return '#FF0000'; // Red - very loud
  return '#8F3F97'; // Purple - extremely loud
}
