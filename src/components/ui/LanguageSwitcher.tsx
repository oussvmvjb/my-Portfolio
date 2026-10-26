"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Check } from "lucide-react";

const LOCALES: { code: string; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "EN" },
  { code: "fr", label: "Français", flag: "FR" },
  { code: "ar", label: "العربية", flag: "AR" },
  { code: "zh", label: "中文", flag: "ZH" },
];

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname() || `/${currentLocale}`;
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const switchLocale = (newLocale: string) => {
    setOpen(false);
    if (newLocale === currentLocale) return;

    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && LOCALES.some((l) => l.code === segments[0])) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    const newPath = `/${segments.join("/")}`;
    router.push(`${newPath}${hash}`);
  };

  const current = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch language"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/70 bg-surface/80 hover:bg-surface hover:border-primary/40 text-xs md:text-sm font-semibold transition-all"
      >
        <Globe className="size-4 text-primary" />
        <span>{current.flag}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Select language"
          className="absolute end-0 mt-2 w-36 rounded-xl border border-border bg-bg/95 backdrop-blur-md p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {LOCALES.map(({ code, label }) => (
            <li key={code}>
              <button
                role="option"
                aria-selected={code === currentLocale}
                onClick={() => switchLocale(code)}
                className={`flex w-full items-center justify-between px-3 py-2 text-xs md:text-sm rounded-lg transition-colors text-start ${
                  code === currentLocale
                    ? "bg-primary/15 text-primary font-bold"
                    : "text-fg hover:bg-surface"
                }`}
              >
                <span>{label}</span>
                {code === currentLocale && <Check className="size-3.5 text-primary" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
