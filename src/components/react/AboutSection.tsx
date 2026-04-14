import { useEffect, useRef } from "react";
import { Linkedin, Github, Mail } from "lucide-react";
import { animate, stagger } from "animejs";
import { useLang } from "@/context/LangContext";
import { aboutT } from "@/data/translations";
import { useAnimeReveal } from "@/hooks/useAnimeReveal";

const AboutSection = () => {
  const T = aboutT[useLang()];
  const sectionRef = useRef<HTMLElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRun.current) {
            hasRun.current = true;

            // Left column: text lines slide in from left
            animate('.about-left > *', {
              opacity: [0, 1],
              translateX: [-60, 0],
              duration: 700,
              ease: 'outExpo',
              delay: stagger(100),
            });

            // Right card: scales up with slight bounce
            animate('.about-card', {
              opacity: [0, 1],
              translateX: [60, 0],
              scale: [0.92, 1],
              duration: 800,
              ease: 'outExpo',
              delay: 200,
            });

            // Social links pop in sequentially
            animate('.about-social a', {
              opacity: [0, 1],
              scale: [0.5, 1],
              duration: 400,
              ease: 'outBack(1.5)',
              delay: stagger(80, { start: 500 }),
            });

            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative border-t border-border py-24"
    >
      <div className="container px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="about-left">
            <span
              className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary"
              style={{ opacity: 0 }}
            >
              {T.label}
            </span>
            <h2
              className="mb-6 font-heading text-3xl font-bold tracking-tight md:text-4xl"
              style={{ opacity: 0 }}
            >
              {T.heading1}
              <br />
              <span className="gradient-text">{T.heading2}</span>
            </h2>
            <p
              className="mb-6 font-body text-base leading-relaxed text-muted-foreground"
              style={{ opacity: 0 }}
            >
              {T.p1}
            </p>
            <p
              className="mb-6 font-body text-base leading-relaxed text-muted-foreground"
              style={{ opacity: 0 }}
            >
              {T.p2}
            </p>
            <p
              className="font-body text-base leading-relaxed text-muted-foreground"
              style={{ opacity: 0 }}
            >
              {T.p3}
            </p>
          </div>

          <div
            className="about-card rounded-lg border border-border bg-card/50 p-8"
            style={{ opacity: 0 }}
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-heading text-lg font-bold text-primary">
                IM
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold">Iago Mussel</h3>
                <p className="font-body text-sm text-primary">CEO & Founder</p>
              </div>
            </div>
            <p className="mb-6 font-body text-sm leading-relaxed text-muted-foreground">
              {T.bio}
            </p>
            <div className="about-social flex gap-3">
              <a
                href="https://www.linkedin.com/in/iago-mussel/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border p-2.5 text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
                style={{ opacity: 0 }}
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://github.com/iagomussel"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border p-2.5 text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
                style={{ opacity: 0 }}
              >
                <Github size={16} />
              </a>
              <a
                href="mailto:contact@huntermussel.com"
                className="rounded-md border border-border p-2.5 text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
                style={{ opacity: 0 }}
              >
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
