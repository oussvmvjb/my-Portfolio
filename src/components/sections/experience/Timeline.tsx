import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import Timeline, { TimelineItem } from "@/components/ui/Timeline";
import Card from "@/components/ui/Card";
import SplitText from "@/components/ui/SplitText";
import { Briefcase, Building2, MapPin } from "lucide-react";

export default function ExperienceTimeline({ content }: SectionProps) {
  const { experience, activities } = content;

  return (
    <div className="space-y-12">
      <SectionHeading title={experience.title} subtitle={experience.subtitle} />

      <div className="max-w-4xl text-start">
        <Timeline>
          {experience.items.map((item) => (
            <TimelineItem
              key={item.id}
              title={
                <SplitText
                  text={item.role}
                  className="text-lg md:text-xl font-bold text-fg font-display group-hover:text-primary transition-colors"
                  effect="rise"
                  splitType="words"
                  delay={30}
                  duration={0.8}
                />
              }
              period={item.period}
            >
              <Card className="mt-3 p-5 sm:p-6 bg-surface/70">
                <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-fg/90 mb-4">
                  <span className="flex items-center gap-1.5 text-primary">
                    <Building2 className="size-4" />
                    <span>{item.company}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 text-muted">
                    <MapPin className="size-3.5" />
                    <span>{item.location}</span>
                  </span>
                </div>

                <ul className="space-y-2 text-sm text-muted">
                  {item.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </TimelineItem>
          ))}
        </Timeline>
      </div>

      {/* Activities / Leadership Block */}
      {activities?.items && (
        <Card className="max-w-4xl p-6 bg-surface/80 border-border">
          <h4 className="text-lg font-bold text-fg mb-4 font-display flex items-center gap-2">
            <Briefcase className="size-5 text-primary" />
            <SplitText
              text={activities.title}
              className="text-lg font-bold text-fg font-display"
              effect="rise"
              splitType="chars"
              delay={40}
              duration={1}
            />
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
