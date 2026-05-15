'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CursorTrail } from './CursorTrail';
import { AnimatedBackground } from './AnimatedBackground';
import { DashboardLayout } from './DashboardLayout';
import { AlertSystem } from './AlertSystem';
import { FeaturesGrid } from './FeaturesGrid';

export function LandingPage() {
  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      <CursorTrail />
      <AnimatedBackground intensity={60} pollutionLevel="moderate" />

      {/* Main content - positioned relative to background */}
      <div className="relative z-10">
        <DashboardLayout />
        <FeaturesGrid />
        <AlertSystem alerts={[]} />
      </div>
    </div>
  );
}
