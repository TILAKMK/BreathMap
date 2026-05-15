'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { CursorTrail } from './CursorTrail';
import { AnimatedBackground } from './AnimatedBackground';

// Dynamic imports for heavy components
const CinematicHero = dynamic(() => import('./CinematicHero'), { ssr: false });
const AiOrb = dynamic(() => import('./AiOrb'), { ssr: false });
const EnhancedAnalytics = dynamic(() => import('./EnhancedAnalytics'), { ssr: false });
const CinematicMap = dynamic(() => import('./CinematicMap'), { ssr: false });
const AnimatedGraphs = dynamic(() => import('./AnimatedGraphs'), { ssr: false });
const PremiumFeatures = dynamic(() => import('./PremiumFeatures'), { ssr: false });
const PremiumFooter = dynamic(() => import('./PremiumFooter'), { ssr: false });

export function LandingPage() {
  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden">
      <CursorTrail />
      <AnimatedBackground intensity={60} pollutionLevel="moderate" />

      {/* Main content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <CinematicHero />

        {/* AI Orb Section */}
        <AiOrb />

        {/* Enhanced Analytics */}
        <EnhancedAnalytics />

        {/* Cinematic Map */}
        <CinematicMap />

        {/* Animated Graphs */}
        <AnimatedGraphs />

        {/* Premium Features */}
        <PremiumFeatures />

        {/* Footer */}
        <PremiumFooter />
      </div>
    </div>
  );
}
