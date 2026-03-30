import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  Brain,
  Code2,
  GitBranch,
  Shield,
  Cloud,
  TrendingUp,
} from "lucide-react";
import { useLang } from "@/context/LangContext";
import { servicesT } from "@/data/translations";

const icons = [Code2, GitBranch, TrendingUp, Brain, Cloud, Shield];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: (i: number) => ({ opacity: 0, x: i % 2 === 0 ? -50 : 50 }),
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 } as const,
  },
};

const ServicesSection = () => {
  const T = servicesT[useLang()];

  return (
    <section id="services" className="relative py-24 overflow-hidden">
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
            {T.heading}
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {T.items.map((service, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={service.slug}
                custom={index}
                variants={item}
                className="group rounded-lg border border-border bg-card/50 transition-all hover:border-primary/30 hover:bg-card"
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
              </motion.div>
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
            href="/services"
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

export default ServicesSection;
