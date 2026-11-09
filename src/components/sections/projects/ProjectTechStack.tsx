'use client';

import React from 'react';
import type { ProjectStack } from '@/types/content';
import {
  SiAngular,
  SiTypescript,
  SiThreedotjs,
  SiPython,
  SiFastapi,
  SiPostgresql,
  SiRedis,
  SiGit,
  SiGithub,
  SiKotlin,
  SiFlutter,
  SiDart,
  SiHtml5,
  SiCss,
  SiSass,
  SiN8N,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';
import { Code2, Server, Database, Wrench, Sparkles, Network } from 'lucide-react';

interface ProjectTechStackProps {
  stack: ProjectStack;
  labels?: {
    frontend?: string;
    backend?: string;
    database?: string;
    tools?: string;
  };
}

// Icon mapping for technology badges
function getTechIcon(tech: string) {
  const norm = tech.trim().toLowerCase();
  switch (norm) {
    case 'angular':
      return <SiAngular className="size-3 text-[#DD0031]" />;
    case 'typescript':
      return <SiTypescript className="size-3 text-[#3178C6]" />;
    case 'three.js':
    case 'threejs':
      return <SiThreedotjs className="size-3 text-fg" />;
    case 'python':
      return <SiPython className="size-3 text-[#3776AB]" />;
    case 'fastapi':
      return <SiFastapi className="size-3 text-[#009688]" />;
    case 'postgresql':
    case 'postgres':
      return <SiPostgresql className="size-3 text-[#4169E1]" />;
    case 'redis':
      return <SiRedis className="size-3 text-[#DC382D]" />;
    case 'git':
      return <SiGit className="size-3 text-[#F05032]" />;
    case 'github':
      return <SiGithub className="size-3 text-fg" />;
    case 'java':
      return <FaJava className="size-3 text-[#ED8B00]" />;
    case 'kotlin':
      return <SiKotlin className="size-3 text-[#7F52FF]" />;
    case 'flutter':
      return <SiFlutter className="size-3 text-[#02569B]" />;
    case 'dart':
      return <SiDart className="size-3 text-[#0175C2]" />;
    case 'html':
    case 'html5':
      return <SiHtml5 className="size-3 text-[#E34F26]" />;
    case 'css':
    case 'css3':
      return <SiCss className="size-3 text-[#1572B6]" />;
    case 'scss':
    case 'sass':
      return <SiSass className="size-3 text-[#CC6699]" />;
    case 'n8n':
      return <SiN8N className="size-3 text-[#EA4B71]" />;
    case 'ai apis':
    case 'ai api':
      return <Sparkles className="size-3 text-[#FFBE00]" />;
    case 'microservices':
      return <Network className="size-3 text-[#00CFFF]" />;
    default:
      return null;
  }
}

export default function ProjectTechStack({ stack, labels }: ProjectTechStackProps) {
  const categories: {
    key: keyof ProjectStack;
    title: string;
    icon: React.ReactNode;
    items: string[];
  }[] = [
    {
      key: 'frontend',
      title: labels?.frontend || 'Frontend',
      icon: <Code2 className="size-3 text-primary" />,
      items: stack.frontend || [],
    },
    {
      key: 'backend',
      title: labels?.backend || 'Backend',
      icon: <Server className="size-3 text-emerald-400" />,
      items: stack.backend || [],
    },
    {
      key: 'database',
      title: labels?.database || 'Database',
      icon: <Database className="size-3 text-amber-400" />,
      items: stack.database || [],
    },
    {
      key: 'tools',
      title: labels?.tools || 'Tools',
      icon: <Wrench className="size-3 text-cyan-400" />,
      items: stack.tools || [],
    },
  ];

  const activeCategories = categories.filter((c) => c.items.length > 0);

  if (activeCategories.length === 0) return null;

  return (
    <div className="space-y-3 my-4">
      {activeCategories.map((cat) => (
        <div key={cat.key} className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-muted font-semibold">
            {cat.icon}
            <span>{cat.title}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {cat.items.map((tech) => {
              const icon = getTechIcon(tech);
              return (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-surface/80 border border-border/70 text-fg hover:border-primary/50 transition-colors shadow-xs"
                >
                  {icon}
                  <span>{tech}</span>
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
