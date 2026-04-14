import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import AnimeScrollSection from "@/components/react/AnimeScrollSection";
import { useLang } from "@/context/LangContext";
import { toolsT } from "@/data/translations";
import {
  Binary,
  Hash,
  Image,
  FileText,
  ChartBar,
  ScrollText,
  Lock,
  GitCompare,
  Sparkles,
  ShieldCheck,
  ArrowLeftRight,
  Calculator,
  GitCommitHorizontal,
  Cpu,
  DollarSign,
  Users,
  Clock,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "prompt-optimizer": Sparkles,
  "token-counter": Calculator,
  "commit-message-generator": GitCommitHorizontal,
  "ai-model-picker": Cpu,
  "llm-cost-estimator": DollarSign,
  "persona-picker": Users,
  "base64-converter": Binary,
  "hash-generator": Hash,
  "image-optimizer": Image,
  "markdown-editor": FileText,
  "estimators": ChartBar,
  "log-viewer": ScrollText,
  "jwt-inspector": Lock,
  "yaml-json": ArrowLeftRight,
  "online-linters": ShieldCheck,
  "diff-viewer": GitCompare,
};

const ToolsSection = () => {
  const T = toolsT[useLang()];
  const sectionRef = useRef<HTMLElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Initialise items as hidden
    const items = el.querySelectorAll('.tool-card');
    items.forEach((item) => {
      (item as HTMLElement).style.opacity = '0';
      (item as HTMLElement).style.transform = 'translateY(32px) scale(0.9)';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasRun.current) {
          hasRun.current = true;

          animate('.tool-card', {
            opacity: [0, 1],
            translateY: [32, 0],
            scale: [0.9, 1],
            duration: 550,
            ease: 'outExpo',
            delay: stagger(45, { from: 'first' }),
          });

          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="tools"
      className="relative py-24 overflow-hidden border-t border-border"
    >
      <div className="container px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
            {T.label}
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {T.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-muted-foreground">
            {T.subtitle}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {T.items.map((tool) => {
            const Icon = iconMap[tool.slug] ?? Clock;
            return (
              <a
                key={tool.slug}
                href={`/tools/${tool.slug}/`}
                className="tool-card group relative flex flex-col gap-3 rounded-lg border border-border bg-card/50 p-5 text-current no-underline transition-all hover:border-primary/30 hover:bg-card hover:shadow-[0_0_20px_hsl(145_80%_50%/0.10)] hover:-translate-y-1 duration-300"
              >
                {tool.badge && (
                  <span className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5 font-heading text-[0.58rem] font-bold uppercase tracking-wide text-primary-foreground">
                    {tool.badge}
                  </span>
                )}
                <div className="inline-flex rounded-md border border-border bg-muted/50 p-2.5 text-primary transition-all group-hover:border-glow group-hover:box-glow w-fit">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-foreground">
                    {tool.title}
                  </h3>
                  <p className="mt-1 font-body text-xs leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a
            href="/tools/"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-6 py-2.5 font-heading text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-card"
          >
            {T.viewAll}
          </a>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
