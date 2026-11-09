'use client';

import React, { useMemo } from 'react';
import type { ProjectItem } from '@/types/content';
import Carousel, { CarouselEntry } from '@/components/ui/ReactBitsCarousel';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { Monitor, Smartphone, Terminal, Sparkles, Layers } from 'lucide-react';

interface ProjectImageCarouselProps {
  project: ProjectItem;
}

export default function ProjectImageCarousel({ project }: ProjectImageCarouselProps) {
  const { mode } = useTheme();

  // Determine effective theme
  const carouselTheme: 'dark' | 'light' = useMemo(() => {
    if (typeof window !== 'undefined') {
      const isDark =
        mode === 'dark' ||
        (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      return isDark ? 'dark' : 'light';
    }
    return mode === 'light' ? 'light' : 'dark';
  }, [mode]);

  // Construct items: use real screenshots if available, otherwise generate polished cyber preview slides
  const items: CarouselEntry[] = useMemo(() => {
    if (project.images && project.images.length > 0) {
      return project.images.map((img, idx) => ({
        id: `${project.id}-img-${idx}`,
        image: img.src,
        alt: img.alt || `${project.title} screenshot ${idx + 1}`,
        title: project.title,
      }));
    }

    // Polished futuristic placeholder slides matching the Bumblebee / Transformers theme
    const isMobile = project.category.some((c) => /mobile|flutter|android|game/i.test(c));
    const isAi = project.category.some((c) => /ai|artificial|machine/i.test(c));

    const slide1 = (
      <div
        key="slide-1"
        className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-br from-[#12141A] via-[#0E1015] to-[#181C24] border border-border/40 rounded-xl relative overflow-hidden select-none"
      >
        {/* Subtle cyber grid background */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #FFBE00 1px, transparent 1px),
                              linear-gradient(to bottom, #FFBE00 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Top window controls */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-red-500/80" />
            <div className="size-2 rounded-full bg-amber-500/80" />
            <div className="size-2 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-mono text-[10px] text-zinc-500 tracking-wider">
            {project.id}.app
          </span>
          <span className="size-2 rounded-full bg-[#FFBE00]/80 animate-pulse" />
        </div>

        {/* Center UI preview illustration */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 my-2 text-center">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 shadow-inner text-[#FFBE00]">
            {isMobile ? (
              <Smartphone className="size-7" />
            ) : isAi ? (
              <Sparkles className="size-7 text-[#00CFFF]" />
            ) : (
              <Monitor className="size-7" />
            )}
          </div>
          <span className="font-display text-sm font-bold text-fg tracking-wide line-clamp-1">
            {project.title}
          </span>
          <span className="font-mono text-[10px] text-muted">
            {project.category[0] || 'System Architecture'}
          </span>
        </div>

        {/* Bottom status bar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-zinc-500">
          <span>STATUS: COMPILED</span>
          <span className="text-[#FFBE00] font-semibold">VIEW 01 // OVERVIEW</span>
        </div>
      </div>
    );

    const slide2 = (
      <div
        key="slide-2"
        className="w-full h-full flex flex-col justify-between p-4 bg-gradient-to-br from-[#0F1218] via-[#0A0D12] to-[#151922] border border-border/40 rounded-xl relative overflow-hidden select-none"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-1.5">
            <Terminal className="size-3 text-[#00CFFF]" />
            <span className="font-mono text-[10px] text-zinc-400">STACK MATRIX</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-500">REV.2</span>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-1.5 my-2">
          {project.stack.frontend.length > 0 && (
            <div className="flex items-center justify-between text-xs font-mono bg-white/[0.02] px-2.5 py-1.5 rounded border border-white/5">
              <span className="text-zinc-400">UI</span>
              <span className="text-[#FFBE00] font-semibold truncate max-w-[150px]">
                {project.stack.frontend.join(' · ')}
              </span>
            </div>
          )}
          {project.stack.backend.length > 0 && (
            <div className="flex items-center justify-between text-xs font-mono bg-white/[0.02] px-2.5 py-1.5 rounded border border-white/5">
              <span className="text-zinc-400">API</span>
              <span className="text-emerald-400 font-semibold truncate max-w-[150px]">
                {project.stack.backend.join(' · ')}
              </span>
            </div>
          )}
          {project.stack.tools.length > 0 && (
            <div className="flex items-center justify-between text-xs font-mono bg-white/[0.02] px-2.5 py-1.5 rounded border border-white/5">
              <span className="text-zinc-400">OPS</span>
              <span className="text-cyan-400 font-semibold truncate max-w-[150px]">
                {project.stack.tools.join(' · ')}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-zinc-500">
          <span>PIPELINE VERIFIED</span>
          <span className="text-[#00CFFF] font-semibold">VIEW 02 // MATRIX</span>
        </div>
      </div>
    );

    return [slide1, slide2];
  }, [project]);

  return (
    <div className="relative w-full my-3 overflow-hidden rounded-xl bg-surface/40 border border-border/50">
      <div style={{ height: '220px', position: 'relative' }} className="w-full">
        <Carousel
          items={items}
          baseWidth={260}
          aspectRatio={1.4}
          effect="tilt"
          indicator="dots"
          frame={false}
          arrows={false}
          loop={false}
          autoplay={false}
          theme={carouselTheme}
          peek={0}
          gap={12}
          radius={12}
          draggable
          round={false}
        />
      </div>
    </div>
  );
}

