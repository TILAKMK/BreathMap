import { AQIData, EnvironmentalMetrics } from '@/types';

// AQI Category Colors and Ranges
export const AQI_CATEGORIES = {
  GOOD: { min: 0, max: 50, label: 'Good', color: '#00FF41', bgColor: 'bg-green-500' },
  MODERATE: { min: 51, max: 100, label: 'Moderate', color: '#FFFF00', bgColor: 'bg-yellow-500' },
  UNHEALTHY_SENSITIVE: { min: 101, max: 150, label: 'Unhealthy for Sensitive Groups', color: '#FF7E00', bgColor: 'bg-orange-500' },
  UNHEALTHY: { min: 151, max: 200, label: 'Unhealthy', color: '#FF0000', bgColor: 'bg-red-500' },
  VERY_UNHEALTHY: { min: 201, max: 300, label: 'Very Unhealthy', color: '#8F3F97', bgColor: 'bg-purple-600' },
  HAZARDOUS: { min: 301, max: Infinity, label: 'Hazardous', color: '#7E0023', bgColor: 'bg-red-900' }
};

export function getAQICategory(aqi: number) {
  if (aqi <= 50) return AQI_CATEGORIES.GOOD;
  if (aqi <= 100) return AQI_CATEGORIES.MODERATE;
  if (aqi <= 150) return AQI_CATEGORIES.UNHEALTHY_SENSITIVE;
  if (aqi <= 200) return AQI_CATEGORIES.UNHEALTHY;
  if (aqi <= 300) return AQI_CATEGORIES.VERY_UNHEALTHY;
  return AQI_CATEGORIES.HAZARDOUS;
}

export function calculateBreathabilityScore(metrics: Partial<AQIData>): number {
  let score = 100;

  if (metrics.aqi) {
    if (metrics.aqi <= 50) score -= 0;
    else if (metrics.aqi <= 100) score -= 10;
    else if (metrics.aqi <= 150) score -= 30;
    else if (metrics.aqi <= 200) score -= 50;
    else if (metrics.aqi <= 300) score -= 75;
    else score -= 100;
  }

  return Math.max(0, Math.min(100, score));
}

export function estimateCO2Density(
  aqi: number,
  trafficIntensity: number,
  soundLevel: number,
  urbanDensity: number = 0.5
): number {
  // Traffic CO2 contribution (higher traffic = more CO2)
  const trafficCO2 = trafficIntensity * 2;

  // Sound-based CO2 estimation (higher noise = more vehicular traffic)
  const soundCO2 = (soundLevel / 100) * 150;

  // AQI correlation with CO2
  const aqiCO2 = (aqi / 500) * 300;

  // Urban density factor
  const densityFactor = urbanDensity * 100;

  // Combined estimate in ppm (rough estimation)
  const baseCO2 = 400; // Baseline atmospheric CO2
  const additionalCO2 = trafficCO2 + soundCO2 + aqiCO2 + densityFactor;

  return Math.round(baseCO2 + additionalCO2);
}

export function estimateOxygenLevel(
  aqi: number,
  greenCover: number,
  nearbyParks: number = 0,
  vegetationIndex: number = 0
): number {
  // Base oxygen level (21% at sea level)
  let oxygenLevel = 21;

  // AQI reduction of oxygen
  const aqiReduction = (aqi / 500) * 3;
  oxygenLevel -= aqiReduction;

  // Green cover contribution
  const greenContribution = greenCover * 0.02;
  oxygenLevel += greenContribution;

  // Nearby parks boost
  const parkBoost = Math.min(nearbyParks * 0.5, 2);
  oxygenLevel += parkBoost;

  // Vegetation index boost
  const vegBoost = (vegetationIndex / 100) * 1.5;
  oxygenLevel += vegBoost;

  return Math.max(15, Math.min(21, parseFloat(oxygenLevel.toFixed(2))));
}

export function getBreathabilityStatus(score: number): 'HIGHLY_BREATHABLE' | 'MODERATE_RISK' | 'TOXIC_ENVIRONMENT' {
  if (score >= 70) return 'HIGHLY_BREATHABLE';
  if (score >= 40) return 'MODERATE_RISK';
  return 'TOXIC_ENVIRONMENT';
}

export function getHeatmapColor(intensity: number): string {
  // intensity: 0-100, where 0 is green (safe) and 100 is dark red (toxic)
  if (intensity < 20) return '#00FF41'; // Neon Green
  if (intensity < 40) return '#FFFF00'; // Yellow
  if (intensity < 60) return '#FF7E00'; // Orange
  if (intensity < 80) return '#FF0000'; // Red
  if (intensity < 90) return '#8F3F97'; // Purple
  return '#7E0023'; // Dark Red
}
