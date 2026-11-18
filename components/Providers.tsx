"use client";

import { LazyMotion, MotionConfig, useReducedMotion, AnimatePresence, m } from "motion/react";
import { ReactLenis, useLenis } from "lenis/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { CaseContext, PaletteContext, ToastContext } from "./ctx";
import type { CaseId } from "@/content/profile";
import { ease } from "@/lib/motion";

const loadFeatures = () => import("./features").then((f) => f.default);
const CaseStudy = dynamic(() => import("./CaseStudy"), { ssr: false });
const Palette = dynamic(() => import("./CommandPalette"), { ssr: false });

const isCase = (v: string | null): v is CaseId => v === "nwc" || v === "autobiz";

function LockScroll({ locked }: { locked: boolean }) {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    if (locked) lenis.stop(); else lenis.start();
  }, [lenis, locked]);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState<CaseId | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteLoaded, setPaletteLoaded] = useState(false);
  const pushed = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    setMounted(true);
    const read = () => setOpen((c) => { const q = new URLSearchParams(location.search).get("case"); return isCase(q) ? q : null; });
    read();
    addEventListener("popstate", read);
    return () => removeEventListener("popstate", read);
  }, []);

  const trigger = useRef<HTMLElement | null>(null);
  const openCase = useCallback((id: CaseId, el: HTMLElement | null) => {
    trigger.current = el;
    const u = new URL(location.href);
    u.searchParams.set("case", id);
    history.pushState({ case: id }, "", u);
    pushed.current = true;
    setOpen(id);
  }, []);
  const closeCase = useCallback(() => {
    if (pushed.current) { pushed.current = false; history.back(); return; }
    const u = new URL(location.href);
    u.searchParams.delete("case");
    history.replaceState(null, "", u);
    setOpen(null);
  }, []);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastMsg(null), 2200);
  }, []);

  const showPalette = useCallback(() => { setPaletteLoaded(true); setPaletteOpen(true); }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteLoaded(true); setPaletteOpen((o) => !o); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const body = (
    <LazyMotion features={loadFeatures}>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.2, ease: ease.out }}>
        <CaseContext.Provider value={{ open, openCase, closeCase }}>
          <ToastContext.Provider value={toast}>
            <PaletteContext.Provider value={{ show: showPalette }}>
              {children}
              <AnimatePresence>{open && <CaseStudy key={open} id={open} triggerRef={trigger} />}</AnimatePresence>
              {paletteLoaded && <Palette open={paletteOpen} onOpenChange={setPaletteOpen} />}
              <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center">
                <AnimatePresence>
                  {toastMsg && (
                    <m.p key={toastMsg} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="rounded-full border border-hairline bg-[#0a0f17] px-5 py-2.5 text-[0.95rem] text-ink">
                      {toastMsg}
                    </m.p>
                  )}
                </AnimatePresence>
              </div>
            </PaletteContext.Provider>
          </ToastContext.Provider>
        </CaseContext.Provider>
      </MotionConfig>
    </LazyMotion>
  );

  // Lenis only after mount, and never when the visitor asks for reduced motion.
  // It lives beside the tree (root mode), so enabling it never remounts the page.
  return (
    <>
      {mounted && !reduced && <ReactLenis root options={{ lerp: 0.1, anchors: false }} />}
      <LockScroll locked={!!open} />
      {body}
    </>
  );
}
