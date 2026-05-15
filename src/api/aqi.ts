import { AQIData } from '@/types';

// OpenWeather AQI API
export async function fetchOpenWeatherAQI(lat: number, lng: number): Promise<AQIData | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.warn('OpenWeather API key not found');
      return null;
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_quality?lat=${lat}&lon=${lng}&appid=${apiKey}`
    );

    if (!response.ok) throw new Error('OpenWeather API error');

    const data = await response.json();

    return {
      aqi: data.list[0].main.aqi * 50, // Convert to 0-500 scale
      pm25: data.list[0].components.pm2_5 || 0,
      pm10: data.list[0].components.pm10 || 0,
      no2: data.list[0].components.no2 || 0,
      so2: data.list[0].components.so2 || 0,
      o3: data.list[0].components.o3 || 0,
      co: data.list[0].components.co || 0,
      timestamp: new Date(),
      location: { lat, lng }
    };
  } catch (error) {
    console.error('Error fetching OpenWeather AQI:', error);
    return null;
  }
}

// WAQI API
export async function fetchWAQIData(lat: number, lng: number): Promise<AQIData | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_WAQI_API_KEY;
    if (!apiKey) {
      console.warn('WAQI API key not found');
      return null;
    }

    const response = await fetch(
      `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${apiKey}`
    );

    if (!response.ok) throw new Error('WAQI API error');

    const data = await response.json();

    if (data.status !== 'ok') throw new Error('WAQI data not available');

    const aqiData = data.data;

    return {
      aqi: aqiData.aqi || 0,
      pm25: aqiData.iaqi?.pm25?.v || 0,
      pm10: aqiData.iaqi?.pm10?.v || 0,
      no2: aqiData.iaqi?.no2?.v || 0,
      so2: aqiData.iaqi?.so2?.v || 0,
      o3: aqiData.iaqi?.o3?.v || 0,
      co: aqiData.iaqi?.co?.v || 0,
      timestamp: new Date(),
      location: { lat, lng }
    };
  } catch (error) {
    console.error('Error fetching WAQI data:', error);
    return null;
  }
}

// IQAir API
export async function fetchIQAirData(lat: number, lng: number): Promise<AQIData | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_IQAIR_API_KEY;
    if (!apiKey) {
      console.warn('IQAir API key not found');
      return null;
    }

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lng}&aqi=yes`
    );

    if (!response.ok) throw new Error('IQAir API error');

    const data = await response.json();

    return {
      aqi: data.current.air_quality?.us_epa_index ? (data.current.air_quality.us_epa_index * 50) : 0,
      pm25: data.current.air_quality?.pm2_5 || 0,
      pm10: data.current.air_quality?.pm10 || 0,
      no2: 0,
      so2: 0,
      o3: 0,
      co: 0,
      timestamp: new Date(),
      location: { lat, lng }
    };
  } catch (error) {
    console.error('Error fetching IQAir data:', error);
    return null;
  }
}

// Fallback mock data
export function generateMockAQIData(lat: number, lng: number): AQIData {
  return {
    aqi: Math.random() * 200 + 30,
    pm25: Math.random() * 50 + 10,
    pm10: Math.random() * 100 + 20,
    no2: Math.random() * 50 + 5,
    so2: Math.random() * 30 + 2,
    o3: Math.random() * 80 + 20,
    co: Math.random() * 2 + 0.5,
    timestamp: new Date(),
    location: { lat, lng }
  };
}
