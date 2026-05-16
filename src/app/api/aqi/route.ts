import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function calculateAQIFromPM25(pm25: number): number {
  if (pm25 <= 12.0) return Math.round((50 / 12.0) * pm25);
  if (pm25 <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
  if (pm25 <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
  if (pm25 <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
  if (pm25 <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
  if (pm25 <= 350.4) return Math.round(((400 - 301) / (350.4 - 250.5)) * (pm25 - 250.5) + 301);
  return Math.round(((500 - 401) / (500.4 - 350.5)) * (pm25 - 350.5) + 401);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  
  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHERMAP_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    // 1. Fetch Weather Data (Temp, Humidity, Wind, City Name)
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const weatherRes = await fetch(weatherUrl, { next: { revalidate: 60 } });
    if (!weatherRes.ok) throw new Error('Weather API failed');
    const weatherData = await weatherRes.json();

    // 2. Fetch Air Pollution Data (PM2.5, etc)
    const pollutionUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const pollutionRes = await fetch(pollutionUrl, { next: { revalidate: 60 } });
    if (!pollutionRes.ok) throw new Error('Pollution API failed');
    const pollutionData = await pollutionRes.json();

    const pm25 = pollutionData.list[0].components.pm2_5;
    
    // Wind comes in meters/sec from OpenWeatherMap metric, convert to km/h
    const windKmh = weatherData.wind.speed * 3.6;

    return NextResponse.json({
      aqi: calculateAQIFromPM25(pm25),
      pm25: pm25,
      temp: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      wind: windKmh,
      city: weatherData.name || 'Unknown Location'
    });

  } catch (error: any) {
    console.error('Failed to fetch from OpenWeatherMap:', error.message);
    return NextResponse.json({ error: 'Failed to fetch environmental data', details: error.message }, { status: 500 });
  }
}
