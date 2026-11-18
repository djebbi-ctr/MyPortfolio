"use client";

import { useId, useState } from "react";
import { consoleSuggestions, consoleTables, ui } from "@/content/profile";

type Result = { text: string } | { cols: string[]; rows: string[][] };

const tables = Object.keys(consoleTables);
const HELP = `Tables: ${tables.join(", ")}. Try: SELECT * FROM certifications;`;

function run(raw: string): Result {
  const q = raw.trim();
  if (!q || q.toLowerCase() === "help") return { text: HELP };
  const m = q.match(/^select\s+(.+?)\s+from\s+(\w+)(?:\s+where\s+(\w+)\s*=\s*'([^']*)')?\s*;?$/i);
  if (!m) return { text: `Could not parse that. ${HELP}` };
  const [, colPart, table, wcol, wval] = m;
  const data = consoleTables[table.toLowerCase()];
  if (!data) return { text: `Unknown table "${table}". ${HELP}` };
  const all = Object.keys(data[0] ?? {});
  const cols = colPart.trim() === "*" ? all : colPart.split(",").map((c) => c.trim().toLowerCase());
  const bad = [...cols, ...(wcol ? [wcol.toLowerCase()] : [])].find((c) => !all.includes(c));
  if (bad) return { text: `Unknown column "${bad}". Columns in ${table}: ${all.join(", ")}.` };
  const rows = data.filter((r) => !wcol || r[wcol.toLowerCase()].toLowerCase() === wval.toLowerCase());
  return { cols, rows: rows.map((r) => cols.map((c) => r[c])) };
}

export default function QueryConsole() {
  const id = useId();
  const [value, setValue] = useState("");
  const [result, setResult] = useState<Result>(() => run("SELECT * FROM certifications;"));

  const exec = (cmd: string) => { setResult(run(cmd)); setValue(""); };

  return (
    <div className="mt-4">
      <form onSubmit={(e) => { e.preventDefault(); exec(value); }} className="flex gap-2">
        <label htmlFor={id} className="sr-only">{ui.consoleLabel}</label>
        <input id={id} value={value} onChange={(e) => setValue(e.target.value)} placeholder={ui.consolePlaceholder}
          autoComplete="off" spellCheck={false}
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-hairline bg-obsidian/60 px-3 font-mono text-[0.85rem] text-ink placeholder:text-mute focus-visible:outline-signal" />
        <button type="submit" className="min-h-11 rounded-xl border border-hairline px-4 transition-colors hover:border-signal/60">{ui.consoleRun}</button>
      </form>

      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Example queries">
        {consoleSuggestions.map((s) => (
          <li key={s}>
            <button type="button" onClick={() => exec(s)} className="min-h-11 max-w-full truncate rounded-full border border-hairline px-3 font-mono text-[0.72rem] text-mute transition-colors hover:border-signal/60 hover:text-ink">
              {s}
            </button>
          </li>
        ))}
      </ul>

      <div role="region" aria-live="polite" aria-label="Query result" tabIndex={0} className="mt-3 max-h-60 overflow-auto rounded-xl border border-hairline bg-obsidian/60 p-3 font-mono text-[0.8rem]">
        {"text" in result ? (
          <p className="text-mute">{result.text}</p>
        ) : result.rows.length === 0 ? (
          <p className="text-mute">0 rows.</p>
        ) : (
          <table className="w-full border-collapse text-start">
            <thead>
              <tr>{result.cols.map((c) => <th key={c} scope="col" className="pb-1.5 pe-4 text-start font-medium text-signal">{c}</th>)}</tr>
            </thead>
            <tbody>
              {result.rows.map((r, i) => (
                <tr key={i}>{r.map((v, j) => <td key={j} className="py-0.5 pe-4 align-top text-ink">{v}</td>)}</tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
