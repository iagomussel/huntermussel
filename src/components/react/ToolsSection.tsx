import { motion } from "framer-motion";
import {
  Binary,
  Hash,
  FileJson,
  Image,
  FileText,
  Calculator,
  ChartBar,
  ScrollText,
  Code,
  GitBranch,
  CheckSquare,
} from "lucide-react";

const tools = [
  {
    icon: Binary,
    title: "Base64 Converter",
    slug: "base64-converter",
    category: "encoding",
    description: "Convert, validate, and repair Base64/Base64URL payloads fully client-side.",
  },
  {
    icon: Hash,
    title: "Hash Generator",
    slug: "hash-generator",
    category: "hashing",
    description: "Generate and verify MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes.",
  },
  {
    icon: FileJson,
    title: "JSON Formatter",
    slug: "json-formatter",
    category: "json",
    description: "Format, validate, and minify JSON payloads with syntax highlighting.",
  },
  {
    icon: Image,
    title: "Image Optimizer",
    slug: "image-optimizer",
    category: "imaging",
    description: "Convert images to WebP in-browser. Control quality and resize — zero uploads.",
  },
  {
    icon: FileText,
    title: "Markdown Editor",
    slug: "markdown-editor",
    category: "writing",
    description: "Live Markdown editor with preview, export, and formatting shortcuts.",
  },
  {
    icon: Calculator,
    title: "Calculators",
    slug: "calculators",
    category: "math",
    description: "Engineering and business calculators for quick on-the-fly computations.",
  },
  {
    icon: ChartBar,
    title: "Estimators",
    slug: "estimators",
    category: "planning",
    description: "Project and effort estimation tools for engineering teams.",
  },
  {
    icon: ScrollText,
    title: "Log Viewer",
    slug: "log-viewer",
    category: "devops",
    description: "Parse, filter, and inspect structured log files directly in the browser.",
  },
  {
    icon: Code,
    title: "Online Linters",
    slug: "online-linters",
    category: "code quality",
    description: "Lint JavaScript, TypeScript, CSS, and more without leaving the browser.",
  },
  {
    icon: GitBranch,
    title: "Pipeline Simulator",
    slug: "pipeline-simulator",
    category: "devops",
    description: "Simulate and visualize CI/CD pipeline flows and dependencies.",
  },
  {
    icon: CheckSquare,
    title: "Validators",
    slug: "validators",
    category: "validation",
    description: "Validate URLs, emails, regex patterns, YAML, and more.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 20 } as const },
};

const ToolsSection = () => {
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
            // tools
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Free Developer Tools
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-muted-foreground">
            Client-side utilities for encoding, hashing, formatting, and more — no
            account, no uploads, no tracking.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {tools.map((tool) => (
            <motion.a
              key={tool.slug}
              variants={item}
              href={`/tools/${tool.slug}`}
              className="group flex flex-col gap-3 rounded-lg border border-border bg-card/50 p-5 text-current no-underline transition-all hover:border-primary/30 hover:bg-card hover:shadow-[0_0_20px_hsl(145_80%_50%/0.08)]"
            >
              <div className="inline-flex rounded-md border border-border bg-muted/50 p-2.5 text-primary transition-all group-hover:border-glow group-hover:box-glow w-fit">
                <tool.icon size={18} />
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
          ))}
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
            View all tools →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ToolsSection;
