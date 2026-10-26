import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  target,
  rel,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs font-medium rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm font-semibold rounded-xl gap-2",
    lg: "px-6 py-3 text-base font-semibold rounded-xl gap-2.5",
  }[size];

  const variantClasses = {
    primary:
      "bg-primary text-primary-fg shadow-md shadow-primary/20 hover:opacity-95 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]",
    secondary:
      "bg-surface text-fg border border-border hover:border-primary/40 hover:bg-surface/90 active:scale-[0.98]",
    outline:
      "border-2 border-primary text-primary hover:bg-primary/10 active:scale-[0.98]",
    ghost:
      "text-muted hover:text-fg hover:bg-surface active:scale-[0.98]",
  }[variant];

  const baseClasses =
    "inline-flex items-center justify-center font-display tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === "_blank" ? (rel ?? "noopener noreferrer") : rel}
        className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
