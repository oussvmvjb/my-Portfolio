import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import { Building2, Calendar, MapPin, Award } from "lucide-react";

export default function ExperienceCards({ content }: SectionProps) {
  const { experience, activities } = content;

  return (
    <div className="space-y-12">
      <SectionHeading title={experience.title} subtitle={experience.subtitle} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
        {experience.items.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between p-6 sm:p-8">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  <Calendar className="size-3.5" />
                  <span>{item.period}</span>
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-fg font-display">
                {item.role}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-muted my-3">
                <span className="flex items-center gap-1.5 text-primary">
                  <Building2 className="size-4" />
                  <span>{item.company}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  <span>{item.location}</span>
                </span>
              </div>

              <ul className="space-y-2.5 text-sm text-muted mt-4">
                {item.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      {activities?.items && (
        <Card className="p-6 bg-surface/80 border-border text-start">
          <h4 className="text-lg font-bold text-fg mb-4 font-display flex items-center gap-2">
            <Award className="size-5 text-primary" />
            <span>{activities.title}</span>
          </h4>
          <ul className="space-y-2 text-sm text-muted">
            {activities.items.map((act, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
