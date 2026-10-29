'use client';

import type { ReactNode } from "react";
import SplitFlapText from "./SplitFlapText";
import ScrollFloat from "./ScrollFloat";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  badge?: string;
  className?: string;
  useSplitFlap?: boolean;
  children?: ReactNode;
}

export default function SectionHeading({
  title,
  subtitle,
  align = "start",
  badge,
  className = "",
  useSplitFlap = true,
  children,
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={`mb-12 ${
        isCentered ? "text-center mx-auto max-w-3xl" : "text-start max-w-3xl"
      } ${className}`}
    >
      {badge && (
        <span className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
          {badge}
        </span>
      )}
      <ScrollFloat
        effect="float"
        splitBy="chars"
        direction="up"
        order="start"
        animationDuration={0.9}
        ease="back.inOut(2)"
        scrollStart="center bottom+=50%"
        scrollEnd="bottom bottom-=40%"
        stagger={0.03}
        distance={80}
        stretch={1.8}
        smoothing={0}
        containerClassName={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-fg font-display leading-tight ${isCentered ? "mx-auto" : ""}`}
        textClassName="flex-wrap"
      >
        {title}
      </ScrollFloat>
      {subtitle && (
        useSplitFlap ? (
          <div className="mt-4 flex max-w-full overflow-x-auto">
            <SplitFlapText
              text={subtitle}
              fontSize={17}
              gap={3}
              tileRadius={4}
              flipsPerChar={5}
              flipDuration={0.08}
              tileColor="#111827"
              textColor="#f8fafc"
              align={align === "center" ? "center" : "left"}
            />
          </div>
        ) : (
          <p className="mt-3 text-base md:text-lg text-muted leading-relaxed">
            {subtitle}
          </p>
        )
      )}
      {children}
    </div>
  );
}
