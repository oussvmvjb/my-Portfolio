"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import type { SectionProps } from "../registry";
import Button from "@/components/ui/Button";
import SplitFlapText from "@/components/ui/SplitFlapText";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { Github, Gitlab, Linkedin } from "@/components/ui/Icons";

// Dynamically imported to avoid SSR/WebGL issues
const ModelViewer = lazy(() => import("@/components/ui/ModelViewer"));

export default function HomeClassic({ content }: SectionProps) {
  const { hero, person } = content;
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (!hero.typedRoles || hero.typedRoles.length === 0) return;
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % hero.typedRoles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [hero.typedRoles]);

  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16 pt-8 md:pt-16">
      {/* Text Info */}
      <div className="flex-1 text-start space-y-6 max-w-2xl">
        {/* Status Pill */}
        {hero.status && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span>{hero.status}</span>
          </div>
        )}

        {/* Heading */}
        <div className="space-y-2">
          <p className="text-lg md:text-xl font-medium text-muted">{hero.greeting}</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-fg tracking-tight font-display">
            {hero.name}
          </h1>
          <div className="flex items-center gap-2 text-2xl sm:text-3xl font-bold text-primary font-display h-10">
            <Sparkles className="size-5 shrink-0" />
            <span className="transition-all duration-300">
              {hero.typedRoles[roleIndex] || hero.role}
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div className="pt-1 w-full">
          <SplitFlapText
            text={hero.tagline}
            gap={3}
            tileRadius={4}
            flipsPerChar={6}
            flipDuration={0.08}
            tileColor="transparent"
            textColor="currentColor"
            responsive
            minFontSize={11}
            maxFontSize={28}
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button href="#projects" variant="primary" size="lg">
            <span>{hero.cta.primary}</span>
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Button>

          <Button href="#contact" variant="secondary" size="lg">
            <span>{hero.cta.secondary}</span>
          </Button>
        </div>

        {/* Social Links Bar */}
        <div className="flex items-center gap-3 pt-4 border-t border-border/70">
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

      {/* 3D Model Right */}
      <div className="relative shrink-0">
        <div className="relative size-64 sm:size-80 lg:size-96 rounded-3xl overflow-hidden border border-primary/20 bg-surface/60 shadow-2xl group">
          {/* Glow overlay */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-full h-full">
                <span className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            }
          >
            <ModelViewer
              src="/3d model/Meshy_AI_Block_Street_King_1026124354_texture.glb"
              autoRotate
              cameraPosition={[0, 1, 4]}
              environment="city"
              className="w-full h-full"
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
