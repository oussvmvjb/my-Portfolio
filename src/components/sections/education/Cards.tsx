import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import { GraduationCap, MapPin, Calendar, Sparkles } from "lucide-react";

export default function EducationCards({ content }: SectionProps) {
  const { education } = content;

  return (
    <div className="space-y-12">
      <SectionHeading title={education.title} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-start">
        {education.items.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between p-6 sm:p-7">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  <Calendar className="size-3.5" />
                  <span>{item.period}</span>
                </span>
                {item.status && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-fg animate-pulse">
                    <Sparkles className="size-3" />
                    <span>{item.status}</span>
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-fg font-display mt-2">
                {item.degree}
              </h3>

              <div className="flex flex-col gap-1 text-sm font-semibold text-muted my-3">
                <span className="flex items-center gap-1.5 text-primary">
                  <GraduationCap className="size-4" />
                  <span>{item.school}</span>
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted">
                  <MapPin className="size-3" />
                  <span>{item.location}</span>
                </span>
              </div>

              {item.details.length > 0 && (
                <ul className="space-y-2 text-xs sm:text-sm text-muted mt-4 border-t border-border/60 pt-4">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
