'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useTheme } from '@/lib/theme/ThemeProvider';

// Dynamically import so the heavy WebGL code is never bundled server-side
const PatternWaves = dynamic(() => import('@/components/ui/PatternWaves'), { ssr: false });

/**
 * Full-viewport, pointer-interactive silk-wave background.
 * Mounted as the bottom-most under layer behind all page content.
 */
export default function AppBackground() {
  const { mode } = useTheme();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const update = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [mode]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      <PatternWaves
        preset="silk"
        color={isDark ? '#ffffff' : '#120f17'}
        backgroundColor={isDark ? '#120f17' : '#f8fafc'}
        fade="edges"
        interactive
        cursorSize={50}
        cursorStrength={0.6}
        pattern="dot"
        wave="silk"
        spacing={9}
        markSize={0.95}
        depth={0.95}
        light={0}
        shine={0.8}
        contrast={1.2}
        speed={0.35}
        scale={1}
        direction={20}
        opacity={1}
        fadeSize={0.5}
        characters=".:-=+*#%@"
        intro
        paused={false}
      />
    </div>
  );
}
