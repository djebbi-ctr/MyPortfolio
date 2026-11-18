"use client";

import { m, useInView, useReducedMotion } from "motion/react";
import { createContext, useContext, useRef } from "react";
import { rise } from "@/lib/motion";

const WaveContext = createContext(true);

// A section assembles once, when the spine reaches it.
export function Wave({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref, { once: true, margin: "0px 0px -22% 0px" });
  return (
    <WaveContext.Provider value={shown}>
      <div ref={ref} id={id} className={className}>{children}</div>
    </WaveContext.Provider>
  );
}

// i = distance from where the spine enters, so neighbours arrive in a wave.
export function WaveItem({ i = 0, className = "", children }: { i?: number; className?: string; children: React.ReactNode }) {
  const shown = useContext(WaveContext);
  const reduced = useReducedMotion();
  return (
    <m.div className={`reveal ${className}`} custom={reduced ? 0 : i} variants={rise} initial="hidden" animate={shown ? "show" : "hidden"}>
      {children}
    </m.div>
  );
}
