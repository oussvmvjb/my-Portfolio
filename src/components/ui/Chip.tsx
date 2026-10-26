import type { HTMLAttributes, ReactNode } from "react";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: "default" | "primary" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export default function Chip({
  children,
  variant = "default",
  size = "sm",
  className = "",
  ...props
}: ChipProps) {
  const sizeClasses = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm";
  const variantClasses = {
    default: "bg-surface border border-border text-muted hover:text-fg hover:border-primary/40",
    primary: "bg-primary/10 border border-primary/20 text-primary font-medium",
    outline: "border border-border text-fg hover:border-primary",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full transition-colors duration-200 ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
