'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SectionProps } from '../registry';
import SectionHeading from '@/components/ui/SectionHeading';
import ProjectCard from './ProjectCard';
import Button from '@/components/ui/Button';
import { Github } from '@/components/ui/Icons';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection({ content }: SectionProps) {
  const { projects, person } = content;
  const [activeFilter, setActiveFilter] = useState('all');
  const gridRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Extract locale from pathname (e.g. /en, /fr, /ar, /zh)
  const locale = pathname?.split('/')[1] || 'en';

  const filteredItems = projects.items.filter((item) => {
    if (activeFilter === 'all') return true;
    const f = activeFilter.toLowerCase();
    return item.category.some((c) => {
      const lower = c.toLowerCase();
      if (f === 'web')
        return lower.includes('web') || lower.includes('e-commerce') || lower.includes('frontend');
      if (f === 'mobile')
        return (
          lower.includes('mobile') ||
          lower.includes('android') ||
          lower.includes('flutter') ||
          lower.includes('game')
        );
      if (f === 'backend')
        return lower.includes('backend') || lower.includes('api') || lower.includes('java');
      if (f === 'ai')
        return (
          lower.includes('ai') ||
          lower.includes('artificial') ||
          lower.includes('machine') ||
          lower.includes('automation')
        );
      return lower.includes(f);
    });
  });

  // Staggered GSAP entrance animation
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(':scope > div');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 32, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      }
    );
    setTimeout(() => ScrollTrigger.refresh(), 60);
  }, [activeFilter]);

  return (
    <div className="space-y-8 sm:space-y-10">
      <SectionHeading title={projects.title} subtitle={projects.subtitle} />

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-start items-center">
        {Object.entries(projects.filters).map(([key, label]) => {
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer font-display ${
                isActive
                  ? 'bg-primary text-primary-fg shadow-md shadow-primary/25 scale-105 border border-primary'
                  : 'bg-surface/80 text-muted hover:text-fg border border-border/70 hover:border-border'
              }`}
            >
              {label}
            </button>
          );
        })}

        <span className="text-xs font-mono text-muted ml-auto hidden sm:inline-block">
          {filteredItems.length} {filteredItems.length === 1 ? 'project' : 'projects'}
        </span>
      </div>

      {/* ── Responsive Grid: 3 cards per row on desktop, 2 on tablet/mobile ── */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch"
      >
        {filteredItems.map((project) => (
          <div key={project.id} className="h-full flex flex-col transition-all duration-300">
            <ProjectCard project={project} labels={projects.labels} locale={locale} />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-border text-muted font-mono text-sm">
          No projects found in this category.
        </div>
      )}

      {/* See more on GitHub */}
      {person.socials.github && (
        <div className="pt-6 text-center">
          <Button
            href={person.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            size="lg"
            className="group"
          >
            <Github className="size-5 group-hover:scale-110 transition-transform" />
            <span>{projects.seeMore}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
