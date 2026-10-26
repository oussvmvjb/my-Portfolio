import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import Timeline, { TimelineItem } from "@/components/ui/Timeline";
import Card from "@/components/ui/Card";
import { GraduationCap, MapPin } from "lucide-react";

export default function EducationTimeline({ content }: SectionProps) {
  const { education } = content;

  return (
    <div className="space-y-12">
      <SectionHeading title={education.title} />

      <div className="max-w-4xl text-start">
        <Timeline>
          {education.items.map((item) => (
            <TimelineItem
              key={item.id}
              title={item.degree}
              period={item.period}
              badge={item.status || undefined}
            >
              <Card className="mt-3 p-5 sm:p-6 bg-surface/70">
                <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-fg mb-3">
                  <span className="flex items-center gap-1.5 text-primary">
                    <GraduationCap className="size-4" />
                    <span>{item.school}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 text-muted">
                    <MapPin className="size-3.5" />
                    <span>{item.location}</span>
                  </span>
                </div>

                {item.details.length > 0 && (
                  <ul className="space-y-2 text-sm text-muted">
                    {item.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </div>
  );
}
