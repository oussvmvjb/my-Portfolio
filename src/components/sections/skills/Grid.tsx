import type { SectionProps } from "../registry";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import { Sparkles, Terminal, Layers, Smartphone, GitBranch, Palette } from "lucide-react";

export default function SkillsGrid({ content }: SectionProps) {
  const { skills } = content;

  const groupIcons: Record<string, typeof Terminal> = {
    frontend: Layers,
    backend: Terminal,
    mobile: Smartphone,
    devops: GitBranch,
    design: Palette,
  };

  return (
    <div className="space-y-12">
      <SectionHeading title={skills.title} subtitle={skills.subtitle} />

      {/* Grid of skill categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.groups.map((group) => {
          const Icon = groupIcons[group.id] || Terminal;
          return (
            <Card key={group.id} className="flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="text-xl font-bold text-fg font-display">
                    {group.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {group.items.map((tech) => (
                    <Chip key={tech} variant="default" size="md">
                      {tech}
                    </Chip>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Currently Improving Block */}
      {skills.currentGoals && (
        <Card className="p-6 md:p-8 border-primary/30 bg-primary/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-fg">
                <Sparkles className="size-4" />
              </span>
              <div>
                <h4 className="text-lg font-bold text-fg font-display">
                  {skills.currentGoals.title}
                </h4>
                <p className="text-xs text-muted">Constantly expanding technical depth</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.currentGoals.items.map((item) => (
                <Chip key={item} variant="primary" size="md">
                  {item}
                </Chip>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
