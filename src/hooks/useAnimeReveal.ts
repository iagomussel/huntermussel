import { useEffect, useRef } from 'react';
import { animate, stagger, createTimeline } from 'animejs';

type RevealStyle = 'fade-up' | 'fade-left' | 'fade-right' | 'scale-up' | 'cards';

interface UseAnimeRevealOptions {
  style?: RevealStyle;
  delay?: number;
  /** Optional child selector to animate children in stagger */
  childSelector?: string;
  staggerDelay?: number;
  once?: boolean;
  threshold?: number;
}

/**
 * Hook that triggers an anime.js animation when the ref element enters the viewport.
 * Returns a ref to attach to the element you want to watch.
 */
export function useAnimeReveal<T extends HTMLElement = HTMLElement>({
  style = 'fade-up',
  delay = 0,
  childSelector,
  staggerDelay = 80,
  once = true,
  threshold = 0.15,
}: UseAnimeRevealOptions = {}) {
  const ref = useRef<T>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (once && hasAnimated.current) return;
      hasAnimated.current = true;

      // Always make the parent section itself visible first
      el.style.opacity = '1';
      el.style.transform = '';
      el.style.transition = 'none';

      const targets = childSelector ? Array.from(el.querySelectorAll(childSelector)) : [el];

      const tl = createTimeline({ defaults: { ease: 'outExpo', duration: 700 } });

      if (style === 'fade-up') {
        tl.add(targets, {
          opacity: [0, 1],
          translateY: [36, 0],
          delay: stagger(staggerDelay),
        }, delay);
      } else if (style === 'fade-left') {
        tl.add(targets, {
          opacity: [0, 1],
          translateX: [-48, 0],
          delay: stagger(staggerDelay),
        }, delay);
      } else if (style === 'fade-right') {
        tl.add(targets, {
          opacity: [0, 1],
          translateX: [48, 0],
          delay: stagger(staggerDelay),
        }, delay);
      } else if (style === 'scale-up') {
        tl.add(targets, {
          opacity: [0, 1],
          scale: [0.82, 1],
          delay: stagger(staggerDelay),
        }, delay);
      } else if (style === 'cards') {
        tl.add(targets, {
          opacity: [0, 1],
          translateY: [48, 0],
          scale: [0.94, 1],
          delay: stagger(staggerDelay, { from: 'first' }),
        }, delay);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            if (once) observer.disconnect();
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [style, delay, childSelector, staggerDelay, once, threshold]);

  return ref;
}

/** Animate a number counting up when it enters view */
export function useAnimeCounter(target: number, duration = 1200) {
  const ref = useRef<HTMLElement>(null);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { val: 0 };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animRef.current = animate(obj, {
              val: target,
              duration,
              ease: 'outExpo',
              onUpdate: () => {
                if (ref.current) ref.current.textContent = Math.round(obj.val).toString();
              },
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      animRef.current?.pause();
    };
  }, [target, duration]);

  return ref;
}
