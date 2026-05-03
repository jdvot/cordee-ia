"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";
const STORAGE_KEY = "cordee-ia.theme";

function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* no-op (private mode, etc.) */
  }
}

/**
 * Sun/moon toggle. Persists to localStorage and updates `data-theme` on the
 * <html> element. Designed to live in the Nav alongside the LanguageSwitcher.
 *
 * SSR-safe: renders a placeholder until mounted to avoid hydration mismatch.
 */
export function DarkToggle({ className }: { className?: string }) {
  const [theme, setTheme] = React.useState<Theme>("light");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // On mount: read whatever theme was set by an inline boot script (or the
    // SSR default `light`), and sync localStorage if we have a stored value.
    let stored: Theme | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === "light" || raw === "dark") stored = raw;
    } catch {
      /* no-op */
    }
    if (stored && stored !== readInitialTheme()) {
      applyTheme(stored);
      setTheme(stored);
    } else {
      setTheme(readInitialTheme());
    }
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    applyTheme(next);
    setTheme(next);
  }

  // Render a placeholder on the server to keep the layout stable.
  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-full",
          className
        )}
      />
    );
  }

  const isDark = theme === "dark";
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light" : "Dark"}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full",
        "border border-[var(--color-border)] bg-[var(--color-background)]/60",
        "text-[var(--color-muted-foreground)] hover:text-[var(--color-accent)]",
        "hover:border-[var(--color-accent)]/40 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
    </button>
  );
}
