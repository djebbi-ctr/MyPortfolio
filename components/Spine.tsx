"use client";

import { m, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

// One thin line, drawn by scroll progress (scroll-linked, not timed). It leaves the DAG and ends at contact.
export default function Spine({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 70%"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, h]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    setH(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative mx-auto max-w-[1180px] px-4 md:px-6">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 start-1 w-px bg-hairline md:start-2">
        <m.div className="absolute inset-0 origin-top bg-gradient-to-b from-signal to-current" style={{ scaleY: scrollYProgress }} />
        <m.span className="absolute -start-[3px] top-0 size-[7px] rounded-full bg-signal" style={{ y }} />
      </div>
      {children}
    </div>
  );
}
