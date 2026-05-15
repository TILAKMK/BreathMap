'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Minimal premium components
const MinimalHero = dynamic(() => import('./MinimalHero'), { ssr: false });
const MinimalDashboard = dynamic(() => import('./MinimalDashboard'), { ssr: false });

export function LandingPage() {
  return (
    <div className="relative w-full bg-[#050816] overflow-x-hidden">
      {/* Hero Section */}
      <MinimalHero />

      {/* Dashboard / Main Content */}
      <MinimalDashboard />
    </div>
  );
}
