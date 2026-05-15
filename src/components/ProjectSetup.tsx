import React from 'react';

export function ProjectSetup() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Quick Start Guide</h2>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-2">1. Environment Setup</h3>
            <code className="block bg-black/40 p-3 rounded text-white/80 text-sm overflow-x-auto">
              cp .env.example .env.local
            </code>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">2. Install Dependencies</h3>
            <code className="block bg-black/40 p-3 rounded text-white/80 text-sm overflow-x-auto">
              npm install
            </code>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-2">3. Start Development</h3>
            <code className="block bg-black/40 p-3 rounded text-white/80 text-sm overflow-x-auto">
              npm run dev
            </code>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">API Keys Needed</h2>
        <ul className="space-y-3 text-white/80">
          <li className="flex items-start gap-3">
            <span className="text-green-400 mt-1">✓</span>
            <div>
              <p className="font-semibold">Mapbox API Token</p>
              <p className="text-sm text-white/60">https://account.mapbox.com/tokens/</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-1">✓</span>
            <div>
              <p className="font-semibold">OpenWeather API Key</p>
              <p className="text-sm text-white/60">https://openweathermap.org/api</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-400 mt-1">✓</span>
            <div>
              <p className="font-semibold">WAQI API Key</p>
              <p className="text-sm text-white/60">https://waqi.info/api-doc/</p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
}
