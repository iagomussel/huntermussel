import { type ComponentPropsWithoutRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAnimeReveal } from "@/hooks/useAnimeReveal";

export type AnimeScrollSectionProps = ComponentPropsWithoutRef<"section"> & {
  innerClassName?: string;
  revealStyle?: "fade-up" | "fade-left" | "fade-right" | "scale-up" | "cards";
  childSelector?: string;
  staggerDelay?: number;
};

/** Section wrapper with Anime.js IntersectionObserver reveal. */
const AnimeScrollSection = ({
  children,
  className,
  innerClassName,
  revealStyle = "fade-up",
  childSelector,
  staggerDelay = 80,
  ...sectionProps
}: AnimeScrollSectionProps) => {
  const reduceMotion = useReducedMotion();

  const ref = useAnimeReveal<HTMLElement>({
    style: reduceMotion ? undefined : revealStyle,
    childSelector,
    staggerDelay,
    once: true,
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      className={cn(className, !reduceMotion && !childSelector && "opacity-0")}
      {...sectionProps}
    >
      <div className={cn(innerClassName)}>{children}</div>
    </section>
  );
};

export default AnimeScrollSection;
