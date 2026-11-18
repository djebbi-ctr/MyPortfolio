import { ImageResponse } from "next/og";
import { hero, profile } from "@/content/profile";

export const dynamic = "force-static";
export const alt = profile.siteTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Built at build time: obsidian, a blueprint grid, one line of light running left to right.
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#05070B", color: "#E6EDF3",
        backgroundImage: "linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)", backgroundSize: "56px 56px" }}>
        <div style={{ fontSize: 34, display: "flex" }}>{profile.name}</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, lineHeight: 1.02, letterSpacing: -3, fontWeight: 700 }}>
          {hero.lines.map((l) => <div key={l} style={{ display: "flex" }}>{l}</div>)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <div style={{ width: 16, height: 16, borderRadius: 8, background: "#22D3EE", display: "flex" }} />
          <div style={{ height: 3, width: 520, background: "linear-gradient(90deg,#22D3EE,#3B82F6)", display: "flex" }} />
          <div style={{ width: 16, height: 16, borderRadius: 8, background: "#3B82F6", display: "flex" }} />
          <div style={{ marginLeft: 32, fontSize: 28, color: "#94A3B8", display: "flex" }}>{profile.role}</div>
        </div>
      </div>
    ),
    size,
  );
}
