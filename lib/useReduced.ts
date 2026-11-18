"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// Same value as useReducedMotion, but false until mounted, so server and first client render match.
export function useReducedAfterMount() {
  const r = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !!r;
}
