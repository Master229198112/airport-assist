import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from '@/components/Navbar'
import { LangProvider } from '@/context/LangContext'
import { MapProvider } from '@/context/MapProvider'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Airport Assistance Platform',
  description: 'Smart Airport Helper',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-orange-400 to-pink-500 text-white min-h-screen`}
      >
        <LangProvider>
        <MapProvider>
        <Navbar />
        <Toaster position="top-center" />
        {children}
        </MapProvider>
        </LangProvider>
      </body>
    </html>
  );
}
