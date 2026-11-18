"use client";

import { useEffect } from "react";

// Feeds the two background light fields a slow drift (a CSS variable, no React renders).
export default function ScrollFields() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const set = () => { raf = 0; document.documentElement.style.setProperty("--scroll", Math.min(scrollY / innerHeight, 3).toFixed(3)); };
    const on = () => { if (!raf) raf = requestAnimationFrame(set); };
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  return null;
}
