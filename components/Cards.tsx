"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, m, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Counter from "./Counter";
import Marquee from "./Marquee";
import { useCase } from "./ctx";
import { WaveItem } from "./Wave";
import { cardA, cardB, cardC, cardD, cardE, certs, experience, profile, riyadh, stack, ui } from "@/content/profile";
import { spring } from "@/lib/motion";

type P = { className?: string };
const FRAME = { borderRadius: 28 };

const QueryConsole = dynamic(() => import("./QueryConsole"), {
  ssr: false,
  loading: () => <div className="h-52 rounded-xl border border-hairline" aria-hidden />,
});

/* ---------- A: NWC (opens a case study) ---------- */
export function CardA({ className = "" }: P) {
  const { openCase } = useCase();
  return (
    <WaveItem i={0} className={className}>
      <m.article layoutId="case-nwc-frame" style={FRAME} className="card card-open flex h-full flex-col" aria-labelledby="a-t"
        onClick={(e) => openCase("nwc", e.currentTarget.querySelector("button"))}>
        <m.h2 layoutId="case-nwc-title" id="a-t">{cardA.title}</m.h2>
        <div className="mt-4 space-y-3">
          {cardA.body.map((p) => <p key={p}>{p}</p>)}
        </div>
        <m.div layoutId="case-nwc-visual" className="mini mt-auto flex flex-wrap items-center gap-y-2 pt-7" aria-hidden>
          {cardA.mini.map((t, i) => (
            <span key={t} className="flex items-center">
              <span className="rounded-xl border border-hairline bg-obsidian/60 px-3 py-1.5 text-[0.85rem]">{t}</span>
              {i < cardA.mini.length - 1 && <span className="mini-edge" style={{ ["--s" as string]: i }} />}
            </span>
          ))}
        </m.div>
        <button type="button" data-case-trigger="nwc" onClick={(e) => { e.stopPropagation(); openCase("nwc", e.currentTarget); }}
          className="mt-6 min-h-11 self-start rounded-full border border-hairline px-5 transition-colors hover:border-signal/60">
          {ui.openCase}
        </button>
      </m.article>
    </WaveItem>
  );
}

/* ---------- B: Autobiz (counter + stages turn green in sequence) ---------- */
export function CardB({ className = "" }: P) {
  const { openCase } = useCase();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [done, setDone] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (reduced) { setDone(cardB.stages.length); return; }
    const ids = cardB.stages.map((_, i) => setTimeout(() => setDone(i + 1), 500 + i * 320));
    return () => ids.forEach(clearTimeout);
  }, [seen, reduced]);

  return (
    <WaveItem i={1} className={className}>
      <m.article layoutId="case-autobiz-frame" style={FRAME} className="card card-open h-full" aria-labelledby="b-t"
        onClick={(e) => openCase("autobiz", e.currentTarget.querySelector("button"))}>
        <m.h2 layoutId="case-autobiz-title" id="b-t">{cardB.title}</m.h2>
        <div ref={ref} className="mt-5 flex items-baseline gap-3">
          <Counter to={cardB.metric.value} suffix={cardB.metric.suffix} className="font-mono text-[clamp(2.75rem,6vw,4.25rem)] font-semibold leading-none tracking-tight text-ink" />
          <span className="text-mute">{cardB.metric.label}</span>
        </div>
        <p className="mt-4">{cardB.body}</p>
        <m.div layoutId="case-autobiz-visual" className="mt-6">
          <ol className="flex flex-wrap items-center gap-y-2" aria-label={cardB.stagesNote}>
            {cardB.stages.map((s, i) => (
              <li key={s} className="flex items-center">
                <span className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[0.85rem] transition-colors duration-200 ${i < done ? "border-run/50" : "border-hairline"}`}>
                  <span className={`size-2 rounded-full transition-colors duration-200 ${i < done ? "bg-run" : "bg-mute/50"}`} aria-hidden />
                  {s}
                </span>
                {i < cardB.stages.length - 1 && <span aria-hidden className="h-px w-3.5 bg-mute/40" />}
              </li>
            ))}
          </ol>
          <p className="mt-2 text-[0.85rem] text-mute">{cardB.stagesNote}</p>
        </m.div>
        <button type="button" data-case-trigger="autobiz" onClick={(e) => { e.stopPropagation(); openCase("autobiz", e.currentTarget); }}
          className="mt-5 min-h-11 rounded-full border border-hairline px-5 transition-colors hover:border-signal/60">
          {ui.openCase}
        </button>
      </m.article>
    </WaveItem>
  );
}

/* ---------- C: certifications (tilt + sheen, like the seal on a certificate) ---------- */
function Cert({ c }: { c: (typeof certs)[number] }) {
  const rx = useSpring(useMotionValue(0), spring);
  const ry = useSpring(useMotionValue(0), spring);
  const sx = useMotionValue(50);
  const glow = useSpring(useMotionValue(0), spring);
  const sheen = useMotionTemplate`linear-gradient(105deg, transparent calc(${sx}% - 22%), rgba(34,211,238,0.2) ${sx}%, rgba(59,130,246,0.15) calc(${sx}% + 10%), transparent calc(${sx}% + 28%))`;
  const on = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    ry.set((x - 0.5) * 6); rx.set((0.5 - y) * 6); sx.set(x * 100); glow.set(1);
  };
  const off = () => { rx.set(0); ry.set(0); glow.set(0); };
  const body = (
    <>
      <m.span aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: sheen, opacity: glow }} />
      <span className="block font-medium">{c.name}</span>
      <span className="block text-[0.85rem] text-mute">
        {c.issuer}{c.url && <> · {ui.verify}<span className="sr-only"> {c.name} {ui.newTab}</span></>}
      </span>
    </>
  );
  const cls = "relative block overflow-hidden rounded-xl border border-hairline bg-obsidian/45 px-4 py-3.5";
  return (
    <m.li style={{ rotateX: rx, rotateY: ry, transformPerspective: 700 }} onPointerMove={on} onPointerLeave={off}>
      {c.url
        ? <a href={c.url} target="_blank" rel="noopener noreferrer" className={`${cls} transition-colors hover:border-signal/60`}>{body}</a>
        : <div className={cls}>{body}</div>}
    </m.li>
  );
}
export function CardC({ className = "" }: P) {
  return (
    <WaveItem i={2} className={className}>
      <section className="card h-full" aria-labelledby="c-t">
        <h2 id="c-t">{cardC.title}</h2>
        <ul className="mt-5 grid gap-2.5">{certs.map((c) => <Cert key={c.name} c={c} />)}</ul>
      </section>
    </WaveItem>
  );
}

/* ---------- D: stack, two marquees, speed follows scroll velocity ---------- */
const LAYERS = ["ingest", "process", "warehouse", "transform", "orchestrate", "language", "legacy", "serve", "delivery"];
const sorted = [...stack].sort((a, b) => LAYERS.indexOf(a.layer) - LAYERS.indexOf(b.layer));
const rows = [sorted.slice(0, Math.ceil(sorted.length / 2)), sorted.slice(Math.ceil(sorted.length / 2))];
export function CardD({ className = "" }: P) {
  const [userPaused, setUserPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const paused = userPaused || engaged;
  return (
    <WaveItem i={1} className={className}>
      <section id="stack" className="card h-full scroll-mt-6" aria-labelledby="d-t"
        onPointerEnter={() => setEngaged(true)} onPointerLeave={() => setEngaged(false)}
        onFocusCapture={() => setEngaged(true)} onBlurCapture={() => setEngaged(false)}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="d-t">{cardD.title}</h2>
            <p className="mt-1 text-[0.9rem]">{cardD.sub}</p>
          </div>
          <button type="button" onClick={() => setUserPaused((p) => !p)} aria-pressed={userPaused}
            aria-label={userPaused ? ui.playMotion : ui.pauseMotion}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-hairline transition-colors hover:border-signal/60">
            {userPaused ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}
          </button>
        </div>
        <div className="mt-6 space-y-2.5">
          <Marquee items={rows[0]} paused={paused} />
          <Marquee items={rows[1]} reverse paused={paused} />
        </div>
      </section>
    </WaveItem>
  );
}

/* ---------- E: experience (line fills on entry; roles expand on hover, focus or tap) ---------- */
export function CardE({ className = "" }: P) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <WaveItem i={2} className={className}>
      <section id="experience" className="card h-full scroll-mt-6" aria-labelledby="e-t">
        <h2 id="e-t">{cardE.title}</h2>
        <div className="relative mt-7 ps-8">
          <m.span aria-hidden initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} style={{ originY: 0 }}
            className="absolute inset-y-1 start-[7px] w-px bg-gradient-to-b from-signal to-hairline" />
          <ol className="space-y-1">
            {experience.map((x, i) => {
              const expanded = open === x.id;
              const has = x.points.length > 0;
              return (
                <m.li layout="position" key={x.id} className="relative"
                  onPointerEnter={(e) => { if (e.pointerType === "mouse" && has) setOpen(x.id); }}
                  onPointerLeave={(e) => { if (e.pointerType === "mouse") setOpen((o) => (o === x.id ? null : o)); }}>
                  <span aria-hidden className={`absolute -start-8 top-[1.15rem] size-[15px] rounded-full border-2 border-signal ${i === 0 ? "bg-signal" : "bg-obsidian"}`} />
                  <button type="button" disabled={!has} aria-expanded={has ? expanded : undefined}
                    onClick={() => setOpen(expanded ? null : x.id)}
                    onFocus={() => has && setOpen(x.id)}
                    className="block min-h-11 w-full py-2 text-start disabled:cursor-default">
                    <span className="block text-[0.85rem] text-mute">{x.start} to {x.end} · {x.place}</span>
                    <span className="block text-[1.0625rem] font-medium">{x.role} <span className="text-signal">{x.org}</span></span>
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded && has && (
                      <m.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-3 space-y-1.5 text-[0.95rem] text-mute">
                        {x.points.map((p) => <li key={p} className="max-w-[62ch]">{p}</li>)}
                      </m.ul>
                    )}
                  </AnimatePresence>
                </m.li>
              );
            })}
          </ol>
        </div>
      </section>
    </WaveItem>
  );
}

/* ---------- F: query console (lazy) ---------- */
export function CardF({ className = "" }: P) {
  return (
    <WaveItem i={3} className={className}>
      <section className="card h-full" aria-labelledby="f-t">
        <h2 id="f-t">{ui.consoleTitle}</h2>
        <QueryConsole />
      </section>
    </WaveItem>
  );
}

/* ---------- G: Riyadh (live clock, arc to Tunis) ---------- */
const project = ([lon, lat]: [number, number]) => ({ x: ((lon - 5) / 45) * 200 + 20, y: ((40 - lat) / 18) * 80 + 20 });
export function CardG({ className = "" }: P) {
  const [time, setTime] = useState("");
  const [hover, setHover] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", { timeZone: profile.timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const tick = () => setTime(f.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const a = project(riyadh.tunis), b = project(riyadh.riyadh);
  const d = `M${a.x},${a.y} Q${(a.x + b.x) / 2},${Math.min(a.y, b.y) - 38} ${b.x},${b.y}`;
  return (
    <WaveItem i={3} className={className}>
      <section className="card h-full" aria-labelledby="g-t" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
        <h2 id="g-t">{riyadh.title}</h2>
        <p className="mt-3 font-mono text-[1.75rem] tabular-nums text-ink" aria-label={`Local time in ${riyadh.title}`}>
          <span suppressHydrationWarning>{time || "--:--:--"}</span>
        </p>
        <svg viewBox="0 0 240 120" className="mt-3 w-full" aria-hidden>
          <path d={d} fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth={1.5} className="text-mute" />
          <m.path d={d} fill="none" stroke="#22D3EE" strokeWidth={1.5} initial={false}
            animate={{ pathLength: hover || reduced ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }} />
          {[[a, riyadh.from], [b, riyadh.title]].map(([p, name]) => (
            <g key={name as string}>
              <circle cx={(p as typeof a).x} cy={(p as typeof a).y} r={3.5} fill="#22D3EE" />
              <text x={(p as typeof a).x} y={(p as typeof a).y + 16} textAnchor="middle" fontSize={10} fill="#94A3B8">{name as string}</text>
            </g>
          ))}
        </svg>
        <p className="mt-2 text-[0.9rem]">{riyadh.languages.join(", ")}</p>
      </section>
    </WaveItem>
  );
}
