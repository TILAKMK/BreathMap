# BreathMap AI 🌍

**"See The Air Before You Breathe It"**

A next-generation, real-time environmental intelligence platform that visualizes live air quality, CO₂ density, oxygen levels, and breath safety zones around you with a cinematic, futuristic UI.

## Features

### 🎯 Core Capabilities

- **Live Breathability Heatmap**: Real-time animated pollution overlays with dynamic glowing gradients
- **Real-Time AQI Engine**: Fetch AQI, PM2.5, PM10, NO₂, SO₂, and Ozone data
- **CO₂ Estimation System**: Smart estimation using traffic density, AQI, sound intensity, and urban metrics
- **Oxygen Level Estimation**: Calculate breath freshness based on green cover and vegetation
- **Sound-Based Pollution Detection**: Live microphone analysis with cyberpunk-style waveform visualization
- **AI Breath Safety Score**: 0-100 live score based on multiple environmental factors
- **Live Environment Timeline**: Stock-market-style graphs showing pollution spikes and user movement
- **Real-Time Analytics Dashboard**: Glassmorphism cards with live data updates
- **AI Environment Forecast**: Predict breathability for the next 30 minutes
- **Green Route Navigation**: Find cleaner walking routes
- **City Ranking System**: See top breathable zones nearby
- **Air Danger Alerts**: Cinematic popup warnings for hazardous conditions

### 🎨 UI/UX Features

- **Futuristic Glassmorphism Design**: Premium transparent glass cards with neon accents
- **Animated Particle System**: Air molecules moving based on pollution levels
- **3D Earth Visualization**: Rotating atmospheric Earth with glow effects
- **Smooth Animations**: 60fps animations powered by Framer Motion and GSAP
- **Interactive Hover Physics**: Cards react to mouse movement
- **Real-Time Animated Graphs**: AQI trends, CO₂ levels, oxygen richness
- **Cinematic Transitions**: Smooth screen-to-screen animations
- **Dark Theme**: Deep black with neon green, electric blue, and purple accents
- **Responsive Design**: Optimized for desktop, tablet, and mobile

## Tech Stack

### Frontend
- **Next.js 15+**: React framework for production
- **React 19**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Advanced animations
- **GSAP**: High-performance animations
- **Three.js**: 3D graphics
- **Mapbox GL**: Interactive maps
- **Recharts**: Real-time charts
- **Socket.io Client**: Real-time updates

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **WebSocket**: Real-time communication
- **MongoDB**: NoSQL database (optional)
- **Redis**: Caching layer (optional)

### APIs
- **OpenWeather AQI API**: Air quality data
- **WAQI API**: World air quality index
- **IQAir API**: Air quality data
- **Mapbox API**: Map visualization
- **NASA Earth Data**: Environmental data

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Setup Instructions

1. **Install dependencies**
```bash
cd breathmap
npm install
```

2. **Configure environment variables**
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your API keys:
- Get Mapbox token: https://account.mapbox.com/tokens/
- Get OpenWeather key: https://openweathermap.org/api
- Get WAQI key: https://waqi.info/api-doc/
- Get IQAir key: https://api-docs.iqair.com/

3. **Run development server**
```bash
npm run dev
```

4. **Run backend server (optional, in another terminal)**
```bash
npm run dev:server
```

The application will be available at `http://localhost:3000`

## Project Structure

```
breathmap/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── AnimatedBackground.tsx
│   │   ├── MetricsCard.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── ...
│   ├── hooks/
│   │   ├── useLocation.ts
│   │   └── useAQI.ts
│   ├── api/
│   │   └── aqi.ts
│   ├── utils/
│   │   ├── aqi.ts
│   │   ├── sound.ts
│   │   └── geolocation.ts
│   ├── types/
│   │   └── index.ts
│   └── lib/
│       └── cn.ts
├── server/
│   └── index.ts
├── public/
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Key Features Explained

### Live AQI Visualization
The heatmap dynamically updates based on real air quality data, displaying pollution intensity through color gradients.

### CO₂ Density Estimation
Calculates estimated CO₂ levels using traffic, sound, AQI, and urban density factors.

### Oxygen Level Estimation
Estimates O₂ richness using green cover, nearby parks, air quality, and vegetation data.

### Sound Pollution Detection
Real-time microphone analysis with frequency spectrum visualization and noise type classification.

### AI Breath Safety Score
Composite score (0-100) calculated from AQI, CO₂, oxygen, sound pollution, and traffic intensity.

## Performance

- **GPU Accelerated Rendering**: Three.js and Mapbox use GPU for 60fps animations
- **Lazy Loading**: Components load on demand
- **Image Optimization**: Next.js automatic optimization
- **Caching**: Redis for frequently accessed data

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## License

MIT License - See LICENSE file for details

---

Made with ❤️ for a cleaner, healthier world.
