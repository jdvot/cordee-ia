import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cordée.IA — Démarrer un projet Claude Code + Claude Design en 2 min",
  description:
    "Générateur de starter projet Claude Code + Claude Design. Réponds à 6 questions, télécharge un .zip prêt à l'emploi. Gratuit, open-source.",
  openGraph: {
    title: "Cordée.IA",
    description: "Démarre un projet Claude Code en 2 minutes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
