"use client";

import { useState } from "react";
import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import { Video, Palette, Music, CheckCircle2 } from "lucide-react";

export default function CreativeShowcase({ content }: SectionProps) {
  const { creative } = content;
  const [activeTab, setActiveTab] = useState(creative.items[0]?.id || "video");

  const itemIcons: Record<string, typeof Video> = {
    video: Video,
    graphic: Palette,
    music: Music,
  };

  const currentItem =
    creative.items.find((it) => it.id === activeTab) || creative.items[0];
  const CurrentIcon = currentItem ? (itemIcons[currentItem.id] || Video) : Video;

  return (
    <div className="space-y-10">
      <SectionHeading title={creative.title} subtitle={creative.subtitle} />

      {creative.intro && (
        <p className="text-base sm:text-lg text-muted max-w-3xl text-start leading-relaxed">
          {creative.intro}
        </p>
      )}

      {/* Big Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {creative.items.map((item) => {
          const Icon = itemIcons[item.id] || Video;
          const isActive = item.id === activeTab;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer text-start ${
                isActive
                  ? "bg-primary text-primary-fg border-primary shadow-lg shadow-primary/25 scale-[1.02]"
                  : "bg-surface text-fg border-border hover:border-primary/40"
              }`}
            >
              <span
                className={`p-2.5 rounded-xl ${
                  isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                }`}
              >
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-base font-bold font-display">{item.title}</p>
                <p className={`text-xs ${isActive ? "text-white/80" : "text-muted"}`}>
                  {item.tools.join(" • ")}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Showcase Card */}
      {currentItem && (
        <Card className="p-8 sm:p-12 text-start">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/80 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                <CurrentIcon className="size-7" />
              </span>
              <div>
                <h3 className="text-3xl font-bold text-fg font-display">
                  {currentItem.title}
                </h3>
                <p className="text-sm text-muted mt-1">Creative discipline</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentItem.tools.map((t) => (
                <Chip key={t} variant="primary" size="md">
                  {t}
                </Chip>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-wider font-bold text-muted">
              Capabilities &amp; Workflow
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentItem.points.map((pt, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl bg-surface/70 border border-border"
                >
                  <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-fg leading-relaxed">
                    {pt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
