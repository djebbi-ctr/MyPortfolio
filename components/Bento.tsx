"use client";

import { useEffect, useRef } from "react";
import { Wave } from "./Wave";
import { CardA, CardB, CardC, CardD, CardE, CardG, CardF } from "./Cards";

// One pointer listener moves the light for every card (motion off the React render path).
export default function Bento() {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const cards = [...el.querySelectorAll<HTMLElement>(".card")];
    const paint = (cx: number, cy: number, hover: boolean) => {
      for (const c of cards) {
        const r = c.getBoundingClientRect();
        const dx = Math.max(r.left - cx, 0, cx - r.right), dy = Math.max(r.top - cy, 0, cy - r.bottom);
        c.style.setProperty("--mx", `${cx - r.left}px`);
        c.style.setProperty("--my", `${cy - r.top}px`);
        c.style.setProperty("--near", Math.max(0, 1 - Math.hypot(dx, dy) / 260).toFixed(2));
        c.dataset.hov = hover && !dx && !dy ? "1" : "0";
      }
    };
    const reset = () => cards.forEach((c) => { c.style.setProperty("--near", "0"); c.dataset.hov = "0"; });

    if (matchMedia("(hover: none)").matches) {
      // Touch: the card nearest the viewport centre holds the light while you scroll.
      let raf = 0;
      const hold = () => {
        raf = 0;
        const mid = innerHeight / 2;
        let best: HTMLElement | null = null, bd = Infinity;
        for (const c of cards) { const r = c.getBoundingClientRect(); const d = Math.abs((r.top + r.bottom) / 2 - mid); if (d < bd) { bd = d; best = c; } }
        for (const c of cards) {
          const on = c === best;
          c.style.setProperty("--near", on ? "1" : "0");
          c.dataset.hov = on ? "1" : "0";
          if (on) { c.style.setProperty("--mx", "50%"); c.style.setProperty("--my", "30%"); }
        }
      };
      const onScroll = () => { if (!raf) raf = requestAnimationFrame(hold); };
      hold();
      addEventListener("scroll", onScroll, { passive: true });
      return () => removeEventListener("scroll", onScroll);
    }

    const onMove = (e: PointerEvent) => paint(e.clientX, e.clientY, true);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", reset); };
  }, []);

  return (
    <Wave id="work" className="scroll-mt-6 py-[clamp(64px,10vw,120px)]">
      <div ref={grid} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CardA className="md:col-span-2 lg:col-span-2 lg:col-start-1 lg:row-span-2 lg:row-start-1" />
        <CardB className="md:col-span-2 lg:col-span-2 lg:col-start-3 lg:row-start-1" />
        <CardC className="lg:col-start-3 lg:row-span-2 lg:row-start-2" />
        <CardF className="order-6 md:order-none lg:col-start-4 lg:row-span-2 lg:row-start-2" />
        <CardD className="order-5 md:order-none md:col-span-2 lg:col-span-2 lg:col-start-1 lg:row-start-3" />
        <CardE className="order-4 md:order-none md:col-span-2 lg:col-span-3 lg:col-start-1 lg:row-start-4" />
        <CardG className="order-7 md:order-none lg:col-start-4 lg:row-start-4" />
      </div>
    </Wave>
  );
}
