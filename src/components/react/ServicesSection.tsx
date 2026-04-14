import {
  ArrowRight,
  Brain,
  Code2,
  GitBranch,
  Shield,
  Cloud,
  TrendingUp,
} from "lucide-react";
import AnimeScrollSection from "@/components/react/AnimeScrollSection";
import { useLang } from "@/context/LangContext";
import { servicesT } from "@/data/translations";

const icons = [Code2, GitBranch, TrendingUp, Brain, Cloud, Shield];

const ServicesSection = () => {
  const T = servicesT[useLang()];

  return (
    <AnimeScrollSection
      id="services"
      className="relative py-24 overflow-x-hidden"
      revealStyle="fade-up"
      childSelector=".service-card"
      staggerDelay={90}
    >
      <div className="container px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
            {T.label}
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {T.heading}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {T.items.map((service, index) => {
            const Icon = icons[index];
            return (
              <div
                key={service.slug}
                className="service-card group rounded-lg border border-border bg-card/50 transition-all hover:border-primary/30 hover:bg-card hover:shadow-[0_0_24px_hsl(145_80%_50%/0.10)] hover:-translate-y-1 duration-300"
                style={{ opacity: 0, transform: 'translateY(48px)' }}
              >
                <a
                  href={`/services/${service.slug}/`}
                  className="block p-6 text-current no-underline hover:no-underline"
                >
                  <div className="mb-4 inline-flex rounded-md border border-border bg-muted/50 p-3 text-primary transition-all group-hover:border-glow group-hover:box-glow">
                    <Icon size={22} />
                  </div>
                  <h3 className="mb-2 font-heading text-base font-semibold">
                    {service.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a
            href="/services/"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-6 py-2.5 font-heading text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-card"
          >
            {T.viewAll}
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </AnimeScrollSection>
  );
};

export default ServicesSection;
