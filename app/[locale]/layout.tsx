import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Instrument_Serif, Inter, JetBrains_Mono, Fraunces } from "next/font/google";

import { routing } from "@/i18n/routing";
import "../globals.css";

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cordee-ia.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  // Canonical: default-locale URLs have no prefix, others are /<locale>
  const canonical =
    locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`;
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [
      loc,
      loc === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${loc}`,
    ])
  );
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical,
      languages: { ...languages, "x-default": SITE_URL },
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      type: "website",
      url: canonical,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      siteName: "Cordée.IA",
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      data-theme="light"
      data-density="default"
      data-topo="on"
      className={`${instrumentSerif.variable} ${fraunces.variable} ${inter.variable} ${mono.variable}`}
    >
      <body>
        {/* JSON-LD: SoftwareApplication for rich snippets in Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Cordée.IA",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              url: SITE_URL,
              description:
                locale === "fr"
                  ? "Générateur open source de starters Claude Code + Claude Design. 9 questions, 14 stacks, agents stack-aware. MIT, gratuit."
                  : "Open-source generator for Claude Code + Claude Design starters. 9 questions, 14 stacks, stack-aware agents. MIT, free.",
              inLanguage: locale === "fr" ? "fr-FR" : "en-US",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              license: "https://opensource.org/licenses/MIT",
              author: {
                "@type": "Person",
                name: "Julien Devot",
                url: "https://www.linkedin.com/in/julien-dvt/",
              },
              codeRepository: "https://github.com/jdvot/cordee-ia",
            }),
          }}
        />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
