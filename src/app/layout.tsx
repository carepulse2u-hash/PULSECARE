import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rechargeable Wrist Blood Pressure Monitor | PulseCare",
  description: "Shop a compact rechargeable wrist blood-pressure monitor with automatic measurement, digital LED display and voice guidance. Designed for convenient home BP monitoring.",
  openGraph: {
    title: "Rechargeable Wrist Blood Pressure Monitor | PulseCare",
    description: "Shop a compact rechargeable wrist blood-pressure monitor with automatic measurement, digital LED display and voice guidance. Designed for convenient home BP monitoring.",
    type: "website",
    locale: "en_IN",
    siteName: "PulseCare",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
