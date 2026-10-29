"use client";

import { useTheme } from "@/lib/theme/ThemeProvider";
import { REGISTRY } from "./registry";
import type { Content } from "@/types/content";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function SectionRenderer({ content }: { content: Content }) {
  const { order, hidden, variants } = useTheme();
  return (
    <>
      {order.filter((id) => !hidden.includes(id)).map((id) => {
        const Variant = REGISTRY[id][variants[id]] ?? Object.values(REGISTRY[id])[0];
        return (
          <section key={id} id={id} className="scroll-mt-20 py-20 md:py-28">
            <div className="mx-auto w-full max-w-6xl px-5">
              <ScrollReveal
                distance={70}
                duration={0.85}
                ease="power3.out"
                start="top 90%"
                end="bottom 10%"
                staggerChildren
                stagger={0.1}
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
