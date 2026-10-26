"use client";

import Image from "next/image";
import type { SectionProps } from "../registry";
import Button from "@/components/ui/Button";
import { ArrowRight, Mail } from "lucide-react";
import { Github, Gitlab, Linkedin } from "@/components/ui/Icons";

export default function HomeCentered({ content }: SectionProps) {
  const { hero, person } = content;

  return (
    <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8 pt-8 md:pt-16">
      {/* Centered Avatar with Glow */}
      <div className="relative group">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-primary/40 blur-md opacity-70 group-hover:opacity-100 transition duration-500" />
        <div className="relative size-32 sm:size-40 rounded-full overflow-hidden border-2 border-primary/30 p-1 bg-surface">
          <Image
            src="/images/profile.png"
            alt={person.name}
            fill
            className="object-cover rounded-full"
            priority
          />
        </div>
      </div>

      {/* Status Pill */}
      {hero.status && (
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <span className="size-2 rounded-full bg-primary animate-ping" />
          <span>{hero.status}</span>
        </div>
      )}

      {/* Main Titles */}
      <div className="space-y-3">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-fg tracking-tight font-display">
          {hero.greeting} <span className="text-primary">{hero.name}</span>
        </h1>
        <p className="text-xl sm:text-2xl font-bold text-muted font-display">
          {hero.role}
        </p>
      </div>

      {/* Tagline */}
      <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
        {hero.tagline}
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Button href="#projects" variant="primary" size="lg">
          <span>{hero.cta.primary}</span>
          <ArrowRight className="size-4 rtl:rotate-180" />
        </Button>

        <Button href="#contact" variant="secondary" size="lg">
          <span>{hero.cta.secondary}</span>
        </Button>
      </div>

      {/* Social Links */}
      <div className="flex items-center justify-center gap-3 pt-6 border-t border-border/70 w-full max-w-md">
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
        <a
          href={`mailto:${person.email}`}
          aria-label="Email"
          className="p-2.5 rounded-full border border-border bg-surface text-muted hover:text-primary hover:border-primary/40 transition-colors"
        >
          <Mail className="size-4" />
        </a>
      </div>
    </div>
  );
}
