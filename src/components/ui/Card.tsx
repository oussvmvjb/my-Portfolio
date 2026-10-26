import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverEffect?: boolean;
  glow?: boolean;
  className?: string;
}

export default function Card({
  children,
  hoverEffect = true,
  glow = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border/80 bg-surface/80 backdrop-blur-sm p-6 transition-all duration-300 ${
        hoverEffect
          ? "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
          : ""
      } ${glow ? "relative after:absolute after:inset-0 after:rounded-2xl after:border after:border-primary/30 after:pointer-events-none" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
