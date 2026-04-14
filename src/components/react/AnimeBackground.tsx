import React, { useEffect, useRef, useState } from 'react';
import { createTimeline, stagger } from 'animejs';

interface GridInfo {
  columns: number;
  rows: number;
  mounted: boolean;
}

// Larger spacing = fewer dots = cheaper seek
const DOT_SPACING = 75;

const AnimeBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<ReturnType<typeof createTimeline> | null>(null);
  const [gridInfo, setGridInfo] = useState<GridInfo>({ columns: 0, rows: 0, mounted: false });

  useEffect(() => {
    const compute = () => {
      const cols = Math.ceil(window.innerWidth / DOT_SPACING) + 2;
      const rows = Math.ceil(window.innerHeight / DOT_SPACING) + 2;
      setGridInfo({ columns: cols, rows: rows, mounted: true });
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  useEffect(() => {
    if (!gridInfo.mounted || gridInfo.columns === 0) return;

    const { columns: cols, rows } = gridInfo;

    // Multi-phase timeline — fully paused, seeked by scroll
    const tl = createTimeline({ autoplay: false });

    // PHASE 1 (0–1400ms): Fade in + scale from center
    tl.add('.anime-dot', {
      opacity: [0, 0.6],
      scale: [0, 1],
      duration: 900,
      ease: 'outExpo',
      delay: stagger(30, { grid: [cols, rows], from: 'center' }),
    }, 0);

    // PHASE 2 (1400–3000ms): Star explosion
    tl.add('.anime-dot', {
      translateX: () => (Math.random() - 0.5) * 500,
      translateY: () => (Math.random() - 0.5) * 500,
      scale: [1, 0.15],
      opacity: [0.6, 0.06],
      duration: 1400,
      ease: 'inOutQuart',
    }, 1400);

    // PHASE 3 (3000–5500ms): 3D rotation chaos + surge
    tl.add('.anime-dot', {
      rotateX: () => (Math.random() - 0.5) * 720,
      rotateY: () => (Math.random() - 0.5) * 720,
      rotateZ: () => (Math.random() - 0.5) * 360,
      scale: [0.15, 2.2],
      opacity: [0.06, 0.6],
      duration: 2000,
      ease: 'inOutSine',
      delay: stagger(10, { grid: [cols, rows], from: 'random' }),
    }, 3000);

    // PHASE 4 (5500–7200ms): Return to grid
    tl.add('.anime-dot', {
      translateX: 0,
      translateY: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: [2.2, 0.6],
      opacity: [0.6, 0.25],
      duration: 1500,
      ease: 'outExpo',
      delay: stagger(15, { grid: [cols, rows], from: 'center' }),
    }, 5500);

    tlRef.current = tl;

    // Seek directly in RAF — one seek per animation frame max, no lerp lag
    let rafId = 0;
    let pendingProgress = 0;
    let pending = false;

    const handleScroll = () => {
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      pendingProgress = scrollMax > 0 ? Math.min(1, window.scrollY / scrollMax) : 0;

      if (!pending) {
        pending = true;
        rafId = requestAnimationFrame(() => {
          tl.seek(pendingProgress * tl.duration);
          pending = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
      tlRef.current?.pause();
    };
  }, [gridInfo]);

  if (!gridInfo.mounted) return null;

  const total = gridInfo.columns * gridInfo.rows;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        display: 'grid',
        gridTemplateColumns: `repeat(${gridInfo.columns}, ${DOT_SPACING}px)`,
        gridTemplateRows:    `repeat(${gridInfo.rows}, ${DOT_SPACING}px)`,
        placeContent: 'center',
        perspective: '1000px',
        overflow: 'hidden',
        mixBlendMode: 'screen',
        opacity: 0.6,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="anime-dot"
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'hsl(145 80% 60%)',
            boxShadow: '0 0 10px 3px hsl(145 80% 55% / 0.6)',
            placeSelf: 'center',
            transformStyle: 'preserve-3d',
            transform: 'scale(0)',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
};

export default AnimeBackground;
