"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

/* =========================================================
   Topographic background — concentric ellipses, hand-rotated.
   ========================================================= */

interface TopoProps {
  density?: number;
}

export function Topo({ density = 14 }: TopoProps) {
  return (
    <div
      className="topo-bg"
      aria-hidden="true"
      style={{ color: "var(--color-foreground)", opacity: 0.07 }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <g transform="translate(800 450)">
          {Array.from({ length: density }).map((_, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="0"
              rx={80 + i * 70}
              ry={(80 + i * 70) * 0.55}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              transform={`rotate(${-8 + i * 0.4})`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

/* =========================================================
   Counter — animates to target value when scrolled into view.
   ========================================================= */

interface CounterProps {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}

export function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 1600,
  decimals = 0,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setVal(to * eased);
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0
        ? val.toFixed(decimals)
        : Math.round(val).toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}

/* =========================================================
   Reveal — fade + translateY when scrolled into view.
   ========================================================= */

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setTimeout(() => el.classList.add("in"), delay);
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </div>
  );
}

/* =========================================================
   Placeholder — striped monochrome with monospace caption.
   ========================================================= */

interface PlaceholderProps {
  label: string;
  ratio?: string;
  style?: CSSProperties;
}

export function Placeholder({ label, ratio = "4 / 3", style }: PlaceholderProps) {
  return (
    <div className="placeholder" style={{ aspectRatio: ratio, ...style }}>
      <span className="label">{label}</span>
    </div>
  );
}

/* =========================================================
   Icons.
   ========================================================= */

export function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function CordeeMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 26 L12 12 L16 18 L20 10 L28 26 Z" />
      <circle cx="16" cy="6" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}
