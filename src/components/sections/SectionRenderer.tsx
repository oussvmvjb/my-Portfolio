"use client";

import { useTheme } from "@/lib/theme/ThemeProvider";
import { REGISTRY } from "./registry";
import type { Content } from "@/types/content";

export default function SectionRenderer({ content }: { content: Content }) {
  const { order, hidden, variants } = useTheme();
  return (
    <>
      {order.filter((id) => !hidden.includes(id)).map((id) => {
        const Variant = REGISTRY[id][variants[id]] ?? Object.values(REGISTRY[id])[0];
        return (
          <section key={id} id={id} className="scroll-mt-20 py-20 md:py-28">
            <div className="mx-auto w-full max-w-6xl px-5">
              <Variant content={content} />
            </div>
          </section>
        );
      })}
    </>
  );
}
