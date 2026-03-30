import { motion } from "framer-motion";
import { ArrowRight, Truck, GraduationCap, Globe, Users, CalendarCheck } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { casesT } from "@/data/translations";

const icons = [Truck, GraduationCap, Globe, Users, CalendarCheck];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: (i: number) => ({ opacity: 0, y: 20, x: i % 2 === 0 ? -50 : 50 }),
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 } as const,
  },
};

const CasesSection = () => {
  const T = casesT[useLang()];

  return (
    <section
      id="cases"
      className="relative border-t border-border py-24 overflow-hidden"
    >
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
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
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {T.items.map((c, index) => {
            const Icon = icons[index];
            return (
              <motion.article
                key={c.slug}
                custom={index}
                variants={item}
                className="group relative overflow-hidden rounded-lg border border-border bg-card/50 transition-all hover:border-primary/30 hover:bg-card"
              >
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
              </motion.article>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <a
            href="/cases"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-6 py-2.5 font-heading text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-card"
          >
            {T.viewAll}
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CasesSection;
