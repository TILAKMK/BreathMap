interface AppState {
  aqi: number;
  pm25: number;
  temp: number;
  humidity: number;
  wind: number;
  o2: number;
  city: string;
  country: string;
  lat: number;
  lon: number;
  timestamp: Date;
}

declare global {
  interface Window {
    appState: AppState;
    initializeSystem: () => void;
    sendToAria: () => void;
    quickAsk: (msg: string) => void;
    webkitAudioContext: typeof AudioContext;
  }
}

// This export is needed to make the file a module
export {};
