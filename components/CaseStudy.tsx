"use client";

import { m } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef, type RefObject } from "react";
import Dag from "./Dag";
import { useCase } from "./ctx";
import { cardB, cases, ui, type CaseId } from "@/content/profile";
import { morphSpring } from "@/lib/motion";

const FOCUSABLE = 'a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])';

// The frame, title and visual share layoutIds with the bento card, so they morph instead of cutting.
export default function CaseStudy({ id, triggerRef }: { id: CaseId; triggerRef: RefObject<HTMLElement | null> }) {
  const { closeCase } = useCase();
  const c = cases[id];
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const page = document.getElementById("page");
    const html = document.documentElement;
    page?.setAttribute("inert", "");
    html.style.overflow = "hidden";
    closeBtn.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); closeCase(); return; }
      if (e.key !== "Tab" || !dialog.current) return;
      const f = [...dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    addEventListener("keydown", key);
    return () => {
      removeEventListener("keydown", key);
      page?.removeAttribute("inert");
      html.style.overflow = "";
      // Return focus to the card that opened it (also works when opened from a shared URL).
      (triggerRef.current ?? document.querySelector<HTMLElement>(`[data-case-trigger="${id}"]`))?.focus({ preventScroll: true });
    };
  }, [closeCase, id, triggerRef]);

  const fade = { initial: { opacity: 0 }, animate: { opacity: 1, transition: { delay: 0.25, duration: 0.3 } }, exit: { opacity: 0, transition: { duration: 0.1 } } };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-3 sm:p-6">
      <m.div className="absolute inset-0 bg-[#020408]/85" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeCase} aria-hidden />
      <m.div
        ref={dialog} role="dialog" aria-modal="true" aria-labelledby="case-title"
        layoutId={`case-${id}-frame`} style={{ borderRadius: 28 }} transition={morphSpring}
        className="relative max-h-full w-full max-w-[1040px] overflow-y-auto overscroll-contain border border-hairline bg-[#0a0f17] p-6 sm:p-10"
      >
        <button ref={closeBtn} type="button" onClick={closeCase} aria-label={ui.closeCase}
          className="absolute end-4 top-4 grid size-11 place-items-center rounded-full border border-hairline transition-colors hover:border-signal/60">
          <X size={18} aria-hidden />
        </button>

        <m.p {...fade} className="text-[0.9rem] text-mute">{c.eyebrow}</m.p>
        <m.h2 layoutId={`case-${id}-title`} transition={morphSpring} id="case-title"
          className="mt-2 max-w-[22ch] text-balance text-[clamp(1.9rem,4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em]" style={{ fontStretch: "106%" }}>
          {c.title}
        </m.h2>
        <m.p {...fade} className="mt-4 max-w-[62ch] text-mute">{c.summary}</m.p>

        <m.div layoutId={`case-${id}-visual`} transition={morphSpring} className="mt-8">
          <m.div {...fade}>
            {id === "nwc" ? (
              <Dag introDelay={0.2} />
            ) : (
              <>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
                  {c.facts?.map((f) => (
                    <div key={f.label} className="flex flex-col-reverse">
                      <dt className="text-[0.9rem] text-mute">{f.label}</dt>
                      <dd className="font-mono text-[2.5rem] font-semibold leading-none tracking-tight text-signal">{f.value}</dd>
                    </div>
                  ))}
                </dl>
                <ol className="mt-6 flex flex-wrap items-center gap-y-2" aria-label={cardB.stagesNote}>
                  {cardB.stages.map((s, i) => (
                    <li key={s} className="flex items-center">
                      <span className="flex items-center gap-2 rounded-xl border border-run/50 px-3 py-1.5 text-[0.85rem]"><span className="size-2 rounded-full bg-run" aria-hidden />{s}</span>
                      {i < cardB.stages.length - 1 && <span aria-hidden className="h-px w-3.5 bg-mute/40" />}
                    </li>
                  ))}
                </ol>
                <p className="mt-2 text-[0.85rem] text-mute">{cardB.stagesNote}</p>
              </>
            )}
          </m.div>
        </m.div>

        <m.div {...fade} className="mt-10 grid gap-8 md:grid-cols-2">
          {c.sections.map((s) => (
            <section key={s.heading}>
              <h3 className="text-[1.0625rem] font-semibold text-ink">{s.heading}</h3>
              <ul className="mt-3 space-y-2 text-mute">
                {s.points.map((p) => <li key={p} className="flex gap-3"><span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-signal" /><span>{p}</span></li>)}
              </ul>
            </section>
          ))}
        </m.div>
      </m.div>
    </div>
  );
}
