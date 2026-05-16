'use client';

import { AQIData } from '@/lib/realTimeApis';
import Link from 'next/link';

interface StickyTopbarProps {
  aqi: AQIData | null;
  locationName: string;
  lastUpdate: Date | null;
}

export function StickyTopbar({ aqi, locationName, lastUpdate }: StickyTopbarProps) {
  const formatTime = (date: Date | null) => {
    if (!date) return 'Loading...';
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getAQIColor = (aqi: number | null) => {
    if (!aqi) return 'text-white';
    if (aqi <= 50) return 'text-emerald-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    if (aqi <= 200) return 'text-red-400';
    return 'text-red-600';
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-black/80 backdrop-blur-xl border-b border-white/10 z-40 flex items-center justify-between px-8">
      {/* Left: Logo + Status */}
      <div className="flex items-center gap-4">
        <Link href="/" className="hover:opacity-70 transition-opacity flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-black" />
          </div>
          <span className="text-sm font-black text-white tracking-[0.15em] uppercase hidden md:block">BreathMap</span>
        </Link>
        
        <div className="flex items-center gap-2 ml-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-white/60 tracking-[0.1em] uppercase font-bold">Live Monitoring</span>
        </div>
      </div>

      {/* Center: City + Time */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center">
          <span className="text-xs text-white/40 uppercase tracking-[0.1em] font-bold">Location</span>
          <span className="text-sm text-white font-bold">{locationName}</span>
        </div>
        
        <div className="w-px h-6 bg-white/10" />
        
        <div className="flex flex-col items-center">
          <span className="text-xs text-white/40 uppercase tracking-[0.1em] font-bold">Last Update</span>
          <span className="text-sm text-white/80 font-mono text-xs">{formatTime(lastUpdate)}</span>
        </div>
      </div>

      {/* Right: AQI Display */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-xs text-white/40 uppercase tracking-[0.1em] font-bold">AQI</span>
          <span className={`text-2xl font-black ${getAQIColor(aqi?.aqi || null)}`}>
            {aqi?.aqi || '—'}
          </span>
        </div>
        <div className="w-1 h-10 bg-gradient-to-b from-cyan-500/50 to-cyan-600/50 rounded-full" />
      </div>
    </div>
  );
}

export default StickyTopbar;
