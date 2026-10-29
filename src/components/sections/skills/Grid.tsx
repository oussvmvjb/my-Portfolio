"use client";

import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import LogoLoop from "@/components/ui/LogoLoop";
import { CATEGORY_ICONS, getLogosForGroup } from "./techLogos";
import { Sparkles, Terminal } from "lucide-react";

export default function SkillsGrid({ content }: SectionProps) {
  const { skills } = content;

  return (
    <div className="space-y-12">
      <SectionHeading title={skills.title} subtitle={skills.subtitle} />

      {/* Grid of skill categories — each card has its own LogoLoop moving in the opposite direction */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.groups.map((group, index) => {
          const isReverse = index % 2 === 1;
          const direction = isReverse ? "right" : "left";
          const Icon = CATEGORY_ICONS[group.id] || Terminal;
          const logos = getLogosForGroup(group.id, group.items);

          return (
            <Card
              key={group.id}
              className="flex flex-col justify-between p-6 overflow-hidden border border-border/80 bg-surface/50 backdrop-blur-sm hover:border-primary/40 transition-colors"
            >
              <div className="space-y-5">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-fg font-display">
                        {group.title}
                      </h3>
                      <p className="text-xs text-muted">
                        {group.items.length} tools &amp; frameworks
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-muted/60 uppercase tracking-widest hidden sm:inline-flex">
                    {direction === "left" ? "← left" : "right →"}
                  </span>
                </div>

                {/* Individual LogoLoop inside this skill card */}
                <div className="py-2.5 -mx-6 overflow-hidden bg-bg/40 border-y border-border/40">
                  <LogoLoop
                    logos={logos}
                    direction={direction}
                    speed={50}
                    logoHeight={32}
                    gap={36}
                    hoverSpeed={0}
                    scaleOnHover
                    labels="below"
                    fadeOut
                    fadeOutWidth={0.14}
                    draggable
                    ariaLabel={`${group.title} interactive logo loop moving ${direction}`}
                  />
                </div>

                {/* Skill pills for fast scanning */}
                
              </div>
            </Card>
          );
        })}
      </div>

      {/* Currently Improving Block */}
      {skills.currentGoals && (
        <Card className="p-6 md:p-8 border-primary/30 bg-primary/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-fg">
                <Sparkles className="size-4" />
              </span>
              <div>
                <h4 className="text-lg font-bold text-fg font-display">
                  {skills.currentGoals.title}
                </h4>
                <p className="text-xs text-muted">Constantly expanding technical depth</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.currentGoals.items.map((item) => (
                <Chip key={item} variant="primary" size="md">
                  {item}
                </Chip>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
