"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import Magnetic from "./Magnetic";
import { useToast } from "./ctx";
import { Wave, WaveItem } from "./Wave";
import { contact, profile, ui } from "@/content/profile";
import { asset } from "@/lib/asset";

const secondary = "inline-flex min-h-12 items-center gap-2 rounded-full border border-hairline px-5 transition-colors hover:border-signal/60";

export default function Contact() {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.links.email);
      setCopied(true);
      toast(ui.emailCopied);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast(profile.links.email); // clipboard blocked: show the address instead
    }
  };
  return (
    <Wave id="contact" className="scroll-mt-6 pb-40 pt-[clamp(48px,8vw,96px)]">
      <WaveItem>
        <h2 className="max-w-[20ch] text-balance text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.03em]" style={{ fontStretch: "108%" }}>
          {contact.title}
        </h2>
        <p className="mt-4 text-mute">{contact.body}</p>
      </WaveItem>
      <WaveItem i={1} className="mt-8 flex flex-wrap items-center gap-3">
        <Magnetic>
          <a href={`mailto:${profile.links.email}`} className="inline-flex min-h-12 items-center rounded-full bg-signal px-6 font-medium text-obsidian transition-colors hover:bg-[#67e3f5]">
            {ui.emailMe}
          </a>
        </Magnetic>
        <button type="button" onClick={copy} className={secondary}>
          {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}{ui.copyEmail}
        </button>
        {profile.links.linkedin && (
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className={secondary}>
            {ui.linkedin}<span className="sr-only"> {ui.newTab}</span>
          </a>
        )}
        {profile.links.github && (
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className={secondary}>
            {ui.github}<span className="sr-only"> {ui.newTab}</span>
          </a>
        )}
        {profile.links.cv && (
          <a href={asset(profile.links.cv)} download className={secondary}>{ui.downloadCv}</a>
        )}
      </WaveItem>
    </Wave>
  );
}
