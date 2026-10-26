"use client";

import Image from "next/image";
import type { SectionProps } from "../registry";
import Button from "@/components/ui/Button";
import { ArrowRight, Code, Sparkles, MapPin } from "lucide-react";

export default function HomeSplit({ content }: SectionProps) {
  const { hero, person, skills } = content;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8 md:pt-12">
      {/* Photo Column - takes 5 cols */}
      <div className="lg:col-span-5 relative order-2 lg:order-1">
        <div className="relative h-[380px] sm:h-[460px] lg:h-[520px] w-full rounded-3xl overflow-hidden border border-border bg-surface shadow-2xl">
          <Image
            src="/images/profile.png"
            alt={person.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent" />

          {/* Floating stat card on photo */}
          <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-surface/90 backdrop-blur-md border border-border/80 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-fg font-bold">
                <Code className="size-5" />
              </span>
              <div>
                <p className="text-xs text-muted">Specialization</p>
                <p className="text-sm font-bold text-fg">{hero.role}</p>
              </div>
            </div>
            <div className="text-end">
              <p className="text-xs text-muted flex items-center justify-end gap-1">
                <MapPin className="size-3" /> Location
              </p>
              <p className="text-xs font-semibold text-fg">{person.location.split("/")[0]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Column - takes 7 cols */}
      <div className="lg:col-span-7 space-y-6 text-start order-1 lg:order-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Sparkles className="size-3.5" />
          <span>{hero.role}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-fg tracking-tight font-display">
          {hero.greeting} <span className="text-primary">{hero.name}</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted leading-relaxed font-medium">
          {hero.tagline}
        </p>

        {hero.status && (
          <p className="text-sm text-muted/90 border-s-2 border-primary ps-3">
            {hero.status}
          </p>
        )}

        {/* Featured Tech Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {skills.groups[0]?.items.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-surface border border-border text-fg"
            >
              {tech}
            </span>
          ))}
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
