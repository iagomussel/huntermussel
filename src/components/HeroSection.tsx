import { motion } from "framer-motion";
import { Terminal, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="container relative z-10 px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto max-w-4xl"
        >
          {/* Terminal badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 backdrop-blur-sm"
          >
            <Terminal size={14} className="text-primary" />
            <span className="font-heading text-xs text-muted-foreground">
              Process Management with AI & DevOps
            </span>
          </motion.div>

          <h1 className="mb-6 font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            We transform processes
            <br />
            with{" "}
            <span className="gradient-text text-glow">Artificial Intelligence</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl font-body text-lg leading-relaxed text-muted-foreground md:text-xl">
            Automate, optimize, and scale your company's process management
            with AI, software engineering, and cutting-edge DevOps practices.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#contato"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 font-heading text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_hsl(145_80%_50%/0.3)]"
            >
              Start Project
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
            <a
              href="#servicos"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-8 py-3.5 font-heading text-sm font-medium text-foreground transition-all hover:border-primary/30 hover:bg-card"
            >
              View Services
            </a>
          </div>
        </motion.div>

        {/* Terminal snippet */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-16 max-w-xl rounded-lg border border-border bg-card/80 p-4 text-left backdrop-blur-sm"
        >
          <div className="mb-3 flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-destructive/60" />
            <div className="h-3 w-3 rounded-full bg-muted-foreground/40" />
            <div className="h-3 w-3 rounded-full bg-primary/60" />
          </div>
          <pre className="font-heading text-xs leading-relaxed text-muted-foreground md:text-sm">
            <span className="text-primary">$</span> huntermussel ai --optimize-processes{"\n"}
            <span className="text-muted-foreground/60">▸ Analyzing flows...</span>{"\n"}
            <span className="text-muted-foreground/60">▸ Applying AI models...</span>{"\n"}
            <span className="text-primary">✓</span> 3 processes optimized with AI 🚀
          </pre>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
