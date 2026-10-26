"use client";

import type { FooterContent, PersonContent } from "@/types/content";
import { ArrowUp } from "lucide-react";
import { Github, Linkedin, Gitlab } from "@/components/ui/Icons";

interface FooterProps {
  footer: FooterContent;
  person: PersonContent;
}

export default function Footer({ footer, person }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/80 bg-surface/40 py-12 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 sm:flex-row">
        {/* Left: copyright & tech note */}
        <div className="text-center sm:text-start space-y-1">
          <p className="text-sm font-semibold text-fg">
            © {new Date().getFullYear()} {person.name}. {footer.rights}
          </p>
          <p className="text-xs text-muted">{footer.built}</p>
        </div>

        {/* Center: Social links */}
        <div className="flex items-center gap-3">
          {person.socials.github && (
            <a
              href={person.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="p-2.5 rounded-full border border-border bg-surface text-muted hover:text-primary hover:border-primary/40 transition-colors"
            >
              <Github className="size-4" />
            </a>
          )}
          {person.socials.gitlab && (
            <a
              href={person.socials.gitlab}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitLab"
              className="p-2.5 rounded-full border border-border bg-surface text-muted hover:text-primary hover:border-primary/40 transition-colors"
            >
              <Gitlab className="size-4" />
            </a>
          )}
          {person.socials.linkedin && (
            <a
              href={person.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2.5 rounded-full border border-border bg-surface text-muted hover:text-primary hover:border-primary/40 transition-colors"
            >
              <Linkedin className="size-4" />
            </a>
          )}
        </div>

        {/* Right: Back to top button */}
        <button
          onClick={scrollToTop}
          aria-label={footer.backToTop}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border border-border bg-surface hover:bg-surface/80 hover:border-primary text-fg transition-all cursor-pointer"
        >
          <span>{footer.backToTop}</span>
          <ArrowUp className="size-3.5 text-primary" />
        </button>
      </div>
    </footer>
  );
}
