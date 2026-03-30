import { motion } from "framer-motion";
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
import { useLang } from "@/context/LangContext";
import { toolsT } from "@/data/translations";

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


const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 20 } as const },
};

const ToolsSection = () => {
  const T = toolsT[useLang()];

  return (
    <section id="tools" className="relative py-24 overflow-hidden">
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
          <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-muted-foreground">
            {T.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {T.items.map((tool) => {
            const Icon = iconMap[tool.slug] ?? Clock;
            return (
              <motion.a
                key={tool.slug}
                variants={item}
                href={`/tools/${tool.slug}`}
                className="group relative flex flex-col gap-3 rounded-lg border border-border bg-card/50 p-5 text-current no-underline transition-all hover:border-primary/30 hover:bg-card hover:shadow-[0_0_20px_hsl(145_80%_50%/0.08)]"
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
                  <span className="mb-1 inline-block font-heading text-[0.65rem] font-medium uppercase tracking-widest text-muted-foreground">
                    // {tool.category}
                  </span>
                  <h3 className="font-heading text-sm font-semibold text-foreground">
                    {tool.title}
                  </h3>
                  <p className="mt-1 font-body text-xs leading-relaxed text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <a
            href="/tools"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-6 py-2.5 font-heading text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-card"
          >
            {T.viewAll}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ToolsSection;
