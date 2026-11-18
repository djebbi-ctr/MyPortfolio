"use client";

import { Command } from "cmdk";
import { useCase, useToast } from "./ctx";
import { useGoTo } from "./Dock";
import { cases, nav, profile, ui, type CaseId } from "@/content/profile";
import { asset } from "@/lib/asset";

export default function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const go = useGoTo();
  const toast = useToast();
  const { openCase } = useCase();
  const done = (fn: () => void) => () => { onOpenChange(false); setTimeout(fn, 60); };

  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.links.email); toast(ui.emailCopied); } catch { toast(profile.links.email); }
  };
  const download = () => {
    if (!profile.links.cv) return;
    const a = document.createElement("a");
    a.href = asset(profile.links.cv);
    a.download = "";
    a.click();
  };

  return (
    <Command.Dialog open={open} onOpenChange={onOpenChange} label={ui.paletteHint}>
      <Command.Input placeholder={ui.paletteHint} />
      <Command.List>
        <Command.Empty>No match.</Command.Empty>
        <Command.Group heading={ui.paletteGroupSections}>
          {nav.map((n) => <Command.Item key={n.id} value={`go ${n.label}`} onSelect={done(() => go(n.id))}>{n.label}</Command.Item>)}
        </Command.Group>
        <Command.Group heading={ui.paletteGroupActions}>
          {(Object.keys(cases) as CaseId[]).map((id) => (
            <Command.Item key={id} value={`case ${cases[id].title}`} onSelect={done(() => openCase(id, null))}>{ui.openCase}: {cases[id].title}</Command.Item>
          ))}
          <Command.Item value="copy email" onSelect={done(copy)}>{ui.copyEmail}</Command.Item>
          {profile.links.cv && <Command.Item value="download cv" onSelect={done(download)}>{ui.downloadCv}</Command.Item>}
          {profile.links.linkedin && (
            <Command.Item value="open linkedin" onSelect={done(() => window.open(profile.links.linkedin!, "_blank", "noopener,noreferrer"))}>{ui.linkedin}</Command.Item>
          )}
          {profile.links.github && (
            <Command.Item value="open github" onSelect={done(() => window.open(profile.links.github!, "_blank", "noopener,noreferrer"))}>{ui.github}</Command.Item>
          )}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
