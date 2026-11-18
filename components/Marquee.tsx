"use client";

import { m, useAnimationFrame, useMotionValue, useScroll, useSpring, useVelocity } from "motion/react";
import { useEffect, useRef } from "react";
import { useReducedAfterMount } from "@/lib/useReduced";

type Item = { name: string; layer: string };

function Chip({ i, hidden }: { i: Item; hidden?: boolean }) {
  return (
    <li aria-hidden={hidden || undefined} className="flex shrink-0 items-baseline gap-2 whitespace-nowrap rounded-full border border-hairline bg-obsidian/60 px-4 py-2">
      <span className="text-ink">{i.name}</span>
      <span className="font-mono text-[0.72rem] text-mute">{i.layer}</span>
    </li>
  );
}

// Slow drift that speeds up with scroll velocity. A static wrapped list under reduced motion.
export default function Marquee({ items, reverse = false, paused }: { items: Item[]; reverse?: boolean; paused: boolean }) {
  const reduced = useReducedAfterMount();
  const x = useMotionValue(0);
  const track = useRef<HTMLUListElement>(null);
  const half = useRef(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => { half.current = el.scrollWidth / 2; };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [reduced]);

  useAnimationFrame((_, dt) => {
    if (reduced || paused || !half.current) return;
    const boost = 1 + Math.min(Math.abs(vel.get()) / 400, 5);
    let next = x.get() + (reverse ? 1 : -1) * dt * 0.03 * boost;
    if (next <= -half.current) next += half.current;
    if (next > 0) next -= half.current;
    x.set(next);
  });

  if (reduced) {
    return <ul className="flex flex-wrap gap-2">{items.map((i) => <Chip key={i.name} i={i} />)}</ul>;
  }
  return (
    <div className="fade-x overflow-hidden">
      <m.ul ref={track} style={{ x }} className="flex w-max gap-2">
        {items.map((i) => <Chip key={i.name} i={i} />)}
        {items.map((i) => <Chip key={i.name + "2"} i={i} hidden />)}
      </m.ul>
    </div>
  );
}
