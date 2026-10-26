"use client";

import { useState } from "react";
import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import { Sparkles, CheckCircle } from "lucide-react";

export default function SkillsTabs({ content }: SectionProps) {
  const { skills } = content;
  const [activeTab, setActiveTab] = useState(skills.groups[0]?.id || "frontend");

  const currentGroup =
    skills.groups.find((g) => g.id === activeTab) || skills.groups[0];

  return (
    <div className="space-y-10">
      <SectionHeading title={skills.title} subtitle={skills.subtitle} />

      {/* Group Navigation Tabs */}
      <div className="flex flex-wrap gap-2 justify-start border-b border-border/80 pb-4">
        {skills.groups.map((group) => {
          const isActive = group.id === activeTab;
          return (
            <button
              key={group.id}
              onClick={() => setActiveTab(group.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer font-display ${
                isActive
                  ? "bg-primary text-primary-fg shadow-md shadow-primary/20 scale-105"
                  : "bg-surface text-muted hover:text-fg hover:bg-surface/80 border border-border"
              }`}
            >
              {group.title}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content Card */}
      {currentGroup && (
        <Card className="p-8 md:p-12 text-start">
          <div className="mb-6">
            <h3 className="text-2xl md:text-3xl font-bold text-fg font-display">
              {currentGroup.title}
            </h3>
            <p className="text-sm text-muted mt-1">
              {currentGroup.items.length} tools &amp; frameworks mastered in this category
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {currentGroup.items.map((tech) => (
              <div
                key={tech}
                className="flex items-center gap-2 p-3.5 rounded-xl border border-border bg-bg hover:border-primary/50 transition-colors"
              >
                <CheckCircle className="size-4 text-primary shrink-0" />
                <span className="text-sm font-semibold text-fg">{tech}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

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
    </div>
  );
}
