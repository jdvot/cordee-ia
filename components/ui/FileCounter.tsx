"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface FileCounterProps {
  /** Live count (e.g. recomputed from form values). */
  count: number;
  /** Plural label, displayed under the digit. */
  label?: string;
  /** Animation duration in seconds. */
  duration?: number;
  /** Show a subtle pulse when count changes. */
  pulse?: boolean;
  className?: string;
}

/**
 * Animated tabular-nums file counter. Re-animates from previous value to new
 * value whenever `count` changes — designed to live next to a questionnaire
 * so each toggle bumps the digit visibly.
 */
export function FileCounter({
  count,
  label = "fichiers",
  duration = 0.6,
  pulse = true,
  className,
}: FileCounterProps) {
  const mv = useMotionValue(count);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [display, setDisplay] = React.useState(count);
  const [bumpKey, setBumpKey] = React.useState(0);
  const prevCount = React.useRef(count);

  React.useEffect(() => {
    if (prevCount.current === count) return;
    const controls = animate(mv, count, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    if (pulse) setBumpKey((k) => k + 1);
    prevCount.current = count;
    return () => {
      controls.stop();
      unsub();
    };
  }, [count, duration, mv, rounded, pulse]);

  return (
    <div
      className={cn(
        "inline-flex flex-col items-start gap-1 select-none",
        className
      )}
    >
      <motion.div
        key={bumpKey}
        initial={pulse ? { scale: 0.92, opacity: 0.6 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl tabular-nums leading-none text-[var(--color-primary)]"
        style={{
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.03em",
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {display}
      </motion.div>
      <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
        {label}
      </div>
    </div>
  );
}
