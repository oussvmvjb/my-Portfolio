"use client";

import { useState, useEffect, useMemo } from "react";
import type { NavContent, PersonContent } from "@/types/content";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Menu, X, Code2 } from "lucide-react";

interface NavbarProps {
  nav: NavContent;
  person: PersonContent;
  currentLocale: string;
}

export default function Navbar({ nav, person, currentLocale }: NavbarProps) {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = useMemo(
    () => [
      { id: "home", label: nav.home },
      { id: "about", label: nav.about },
      { id: "skills", label: nav.skills },
      { id: "experience", label: nav.experience },
      { id: "projects", label: nav.projects },
      { id: "education", label: nav.education },
      { id: "creative", label: nav.creative },
      { id: "contact", label: nav.contact },
    ],
    [nav]
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // detect active section
      const sections = navLinks.map((l) => document.getElementById(l.id));
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(navLinks[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-bg/85 backdrop-blur-md border-b border-border/80 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
        {/* Brand Logo */}
        <a
          href="#home"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-fg font-display hover:text-primary transition-colors"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-fg shadow-md shadow-primary/20">
            <Code2 className="size-5" />
          </span>
          <span className="hidden sm:inline font-display">{person.name}</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-1 rounded-full border border-border/60 bg-surface/60 backdrop-blur-md px-3 py-1.5 shadow-sm"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`relative px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                  isActive
                    ? "text-primary-fg bg-primary shadow-sm shadow-primary/30"
                    : "text-muted hover:text-fg hover:bg-surface/80"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right side controls: Language Switcher, Theme Toggle, Mobile Hamburger */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher currentLocale={currentLocale} />
          <ThemeToggle />

          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            aria-label="Toggle menu"
            className="md:hidden p-2 rounded-xl border border-border bg-surface text-fg hover:bg-surface/80"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-bg/95 backdrop-blur-xl border-b border-border p-5 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-primary-fg"
                      : "text-fg hover:bg-surface"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
