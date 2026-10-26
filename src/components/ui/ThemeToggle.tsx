"use client";

import { useTheme } from "@/lib/theme/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { mode, setMode } = useTheme();

  const toggle = () => {
    if (mode === "dark") {
      setMode("light");
    } else {
      setMode("dark");
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme mode"
      className="p-2 rounded-xl border border-border/70 bg-surface/80 hover:bg-surface hover:border-primary/40 text-fg transition-all"
    >
      {mode === "light" ? (
        <Sun className="size-4 text-primary" />
      ) : (
        <Moon className="size-4 text-primary" />
      )}
    </button>
  );
}
