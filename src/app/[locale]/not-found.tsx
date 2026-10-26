"use client";

import { useParams } from "next/navigation";
import { getContent } from "@/lib/content";
import Button from "@/components/ui/Button";
import { Home } from "lucide-react";

export default function NotFound() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const content = getContent(locale);
  const { notFound } = content;

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-5 py-20 relative overflow-hidden">
      {/* Scanline pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"
        aria-hidden="true"
      />

      <div className="relative z-10 text-center max-w-xl mx-auto space-y-6">
        {/* Big Glitch OOPS! */}
        <h1
          className="glitch text-7xl sm:text-9xl font-black font-display tracking-widest text-primary select-none"
          data-text={notFound.title}
        >
          {notFound.title}
        </h1>

        <div className="space-y-2">
          <h2
            className="text-2xl sm:text-3xl font-bold text-fg font-display tracking-wide"
          >
            {notFound.subtitle}
          </h2>
          <p className="text-base text-muted max-w-md mx-auto leading-relaxed">
            {notFound.description}
          </p>
        </div>

        <div className="pt-4">
          <Button href={`/${locale}`} variant="primary" size="lg" className="shadow-xl">
            <Home className="size-5" />
            <span>{notFound.cta}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
