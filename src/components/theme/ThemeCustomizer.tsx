"use client";

import { useState } from "react";
import { Monitor, Moon, Palette, Pipette, RotateCcw, Sun, X, ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";
import { PRIMARY_PRESETS, SECTION_VARIANTS, type ThemeMode } from "@/config/sections";
import { useTheme } from "@/lib/theme/ThemeProvider";

const MODES: { id: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { id: "light", label: "Light", Icon: Sun },
  { id: "dark", label: "Dark", Icon: Moon },
  { id: "system", label: "System", Icon: Monitor },
];

export default function ThemeCustomizer({ labels }: { labels?: Record<string, string> }) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"theming" | "sections">("theming");
  const L = (k: string, d: string) => labels?.[k] ?? d;

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label={L("open", "Customize theme")}
        className="fixed bottom-5 end-5 z-50 grid size-12 place-items-center rounded-full bg-primary text-primary-fg shadow-lg transition hover:scale-105">
        <Palette className="size-5" />
      </button>

      {open && <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)} />}

      <aside role="dialog" aria-label="Theme Customizer"
        className={`fixed inset-y-0 end-0 z-50 w-full max-w-sm overflow-y-auto border-s border-border bg-bg p-5 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"}`}>
        <header className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">{L("title", "Theme Customizer")}</h2>
            <p className="text-sm text-muted">{L("subtitle", "Customize & Preview in Real Time")}</p>
          </div>
          <div className="flex gap-1">
            <button onClick={t.reset} aria-label="Reset" className="rounded-lg p-2 hover:bg-surface"><RotateCcw className="size-5" /></button>
            <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-lg p-2 hover:bg-surface"><X className="size-5" /></button>
          </div>
        </header>

        <div className="mt-5 flex gap-2">
          {(["theming", "sections"] as const).map((k) => (
            <button key={k} onClick={() => setTab(k)}
              className={`rounded-md px-3 py-1 text-sm font-medium capitalize ${tab === k ? "bg-primary/15 text-primary" : "text-muted hover:bg-surface"}`}>
              {L(k, k)}
            </button>
          ))}
        </div>

        {tab === "theming" && (
          <div className="mt-6 space-y-8">
            <div>
              <h3 className="mb-3 font-semibold">{L("primary", "Primary Color")}</h3>
              <div className="flex flex-wrap gap-3">
                {PRIMARY_PRESETS.map((c) => (
                  <button key={c} onClick={() => t.setPrimary(c)} aria-label={c}
                    className={`grid size-14 place-items-center rounded-xl border-2 ${t.primary.toLowerCase() === c.toLowerCase() ? "border-primary" : "border-border"}`}>
                    <span className="size-8 rounded-md" style={{ background: c }} />
                  </button>
                ))}
                <label className="grid size-14 cursor-pointer place-items-center rounded-xl border-2 border-border bg-surface" title="Custom color">
                  <Pipette className="size-5" />
                  <input type="color" value={t.primary} onChange={(e) => t.setPrimary(e.target.value)} className="sr-only" />
                </label>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold">{L("mode", "Mode")}</h3>
              <div className="grid grid-cols-3 gap-3">
                {MODES.map(({ id, label, Icon }) => (
                  <button key={id} onClick={() => t.setMode(id)}
                    className={`flex h-20 flex-col items-center justify-center gap-1 rounded-xl border-2 text-sm ${t.mode === id ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>
                    <Icon className="size-6" />{L(id, label)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "sections" && (
          <ul className="mt-6 space-y-4">
            {t.order.map((id, i) => (
              <li key={id} className="rounded-xl border border-border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold capitalize">{id}</span>
                  <div className="flex gap-1">
                    <button onClick={() => t.moveSection(id, -1)} disabled={i === 0} aria-label="Move up" className="rounded p-1 hover:bg-surface disabled:opacity-30"><ChevronUp className="size-4" /></button>
                    <button onClick={() => t.moveSection(id, 1)} disabled={i === t.order.length - 1} aria-label="Move down" className="rounded p-1 hover:bg-surface disabled:opacity-30"><ChevronDown className="size-4" /></button>
                    <button onClick={() => t.toggleSection(id)} aria-label="Toggle section" className="rounded p-1 hover:bg-surface">
                      {t.hidden.includes(id) ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SECTION_VARIANTS[id].map((v) => (
                    <button key={v.id} onClick={() => t.setVariant(id, v.id)}
                      className={`rounded-lg border px-3 py-1 text-sm ${t.variants[id] === v.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted hover:bg-surface"}`}>
                      {v.label}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </>
  );
}
