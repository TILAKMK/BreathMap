// Real-time environmental data API services

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface AQIData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  o3: number;
  co: number;
  timestamp: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  condition: string;
  feelsLike: number;
}

export interface SoundData {
  decibels: number;
  frequency: number;
  waveform: number[];
}

// Get user geolocation
export async function getUserLocation(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation not available'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}

// Fetch real AQI data from Open-Meteo Air Quality API
export async function fetchAQIData(
  latitude: number,
  longitude: number
): Promise<AQIData> {
  try {
    const response = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`
    );

    if (!response.ok) throw new Error('Failed to fetch AQI data');

    const data = await response.json();
    const current = data.current;

    // Calculate AQI from pollutants (simplified EPA calculation)
    const aqi = calculateAQI(
      current.pm2_5,
      current.pm10,
      current.nitrogen_dioxide,
      current.sulphur_dioxide,
      current.ozone,
      current.carbon_monoxide
    );

    return {
      aqi,
      pm25: current.pm2_5 || 0,
      pm10: current.pm10 || 0,
      no2: current.nitrogen_dioxide || 0,
      so2: current.sulphur_dioxide || 0,
      o3: current.ozone || 0,
      co: current.carbon_monoxide || 0,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('AQI fetch error:', error);
    throw error;
  }
}

// Fetch real weather data
export async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl,apparent_temperature&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`
    );

    if (!response.ok) throw new Error('Failed to fetch weather data');

    const data = await response.json();
    const current = data.current;

    return {
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      pressure: current.pressure_msl,
      feelsLike: current.apparent_temperature,
      condition: getWeatherDescription(current.weather_code),
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw error;
  }
}

// Get reverse geocoding to find city name
export async function getCityName(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );

    if (!response.ok) throw new Error('Failed to fetch location name');

    const data = await response.json();
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.county ||
      'Unknown Location'
    );
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return 'Unknown Location';
  }
}

// Calculate AQI from pollutant concentrations (simplified EPA method)
function calculateAQI(
  pm25: number,
  pm10: number,
  no2: number,
  so2: number,
  o3: number,
  co: number
): number {
  // Simplified AQI calculation - based on PM2.5 as primary indicator
  if (pm25 <= 12) return Math.round((pm25 / 12) * 50);
  if (pm25 <= 35.4) return Math.round(50 + ((pm25 - 12) / 23.4) * 50);
  if (pm25 <= 55.4) return Math.round(100 + ((pm25 - 35.4) / 20) * 50);
  if (pm25 <= 150.4) return Math.round(150 + ((pm25 - 55.4) / 95) * 50);
  if (pm25 <= 250.4) return Math.round(200 + ((pm25 - 150.4) / 100) * 50);
  return 300 + ((pm25 - 250.4) / 350.4) * 100;
}

// Convert weather code to description
function getWeatherDescription(code: number): string {
  const descriptions: { [key: number]: string } = {
    0: 'Clear',
    1: 'Partly Cloudy',
    2: 'Mostly Cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Foggy',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Heavy Drizzle',
    61: 'Slight Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    71: 'Slight Snow',
    73: 'Moderate Snow',
    75: 'Heavy Snow',
    80: 'Slight Showers',
    81: 'Moderate Showers',
    82: 'Violent Showers',
    85: 'Slight Snow Showers',
    86: 'Heavy Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Hail',
    99: 'Thunderstorm with Hail',
  };

  return descriptions[code] || 'Unknown';
}

// Estimate air freshness score
export function estimateAirFreshness(
  aqi: number,
  humidity: number,
  windSpeed: number
): { score: number; level: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR' } {
  // Higher wind speed disperses pollution
  // Humidity can trap or clear pollutants
  let score = 100 - aqi;

  // Adjust for weather conditions
  if (windSpeed < 3) score -= 10; // Low wind traps pollution
  if (humidity > 80) score -= 5; // High humidity can trap particles
  if (humidity < 30) score -= 5; // Very dry air can increase particle suspension

  score = Math.max(0, Math.min(100, score));

  let level: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR';
  if (score >= 75) level = 'EXCELLENT';
  else if (score >= 50) level = 'GOOD';
  else if (score >= 25) level = 'MODERATE';
  else level = 'POOR';

  return { score: Math.round(score), level };
}

// Estimate CO2 exposure
export function estimateCO2Exposure(
  aqi: number,
  co: number,
  pm25: number
): { estimate: number; severity: string } {
  // Rough estimation: AQI correlates with CO2 levels
  let estimate = 350 + aqi * 2 + co * 0.1;

  let severity = 'Low';
  if (estimate > 500) severity = 'Moderate';
  if (estimate > 700) severity = 'High';
  if (estimate > 1000) severity = 'Critical';

  return {
    estimate: Math.round(estimate),
    severity,
  };
}
