'use client';

/**
 * ProjectDetailsClient.tsx
 * Full-screen cinematic project details page.
 * Sections: Hero → Overview → Features → TechStack → Architecture → Challenges → Gallery → Navigation
 */

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectItem } from '@/types/content';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  Code2,
  Server,
  Database,
  Wrench,
  Sparkles,
  Network,
  Trophy,
  Zap,
  GitBranch,
  BookOpen,
  Layers,
} from 'lucide-react';
import { Github } from '@/components/ui/Icons';
import Button from '@/components/ui/Button';
import ProjectDetailsTechStack from './ProjectDetailsTechStack';
import ProjectDetailsGallery from './ProjectDetailsGallery';
import MarketFlowArchitecture from './MarketFlowArchitecture';

interface ProjectDetailsClientProps {
  project: ProjectItem;
  prevProject: ProjectItem | null;
  nextProject: ProjectItem | null;
  locale: string;
}

export default function ProjectDetailsClient({
  project,
  prevProject,
  nextProject,
  locale,
}: ProjectDetailsClientProps) {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  const isLive = Boolean(project.live?.trim());
  const hasGithub = Boolean(project.github?.trim());
  const isMarketFlow = project.id === 'marketflow';

  // Animate on mount
  useEffect(() => {
    if (!heroRef.current) return;
    const el = heroRef.current;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return () => cancelAnimationFrame(raf);
  }, [project.id]);

  const backHref = `/${locale}#projects`;

  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* ── Sticky top nav bar ───────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-5 py-3 flex items-center gap-4">
          <a
            href={backHref}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg transition-colors font-mono"
          >
            <ChevronLeft className="size-4" />
            All Projects
          </a>
          <span className="text-border">|</span>
          <span className="text-sm font-mono text-muted truncate">{project.title}</span>
          <div className="ml-auto flex items-center gap-2">
            {hasGithub && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/70 bg-surface hover:border-primary/40 transition-colors"
              >
                <Github className="size-3.5" />
                Code
              </a>
            )}
            {isLive && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-fg shadow-md shadow-primary/20 hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="size-3.5" />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-5 pb-24">
        {/* ── Hero Section ─────────────────────────────────────────────────── */}
        <div ref={heroRef} className="pt-16 pb-12">
          {/* Category badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.category.map((cat) => (
              <span
                key={cat}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-surface border border-border/70 text-muted"
              >
                {cat}
              </span>
            ))}
            {isLive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-semibold">
                <span className="relative flex size-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500" />
                </span>
                LIVE
              </span>
            )}
            {project.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFC400]/15 border border-[#FFC400]/30 text-[#FFC400] text-[11px] font-mono font-semibold">
                <Sparkles className="size-3" />
                FEATURED
              </span>
            )}
          </div>

          {/* Title + tagline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-fg mb-4 leading-tight">
            {project.title}
          </h1>
          {project.tagline && (
            <p className="text-lg sm:text-xl text-muted max-w-3xl mb-8 leading-relaxed">
              {project.tagline}
            </p>
          )}

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {hasGithub && (
              <Button
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
                className="gap-2"
              >
                <Github className="size-5" />
                View Source Code
              </Button>
            )}
            {isLive && (
              <Button
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
                className="gap-2"
              >
                <ExternalLink className="size-5" />
                Live Demo
              </Button>
            )}
            {project.relatedRepositories && project.relatedRepositories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.relatedRepositories.map((repo) => (
                  <a
                    key={repo.url}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border border-border/70 bg-surface hover:border-primary/50 text-muted hover:text-fg transition-colors"
                  >
                    <GitBranch className="size-3.5" />
                    {repo.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Accent divider ─────────────────────────────────────────────── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FFC400]/40 to-transparent mb-16" />

        {/* ── Gallery ─────────────────────────────────────────────────────── */}
        {project.images && project.images.length > 0 && (
          <Section icon={<Layers className="size-5 text-[#FFC400]" />} title="Gallery">
            <ProjectDetailsGallery project={project} />
          </Section>
        )}

        {/* ── Overview / Problem / Solution ────────────────────────────────── */}
        {(project.overview || project.problem || project.solution) && (
          <Section icon={<BookOpen className="size-5 text-[#FFC400]" />} title="Project Overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.overview && (
                <div className="md:col-span-3">
                  <p className="text-fg/90 leading-relaxed text-base">{project.overview}</p>
                </div>
              )}
              {project.problem && (
                <OverviewCard
                  label="The Challenge"
                  color="amber"
                  icon={<Zap className="size-4 text-amber-400" />}
                  text={project.problem}
                />
              )}
              {project.solution && (
                <OverviewCard
                  label="The Solution"
                  color="emerald"
                  icon={<Sparkles className="size-4 text-emerald-400" />}
                  text={project.solution}
                />
              )}
            </div>
          </Section>
        )}

        {/* ── Achievements (highlighted for 619) ─────────────────────────── */}
        {project.achievements && project.achievements.length > 0 && (
          <Section icon={<Trophy className="size-5 text-[#FFC400]" />} title="Achievements">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.achievements.map((ach, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl bg-[#FFC400]/5 border border-[#FFC400]/20 hover:border-[#FFC400]/40 transition-colors"
                >
                  <span className="size-6 rounded-full bg-[#FFC400]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Trophy className="size-3 text-[#FFC400]" />
                  </span>
                  <span className="text-sm text-fg leading-relaxed">{ach}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Key Features ─────────────────────────────────────────────────── */}
        {project.features && project.features.length > 0 && (
          <Section icon={<Sparkles className="size-5 text-[#FFC400]" />} title="Key Features">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.features.map((feat, i) => (
                <FeatureCard key={i} index={i} title={feat.title} description={feat.description} />
              ))}
            </div>
          </Section>
        )}

        {/* ── Technical Stack ──────────────────────────────────────────────── */}
        <Section icon={<Code2 className="size-5 text-[#FFC400]" />} title="Technical Stack">
          <ProjectDetailsTechStack stack={project.stack} />
        </Section>

        {/* ── MarketFlow Architecture Diagram ──────────────────────────────── */}
        {isMarketFlow && project.architectureServices && (
          <Section
            icon={<Network className="size-5 text-[#FFC400]" />}
            title="Microservices Architecture"
          >
            <MarketFlowArchitecture services={project.architectureServices} />
          </Section>
        )}

        {/* ── Development Challenges ───────────────────────────────────────── */}
        {project.challenges && project.challenges.length > 0 && (
          <Section icon={<Zap className="size-5 text-[#FFC400]" />} title="Development Challenges">
            <div className="space-y-3">
              {project.challenges.map((ch, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl bg-surface/70 border border-border/60 hover:border-[#FFC400]/30 transition-colors group"
                >
                  <span className="font-mono text-xs text-[#FFC400] mt-0.5 shrink-0 w-5 group-hover:text-[#FFC400]/80">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm text-muted leading-relaxed">{ch}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Project Navigation ───────────────────────────────────────────── */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Previous */}
            <div>
              {prevProject && (
                <a
                  href={`/${locale}/projects/${prevProject.id}`}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-surface/50 hover:border-[#FFC400]/40 hover:bg-surface transition-all"
                >
                  <ArrowLeft className="size-4 text-muted group-hover:text-[#FFC400] transition-colors shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-muted uppercase tracking-wider mb-0.5">
                      Previous
                    </div>
                    <div className="text-sm font-semibold text-fg truncate">{prevProject.title}</div>
                  </div>
                </a>
              )}
            </div>

            {/* Back to all */}
            <div className="text-center">
              <a
                href={backHref}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono text-muted hover:text-fg border border-border/60 hover:border-primary/40 bg-surface/50 hover:bg-surface transition-all"
              >
                All Projects
              </a>
            </div>

            {/* Next */}
            <div className="flex justify-end">
              {nextProject && (
                <a
                  href={`/${locale}/projects/${nextProject.id}`}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-surface/50 hover:border-[#FFC400]/40 hover:bg-surface transition-all"
                >
                  <div className="min-w-0 text-right">
                    <div className="text-[10px] font-mono text-muted uppercase tracking-wider mb-0.5">
                      Next
                    </div>
                    <div className="text-sm font-semibold text-fg truncate">{nextProject.title}</div>
                  </div>
                  <ArrowRight className="size-4 text-muted group-hover:text-[#FFC400] transition-colors shrink-0" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helper sub-components ──────────────────────────────────────────────────

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <span className="p-2 rounded-lg bg-[#FFC400]/10 border border-[#FFC400]/20">{icon}</span>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-fg">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function OverviewCard({
  label,
  text,
  color,
  icon,
}: {
  label: string;
  text: string;
  color: 'amber' | 'emerald' | 'cyan';
  icon: React.ReactNode;
}) {
  const colorMap = {
    amber: 'border-amber-500/20 bg-amber-500/5',
    emerald: 'border-emerald-500/20 bg-emerald-500/5',
    cyan: 'border-cyan-500/20 bg-cyan-500/5',
  };
  return (
    <div className={`p-5 rounded-xl border ${colorMap[color]} md:col-span-${color === 'amber' ? '1' : '2'}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted">
          {label}
        </span>
      </div>
      <p className="text-sm text-fg/80 leading-relaxed">{text}</p>
    </div>
  );
}

function FeatureCard({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) {
  return (
    <div className="p-5 rounded-xl bg-surface/70 border border-border/60 hover:border-[#FFC400]/30 hover:-translate-y-0.5 transition-all group">
      <div className="flex items-start gap-3 mb-3">
        <span className="size-7 rounded-lg bg-[#FFC400]/10 border border-[#FFC400]/20 flex items-center justify-center text-[11px] font-mono font-bold text-[#FFC400] shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="text-sm font-semibold text-fg leading-snug group-hover:text-[#FFC400] transition-colors">
          {title}
        </h3>
      </div>
      <p className="text-xs text-muted leading-relaxed">{description}</p>
    </div>
  );
}

