'use client';

import { useEffect, useState, useCallback } from 'react';
import { UserLocation } from '@/types';
import { getCurrentLocation, watchLocation } from '@/utils/geolocation';

export function useLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        setLoading(true);
        const currentLocation = await getCurrentLocation();
        setLocation(currentLocation);

        // Start watching location
        const watchId = watchLocation((newLocation) => {
          setLocation(newLocation);
        });

        return () => navigator.geolocation.clearWatch(watchId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get location');
      } finally {
        setLoading(false);
      }
    };

    initializeLocation();
  }, []);

  return { location, loading, error };
}
