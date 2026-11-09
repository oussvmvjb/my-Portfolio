'use client';

/**
 * ProjectDetailsTechStack.tsx
 * Enlarged tech stack display for the project details page.
 * Shows all 4 categories with large icons and descriptions.
 */

import React from 'react';
import type { ProjectStack } from '@/types/content';
import {
  SiAngular, SiTypescript, SiThreedotjs, SiPython, SiFastapi,
  SiPostgresql, SiRedis, SiGit, SiGithub, SiKotlin, SiFlutter,
  SiDart, SiHtml5, SiCss, SiSass, SiN8N, SiNextdotjs, SiDocker,
  SiJenkins, SiElasticsearch, SiSpringboot, SiPytorch, SiOpencv,
  SiSqlalchemy,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';
import { Code2, Server, Database, Wrench, Sparkles, Network, Brain } from 'lucide-react';

function getTechIconLarge(tech: string) {
  const norm = tech.trim().toLowerCase();
  const cls = 'size-5';
  switch (norm) {
    case 'angular': return <SiAngular className={`${cls} text-[#DD0031]`} />;
    case 'typescript': return <SiTypescript className={`${cls} text-[#3178C6]`} />;
    case 'three.js': case 'threejs': return <SiThreedotjs className={`${cls} text-fg`} />;
    case 'python': return <SiPython className={`${cls} text-[#3776AB]`} />;
    case 'fastapi': return <SiFastapi className={`${cls} text-[#009688]`} />;
    case 'postgresql': case 'postgres': return <SiPostgresql className={`${cls} text-[#4169E1]`} />;
    case 'redis': return <SiRedis className={`${cls} text-[#DC382D]`} />;
    case 'git': return <SiGit className={`${cls} text-[#F05032]`} />;
    case 'github': return <SiGithub className={`${cls} text-fg`} />;
    case 'java': return <FaJava className={`${cls} text-[#ED8B00]`} />;
    case 'kotlin': return <SiKotlin className={`${cls} text-[#7F52FF]`} />;
    case 'flutter': return <SiFlutter className={`${cls} text-[#02569B]`} />;
    case 'dart': return <SiDart className={`${cls} text-[#0175C2]`} />;
    case 'html': case 'html5': return <SiHtml5 className={`${cls} text-[#E34F26]`} />;
    case 'css': case 'css3': return <SiCss className={`${cls} text-[#1572B6]`} />;
    case 'scss': case 'sass': return <SiSass className={`${cls} text-[#CC6699]`} />;
    case 'n8n': return <SiN8N className={`${cls} text-[#EA4B71]`} />;
    case 'next.js': case 'nextjs': return <SiNextdotjs className={`${cls} text-fg`} />;
    case 'docker': return <SiDocker className={`${cls} text-[#2496ED]`} />;
    case 'jenkins': return <SiJenkins className={`${cls} text-[#D33833]`} />;
    case 'elasticsearch': return <SiElasticsearch className={`${cls} text-[#FEC514]`} />;
    case 'spring boot': case 'springboot': return <SiSpringboot className={`${cls} text-[#6DB33F]`} />;
    case 'pytorch': return <SiPytorch className={`${cls} text-[#EE4C2C]`} />;
    case 'opencv': return <SiOpencv className={`${cls} text-[#5C3EE8]`} />;
    case 'sqlalchemy': return <SiSqlalchemy className={`${cls} text-[#D71F00]`} />;
    case 'microservices': return <Network className={`${cls} text-[#00CFFF]`} />;
    case 'ai apis': case 'groq': case 'gemini': return <Brain className={`${cls} text-[#FFC400]`} />;
    case 'cloudinary': return <Sparkles className={`${cls} text-[#3448C5]`} />;
    default: return <Sparkles className={`${cls} text-muted`} />;
  }
}

interface Props {
  stack: ProjectStack;
}

const CATEGORIES = [
  {
    key: 'frontend' as keyof ProjectStack,
    label: 'Frontend',
    icon: <Code2 className="size-4 text-primary" />,
    accent: 'border-primary/20 bg-primary/5',
  },
  {
    key: 'backend' as keyof ProjectStack,
    label: 'Backend',
    icon: <Server className="size-4 text-emerald-400" />,
    accent: 'border-emerald-500/20 bg-emerald-500/5',
  },
  {
    key: 'database' as keyof ProjectStack,
    label: 'Database & Storage',
    icon: <Database className="size-4 text-amber-400" />,
    accent: 'border-amber-500/20 bg-amber-500/5',
  },
  {
    key: 'tools' as keyof ProjectStack,
    label: 'Tools & Integrations',
    icon: <Wrench className="size-4 text-cyan-400" />,
    accent: 'border-cyan-500/20 bg-cyan-500/5',
  },
];

export default function ProjectDetailsTechStack({ stack }: Props) {
  const active = CATEGORIES.filter((c) => stack[c.key].length > 0);
  if (active.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {active.map((cat) => (
        <div
          key={cat.key}
          className={`p-5 rounded-xl border ${cat.accent} transition-all`}
        >
          <div className="flex items-center gap-2 mb-4">
            {cat.icon}
            <span className="text-sm font-semibold font-mono uppercase tracking-wider text-muted">
              {cat.label}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stack[cat.key].map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-surface/80 border border-border/70 text-fg hover:border-primary/40 transition-colors"
              >
                {getTechIconLarge(tech)}
                <span>{tech}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

