"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { ease } from "@/lib/motion";

// Counts up once, the first time it is seen. The server-rendered text is the final value.
export default function Counter({ to, suffix = "", className = "" }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!seen || reduced || !ref.current) return;
    const el = ref.current;
    const c = animate(0, to, { duration: 1.4, ease: ease.out, onUpdate: (v) => { el.textContent = Math.round(v) + suffix; } });
    return () => c.stop();
  }, [seen, reduced, to, suffix]);
  return (
    <span ref={ref} className={`tabular-nums ${className}`} aria-label={`${to}${suffix}`}>
      {to}{suffix}
    </span>
  );
}
