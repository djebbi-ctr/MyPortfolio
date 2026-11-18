"use client";

import { m, useMotionValueEvent, useScroll } from "motion/react";
import { useReducedAfterMount } from "@/lib/useReduced";
import { useRef, useState } from "react";
import { method } from "@/content/profile";

// Pinned scroll story. Each step is a real sequence, so the numbers stay.
export default function Method() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedAfterMount();
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const n = method.steps.length;
  useMotionValueEvent(scrollYProgress, "change", (p) => setStep(Math.min(n - 1, Math.max(0, Math.floor(p * n)))));
  const all = !!reduced; // reduced motion: no pinning, every step visible

  return (
    <section id="method" ref={ref} aria-labelledby="method-t" className="relative scroll-mt-6" style={all ? undefined : { height: `${n * 90 + 40}svh` }}>
      <div className={all ? "py-20" : "sticky top-0 flex h-svh items-center"}>
        <div className="grid w-full gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14">
          <div>
            <h2 id="method-t" className="max-w-[18ch] text-balance text-[clamp(1.9rem,4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em]" style={{ fontStretch: "106%" }}>
              {method.title}
            </h2>
            <ol className="mt-6 space-y-1 md:mt-9">
              {method.steps.map((s, i) => {
                const on = all || i === step;
                return (
                  <li key={s.title} aria-current={!all && i === step ? "step" : undefined} className="transition-colors duration-200">
                    <div className="flex items-baseline gap-3 py-1.5">
                      <span className="font-mono text-[0.85rem] text-signal tabular-nums">{i + 1}</span>
                      <h3 className={`text-[1.125rem] font-semibold transition-colors duration-200 ${on ? "text-ink" : "text-mute"}`}>{s.title}</h3>
                    </div>
                    <div className={`grid transition-[grid-template-rows] duration-300 ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <p className="max-w-[56ch] overflow-hidden ps-7 text-[0.98rem] text-mute">{s.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="relative self-center ps-4" aria-hidden>
            <div className="absolute inset-y-1 start-0 w-px bg-hairline">
              <m.div className="absolute inset-0 origin-top bg-gradient-to-b from-signal to-current" animate={{ scaleY: all ? 1 : (step + 1) / n }} transition={{ duration: 0.4 }} />
            </div>
            <ul className="space-y-3 md:space-y-5">
              {method.steps.map((s, i) => (
                <m.li key={s.title} animate={{ opacity: all || i <= step ? 1 : 0, y: all || i <= step ? 0 : 12 }} transition={{ duration: 0.4 }} className="flex flex-wrap gap-1.5">
                  {s.systems.map((x) => (
                    <span key={x} className="rounded-xl border border-hairline bg-glass px-3 py-1.5 text-[0.85rem]">{x}</span>
                  ))}
                </m.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
