'use client';

import React, {
  Children,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type ScrollFloatEffect = 'float' | 'flip' | 'scatter' | 'blur' | 'wave';
type ScrollFloatSplit = 'chars' | 'words';
type ScrollFloatDirection = 'up' | 'down';
type ScrollFloatOrder =
  | 'start'
  | 'end'
  | 'center'
  | 'edges'
  | 'random';

export interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  containerClassName?: string;
  textClassName?: string;
  effect?: ScrollFloatEffect;
  splitBy?: ScrollFloatSplit;
  direction?: ScrollFloatDirection;
  order?: ScrollFloatOrder;
  fromColor?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  distance?: number;
  stretch?: number;
  smoothing?: number;
}

const clampToScroll = (position: string) =>
  typeof position === 'string' && !position.startsWith('clamp(')
    ? `clamp(${position})`
    : position;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const smoothstep = (from: number, to: number, value: number) => {
  const k = clamp01((value - from) / (to - from));
  return k * k * (3 - 2 * k);
};

function splitText(text: string, by: ScrollFloatSplit): string[] {
  if (by === 'words') return text.split(/\s+/).filter(Boolean);
  return text.split('');
}

function getOrderedIndices(
  count: number,
  order: ScrollFloatOrder
): number[] {
  const indices = Array.from({ length: count }, (_, i) => i);
  if (order === 'end') return [...indices].reverse();
  if (order === 'center') {
    const mid = Math.floor(count / 2);
    return indices.sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid));
  }
  if (order === 'edges') {
    const mid = Math.floor(count / 2);
    return indices.sort((a, b) => Math.abs(b - mid) - Math.abs(a - mid));
  }
  if (order === 'random') return indices.sort(() => Math.random() - 0.5);
  return indices; // 'start'
}

export default function ScrollFloat({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  effect = 'float',
  splitBy = 'chars',
  direction = 'up',
  order = 'start',
  fromColor = 'currentColor',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  distance = 120,
  stretch = 2.3,
  smoothing = 0,
}: ScrollFloatProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Extract text from children
  const text = useMemo(() => {
    const extractText = (node: ReactNode): string => {
      if (typeof node === 'string' || typeof node === 'number')
        return String(node);
      if (Array.isArray(node)) return node.map(extractText).join('');
      if (React.isValidElement(node) && node.props) {
        const props = node.props as { children?: ReactNode };
        return extractText(props.children);
      }
      return '';
    };
    return extractText(children);
  }, [children]);

  const parts = useMemo(
    () => splitText(text, splitBy),
    [text, splitBy]
  );

  const orderedIndices = useMemo(
    () => getOrderedIndices(parts.length, order),
    [parts.length, order]
  );

  useIsomorphicLayoutEffect(() => {
    if (!isClient || !containerRef.current) return;

    const container = containerRef.current;
    const spans = container.querySelectorAll<HTMLSpanElement>('[data-sf-char]');
    if (!spans.length) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          scroller: scrollContainerRef?.current ?? undefined,
          start: clampToScroll(scrollStart),
          end: clampToScroll(scrollEnd),
          scrub: smoothing > 0 ? smoothing : false,
          toggleActions:
            smoothing > 0 ? undefined : 'play none none reverse',
        },
      });

      orderedIndices.forEach((charIdx, animOrder) => {
        const el = spans[charIdx];
        if (!el) return;
        const delay = animOrder * stagger;

        const sign = direction === 'up' ? 1 : -1;

        const fromVars: gsap.TweenVars = {
          opacity: 0,
          color: fromColor !== 'currentColor' ? fromColor : undefined,
          delay,
          duration: animationDuration,
          ease,
        };

        if (effect === 'float') {
          fromVars.y = sign * distance;
          fromVars.scaleY = stretch;
          fromVars.transformOrigin = direction === 'up' ? 'center bottom' : 'center top';
        } else if (effect === 'flip') {
          fromVars.rotationX = sign * 90;
          fromVars.transformOrigin = direction === 'up' ? 'center bottom' : 'center top';
        } else if (effect === 'scatter') {
          fromVars.x = (Math.random() - 0.5) * distance * 2;
          fromVars.y = sign * distance;
          fromVars.rotation = (Math.random() - 0.5) * 60;
        } else if (effect === 'blur') {
          fromVars.y = sign * (distance * 0.5);
          fromVars.filter = 'blur(16px)';
        } else if (effect === 'wave') {
          fromVars.y = sign * distance;
          fromVars.rotation = sign * 20;
        }

        tl.from(el, fromVars, 0);
      });

      return () => {
        tl.kill();
      };
    });

    return () => mm.revert();
  }, [
    isClient,
    orderedIndices,
    direction,
    effect,
    distance,
    stretch,
    animationDuration,
    ease,
    stagger,
    fromColor,
    scrollStart,
    scrollEnd,
    smoothing,
    scrollContainerRef,
  ]);

  return (
    <h2
      ref={containerRef}
      aria-label={text}
      className={`overflow-hidden ${containerClassName}`}
      style={{ display: 'block' } as CSSProperties}
    >
      <span
        aria-hidden
        className={`inline-flex flex-wrap ${textClassName}`}
        style={{ gap: splitBy === 'words' ? '0.3em' : '0' }}
      >
        {parts.map((part, i) => (
          <span
            key={i}
            data-sf-char
            className="inline-block will-change-transform"
            style={{
              whiteSpace: part === ' ' ? 'pre' : undefined,
            }}
          >
            {part === ' ' && splitBy === 'chars' ? '\u00A0' : part}
          </span>
        ))}
      </span>
    </h2>
  );
}

