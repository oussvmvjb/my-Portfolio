"use client";

import type { SectionProps } from "../registry";
import Button from "@/components/ui/Button";
import DotMatrixText from "@/components/ui/DotMatrixText";
import { Terminal, ArrowRight, Cpu } from "lucide-react";

export default function HomeGlitch({ content }: SectionProps) {
  const { hero, projects } = content;

  return (
    <div className="relative rounded-3xl border border-primary/30 bg-surface/90 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
      {/* Scanline background overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]"
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-8 max-w-4xl text-start">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <Terminal className="size-4 text-primary" />
            <span>SYS.PORTFOLIO_V1 // STATUS: ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono text-emerald-400">READY</span>
          </div>
        </div>

        {/* Glitch Name Heading */}
        <div className="space-y-3">
          <p className="text-sm font-mono text-primary uppercase tracking-widest">
            {hero.greeting}
          </p>
          <h1
            className="glitch text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display select-none"
            data-text={hero.name}
          >
            {hero.name}
          </h1>
        </div>

        {/* Dot Matrix Display */}
        <div className="py-2">
          <p className="text-xs font-mono text-muted mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="size-3.5 text-primary" />
            <span>Digital Matrix Display</span>
          </p>
          <DotMatrixText
            text="DEV // FULL-STACK"
            dotSize={4}
            gap={2}
            charGap={6}
          />
        </div>

        {/* Description */}
        <p className="text-base sm:text-lg text-muted max-w-2xl font-mono leading-relaxed">
          &gt; {hero.tagline}
        </p>

        {/* Cyber / Glitch Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border/70 font-mono">
          <div className="p-3 rounded-xl bg-surface/70 border border-border">
            <p className="text-xs text-muted">PROJECTS</p>
            <p className="text-2xl font-bold text-primary font-display">{projects.items.length}+</p>
          </div>
          <div className="p-3 rounded-xl bg-surface/70 border border-border">
            <p className="text-xs text-muted">DEV FOCUS</p>
            <p className="text-sm font-bold text-fg">Web & Mobile</p>
          </div>
          <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-surface/70 border border-border">
            <p className="text-xs text-muted">DEGREE</p>
            <p className="text-sm font-bold text-fg">M.Sc. Candidate</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Button href="#projects" variant="primary" size="lg">
            <span>{hero.cta.primary}</span>
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Button>

          <Button href="#contact" variant="secondary" size="lg">
            <span>{hero.cta.secondary}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
