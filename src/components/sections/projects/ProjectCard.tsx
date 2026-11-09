'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectItem } from '@/types/content';
import Card from '@/components/ui/Card';
import ProjectTechStack from './ProjectTechStack';
import ProjectImageCarousel from './ProjectImageCarousel';
import ProjectActions from './ProjectActions';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: ProjectItem;
  labels: {
    code: string;
    live: string;
    featured: string;
    frontend?: string;
    backend?: string;
    database?: string;
    tools?: string;
  };
  layout?: 'grid' | 'list';
  locale?: string;
}

export default function ProjectCard({ project, labels, layout = 'grid', locale = 'en' }: ProjectCardProps) {
  const isLive = Boolean(project.live && project.live.trim().length > 0);
  const isList = layout === 'list';
  const router = useRouter();

  const detailsHref = `/${locale}/projects/${project.id}`;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking a link/button (let them handle their own events)
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) return;
    router.push(detailsHref);
  };

  return (
    <Card
      onClick={handleCardClick}
      className={`group flex flex-col justify-between h-full relative overflow-hidden bg-surface/70 backdrop-blur-md border border-border/70 hover:border-[#FFBE00]/50 hover:shadow-[0_8px_30px_rgba(255,190,0,0.08)] transition-all duration-300 hover:-translate-y-1.5 p-5 sm:p-6 rounded-2xl cursor-pointer ${
        isList ? 'md:flex-row md:items-center md:gap-8' : ''
      }`}
    >
      {/* Top ambient hover glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFBE00]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#FFBE00]/10 transition-colors" />

      {/* ── A. Project Header ──────────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-[10px] tracking-widest uppercase text-muted px-2 py-0.5 rounded bg-surface border border-border/60">
                {project.id}
              </span>

              {project.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FFBE00]/15 px-2 py-0.5 text-[10px] font-semibold text-[#FFBE00] border border-[#FFBE00]/30 font-mono">
                  <Sparkles className="size-2.5" />
                  {labels.featured}
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-fg group-hover:text-primary transition-colors font-display line-clamp-1">
              {project.title}
            </h3>
          </div>

          {/* Small green LIVE indicator with glowing pulse dot */}
          {isLive && (
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-semibold shrink-0">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
              </span>
              <span>LIVE</span>
            </div>
          )}
        </div>

        {/* ── B. Project Description ────────────────────────────────────────── */}
        <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-3 min-h-[3.75rem]">
          {project.description}
        </p>

        {/* ── C. Categorized Technology Stack ───────────────────────────────── */}
        <ProjectTechStack stack={project.stack} labels={labels} />
      </div>

      {/* ── D. Project Images – React Bits Carousel ──────────────────────────── */}
      <div className="my-2">
        <ProjectImageCarousel project={project} />
      </div>

      {/* ── E. Project Actions + View Details ──────────────────────────────── */}
      <div className="mt-auto space-y-2.5">
        {/* View details link */}
        <a
          href={detailsHref}
          className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl text-xs font-semibold font-mono border border-[#FFC400]/30 bg-[#FFC400]/5 text-[#FFC400] hover:bg-[#FFC400]/10 hover:border-[#FFC400]/50 transition-all group/btn"
          onClick={(e) => e.stopPropagation()}
        >
          <span>View Case Study</span>
          <ArrowRight className="size-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </a>

        <ProjectActions project={project} labels={labels} />
      </div>
    </Card>
  );
}
