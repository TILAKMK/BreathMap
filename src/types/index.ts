// Environmental Data Types
export interface AQIData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  o3: number;
  co: number;
  timestamp: Date;
  location: {
    lat: number;
    lng: number;
  };
}

export interface EnvironmentalMetrics {
  aqi: number;
  co2Density: number;
  oxygenLevel: number;
  soundPollution: number;
  trafficIntensity: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  breathabilityScore: number;
  breathabilityStatus: 'HIGHLY_BREATHABLE' | 'MODERATE_RISK' | 'TOXIC_ENVIRONMENT';
}

export interface BreathSafetyZone {
  id: string;
  center: {
    lat: number;
    lng: number;
  };
  radius: number;
  intensity: number; // 0-100, where 100 is most dangerous
  type: 'safe' | 'moderate' | 'danger' | 'toxic';
  color: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: Date;
}

export interface SoundAnalysis {
  frequency: number[];
  amplitude: number[];
  decibel: number;
  noiseType: 'traffic' | 'construction' | 'natural' | 'quiet';
}

export interface PollutionTrend {
  timestamp: Date;
  aqi: number;
  co2: number;
  sound: number;
}

export interface EnvironmentForecast {
  timestamp: Date;
  predictedAQI: number;
  predictedBreathability: number;
  confidence: number;
  trend: 'improving' | 'stable' | 'worsening';
}

export interface BreathableRoute {
  id: string;
  waypoints: Array<{ lat: number; lng: number }>;
  averageAQI: number;
  distance: number;
  duration: number;
  safetyScore: number;
}

export interface CityZone {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  averageAQI: number;
  greenCover: number;
  population: number;
  breathabilityRank: number;
}

export interface EnvironmentAlert {
  id: string;
  type: 'HIGH_TOXICITY' | 'HEAVY_TRAFFIC' | 'LOW_OXYGEN' | 'NOISE_SPIKE';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: Date;
}
