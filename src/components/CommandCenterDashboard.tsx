'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';
import { useState, useEffect } from 'react';

// Dynamic imports
const AnimatedWindParticles = dynamic(() => import('./AnimatedWindParticles').then((mod) => ({ default: mod.AnimatedWindParticles })), { ssr: false });
const PermissionsModal = dynamic(() => import('./PermissionsModal').then((mod) => ({ default: mod.PermissionsModal })), { ssr: false });
const StickyTopbar = dynamic(() => import('./StickyTopbar').then((mod) => ({ default: mod.StickyTopbar })), { ssr: false });
const HeroMapSection = dynamic(() => import('./HeroMapSection').then((mod) => ({ default: mod.HeroMapSection })), { ssr: false });
const AtmosphericResonanceSection = dynamic(() => import('./AtmosphericResonanceSection').then((mod) => ({ default: mod.AtmosphericResonanceSection })), { ssr: false });
const AnalyticsGridSection = dynamic(() => import('./AnalyticsGridSection').then((mod) => ({ default: mod.AnalyticsGridSection })), { ssr: false });
const PollutantBreakdownSection = dynamic(() => import('./PollutantBreakdownSection').then((mod) => ({ default: mod.PollutantBreakdownSection })), { ssr: false });
const AIForecastSection = dynamic(() => import('./AIForecastSection').then((mod) => ({ default: mod.AIForecastSection })), { ssr: false });
const EnvironmentalFooter = dynamic(() => import('./EnvironmentalFooter').then((mod) => ({ default: mod.EnvironmentalFooter })), { ssr: false });

export function CommandCenterDashboard() {
  const { aqi, weather, location, locationName, lastUpdate } = useEnvironmentalData();
  const [isReady, setIsReady] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [isGrantingPermissions, setIsGrantingPermissions] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    setIsReady(true);
    // Show permissions modal on first load if not already granted
    const hasAskedPermissions = localStorage.getItem('breathmap-permissions-asked');
    if (!hasAskedPermissions) {
      setTimeout(() => setShowPermissionsModal(true), 800);
    }
  }, []);

  const handleGrantPermissions = async () => {
    setIsGrantingPermissions(true);
    try {
      // Request geolocation
      if ('geolocation' in navigator) {
        await new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('Geolocation granted:', position.coords);
              resolve();
            },
            (error) => {
              console.warn('Geolocation denied:', error);
              resolve(); // Don't fail on geolocation denial
            },
            { enableHighAccuracy: true, timeout: 5000 }
          );
        });
      }

      // Request microphone
      if ('mediaDevices' in navigator) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Store stream in localStorage for waveform analyzer to use
          localStorage.setItem('breathmap-audio-stream-active', 'true');
          // Keep stream alive for analysis
          stream.getTracks().forEach(track => {
            // Don't stop immediately, let it run
            console.log('Audio stream active:', track.label);
          });
        } catch (error) {
          console.warn('Microphone access denied:', error);
        }
      }

      localStorage.setItem('breathmap-permissions-asked', 'true');
      setPermissionsGranted(true);
      setShowPermissionsModal(false);
    } catch (error) {
      console.error('Error granting permissions:', error);
    } finally {
      setIsGrantingPermissions(false);
    }
  };

  const handleSkipPermissions = () => {
    localStorage.setItem('breathmap-permissions-asked', 'true');
    setShowPermissionsModal(false);
  };

  if (!isReady) return null;

  return (
    <main className="relative w-full bg-[#020408] overflow-x-hidden selection:bg-cyan-500/30 font-sans scroll-smooth">
      <AnimatedWindParticles />

      {/* Permissions Modal */}
      <PermissionsModal 
        isOpen={showPermissionsModal} 
        onAllow={handleGrantPermissions}
        onSkip={handleSkipPermissions}
        isLoading={isGrantingPermissions}
      />

      {/* Sticky Top Bar */}
      <StickyTopbar aqi={aqi} locationName={locationName} lastUpdate={lastUpdate} />

      {/* Content Container with top offset for sticky navbar */}
      <div className="pt-14">
        {/* SECTION A: HERO MAP (100vh) */}
        <section id="hero-map" className="relative w-full h-screen overflow-hidden bg-black">
          <HeroMapSection aqi={aqi} weather={weather} location={location} locationName={locationName} />
        </section>

        {/* SECTION B: ATMOSPHERIC RESONANCE */}
        <section id="atmospheric-resonance" className="relative w-full px-4 sm:px-8 lg:px-20 bg-[#020408] border-y border-white/10" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          <AtmosphericResonanceSection aqi={aqi} />
        </section>

        {/* SECTION C: ANALYTICS GRID */}
        <section id="analytics-grid" className="relative w-full px-4 sm:px-8 lg:px-20 bg-[#070d14]" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          <AnalyticsGridSection aqi={aqi} />
        </section>

        {/* SECTION D: POLLUTANT BREAKDOWN */}
        <section id="pollutant-breakdown" className="relative w-full px-4 sm:px-8 lg:px-20 bg-[#020408] border-y border-white/10" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          <PollutantBreakdownSection aqi={aqi} />
        </section>

        {/* SECTION E: AI FORECAST + HEALTH ADVISORY */}
        <section id="ai-forecast" className="relative w-full px-4 sm:px-8 lg:px-20 bg-[#070d14]" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          <AIForecastSection aqi={aqi} weather={weather} />
        </section>

        {/* SECTION F: ENVIRONMENTAL INTELLIGENCE FOOTER */}
        <EnvironmentalFooter />
      </div>

      {/* Load animation */}
      <motion.div
        className="fixed inset-0 bg-black z-50 pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        onAnimationComplete={() => {}}
      />
    </main>
  );
}
