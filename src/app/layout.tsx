import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BreathMap AI - Real-Time Environmental Intelligence",
  description: "See the air before you breathe it. Real-time AI-powered environmental intelligence with live AQI heatmaps, CO₂ density tracking, and air quality forecasting.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  keywords: "AQI, air quality, pollution, environmental, sustainability, real-time"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-screen flex flex-col bg-black text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
