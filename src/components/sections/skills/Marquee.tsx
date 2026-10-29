"use client";

import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import LogoLoop from "@/components/ui/LogoLoop";
import { CATEGORY_ICONS, getLogosForGroup } from "./techLogos";
import { Sparkles, Terminal } from "lucide-react";

export default function SkillsMarquee({ content }: SectionProps) {
  const { skills } = content;

  return (
    <div className="space-y-12">
      <SectionHeading title={skills.title} subtitle={skills.subtitle} />

      <Card className="py-8 px-0 overflow-hidden relative border border-border/80 bg-surface/40 backdrop-blur-sm">
        <div className="divide-y divide-border/60 space-y-8 [&>div:not(:first-child)]:pt-8">
          {skills.groups.map((group, index) => {
            const isReverse = index % 2 === 1;
            const direction = isReverse ? "right" : "left";
            const Icon = CATEGORY_ICONS[group.id] || Terminal;
            const logos = getLogosForGroup(group.id, group.items);

            return (
              <div key={group.id} className="space-y-3.5">
                {/* Category Header */}
                <div className="flex items-center justify-between px-6 sm:px-8">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                      <Icon className="size-3.5" />
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-fg font-display uppercase tracking-wider">
                      {group.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono text-muted/70 uppercase tracking-widest hidden sm:inline-flex items-center gap-1.5">
                    {isReverse ? "Moving Right →" : "← Moving Left"}
                  </span>
                </div>

                {/* Alternating LogoLoop Track */}
                <LogoLoop
                  logos={logos}
                  speed={65}
                  direction={direction}
                  logoHeight={36}
                  gap={48}
                  hoverSpeed={0}
                  scaleOnHover
                  labels="below"
                  fadeOut
                  fadeOutWidth={0.12}
                  draggable
                  ariaLabel={`${group.title} technologies interactive loop moving ${direction}`}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Currently Improving */}
      {skills.currentGoals && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-surface/70 border border-border">
          <div className="flex items-center gap-2 text-sm font-bold text-fg font-display">
            <Sparkles className="size-4 text-primary" />
            <span>{skills.currentGoals.title}:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.currentGoals.items.map((item) => (
              <Chip key={item} variant="primary">
                {item}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
