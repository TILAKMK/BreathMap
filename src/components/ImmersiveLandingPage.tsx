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
    <main className="relative w-full bg-[#050816] overflow-x-hidden">
      {/* Animated background particles */}
      <AnimatedWindParticles />

      {/* Section 1: Cinematic Hero */}
      <section className="relative w-full min-h-screen">
        <CinematicHeroV2 />
      </section>

      {/* Section 2: Fullscreen Live Map */}
      <section className="relative w-full min-h-screen">
        <FullscreenLiveMap />

        {/* Overlay components */}
        <FloatingAnalyticsOverlay />
        <RadarScan />
        <LiveSoundWaveform />
        <AIScanMode />
        <PredictionTimeline />
      </section>

      {/* Section 3: Additional immersive content (optional) */}
      <section className="relative w-full min-h-screen bg-gradient-to-br from-[#050816] to-[#0a0e27] flex items-center justify-center p-8">
        <div className="max-w-4xl text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Experience the Environment
            <br />
            <span className="bg-gradient-to-r from-[#00F5D4] to-white bg-clip-text text-transparent">
              Like Never Before
            </span>
          </h2>
          <p className="text-[#94A3B8] text-lg mb-8">
            Our real-time environmental operating system combines satellite data, weather intelligence, and pollution tracking
            into one immersive experience. Watch air quality, wind patterns, and environmental conditions update live as you
            explore.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: '🌍',
                title: 'Live Geolocation',
                desc: 'Automatic detection of your location with GPS precision',
              },
              {
                icon: '📊',
                title: 'Real-Time Data',
                desc: 'Updated metrics from live environmental APIs',
              },
              {
                icon: '🎯',
                title: 'AI Analysis',
                desc: 'Advanced atmospheric scanning and predictions',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#00F5D4]/10 to-[#00F5D4]/5 border border-[#00F5D4]/30 hover:border-[#00F5D4] transition-all"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-[#94A3B8] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
