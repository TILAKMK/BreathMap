import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "BREATHMAP — Environmental Intelligence Network",
  description: "Real-time atmospheric monitoring and AI-powered air quality intelligence",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&family=JetBrains+Mono:wght@300;400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/recharts@2.10.0/dist/Recharts.js"></script>
      </head>
      <body>
        <Providers>
          <canvas id="bg-canvas"></canvas>
          <div id="cursor"></div>
          <div id="cursor-ring"></div>
          <div className="app-wrapper">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
