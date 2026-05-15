import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.BACKEND_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AQI Data endpoint (mock data for demo)
app.get('/api/aqi', (req, res) => {
  const { lat, lng } = req.query;

  res.json({
    aqi: Math.round(Math.random() * 200 + 30),
    pm25: Math.round(Math.random() * 50 + 10),
    pm10: Math.round(Math.random() * 100 + 20),
    no2: Math.round(Math.random() * 50 + 5),
    so2: Math.round(Math.random() * 30 + 2),
    o3: Math.round(Math.random() * 80 + 20),
    co: Math.round((Math.random() * 2 + 0.5) * 100) / 100,
    timestamp: new Date().toISOString(),
    location: { lat: parseFloat(lat as string) || 0, lng: parseFloat(lng as string) || 0 }
  });
});

// CO2 Estimation endpoint
app.get('/api/co2-estimate', (req, res) => {
  const { lat, lng, traffic, sound, urbanDensity } = req.query;

  const trafficLevel = parseFloat(traffic as string) || 0.5;
  const soundLevel = parseFloat(sound as string) || 50;
  const density = parseFloat(urbanDensity as string) || 0.5;

  const co2 = 400 + (trafficLevel * 200) + (soundLevel * 3) + (density * 100);

  res.json({
    co2Density: Math.round(co2),
    timestamp: new Date().toISOString(),
    location: { lat: parseFloat(lat as string) || 0, lng: parseFloat(lng as string) || 0 }
  });
});

// WebSocket for real-time updates
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send initial data
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to BreathMap AI real-time server',
    timestamp: new Date().toISOString()
  }));

  // Simulate real-time data updates
  const interval = setInterval(() => {
    ws.send(JSON.stringify({
      type: 'update',
      data: {
        aqi: Math.round(Math.random() * 200 + 30),
        co2: Math.round(Math.random() * 300 + 300),
        soundLevel: Math.round(Math.random() * 100 + 30),
        timestamp: new Date().toISOString()
      }
    }));
  }, 2000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`BreathMap AI Backend running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
