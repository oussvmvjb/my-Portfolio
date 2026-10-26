"use client";

import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import { Sparkles } from "lucide-react";

export default function SkillsMarquee({ content }: SectionProps) {
  const { skills } = content;

  // Flatten all skills and create two distinct rows
  const allSkills = skills.groups.flatMap((g) => g.items);
  const mid = Math.ceil(allSkills.length / 2);
  const row1 = allSkills.slice(0, mid);
  const row2 = allSkills.slice(mid);

  return (
    <div className="space-y-12">
      <SectionHeading title={skills.title} subtitle={skills.subtitle} />

      <Card className="py-10 px-0 overflow-hidden relative">
        {/* Gradient fade on sides */}
        <div className="pointer-events-none absolute inset-y-0 start-0 w-24 bg-gradient-to-r from-surface to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 end-0 w-24 bg-gradient-to-l from-surface to-transparent z-10" />

        <div className="space-y-6">
          {/* Row 1 - moves left */}
          <div className="flex w-max gap-4 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
            {[...row1, ...row1, ...row1].map((tech, i) => (
              <span
                key={`${tech}-${i}`}
                className="px-5 py-2.5 rounded-2xl bg-bg border border-border text-sm font-bold text-fg shadow-sm hover:border-primary/50 transition-colors whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Row 2 - moves right / reverse */}
          <div className="flex w-max gap-4 animate-[marquee_30s_linear_infinite_reverse] hover:[animation-play-state:paused]">
            {[...row2, ...row2, ...row2].map((tech, i) => (
              <span
                key={`${tech}-${i}`}
                className="px-5 py-2.5 rounded-2xl bg-bg border border-border text-sm font-bold text-primary shadow-sm hover:border-primary transition-colors whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Currently Improving */}
      {skills.currentGoals && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-surface border border-border">
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

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[marquee_25s_linear_infinite\\],
          .animate-\\[marquee_30s_linear_infinite_reverse\\] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
