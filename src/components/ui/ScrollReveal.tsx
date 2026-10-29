'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Distance in px to slide from (positive = from below, negative = from above). Default 60 */
  distance?: number;
  /** Animation duration in seconds. Default 0.8 */
  duration?: number;
  /** GSAP ease. Default 'power3.out' */
  ease?: string;
  /** Delay before animation starts (seconds). Default 0 */
  delay?: number;
  /** When the trigger starts. Default 'top 88%' */
  start?: string;
  /** When the trigger ends. Default 'bottom 12%' */
  end?: string;
  /** If true, also stagger direct children instead of animating the wrapper as one block */
  staggerChildren?: boolean;
  /** Stagger amount between children (seconds). Default 0.12 */
  stagger?: number;
}

/**
 * Wraps its children and animates them in from below (or above) every time
 * the element enters the viewport, and out when it leaves.
 *
 * Uses toggleActions "play reverse play reverse" so the animation fires:
 * - play   : entering viewport scrolling down
 * - reverse: leaving viewport scrolling down
 * - play   : entering viewport scrolling up (back in)
 * - reverse: leaving viewport scrolling up
 */
export default function ScrollReveal({
  children,
  className = '',
  style,
  distance = 60,
  duration = 0.8,
  ease = 'power3.out',
  delay = 0,
  start = 'top 88%',
  end = 'bottom 12%',
  staggerChildren = false,
  stagger = 0.12,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const targets = staggerChildren
        ? Array.from(el.children) as HTMLElement[]
        : [el];

      // Set initial hidden state
      gsap.set(targets, { opacity: 0, y: distance, willChange: 'transform, opacity' });

      const trigger = ScrollTrigger.create({
        trigger: el,
        start,
        end,
        // play entering-down | reverse leaving-down | play entering-up | reverse leaving-up
        toggleActions: 'play reverse play reverse',
        onEnter: () =>
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration,
            ease,
            delay,
            stagger: staggerChildren ? stagger : 0,
            overwrite: true,
          }),
        onLeave: () =>
          gsap.to(targets, {
            opacity: 0,
            y: -distance * 0.4,
            duration: duration * 0.7,
            ease: 'power2.in',
            stagger: staggerChildren ? stagger * 0.5 : 0,
            overwrite: true,
          }),
        onEnterBack: () =>
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration,
            ease,
            delay,
            stagger: staggerChildren ? stagger : 0,
            overwrite: true,
          }),
        onLeaveBack: () =>
          gsap.to(targets, {
            opacity: 0,
            y: distance,
            duration: duration * 0.7,
            ease: 'power2.in',
            stagger: staggerChildren ? stagger * 0.5 : 0,
            overwrite: true,
          }),
      });

      return () => {
        trigger.kill();
        gsap.set(targets, { clearProps: 'all' });
      };
    });

    // Graceful fallback: reduced-motion users see content immediately
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(el, { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, [distance, duration, ease, delay, start, end, staggerChildren, stagger]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

