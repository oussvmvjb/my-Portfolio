import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import LanguageHeartRating from "@/components/ui/LanguageHeartRating";
import { CheckCircle2, Globe2, GraduationCap, MapPin, Target } from "lucide-react";

export default function AboutCards({ content }: SectionProps) {
  const { about, languages } = content;

  const factIcons = [
    <MapPin key="map" className="size-5 text-primary" />,
    <GraduationCap key="grad" className="size-5 text-primary" />,
    <Target key="target" className="size-5 text-primary" />,
    <Globe2 key="globe" className="size-5 text-primary" />,
  ];

  return (
    <div className="space-y-12">
      <SectionHeading title={about.title} />

      {/* Main paragraphs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4 text-base sm:text-lg text-muted leading-relaxed text-start">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          {/* Soft skills */}
          <div className="pt-4">
            <p className="text-sm font-bold text-fg mb-3 font-display uppercase tracking-wider">
              Core Strengths
            </p>
            <div className="flex flex-wrap gap-2">
              {about.softSkills.map((skill) => (
                <Chip key={skill} variant="primary" size="md">
                  <CheckCircle2 className="size-3.5" />
                  <span>{skill}</span>
                </Chip>
              ))}
            </div>
          </div>
        </div>

        {/* Facts Grid Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {about.facts.map((fact, idx) => (
            <Card key={idx} className="flex flex-col justify-between p-5">
              <div className="mb-3">{factIcons[idx % factIcons.length]}</div>
              <div>
                <p className="text-xs text-muted uppercase font-semibold tracking-wider">
                  {fact.label}
                </p>
                <p className="text-sm font-bold text-fg mt-1">
                  {fact.value}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Languages bar (integrated inside About) with Pixel Heart Lottie ratings */}
      {languages?.items && (
        <Card className="p-6 md:p-8 border border-border/80 bg-surface/40 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-fg font-display text-start">
              {languages.title}
            </h3>
            <span className="text-xs font-mono text-muted/70 uppercase tracking-wider hidden sm:inline-flex">
              Pixel Heart Rating
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {languages.items.map((lang) => (
              <LanguageHeartRating
                key={lang.name}
                name={lang.name}
                level={lang.level}
                score={lang.score}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
