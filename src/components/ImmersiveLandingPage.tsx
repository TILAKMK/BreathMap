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

      {/* Section 2: Fullscreen Live Map & Command Center */}
      <section className="relative w-full h-screen overflow-hidden">
        <FullscreenLiveMap />

        {/* HUD Overlay System */}
        <div className="absolute inset-0 pointer-events-none z-30">
          {/* Left HUD: Environmental Stats */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-auto">
            <FloatingAnalyticsOverlay />
          </div>

          {/* Right HUD: AI Scan */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-auto">
            <AIScanMode />
          </div>

          {/* Bottom HUD: Timeline & Sound */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] pointer-events-auto">
            <div className="flex flex-col gap-4 items-center">
              <LiveSoundWaveform />
              <PredictionTimeline />
            </div>
          </div>

          {/* Map Feature HUD: Radar */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-auto">
            <RadarScan />
          </div>
        </div>
      </section>
    </main>
  );
}
