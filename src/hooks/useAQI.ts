'use client';

import { useEffect, useState, useCallback } from 'react';
import { AQIData, EnvironmentalMetrics } from '@/types';
import { fetchWAQIData, generateMockAQIData } from '@/api/aqi';
import { 
  calculateBreathabilityScore, 
  estimateCO2Density, 
  estimateOxygenLevel,
  getBreathabilityStatus 
} from '@/utils/aqi';

export function useAQI(lat: number | null, lng: number | null, refreshInterval: number = 30000) {
  const [aqi, setAqi] = useState<AQIData | null>(null);
  const [metrics, setMetrics] = useState<EnvironmentalMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAQIData = useCallback(async () => {
    if (!lat || !lng) return;

    try {
      setLoading(true);
      let data: AQIData | null = null;

      // Try WAQI first, fall back to mock data
      data = await fetchWAQIData(lat, lng);
      if (!data) {
        data = generateMockAQIData(lat, lng);
      }

      setAqi(data);

      // Calculate environmental metrics
      const breathabilityScore = calculateBreathabilityScore(data);
      const co2Density = estimateCO2Density(data.aqi, 0.5, 50, 0.6);
      const oxygenLevel = estimateOxygenLevel(data.aqi, 0.3, 1, 0.4);

      setMetrics({
        aqi: data.aqi,
        co2Density,
        oxygenLevel,
        soundPollution: 50,
        trafficIntensity: 0.5,
        temperature: 25,
        humidity: 60,
        windSpeed: 5,
        uvIndex: 6,
        breathabilityScore,
        breathabilityStatus: getBreathabilityStatus(breathabilityScore)
      });

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch AQI data');
    } finally {
      setLoading(false);
    }
  }, [lat, lng]);

  useEffect(() => {
    fetchAQIData();
    const interval = setInterval(fetchAQIData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchAQIData, refreshInterval]);

  return { aqi, metrics, loading, error, refetch: fetchAQIData };
}
