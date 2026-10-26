"use client";

import { useState, useRef } from "react";
import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/ui/ProjectCard";
import Button from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Github } from "@/components/ui/Icons";

export default function ProjectsCarousel({ content }: SectionProps) {
  const { projects, person } = content;
  const [activeFilter, setActiveFilter] = useState("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredItems = projects.items.filter((item) => {
    if (activeFilter === "all") return true;
    return item.category.includes(activeFilter);
  });

  const scroll = (direction: -1 | 1) => {
    if (scrollRef.current) {
      const scrollAmount = 360 * direction;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionHeading
          title={projects.title}
          subtitle={projects.subtitle}
          className="mb-0"
        />

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll(-1)}
            aria-label="Previous slide"
            className="p-3 rounded-xl border border-border bg-surface text-fg hover:border-primary hover:text-primary transition-all cursor-pointer"
          >
            <ChevronLeft className="size-5 rtl:rotate-180" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Next slide"
            className="p-3 rounded-xl border border-border bg-surface text-fg hover:border-primary hover:text-primary transition-all cursor-pointer"
          >
            <ChevronRight className="size-5 rtl:rotate-180" />
          </button>
        </div>
      </div>

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

      {/* Scroll-Snap Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {filteredItems.map((project) => (
          <div
            key={project.id}
            className="min-w-[300px] sm:min-w-[360px] md:min-w-[400px] max-w-[420px] snap-start shrink-0 flex flex-col"
          >
            <ProjectCard
              project={project}
              labels={projects.labels}
              layout="grid"
            />
          </div>
        ))}
      </div>

      {/* See more on GitHub */}
      {person.socials.github && (
        <div className="pt-4 text-center">
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
