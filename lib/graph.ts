import { graph } from "@/content/profile";

export const nodeById = (id: string) => graph.nodes.find((n) => n.id === id)!;
export const upstream = (id: string) => graph.edges.filter((e) => e[1] === id).map((e) => e[0]);
export const downstream = (id: string) => graph.edges.filter((e) => e[0] === id).map((e) => e[1]);

function walk(id: string, next: (id: string) => string[], seen = new Set<string>()) {
  for (const n of next(id)) if (!seen.has(n)) { seen.add(n); walk(n, next, seen); }
  return seen;
}
/** The node plus everything upstream and downstream of it. */
export const lineage = (id: string) => new Set([id, ...walk(id, upstream), ...walk(id, downstream)]);

export type Orientation = "h" | "v";
export const NODE = { h: { w: 128, h: 44 }, v: { w: 110, h: 44 } };
export const VIEW = { h: "0 0 1000 340", v: "0 0 360 640" };

export function place(id: string, o: Orientation) {
  const n = nodeById(id);
  return o === "h" ? { x: 70 + n.col * 172, y: 30 + n.t * 280 } : { x: 40 + n.t * 280, y: 40 + n.col * 112 };
}

export function edgePath([a, b]: [string, string], o: Orientation) {
  const p = place(a, o), q = place(b, o), { w, h } = NODE[o];
  if (o === "h") {
    const mx = (p.x + q.x) / 2;
    return `M${p.x + w / 2},${p.y} C${mx},${p.y} ${mx},${q.y} ${q.x - w / 2},${q.y}`;
  }
  const my = (p.y + q.y) / 2;
  return `M${p.x},${p.y + h / 2} C${p.x},${my} ${q.x},${my} ${q.x},${q.y - h / 2}`;
}
