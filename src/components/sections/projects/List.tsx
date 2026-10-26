"use client";

import { useState } from "react";
import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/ui/ProjectCard";
import Button from "@/components/ui/Button";
import { Github } from "@/components/ui/Icons";

export default function ProjectsList({ content }: SectionProps) {
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
                  ? "bg-primary text-primary-fg shadow-md shadow-primary/20"
                  : "bg-surface text-muted hover:text-fg border border-border"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* List of Projects */}
      <div className="space-y-4">
        {filteredItems.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            labels={projects.labels}
            layout="list"
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
