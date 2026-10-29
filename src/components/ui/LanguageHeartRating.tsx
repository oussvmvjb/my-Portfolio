'use client';

import PixelHeart from './PixelHeart';

export function getLanguageScore(name: string, explicitScore?: number): number {
  if (typeof explicitScore === 'number' && explicitScore >= 1 && explicitScore <= 5) {
    return explicitScore;
  }
  const s = name.toLowerCase();
  // Arabic (5/5)
  if (s.includes('arab') || s.includes('عرب') || s.includes('阿拉伯')) return 5;
  // French (4/5)
  if (s.includes('fran') || s.includes('fren') || s.includes('فرنس') || s.includes('法')) return 4;
  // English (4/5)
  if (s.includes('engl') || s.includes('angl') || s.includes('إنجليز') || s.includes('انجليز') || s.includes('英')) return 4;
  // Chinese (2/5)
  if (s.includes('chin') || s.includes('mand') || s.includes('صين') || s.includes('中')) return 2;
  return 3;
}

interface LanguageHeartRatingProps {
  name: string;
  level: string;
  score?: number;
  className?: string;
  compact?: boolean;
}

export default function LanguageHeartRating({
  name,
  level,
  score,
  className = '',
  compact = false,
}: LanguageHeartRatingProps) {
  const currentScore = getLanguageScore(name, score);
  const total = 5;

  return (
    <div
      className={`rounded-2xl border border-border/70 bg-surface/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-surface/80 hover:shadow-lg hover:shadow-primary/5 p-4 sm:p-5 text-start space-y-3 ${className}`.trim()}
    >
      {/* Header: Name + Level */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-base font-bold text-fg font-display tracking-tight">
          {name}
        </span>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          {level}
        </span>
      </div>

      {/* Heart Rating with Lottie Animation */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <PixelHeart
              key={i}
              active={i < currentScore}
              size={compact ? 24 : 28}
              offsetFrame={i * 6}
            />
          ))}
        </div>

        <span className="text-xs font-mono font-bold text-muted/80 tracking-wider">
          <span className="text-primary font-extrabold">{currentScore}</span>/{total}
        </span>
      </div>
    </div>
  );
}

