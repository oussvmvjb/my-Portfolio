import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import { Video, Palette, Music } from "lucide-react";

export default function CreativeCards({ content }: SectionProps) {
  const { creative } = content;

  const itemIcons: Record<string, typeof Video> = {
    video: Video,
    graphic: Palette,
    music: Music,
  };

  return (
    <div className="space-y-12">
      <SectionHeading title={creative.title} subtitle={creative.subtitle} />

      {creative.intro && (
        <p className="text-base sm:text-lg text-muted max-w-3xl text-start leading-relaxed">
          {creative.intro}
        </p>
      )}

      {/* 3 Creative Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
        {creative.items.map((item) => {
          const Icon = itemIcons[item.id] || Video;
          return (
            <Card
              key={item.id}
              className="flex flex-col justify-between p-6 sm:p-8 hover:border-primary/50 group"
            >
              <div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="size-6" />
                </div>

                <h3 className="text-2xl font-bold text-fg font-display mb-3">
                  {item.title}
                </h3>

                {/* Tool chips */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {item.tools.map((tool) => (
                    <Chip key={tool} variant="primary" size="sm">
                      {tool}
                    </Chip>
                  ))}
                </div>

                {/* Bullet points */}
                <ul className="space-y-2 text-sm text-muted">
                  {item.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
