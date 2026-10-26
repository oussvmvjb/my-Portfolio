import type { ReactNode } from "react";

export interface TimelineItemProps {
  title: ReactNode;
  subtitle?: string;
  period?: string;
  location?: string;
  badge?: string;
  children?: ReactNode;
}

export function TimelineItem({
  title,
  subtitle,
  period,
  location,
  badge,
  children,
}: TimelineItemProps) {
  return (
    <div className="relative ps-6 md:ps-8 pb-10 last:pb-0 group">
      {/* Timeline indicator node */}
      <span className="absolute -start-[7px] top-1.5 size-3.5 rounded-full bg-surface border-2 border-primary shadow-sm group-hover:scale-125 group-hover:bg-primary transition-all duration-300" />

      {/* Header info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
        <h3 className="text-lg md:text-xl font-bold text-fg font-display group-hover:text-primary transition-colors">
          {title}
        </h3>
        {period && (
          <span className="text-xs md:text-sm font-medium text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 w-fit">
            {period}
          </span>
        )}
      </div>

      {(subtitle || location || badge) && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted mb-3">
          {subtitle && <span className="font-semibold text-fg/90">{subtitle}</span>}
          {subtitle && location && <span>•</span>}
          {location && <span>{location}</span>}
          {badge && (
            <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-primary/20 text-primary animate-pulse">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Body content */}
      {children && <div className="text-sm md:text-base text-muted/90">{children}</div>}
    </div>
  );
}

export default function Timeline({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-s-2 border-primary/25 ms-3 md:ms-4 space-y-2 ${className}`}
    >
      {children}
    </div>
  );
}
