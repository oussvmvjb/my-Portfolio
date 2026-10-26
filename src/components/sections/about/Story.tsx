import Image from "next/image";
import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import Chip from "@/components/ui/Chip";
import { CheckCircle2, Quote } from "lucide-react";

export default function AboutStory({ content }: SectionProps) {
  const { about, person, languages } = content;

  return (
    <div className="space-y-12">
      <SectionHeading title={about.title} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Sticky Photo Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="relative rounded-3xl overflow-hidden border border-border bg-surface p-2 shadow-xl">
            <div className="relative h-[340px] sm:h-[400px] w-full rounded-2xl overflow-hidden">
              <Image
                src="/images/profile.png"
                alt={person.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 text-start">
              <p className="text-lg font-bold text-fg font-display">{person.name}</p>
              <p className="text-xs text-primary font-semibold">{person.role}</p>
              <p className="text-xs text-muted mt-1">{person.location}</p>
            </div>
          </div>
        </div>

        {/* Narrative Story Column */}
        <div className="lg:col-span-7 space-y-6 text-start">
          <div className="relative p-6 rounded-2xl bg-surface/60 border border-border">
            <Quote className="size-8 text-primary/30 mb-3" />
            <p className="text-lg italic text-fg font-medium leading-relaxed">
              &ldquo;{content.hero.tagline}&rdquo;
            </p>
          </div>

          <div className="space-y-4 text-base sm:text-lg text-muted leading-relaxed">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Quick facts list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {about.facts.map((fact, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-surface/70 border border-border/80"
              >
                <p className="text-xs text-muted font-medium">{fact.label}</p>
                <p className="text-sm font-bold text-fg mt-0.5">{fact.value}</p>
              </div>
            ))}
          </div>

          {/* Soft skills chips */}
          <div className="pt-2">
            <p className="text-xs uppercase tracking-wider font-bold text-muted mb-2">
              Values & Strengths
            </p>
            <div className="flex flex-wrap gap-2">
              {about.softSkills.map((skill) => (
                <Chip key={skill} variant="primary">
                  <CheckCircle2 className="size-3.5" />
                  <span>{skill}</span>
                </Chip>
              ))}
            </div>
          </div>

          {/* Languages */}
          {languages?.items && (
            <div className="pt-4 border-t border-border/70 space-y-3">
              <p className="text-sm font-bold text-fg font-display">
                {languages.title}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {languages.items.map((lang) => (
                  <div key={lang.name} className="p-3 rounded-xl bg-surface border border-border">
                    <div className="flex justify-between items-center text-xs font-semibold mb-1">
                      <span className="text-fg">{lang.name}</span>
                      <span className="text-primary">{lang.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${lang.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
