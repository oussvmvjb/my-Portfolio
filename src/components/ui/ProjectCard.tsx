import { ExternalLink, Sparkles } from "lucide-react";
import { Github } from "@/components/ui/Icons";
import type { ProjectItem } from "@/types/content";
import Card from "./Card";
import Chip from "./Chip";
import Button from "./Button";

interface ProjectCardProps {
  project: ProjectItem;
  labels: {
    code: string;
    live: string;
    featured: string;
  };
  layout?: "grid" | "list";
}

export default function ProjectCard({
  project,
  labels,
  layout = "grid",
}: ProjectCardProps) {
  const isList = layout === "list";

  return (
    <Card
      className={`group flex flex-col justify-between h-full relative overflow-hidden ${
        isList ? "md:flex-row md:items-center md:gap-8" : ""
      }`}
    >
      {/* Top / Header info */}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl md:text-2xl font-bold text-fg group-hover:text-primary transition-colors font-display">
              {project.title}
            </h3>
            {project.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/25">
                <Sparkles className="size-3" />
                {labels.featured}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm md:text-base text-muted leading-relaxed mb-6">
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((t) => (
            <Chip key={t} size="sm">
              {t}
            </Chip>
          ))}
        </div>
      </div>

      {/* Action buttons (only show if link is present) */}
      {(project.github || project.live) && (
        <div
          className={`flex flex-wrap items-center gap-3 pt-4 border-t border-border/60 ${
            isList ? "md:border-t-0 md:pt-0 md:flex-col md:items-end" : ""
          }`}
        >
          {project.github && (
            <Button
              href={project.github}
              target="_blank"
              variant="secondary"
              size="sm"
            >
              <Github className="size-4" />
              <span>{labels.code}</span>
            </Button>
          )}

          {project.live && (
            <Button
              href={project.live}
              target="_blank"
              variant="primary"
              size="sm"
            >
              <ExternalLink className="size-4" />
              <span>{labels.live}</span>
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
