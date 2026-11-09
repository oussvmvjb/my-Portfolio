'use client';

import React from 'react';
import type { ProjectItem } from '@/types/content';
import { ExternalLink } from 'lucide-react';
import { Github } from '@/components/ui/Icons';
import Button from '@/components/ui/Button';

interface ProjectActionsProps {
  project: ProjectItem;
  labels?: {
    code?: string;
    live?: string;
  };
}

export default function ProjectActions({ project, labels }: ProjectActionsProps) {
  const hasGithub = Boolean(project.github && project.github.trim().length > 0);
  const hasLive = Boolean(project.live && project.live.trim().length > 0);

  if (!hasGithub && !hasLive) return null;

  return (
    <div className="flex flex-wrap items-center gap-2.5 pt-3.5 border-t border-border/60 mt-auto">
      {hasGithub && (
        <Button
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          size="sm"
          className="flex-1 min-w-[120px] justify-center text-xs font-semibold"
        >
          <Github className="size-3.5" />
          <span>{labels?.code || 'Source code'}</span>
        </Button>
      )}

      {hasLive && (
        <Button
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="sm"
          className="flex-1 min-w-[120px] justify-center text-xs font-semibold shadow-xs"
        >
          <ExternalLink className="size-3.5" />
          <span>{labels?.live || 'Live Demo'}</span>
        </Button>
      )}
    </div>
  );
}

