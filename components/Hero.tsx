import Dag from "./Dag";
import Magnetic from "./Magnetic";
import { certs, hero, profile, ui } from "@/content/profile";
import { asset } from "@/lib/asset";

// Server component: all text is in the HTML and animates with CSS, never waiting on JS.
export default function Hero() {
  return (
    <header className="mx-auto max-w-[1180px] px-4 pt-7 md:px-6" id="top">
      <div className="flex items-baseline gap-3 font-semibold tracking-tight" style={{ fontStretch: "112%" }}>
        <span>{profile.name}</span>
        <span lang="ar" dir="rtl" className="font-arabic text-[0.9rem] font-medium text-mute">{profile.arabic}</span>
      </div>

      <div className="pt-[clamp(24px,4.5vw,56px)]">
        <h1 className="max-w-[14ch] text-balance text-[clamp(3rem,7.2vw,6.25rem)] font-semibold leading-[0.98] tracking-[-0.035em]" style={{ fontStretch: "108%" }}>
          {hero.lines.map((l, i) => (
            <span key={l} className="hero-line"><span style={{ ["--i" as string]: i }}>{l}</span></span>
          ))}
        </h1>
        <p className="intro mt-7 max-w-[46ch] text-[1.125rem] text-mute" style={{ ["--d" as string]: "0.6s" }}>{hero.lede}</p>

        <ul className="intro mt-6 flex flex-wrap gap-2" style={{ ["--d" as string]: "0.68s" }} aria-label="Certifications">
          {certs.map((c) => (
            <li key={c.name} className="rounded-full border border-hairline bg-glass px-3.5 py-1.5 text-[0.9rem] text-ink">{c.short}</li>
          ))}
        </ul>

        <div className="intro mt-7 flex flex-wrap gap-3" style={{ ["--d" as string]: "0.76s" }}>
          <Magnetic>
            <a href={`mailto:${profile.links.email}`} className="inline-flex min-h-12 items-center rounded-full bg-signal px-6 font-medium text-obsidian transition-colors hover:bg-[#67e3f5]">
              {ui.emailMe}
            </a>
          </Magnetic>
          {profile.links.cv && (
            <a href={asset(profile.links.cv)} download className="inline-flex min-h-12 items-center rounded-full border border-hairline px-6 font-medium transition-colors hover:border-signal/60">
              {ui.downloadCv}
            </a>
          )}
        </div>
      </div>

      <div className="mt-10">
        <Dag parallax />
        <p className="intro mt-3 text-[0.9rem] text-mute" style={{ ["--d" as string]: "2s" }}>{ui.dagHint}</p>
      </div>
    </header>
  );
}
