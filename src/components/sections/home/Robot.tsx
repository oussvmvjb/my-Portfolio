"use client";

import { useState, useEffect } from "react";
import type { SectionProps } from "../registry";
import Button from "@/components/ui/Button";
import SplitFlapText from "@/components/ui/SplitFlapText";
import RobotViewer from "@/components/3d/RobotViewer";
import { ArrowRight, Bot, Sparkles, Terminal, Mail } from "lucide-react";
import { Github, Gitlab, Linkedin } from "@/components/ui/Icons";

const socialClass =
  "p-2.5 rounded-full border border-border bg-surface text-muted hover:text-primary hover:border-primary/40 transition-colors";

export default function HomeRobot({ content }: SectionProps) {
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
    <div className="w-full max-w-full overflow-x-clip pt-6 md:pt-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center max-w-6xl mx-auto">
        {/* Left Column: Bio & Intro */}
        <div className="lg:col-span-6 text-start space-y-6 min-w-0">
          {/* Status pill */}
          {hero.status && (
            <div className="inline-flex max-w-full items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <span className="size-2 shrink-0 rounded-full bg-primary animate-pulse" />
              <span>{hero.status}</span>
              <span className="text-muted/60">•</span>
              <span className="text-muted font-mono flex items-center gap-1">
                <Bot className="size-3 text-primary" /> 3D AI Assistant Ready
              </span>
            </div>
          )}

          {/* Heading */}
          <div className="space-y-1.5">
            <p className="text-base sm:text-lg md:text-xl font-medium text-muted">
              {hero.greeting}
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-fg tracking-tight font-display break-words">
              {hero.name}
            </h1>
            <div className="flex items-start gap-2 text-lg sm:text-3xl font-bold text-primary font-display">
              <Sparkles className="size-5 shrink-0 mt-1" />
              <span className="min-w-0 break-words transition-all duration-300">
                {hero.typedRoles?.[roleIndex] || hero.role}
              </span>
            </div>
          </div>

          {/* Tagline */}
          <div className="min-w-0">
            <SplitFlapText
              text={hero.tagline}
              gap={3}
              tileRadius={4}
              flipsPerChar={6}
              flipDuration={0.08}
              tileColor="transparent"
              textColor="currentColor"
              responsive
              wrap
              charsPerLine={22}
              minFontSize={13}
              maxFontSize={26}
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <Button href="#projects" variant="primary" size="lg">
              <span>{hero.cta.primary}</span>
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Button>
            <Button href="#contact" variant="secondary" size="lg">
              <span>{hero.cta.secondary}</span>
            </Button>
          </div>

          {/* Socials & Tech specs */}
          <div className="flex items-center justify-between gap-3 pt-5 border-t border-border/70">
            <div className="flex items-center gap-2.5">
              {person.socials.github && (
                <a
                  href={person.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className={socialClass}
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
                  className={socialClass}
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
                  className={socialClass}
                >
                  <Linkedin className="size-4" />
                </a>
              )}
              <a href={`mailto:${person.email}`} aria-label="Email" className={socialClass}>
                <Mail className="size-4" />
              </a>
            </div>

            <span className="text-xs font-mono text-muted hidden sm:inline-flex items-center gap-1.5">
              <Terminal className="size-3.5 text-primary" /> WebGL // Three.js // R3F
            </span>
          </div>
        </div>

        {/* Right Column: Interactive 3D Robot */}
        <div className="lg:col-span-6 flex justify-center items-center w-full">
          <RobotViewer className="w-full max-w-[500px]" />
        </div>
      </div>
    </div>
  );
}

