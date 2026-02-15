import { motion } from "framer-motion";
import {
  Truck,
  GraduationCap,
  Globe,
  Users,
  CalendarCheck,
} from "lucide-react";

const cases = [
  {
    icon: Truck,
    title: "Delivery App",
    category: "Automation & Logistics",
    description:
      "AI-powered delivery app for route optimization, demand forecasting, and real-time automated order management.",
  },
  {
    icon: GraduationCap,
    title: "AI-Powered LMS",
    category: "Education & AI",
    description:
      "Learning platform with AI adaptive paths, automatic grading, and student performance analytics.",
  },
  {
    icon: Globe,
    title: "Corporate Website",
    category: "Digital Presence",
    description:
      "Corporate website with advanced SEO, headless CMS, and intelligent customer service chatbot integration.",
  },
  {
    icon: Users,
    title: "Smart CRM",
    category: "Management & Sales",
    description:
      "CRM with AI lead scoring, follow-up automation, and predictive dashboards for sales teams.",
  },
  {
    icon: CalendarCheck,
    title: "Scheduling App",
    category: "Productivity",
    description:
      "Intelligent scheduling system with AI for time optimization, automatic reminders, and availability management.",
  },
];

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
            // cases
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Projects We've <span className="gradient-text">Delivered</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-base text-muted-foreground">
            Real solutions built with AI, automation, and cutting-edge
            engineering.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {cases.map((c, index) => (
            <motion.article
              key={c.title}
              custom={index}
              variants={item}
              className="group relative overflow-hidden rounded-lg border border-border bg-card/50 p-6 transition-all hover:border-primary/30 hover:bg-card"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="inline-flex rounded-md border border-border bg-muted/50 p-3 text-primary transition-all group-hover:border-glow group-hover:box-glow">
                  <c.icon size={22} />
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
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 border-t border-border pt-12 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="https://amparoeaconchego.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              amparoeaconchego.com
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CasesSection;
