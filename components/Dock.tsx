"use client";

import { Briefcase, Command, History, Layers, Mail, Workflow } from "lucide-react";
import { m, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { usePalette } from "./ctx";
import { nav, ui } from "@/content/profile";
import { spring } from "@/lib/motion";

const icons = { work: Briefcase, stack: Layers, experience: History, method: Workflow, contact: Mail };

export function useGoTo() {
  const lenis = useLenis();
  return (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -16 });
    else el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
}

function Item({ id, label, active, mouseX, onGo }: { id: keyof typeof icons; label: string; active: boolean; mouseX: MotionValue<number>; onGo: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const Icon = icons[id];
  // Gentle magnification by pointer distance (fine pointers only; mouseX stays at Infinity otherwise).
  const dist = useTransform(mouseX, (x) => { const r = ref.current?.getBoundingClientRect(); return r ? x - (r.left + r.width / 2) : Infinity; });
  const scale = useSpring(useTransform(dist, [-110, 0, 110], [1, 1.14, 1]), spring);
  return (
    <m.li style={{ scale }}>
      <button ref={ref} type="button" onClick={onGo} aria-current={active ? "true" : undefined} aria-label={label}
        className={`relative flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-[0.9rem] font-medium transition-colors md:px-4 ${active ? "text-obsidian" : "text-mute hover:text-ink"}`}>
        {active && <m.span layoutId="dock-pill" className="absolute inset-0 rounded-full bg-signal" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
        <Icon size={18} aria-hidden className="relative" />
        <span className="relative hidden md:inline">{label}</span>
      </button>
    </m.li>
  );
}

export default function Dock() {
  const go = useGoTo();
  const palette = usePalette();
  const [active, setActive] = useState<string>("");
  const [hidden, setHidden] = useState(false);
  const mouseX = useMotionValue(Infinity);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (v > prev && v > 240) setHidden(true);
    else if (v < prev) setHidden(false);
  });

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? setActive(e.target.id) : setActive((a) => (a === e.target.id ? "" : a)))), { rootMargin: "-45% 0px -50% 0px" });
    nav.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <m.nav aria-label="Sections" initial={false} animate={{ y: hidden ? 140 : 0 }} transition={{ duration: 0.25 }}
      onFocusCapture={() => setHidden(false)}
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(16px,env(safe-area-inset-bottom))]">
      <ul className="flex items-center gap-0.5 rounded-full border border-hairline bg-[#0a0f17]/95 p-1.5"
        onPointerMove={(e) => e.pointerType === "mouse" && mouseX.set(e.clientX)} onPointerLeave={() => mouseX.set(Infinity)}>
        {nav.map((n) => (
          <Item key={n.id} id={n.id as keyof typeof icons} label={n.label} active={active === n.id} mouseX={mouseX} onGo={() => go(n.id)} />
        ))}
        <li className="ms-1 border-s border-hairline ps-1">
          <button type="button" onClick={palette.show} aria-label={`${ui.openPalette}, shortcut K`}
            className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-3 text-mute transition-colors hover:text-ink">
            <Command size={16} aria-hidden /><span className="hidden font-mono text-[0.75rem] md:inline">K</span>
          </button>
        </li>
      </ul>
    </m.nav>
  );
}
