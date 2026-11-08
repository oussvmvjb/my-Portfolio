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

export interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Distance in px to slide from below. Default 35 */
  distance?: number;
  /** Animation duration in seconds. Default 0.9 */
  duration?: number;
  /** GSAP ease. Default 'power3.out' */
  ease?: string;
  /** Delay before animation starts (seconds). Default 0 */
  delay?: number;
  /** When the trigger starts. Default 'top 85%' */
  start?: string;
  /** If true, staggers direct children instead of animating the wrapper as one block */
  staggerChildren?: boolean;
  /** Stagger amount between children (seconds). Default 0.08 */
  stagger?: number;
  /** Scale from. Default 0.98 */
  scaleFrom?: number;
  /** Blur from in px. Default 8 */
  blurFrom?: number;
  /** Is this the first / hero section */
  isHero?: boolean;
}

/**
 * Premium section-based scroll reveal component.
 *
 * Coordinates section heading and progressive content entrance:
 * - Triggers when the section heading enters the viewport (default: 'top 85%').
 * - Once revealed, content remains visible forever (no onLeave / onLeaveBack fading).
 * - Scrolling up preserves all previously revealed content without replaying animations.
 * - Cleans up inline GSAP transform/opacity/filter props on completion so hover states and
 *   dynamic updates work seamlessly.
 */
export default function ScrollReveal({
  children,
  className = '',
  style,
  distance = 35,
  duration = 0.9,
  ease = 'power3.out',
  delay = 0,
  start = 'top 85%',
  staggerChildren = true,
  stagger = 0.08,
  scaleFrom = 0.98,
  blurFrom = 8,
  isHero = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const variantRoot = el.firstElementChild as HTMLElement | null;
      const heading = variantRoot?.querySelector('[data-section-heading]') as HTMLElement | null;

      const isTopElement =
        isHero ||
        (typeof window !== 'undefined' && el.getBoundingClientRect().top < window.innerHeight * 0.7);

      if (heading && variantRoot) {
        // Find the top-level container for the heading within variantRoot
        const headerContainer =
          heading.parentElement === variantRoot
            ? heading
            : (heading.closest('.space-y-10 > div, .space-y-12 > div') || heading.parentElement || heading) as HTMLElement;

        // Content blocks are all sibling containers inside variantRoot excluding the header
        const contentBlocks = Array.from(variantRoot.children).filter(
          (child) => child !== headerContainer && !child.contains(heading)
        ) as HTMLElement[];

        const badge = headerContainer.querySelector('[data-heading-badge]') as HTMLElement | null;
        const subtitle = headerContainer.querySelector('[data-heading-subtitle]') as HTMLElement | null;
        const headerSiblings = Array.from(headerContainer.children).filter(
          (child) => child !== heading && !heading.contains(child)
        ) as HTMLElement[];

        // Initial setup for content blocks
        gsap.set(contentBlocks, {
          opacity: 0,
          y: distance,
          scale: scaleFrom,
          filter: blurFrom > 0 ? `blur(${blurFrom}px)` : 'none',
          willChange: 'transform, opacity, filter',
        });

        if (badge) {
          gsap.set(badge, { opacity: 0, y: 12, willChange: 'transform, opacity' });
        }
        if (subtitle) {
          gsap.set(subtitle, { opacity: 0, y: 15, willChange: 'transform, opacity' });
        }
        if (headerSiblings.length > 0) {
          gsap.set(headerSiblings, { opacity: 0, y: 15, willChange: 'transform, opacity' });
        }

        const tl = gsap.timeline({
          paused: true,
          onComplete: () => {
            gsap.set(
              [
                ...contentBlocks,
                headerContainer,
                ...(badge ? [badge] : []),
                ...(subtitle ? [subtitle] : []),
                ...headerSiblings,
              ],
              { clearProps: 'all' }
            );
          },
        });

        if (badge) {
          tl.to(badge, { opacity: 1, y: 0, duration: 0.6, ease }, 0);
        }
        if (subtitle) {
          tl.to(subtitle, { opacity: 1, y: 0, duration: 0.7, ease }, 0.08);
        }
        if (headerSiblings.length > 0) {
          tl.to(headerSiblings, { opacity: 1, y: 0, duration: 0.6, ease, stagger: 0.05 }, 0.08);
        }

        tl.to(
          contentBlocks,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration,
            ease,
            stagger: staggerChildren ? stagger : 0,
            clearProps: 'transform,opacity,filter,willChange',
          },
          0.15
        );

        if (isTopElement) {
          tl.play();
        } else {
          const trigger = ScrollTrigger.create({
            trigger: heading,
            start,
            once: true,
            toggleActions: 'play none none none',
            onEnter: () => tl.play(),
          });

          return () => {
            trigger.kill();
            tl.kill();
            gsap.set([...contentBlocks, headerContainer], { clearProps: 'all' });
          };
        }

        return () => {
          tl.kill();
          gsap.set([...contentBlocks, headerContainer], { clearProps: 'all' });
        };
      } else {
        // Hero section or custom layout without data-section-heading
        const targets = variantRoot
          ? (Array.from(variantRoot.children) as HTMLElement[])
          : staggerChildren
            ? (Array.from(el.children) as HTMLElement[])
            : [el];

        gsap.set(targets, {
          opacity: 0,
          y: distance,
          scale: scaleFrom,
          filter: blurFrom > 0 ? `blur(${blurFrom}px)` : 'none',
          willChange: 'transform, opacity, filter',
        });

        const tl = gsap.timeline({
          paused: true,
          onComplete: () => {
            gsap.set(targets, { clearProps: 'all' });
          },
        });

        tl.to(targets, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: duration * 1.05,
          ease,
          stagger: staggerChildren ? stagger : 0,
          delay,
          clearProps: 'all',
        });

        if (isTopElement) {
          tl.play();
        } else {
          const trigger = ScrollTrigger.create({
            trigger: el,
            start,
            once: true,
            toggleActions: 'play none none none',
            onEnter: () => tl.play(),
          });

          return () => {
            trigger.kill();
            tl.kill();
            gsap.set(targets, { clearProps: 'all' });
          };
        }

        return () => {
          tl.kill();
          gsap.set(targets, { clearProps: 'all' });
        };
      }
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(el, { opacity: 1, y: 0, filter: 'none', clearProps: 'all' });
      const allChildren = el.querySelectorAll('*');
      gsap.set(allChildren, { opacity: 1, y: 0, filter: 'none', clearProps: 'all' });
    });

    return () => mm.revert();
  }, [
    distance,
    duration,
    ease,
    delay,
    start,
    staggerChildren,
    stagger,
    scaleFrom,
    blurFrom,
    isHero,
  ]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
