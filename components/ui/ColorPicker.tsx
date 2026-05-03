"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "cordee-ia.accent";

interface Swatch {
  /** Stable id, also persisted to localStorage. */
  id: string;
  /** Display name (tooltip). */
  name: string;
  /** OKLCH hue (0-360). */
  h: number;
  /** OKLCH chroma (~0-0.4). */
  c: number;
  /** OKLCH lightness (~0-1). */
  l: number;
}

/**
 * Cordée default palette — alpine-inspired hues, all tuned for AA contrast
 * against the granite primary background.
 */
export const CORDEE_PALETTE: readonly Swatch[] = [
  { id: "cuivre", name: "Cuivre", h: 24, c: 0.12, l: 0.62 },
  { id: "sapin", name: "Sapin", h: 155, c: 0.09, l: 0.55 },
  { id: "glacier", name: "Glacier", h: 220, c: 0.1, l: 0.62 },
  { id: "brique", name: "Brique", h: 12, c: 0.14, l: 0.55 },
  { id: "lavande", name: "Lavande", h: 290, c: 0.1, l: 0.62 },
  { id: "or", name: "Or", h: 75, c: 0.13, l: 0.7 },
];

function applyAccent(s: Swatch) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--accent-h", String(s.h));
  root.style.setProperty("--accent-c", String(s.c));
  root.style.setProperty("--accent-l", String(s.l));
  try {
    window.localStorage.setItem(STORAGE_KEY, s.id);
  } catch {
    /* no-op */
  }
}

/**
 * Six-swatch accent picker. Updates the OKLCH `--accent-*` CSS vars on
 * <html>, which automatically re-tints every accent-colored element on the
 * page (CTAs, eyebrows, italic emphasis, divider lines, etc.).
 */
export function ColorPicker({
  className,
  size = 16,
}: {
  className?: string;
  size?: number;
}) {
  const [activeId, setActiveId] = React.useState<string>(CORDEE_PALETTE[0].id);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* no-op */
    }
    const found = CORDEE_PALETTE.find((s) => s.id === stored);
    if (found) {
      applyAccent(found);
      setActiveId(found.id);
    }
    setMounted(true);
  }, []);

  return (
    <div
      role="radiogroup"
      aria-label="Couleur d'accent"
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      {CORDEE_PALETTE.map((s) => {
        const isActive = mounted && s.id === activeId;
        return (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={s.name}
            title={s.name}
            onClick={() => {
              applyAccent(s);
              setActiveId(s.id);
            }}
            className="rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
            style={{
              width: size,
              height: size,
              background: `oklch(${s.l} ${s.c} ${s.h})`,
              boxShadow: isActive
                ? `0 0 0 2px var(--color-background), 0 0 0 4px oklch(${s.l} ${s.c} ${s.h})`
                : "none",
              border: isActive
                ? "none"
                : "1px solid color-mix(in srgb, currentColor 20%, transparent)",
            }}
          />
        );
      })}
    </div>
  );
}
