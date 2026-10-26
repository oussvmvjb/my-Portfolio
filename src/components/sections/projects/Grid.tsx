"use client";

import { useState } from "react";
import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/ui/ProjectCard";
import Button from "@/components/ui/Button";
import { Github } from "@/components/ui/Icons";

export default function ProjectsGrid({ content }: SectionProps) {
  const { projects, person } = content;
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredItems = projects.items.filter((item) => {
    if (activeFilter === "all") return true;
    return item.category.includes(activeFilter);
  });

  return (
    <div className="space-y-10">
      <SectionHeading title={projects.title} subtitle={projects.subtitle} />

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-start">
        {Object.entries(projects.filters).map(([key, label]) => {
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer font-display ${
                isActive
                  ? "bg-primary text-primary-fg shadow-md shadow-primary/20 scale-105"
                  : "bg-surface text-muted hover:text-fg border border-border"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            labels={projects.labels}
            layout="grid"
          />
        ))}
      </div>

      {/* See more on GitHub */}
      {person.socials.github && (
        <div className="pt-6 text-center">
          <Button
            href={person.socials.github}
            target="_blank"
            variant="secondary"
            size="lg"
          >
            <Github className="size-5" />
            <span>{projects.seeMore}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
