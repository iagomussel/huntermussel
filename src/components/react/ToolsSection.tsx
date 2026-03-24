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
  Layers,
  Grid3x3,
} from "lucide-react";

const tools = [
  {
    icon: Sparkles,
    title: "Prompt Optimizer",
    slug: "prompt-optimizer",
    category: "ai",
    description: "5-step wizard that assembles production-ready prompts for Claude, GPT-4, Gemini and open-source models. Fully deterministic.",
    badge: "new",
  },
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
    icon: Image,
    title: "Image Optimizer",
    slug: "image-optimizer",
    category: "imaging",
    description: "Convert images to WebP in-browser. Control quality and resize — zero uploads.",
  },
  {
    icon: Layers,
    title: "Alpha Channel Splitter",
    slug: "alpha-channel-splitter",
    category: "imaging",
    description: "Split PNG/WebP into a grayscale alpha mask and an opaque RGB plate — all local.",
    badge: "new",
  },
  {
    icon: Grid3x3,
    title: "Sprite Sheet Slicer",
    slug: "sprite-slicer",
    category: "imaging",
    description: "Slice sprite sheets into a grid of PNG tiles with rows×columns or fixed tile size.",
    badge: "new",
  },
  {
    icon: FileText,
    title: "Markdown Editor",
    slug: "markdown-editor",
    category: "writing",
    description: "Live Markdown editor with preview, export, and formatting shortcuts.",
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
    icon: Lock,
    title: "JWT Inspector",
    slug: "jwt-inspector",
    category: "security",
    description: "Decode JWT tokens, inspect claims, and get live expiry countdown with security warnings.",
  },
  {
    icon: ArrowLeftRight,
    title: "YAML ↔ JSON",
    slug: "yaml-json",
    category: "devops",
    description: "Bidirectional YAML and JSON converter with real-time validation. No server, no logs.",
  },
  {
    icon: ShieldCheck,
    title: "Online Linters",
    slug: "online-linters",
    category: "linting",
    description: "Real-time linter for JSON, YAML, JavaScript, and Markdown powered by Monaco Editor.",
  },
  {
    icon: GitCompare,
    title: "Diff Viewer",
    slug: "diff-viewer",
    category: "text",
    description: "Compare two texts side-by-side or unified — added, removed, and unchanged lines highlighted.",
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
              href={`/tools/${tool.slug}/`}
              className="group relative flex flex-col gap-3 rounded-lg border border-border bg-card/50 p-5 text-current no-underline transition-all hover:border-primary/30 hover:bg-card hover:shadow-[0_0_20px_hsl(145_80%_50%/0.08)]"
            >
              {tool.badge && (
                <span className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5 font-heading text-[0.58rem] font-bold uppercase tracking-wide text-primary-foreground">
                  {tool.badge}
                </span>
              )}
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
