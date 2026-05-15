'use client';

import { useState, useEffect } from 'react';
import {
  getUserLocation,
  fetchAQIData,
  fetchWeatherData,
  getCityName,
  LocationData,
  AQIData,
  WeatherData,
  estimateAirFreshness,
  estimateCO2Exposure,
} from '@/lib/realTimeApis';

export interface EnvironmentalData {
  location: LocationData | null;
  locationName: string;
  aqi: AQIData | null;
  weather: WeatherData | null;
  airFreshness: { score: number; level: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR' } | null;
  co2Exposure: { estimate: number; severity: string } | null;
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
}

// Default location (San Francisco) for demo when geolocation denied
const DEFAULT_LOCATION = {
  latitude: 37.7749,
  longitude: -122.4194,
};

export function useEnvironmentalData(autoRefreshInterval: number = 60000) {
  const [data, setData] = useState<EnvironmentalData>({
    location: null,
    locationName: 'Detecting location...',
    aqi: null,
    weather: null,
    airFreshness: null,
    co2Exposure: null,
    loading: true,
    error: null,
    lastUpdate: null,
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setData((prev) => ({ ...prev, loading: true, error: null }));

        // Get user location with fallback
        let location = DEFAULT_LOCATION as LocationData;
        try {
          location = await getUserLocation();
        } catch (geoError) {
          console.log('Using default location due to geolocation error');
          location.accuracy = 0;
        }

        // Fetch AQI and weather data in parallel
        const [aqi, weather, cityName] = await Promise.all([
          fetchAQIData(location.latitude, location.longitude),
          fetchWeatherData(location.latitude, location.longitude),
          getCityName(location.latitude, location.longitude),
        ]);

        // Calculate derived metrics
        const airFreshness = estimateAirFreshness(
          aqi.aqi,
          weather.humidity,
          weather.windSpeed
        );
        const co2Exposure = estimateCO2Exposure(aqi.aqi, aqi.co, aqi.pm25);

        setData({
          location,
          locationName: cityName,
          aqi,
          weather,
          airFreshness,
          co2Exposure,
          loading: false,
          error: null,
          lastUpdate: new Date(),
        });
      } catch (error) {
        console.error('Error fetching environmental data:', error);
        setData((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch environmental data',
        }));
      }
    };

    // Initial fetch
    fetchAllData();

    // Set up auto-refresh
    const interval = setInterval(fetchAllData, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [autoRefreshInterval]);

  return data;
}
