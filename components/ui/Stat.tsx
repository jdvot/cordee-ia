"use client";

import * as React from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
  sublabel?: string;
  duration?: number;
  className?: string;
}

export function Stat({
  value,
  suffix = "",
  label,
  sublabel,
  duration = 1.4,
  className,
}: StatProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, value, duration, count, rounded]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex flex-col gap-1.5", className)}
    >
      <div
        className="text-5xl md:text-6xl text-[var(--color-primary)] tabular-nums leading-none"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
      >
        {display}
        {suffix && (
          <span className="text-[var(--color-accent)]">{suffix}</span>
        )}
      </div>
      <div className="text-sm font-medium text-[var(--color-foreground)] mt-2">
        {label}
      </div>
      {sublabel && (
        <div className="text-xs text-[var(--color-muted-foreground)]">
          {sublabel}
        </div>
      )}
    </motion.div>
  );
}
