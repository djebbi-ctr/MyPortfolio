"use client";

import { createContext, useContext } from "react";
import type { CaseId } from "@/content/profile";

type CaseCtx = { open: CaseId | null; openCase: (id: CaseId, trigger: HTMLElement | null) => void; closeCase: () => void };
export const CaseContext = createContext<CaseCtx>({ open: null, openCase: () => {}, closeCase: () => {} });
export const useCase = () => useContext(CaseContext);

export const ToastContext = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastContext);

export const PaletteContext = createContext<{ show: () => void }>({ show: () => {} });
export const usePalette = () => useContext(PaletteContext);
