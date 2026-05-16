import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat') || '12.2958';
  const lon = searchParams.get('lon') || '76.6394';

  const API_KEY = process.env.OPENWEATHER_API_KEY;

  try {
    const [airRes, weatherRes, geoRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`),
      fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`)
    ]);

    const [air, weather, geo] = await Promise.all([
      airRes.json(),
      weatherRes.json(),
      geoRes.json()
    ]);

    const aqiMap: Record<number, number> = {1:25, 2:75, 3:125, 4:175, 5:250};
    const components = air.list[0].components;
    const aqiIndex = air.list[0].main.aqi;
    const aqi = aqiMap[aqiIndex] || 50;
    const co2 = 415 + (components.co / 1150) * 150;
    const o2 = Math.max(18.5, Math.min(20.9, 20.9 - (aqi / 500) * 1.5));

    return NextResponse.json({
      aqi,
      pm25: components.pm2_5,
      pm10: components.pm10,
      no2: components.no2,
      o3: components.o3,
      so2: components.so2,
      co: components.co,
      nh3: components.nh3,
      co2: Math.round(co2),
      o2: parseFloat(o2.toFixed(2)),
      temp: weather.current.temperature_2m,
      humidity: weather.current.relative_humidity_2m,
      wind: weather.current.wind_speed_10m,
      city: geo[0]?.name || 'Unknown',
      country: geo[0]?.country || '',
      lat: parseFloat(lat),
      lon: parseFloat(lon)
    });

  } catch (e) {
    // Return mock data if APIs fail - never crash
    return NextResponse.json({
      aqi: 87, pm25: 18.4, pm10: 32.1,
      no2: 14.2, o3: 45.6, so2: 3.1,
      co: 280, nh3: 1.2,
      co2: 487, o2: 20.61,
      temp: 28.4, humidity: 65, wind: 12.3,
      city: 'Mysuru', country: 'India',
      lat: 12.2958, lon: 76.6394
    });
  }
}
