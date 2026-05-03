import type { ReactNode } from "react";

// Root layout — minimal. The locale-aware <html lang>, fonts and providers
// live in app/[locale]/layout.tsx (next-intl best practice).
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
