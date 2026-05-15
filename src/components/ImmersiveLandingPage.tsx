'use client';

import dynamic from 'next/dynamic';

// Dynamic imports for heavy components
const CinematicHeroV2 = dynamic(() => import('./CinematicHeroV2').then((mod) => ({ default: mod.CinematicHeroV2 })), {
  ssr: false,
});

const FullscreenLiveMap = dynamic(
  () => import('./FullscreenLiveMap').then((mod) => ({ default: mod.FullscreenLiveMap })),
  {
    ssr: false,
  }
);

const FloatingAnalyticsOverlay = dynamic(
  () => import('./FloatingAnalyticsOverlay').then((mod) => ({ default: mod.FloatingAnalyticsOverlay })),
  {
    ssr: false,
  }
);

const RadarScan = dynamic(() => import('./RadarScan').then((mod) => ({ default: mod.RadarScan })), {
  ssr: false,
});

const LiveSoundWaveform = dynamic(
  () => import('./LiveSoundWaveform').then((mod) => ({ default: mod.LiveSoundWaveform })),
  {
    ssr: false,
  }
);

const AIScanMode = dynamic(() => import('./AIScanMode').then((mod) => ({ default: mod.AIScanMode })), {
  ssr: false,
});

const PredictionTimeline = dynamic(
  () => import('./PredictionTimeline').then((mod) => ({ default: mod.PredictionTimeline })),
  {
    ssr: false,
  }
);

const AnimatedWindParticles = dynamic(
  () => import('./AnimatedWindParticles').then((mod) => ({ default: mod.AnimatedWindParticles })),
  {
    ssr: false,
  }
);

export default function ImmersiveLandingPage() {
  return (
    <main className="relative w-full bg-[#050816] overflow-x-hidden selection:bg-cyan-500/30">
      {/* Animated background particles */}
      <AnimatedWindParticles />

      {/* Section 1: Cinematic Hero */}
      <section className="relative w-full min-h-screen">
        <CinematicHeroV2 />
      </section>

      {/* Section 2: Fullscreen Command Center */}
      <section className="relative w-full h-screen overflow-hidden flex flex-col">
        {/* Top Header Strip (Minimal) */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-40 flex items-center justify-between px-8 pointer-events-none">
          <div className="flex items-center gap-4">
             <div className="w-10 h-[1px] bg-cyan-500/50" />
             <span className="text-[10px] text-cyan-400/60 tracking-[0.4em] uppercase font-bold">Atmospheric Node 01</span>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-white/40 tracking-widest uppercase">System Status</span>
                <span className="text-[10px] text-cyan-400 uppercase font-bold">Synchronized</span>
             </div>
             <div className="w-10 h-[1px] bg-cyan-500/50" />
          </div>
        </div>

        {/* Central Map - Dominant */}
        <div className="absolute inset-0 z-10">
          <FullscreenLiveMap />
        </div>

        {/* HUD Frame Overlay */}
        <div className="absolute inset-0 z-30 pointer-events-none flex">
          {/* Left Sidebar: Data Rich Environmental Stats */}
          <div className="w-80 h-full bg-gradient-to-r from-black/60 via-black/20 to-transparent backdrop-blur-[2px] p-8 flex flex-col gap-6 pointer-events-auto border-r border-white/5">
            <FloatingAnalyticsOverlay />
          </div>

          {/* Center Space for Map Interactivity */}
          <div className="flex-1 relative">
             {/* Sound Waveform - Floating in center bottom */}
             <div className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-auto">
                <LiveSoundWaveform />
             </div>
          </div>

          {/* Right Sidebar: AI, Radar & Alerts */}
          <div className="w-80 h-full bg-gradient-to-l from-black/60 via-black/20 to-transparent backdrop-blur-[2px] p-8 flex flex-col gap-8 items-end pointer-events-auto border-l border-white/5">
            <AIScanMode />
            <RadarScan />
            {/* Added Alert System Placeholder */}
            <div className="w-full mt-auto">
               <div className="flex items-center justify-end gap-2 mb-2">
                 <span className="text-[10px] text-red-500/60 font-bold tracking-[0.2em] uppercase">Alert Matrix</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
               </div>
               <div className="bg-red-500/5 border border-red-500/20 p-3 rounded-sm">
                 <p className="text-[9px] text-red-400 uppercase leading-relaxed">No critical atmospheric anomalies detected in current sector.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Panel: Timeline & Predictions */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-40 pointer-events-auto border-t border-white/5 flex flex-col justify-end">
          <div className="px-8 pb-4">
             <PredictionTimeline />
          </div>
        </div>
      </section>
    </main>
  );
}
