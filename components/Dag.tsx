"use client";

import { useEffect, useId, useRef, useState } from "react";
import { graph, ui } from "@/content/profile";
import { NODE, VIEW, edgePath, lineage, nodeById, place, upstream, downstream, type Orientation } from "@/lib/graph";

const label = (id: string) => {
  const n = nodeById(id);
  const from = upstream(id).map((i) => nodeById(i).label);
  const to = downstream(id).map((i) => nodeById(i).label);
  return `${n.label}${n.sub ? " " + n.sub : ""}.${from.length ? " Receives from " + from.join(", ") + "." : ""}${to.length ? " Feeds " + to.join(", ") + "." : ""}`;
};

// Text equivalent: one sentence per stage, in pipeline order.
const summary = graph.stageNames
  .map((s, c) => `${s}: ${graph.nodes.filter((n) => n.col === c).map((n) => n.label).join(", ")}.`)
  .join(" ");

type Props = { introDelay?: number; parallax?: boolean; className?: string };

export default function Dag({ introDelay = 0.8, parallax = false, className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const root = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = pinned ?? hover;
  const set = active ? lineage(active) : null;

  // Pause packets off-screen; add pointer parallax (8px at most) on fine pointers.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const svgs = el.querySelectorAll("svg");
    const io = new IntersectionObserver(([e]) =>
      svgs.forEach((s) => (e.isIntersecting ? s.unpauseAnimations?.() : s.pauseAnimations?.())));
    io.observe(el);
    let onMove: ((e: PointerEvent) => void) | null = null;
    const ok = parallax && !matchMedia("(prefers-reduced-motion: reduce)").matches && matchMedia("(hover: hover)").matches;
    if (ok) {
      onMove = (e) => {
        el.style.setProperty("--px", `${((e.clientX / innerWidth - 0.5) * 16).toFixed(1)}px`);
        el.style.setProperty("--py", `${((e.clientY / innerHeight - 0.5) * 16).toFixed(1)}px`);
      };
      addEventListener("pointermove", onMove, { passive: true });
    }
    return () => {
      io.disconnect();
      if (onMove) removeEventListener("pointermove", onMove);
    };
  }, [parallax]);

  const toggle = (id: string) => setPinned((p) => (p === id ? null : id));

  const draw = (o: Orientation) => {
    const { w, h } = NODE[o];
    return (
      <g className="dag-layer">
        <g>
          {graph.edges.map((e, k) => {
            const on = !set || (set.has(e[0]) && set.has(e[1]));
            const blue = ["bq", "dfm", "at"].includes(e[0]);
            const id = `${uid}${o}${k}`;
            return (
              <g key={k} className={`eg ${set ? (on ? "lit" : "dim") : ""}`}>
                <path
                  id={id}
                  d={edgePath(e, o)}
                  pathLength={1}
                  className={`edge${blue ? " b" : ""}${set && on ? " lit" : ""}`}
                  style={{ ["--k" as string]: k, ["--d0" as string]: `${introDelay + 0.1}s` }}
                />
                <circle r={3} className={`pkt${blue ? " b" : ""}`}>
                  <animateMotion dur={`${2.4 + (k % 3) * 0.4}s`} repeatCount="indefinite" begin={`${introDelay + 1.4 + k * 0.35}s`}>
                    <mpath href={`#${id}`} />
                  </animateMotion>
                </circle>
              </g>
            );
          })}
        </g>
        <g>
          {graph.nodes.map((n) => {
            const { x, y } = place(n.id, o);
            const on = !set || set.has(n.id);
            return (
              <g
                key={n.id}
                className={`dnode ${set ? (on ? "lit" : "dim") : ""}`}
                style={{ ["--c" as string]: n.col, ["--d0" as string]: `${introDelay}s` }}
                tabIndex={0}
                role="button"
                aria-pressed={pinned === n.id}
                aria-label={label(n.id)}
                onPointerEnter={() => setHover(n.id)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(n.id)}
                onBlur={() => setHover(null)}
                onClick={() => toggle(n.id)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") { setPinned(null); setHover(null); }
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(n.id); }
                }}
              >
                <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={14} />
                <text x={x} y={y - (n.sub ? 7 : 0)}>{n.label}</text>
                {n.sub && <text x={x} y={y + 10} className="sub">{n.sub}</text>}
              </g>
            );
          })}
        </g>
      </g>
    );
  };

  return (
    <div ref={root} className={`dag ${className}`} data-hl={set ? 1 : 0}>
      <p id={`${uid}d`} className="sr-only-list">{summary}</p>
      <svg viewBox={VIEW.h} role="group" aria-label={ui.dagTitle} aria-describedby={`${uid}d`} className="hidden md:block">
        {draw("h")}
      </svg>
      <svg viewBox={VIEW.v} role="group" aria-label={ui.dagTitle} aria-describedby={`${uid}d`} className="mx-auto block max-w-[420px] md:hidden">
        {draw("v")}
      </svg>
    </div>
  );
}
