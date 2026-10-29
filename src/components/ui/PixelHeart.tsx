'use client';

import { useEffect, useRef, useState } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';

let sharedHeartData: object | null = null;
let heartPromise: Promise<object> | null = null;

async function loadHeartData(): Promise<object> {
  if (sharedHeartData) return sharedHeartData;
  if (!heartPromise) {
    heartPromise = fetch('/animations/pixel-heart.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load heart animation');
        return res.json();
      })
      .then((data) => {
        sharedHeartData = data;
        return data;
      })
      .catch((err) => {
        heartPromise = null;
        throw err;
      });
  }
  return heartPromise;
}

interface PixelHeartProps {
  active?: boolean;
  size?: number;
  offsetFrame?: number;
  className?: string;
}

export default function PixelHeart({
  active = true,
  size = 28,
  offsetFrame = 0,
  className = '',
}: PixelHeartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const container = containerRef.current;
    if (!container) return;

    loadHeartData()
      .then((animationData) => {
        if (isCancelled || !container) return;

        // Clean up previous instance if any
        if (animRef.current) {
          animRef.current.destroy();
          animRef.current = null;
        }

        const anim = lottie.loadAnimation({
          container,
          renderer: 'svg',
          loop: active,
          autoplay: active,
          animationData,
        });

        animRef.current = anim;

        if (active && offsetFrame > 0) {
          anim.goToAndPlay(offsetFrame % 37, true);
        } else if (!active) {
          anim.goToAndStop(0, true);
        }

        setLoaded(true);
      })
      .catch(() => {
        // Fallback silently if offline or failed
      });

    return () => {
      isCancelled = true;
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, [active, offsetFrame]);

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size }}
      aria-hidden="true"
      className={`inline-flex items-center justify-center shrink-0 select-none transition-all duration-300 ${
        active
          ? 'drop-shadow-[0_2px_8px_rgba(239,68,68,0.45)] hover:scale-110'
          : 'opacity-20 grayscale brightness-50'
      } ${className}`.trim()}
    />
  );
}

