import { ArrowRight, Truck, GraduationCap, Globe, Users, CalendarCheck } from "lucide-react";
import AnimeScrollSection from "@/components/react/AnimeScrollSection";
import { useLang } from "@/context/LangContext";
import { casesT } from "@/data/translations";

const icons = [Truck, GraduationCap, Globe, Users, CalendarCheck];

const CasesSection = () => {
  const T = casesT[useLang()];

  return (
    <AnimeScrollSection
      id="cases"
      className="relative border-t border-border py-24 overflow-hidden"
      revealStyle="cards"
      childSelector=".case-card"
      staggerDelay={110}
    >
      <div className="container px-6">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
            {T.label}
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {T.headingPre}
            <span className="gradient-text">{T.headingHighlight}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-base text-muted-foreground">
            {T.subtitle}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {T.items.map((c, index) => {
            const Icon = icons[index] ?? icons[0];
            return (
              <article
                key={c.slug}
                className="case-card group relative overflow-hidden rounded-lg border border-border bg-card/50 transition-all hover:border-primary/30 hover:bg-card hover:shadow-[0_0_28px_hsl(145_80%_50%/0.12)] hover:-translate-y-1 duration-300"
                style={{ opacity: 0, transform: 'translateY(48px) scale(0.94)' }}
              >
                {/* animated line on top */}
                <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-primary/60 to-primary transition-transform duration-500 group-hover:scale-x-100" />
                <a href={`/cases/${c.slug}/`} className="block p-6 text-current no-underline hover:no-underline">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="inline-flex rounded-md border border-border bg-muted/50 p-3 text-primary transition-all group-hover:border-glow group-hover:box-glow">
                      <Icon size={22} />
                    </div>
                    <span className="rounded-full border border-border bg-muted/30 px-3 py-1 font-heading text-[10px] uppercase tracking-wider text-muted-foreground">
                      {c.category}
                    </span>
                  </div>
                  <h3 className="mb-2 font-heading text-base font-semibold">
                    {c.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                </a>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a
            href="/cases/"
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

export default CasesSection;
