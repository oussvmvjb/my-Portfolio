"use client";

import { useTheme } from "@/lib/theme/ThemeProvider";
import { REGISTRY } from "./registry";
import type { Content } from "@/types/content";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function SectionRenderer({ content }: { content: Content }) {
  const { order, hidden, variants } = useTheme();
  const visibleSections = order.filter((id) => !hidden.includes(id));

  return (
    <>
      {visibleSections.map((id, index) => {
        const Variant = REGISTRY[id][variants[id]] ?? Object.values(REGISTRY[id])[0];
        const isHero = id === "home" || index === 0;

        return (
          <section key={id} id={id} className="scroll-mt-20 py-20 md:py-28">
            <div className="mx-auto w-full max-w-6xl px-5">
              <ScrollReveal
                isHero={isHero}
                distance={35}
                duration={0.9}
                scaleFrom={0.98}
                blurFrom={8}
                ease="power3.out"
                start="top 85%"
                staggerChildren
                stagger={0.08}
              >
                <Variant content={content} />
              </ScrollReveal>
            </div>
          </section>
        );
      })}
    </>
  );
}
