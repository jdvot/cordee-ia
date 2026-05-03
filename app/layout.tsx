import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cordée.IA — Conseil IA pour décideurs",
  description:
    "Cabinet de conseil indépendant. IA appliquée pour CTO, COO et comités d'investissement. Cinq phases. Une seule corde.",
  openGraph: {
    title: "Cordée.IA",
    description: "Conseil IA pour décideurs. Cinq phases. Une seule corde.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      data-theme="light"
      data-density="default"
      data-topo="on"
      className={`${instrumentSerif.variable} ${fraunces.variable} ${inter.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
