"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_THEME, type SectionId, type ThemeMode, type ThemeState } from "@/config/sections";

const KEY = "portfolio-theme-v1";

interface Ctx extends ThemeState {
  setPrimary: (hex: string) => void;
  setMode: (m: ThemeMode) => void;
  setVariant: (s: SectionId, v: string) => void;
  toggleSection: (s: SectionId) => void;
  moveSection: (s: SectionId, dir: -1 | 1) => void;
  reset: () => void;
}
const ThemeCtx = createContext<Ctx | null>(null);

const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const readableOn = ([r, g, b]: [number, number, number]) =>
  (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? "20 22 30" : "255 255 255";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ThemeState>(DEFAULT_THEME);
  const [ready, setReady] = useState(false);

  // load saved theme
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setState({ ...DEFAULT_THEME, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);

  // apply + persist
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    const rgb = hexToRgb(state.primary);
    root.style.setProperty("--primary", rgb.join(" "));
    root.style.setProperty("--primary-fg", readableOn(rgb));
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => root.classList.toggle("dark", state.mode === "dark" || (state.mode === "system" && mq.matches));
    apply();
    mq.addEventListener("change", apply);
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
    return () => mq.removeEventListener("change", apply);
  }, [state, ready]);

  const set = useCallback((patch: Partial<ThemeState>) => setState((s) => ({ ...s, ...patch })), []);

  const value = useMemo<Ctx>(() => ({
    ...state,
    setPrimary: (primary) => set({ primary }),
    setMode: (mode) => set({ mode }),
    setVariant: (s, v) => setState((p) => ({ ...p, variants: { ...p.variants, [s]: v } })),
    toggleSection: (s) => setState((p) => ({ ...p, hidden: p.hidden.includes(s) ? p.hidden.filter((x) => x !== s) : [...p.hidden, s] })),
    moveSection: (s, dir) => setState((p) => {
      const o = [...p.order]; const i = o.indexOf(s); const j = i + dir;
      if (j < 0 || j >= o.length) return p;
      [o[i], o[j]] = [o[j], o[i]];
      return { ...p, order: o };
    }),
    reset: () => setState(DEFAULT_THEME),
  }), [state, set]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => {
  const c = useContext(ThemeCtx);
  if (!c) throw new Error("useTheme must be used inside <ThemeProvider>");
  return c;
};
