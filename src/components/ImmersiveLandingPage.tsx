'use client';

import dynamic from 'next/dynamic';

// Dynamic imports
const CinematicHeroV2 = dynamic(() => import('./CinematicHeroV2').then((mod) => ({ default: mod.CinematicHeroV2 })), { ssr: false });
const FullscreenLiveMap = dynamic(() => import('./FullscreenLiveMap').then((mod) => ({ default: mod.FullscreenLiveMap })), { ssr: false });
const FloatingAnalyticsOverlay = dynamic(() => import('./FloatingAnalyticsOverlay').then((mod) => ({ default: mod.FloatingAnalyticsOverlay })), { ssr: false });
const RadarScan = dynamic(() => import('./RadarScan').then((mod) => ({ default: mod.RadarScan })), { ssr: false });
const AIScanMode = dynamic(() => import('./AIScanMode').then((mod) => ({ default: mod.AIScanMode })), { ssr: false });
const PredictionTimeline = dynamic(() => import('./PredictionTimeline').then((mod) => ({ default: mod.PredictionTimeline })), { ssr: false });
const AnimatedWindParticles = dynamic(() => import('./AnimatedWindParticles').then((mod) => ({ default: mod.AnimatedWindParticles })), { ssr: false });
const LiveSoundWaveform = dynamic(() => import('./LiveSoundWaveform').then((mod) => ({ default: mod.LiveSoundWaveform })), { ssr: false });
const AnimatedGraphs = dynamic(() => import('./AnimatedGraphs'), { ssr: false });

export default function ImmersiveLandingPage() {
  return (
    <main className="relative w-full bg-[#050816] overflow-x-hidden selection:bg-cyan-500/30 font-sans">
      <AnimatedWindParticles />

      {/* SECTION 1: Cinematic Hero Landing Page */}
      <section id="hero" className="relative w-full min-h-screen">
        <CinematicHeroV2 />
      </section>

      {/* SECTION 2: Massive Live Environmental Map */}
      <section id="live-map" className="relative w-full h-[100vh] border-y border-white/5 bg-black">
        {/* Section Header */}
        <div className="absolute top-8 left-8 z-40 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl pointer-events-none">
           <h2 className="text-sm font-black text-white tracking-[0.3em] uppercase glow-text">Global Atmospheric Map</h2>
           <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-1">Live Sensor Array</p>
        </div>
        
        {/* Fullscreen Map Component */}
        <div className="absolute inset-0 z-10">
          <FullscreenLiveMap />
        </div>
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(5,8,22,0.8)_100%)]" />
      </section>

      {/* SECTION 3: Environmental Telemetry */}
      <section className="relative w-full min-h-screen py-32 px-8 lg:px-24 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.05),transparent_50%)]">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
           <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase glow-text mb-4">Live Telemetry</h2>
              <p className="text-sm text-cyan-400/80 uppercase tracking-[0.3em] font-bold">Atmospheric Node Alpha-01</p>
           </div>
           
           <div className="w-full max-w-4xl bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 shadow-[0_0_50px_rgba(34,211,238,0.05)]">
              <FloatingAnalyticsOverlay />
           </div>
        </div>
      </section>

      {/* SECTION 4: Analytics and Prediction Graphs */}
      <section className="relative w-full min-h-screen py-32 bg-[#050816]">
         <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase glow-text mb-4">Environmental Trends</h2>
            <p className="text-sm text-cyan-400/80 uppercase tracking-[0.3em] font-bold">24-Hour Atmospheric Analysis</p>
         </div>
         <AnimatedGraphs />
      </section>

      {/* SECTION 5: AI Scan Systems + Radar */}
      <section className="relative w-full min-h-screen py-32 px-8 lg:px-24 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05),transparent_50%)]">
         <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="text-center mb-24">
               <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase glow-text mb-4">Tactical Intelligence</h2>
               <p className="text-sm text-emerald-400/80 uppercase tracking-[0.3em] font-bold">Neural Scan & Proximity Radar</p>
            </div>
            
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="w-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 shadow-[0_0_50px_rgba(16,185,129,0.05)] flex items-center justify-center">
                  <RadarScan />
               </div>
               <div className="w-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 shadow-[0_0_50px_rgba(34,211,238,0.05)] flex items-center justify-center">
                  <AIScanMode />
               </div>
            </div>
         </div>
      </section>

      {/* SECTION 6: Environmental Forecasting + Insights */}
      <section className="relative w-full min-h-screen py-32 px-8 lg:px-24 bg-[#050816] border-t border-white/5">
         <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="text-center mb-24">
               <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase glow-text mb-4">Predictive Forecasting</h2>
               <p className="text-sm text-cyan-400/80 uppercase tracking-[0.3em] font-bold">Global Atmospheric Model v9.2</p>
            </div>
            
            <div className="w-full flex flex-col items-center gap-16">
               <LiveSoundWaveform />
               
               <div className="w-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 shadow-[0_0_50px_rgba(34,211,238,0.05)]">
                  <PredictionTimeline />
               </div>
            </div>
         </div>
      </section>

    </main>
  );
}
