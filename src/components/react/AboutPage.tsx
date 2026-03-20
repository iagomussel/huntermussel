import { motion } from "framer-motion";
import { Linkedin, Github, Mail, ArrowRight, MessageCircle } from "lucide-react";

const timeline = [
  {
    era: "2009 – 2016",
    label: "The Parallel Beginning",
    role: "Freelance Developer · IT Technician",
    stack: ["C", "C++", "C#", "PHP 4", "JavaScript"],
    narrative:
      "Seven years of double life. The day job paid the bills; freelance code fed the vocation. Real clients, real problems, no predefined path — learning driven by necessity, curiosity, and stubbornness. While many peers were still figuring out what to study, the first commercial projects were already running.",
  },
  {
    era: "2017 – 2019",
    label: "The Necessary Detour",
    role: "Operational & Billing Systems",
    stack: ["Process Analysis", "Business Operations"],
    narrative:
      "A billing-focused role that looked like a step back. It wasn't. Whoever understands billing systems understands business — where money moves, where process breaks, where automation saves days. That operational fluency rarely comes from a university. It comes from the floor.",
  },
  {
    era: "2019 – 2021",
    label: "The Structured Turning Point",
    role: "Senior Developer → Technology Manager",
    stack: ["Python", "Node.js", "Ruby", "Team Leadership"],
    narrative:
      "Landing a Senior Developer role — and evolving into Technology Manager within months — was the first time a technical trajectory that already existed in practice gained formal structure proportional to it. Nearly a decade of parallel freelance work, finally recognized on paper.",
  },
  {
    era: "2021 – 2022",
    label: "The Architecture Leap",
    role: "DevOps Engineer → Solution Architect & Tech Lead",
    stack: ["AWS", "GCP", "CI/CD", "IaC", "Multi-cloud"],
    narrative:
      "Joining a cloud-focused company as a DevOps Engineer was a fast evolution. Within less than a year the role had grown into Solution Architect and Tech Lead — the position that made sense for someone who had always seen the whole system, not just the module in front.",
  },
  {
    era: "2022 – present",
    label: "Full Depth",
    role: "Tech Lead · Solution Architect · Founder",
    stack: ["Go", "LLM Agents", "AI Automation", "HunterMussel"],
    narrative:
      "Go entered the stack in 2022, called in by a client project — that is the pattern: don't learn for the resume, learn for a real demand, and go deep. Today leading a team of developers and DevOps analysts, architecting multi-cloud solutions for Brazilian and American clients, and building HunterMussel as a technical brand targeting engineering leadership.",
  },
];

const stackGroups = [
  {
    label: "Languages",
    items: ["Go", "Python", "Node.js", "TypeScript", "PHP", "Ruby", "C#"],
  },
  {
    label: "Cloud & Infra",
    items: ["AWS", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD"],
  },
  {
    label: "Frontend",
    items: ["React", "Vite", "Astro", "FlutterFlow", "Unity"],
  },
  {
    label: "Databases",
    items: ["PostgreSQL", "Firebase", "Supabase", "Redis"],
  },
  {
    label: "AI & Automation",
    items: ["Anthropic API", "LLM Agents", "LangChain", "n8n", "Genetic Algorithms"],
  },
  {
    label: "Security",
    items: ["Vulnerability Scanning", "Zero Cool", "Silisecure"],
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      {/* ── Hero ── */}
      <section className="relative z-10 container px-6 pt-20 pb-24">
        <div className="mx-auto max-w-4xl">
          <motion.div {...fadeUp(0.1)}>
            <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
              // about
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.15)}
            className="font-heading text-5xl font-bold tracking-tight md:text-7xl mb-3"
          >
            Iago Mussel
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="font-heading text-xl text-primary mb-6">
            CEO & Founder · HunterMussel
          </motion.p>

          <motion.div {...fadeUp(0.25)} className="flex flex-wrap gap-2 mb-8">
            {["16+ Years", "Multi-cloud", "AI Engineering", "Tech Lead", "GMT-3"].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-card/50 px-3 py-1 font-heading text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              )
            )}
          </motion.div>

          <motion.p
            {...fadeUp(0.3)}
            className="font-body text-lg leading-relaxed text-muted-foreground max-w-2xl mb-4"
          >
            Software engineer who started charging for code in 2009 and never
            stopped going deeper. Distributed architectures, cloud operations, AI
            integration, and the teams that run them — built from the ground up,
            one real problem at a time.
          </motion.p>
          <motion.p
            {...fadeUp(0.35)}
            className="font-body text-lg leading-relaxed text-muted-foreground max-w-2xl mb-10"
          >
            HunterMussel is the consolidation of a technical identity that existed
            fragmented for years — unified under a single brand, built with
            intention, targeting engineering leadership who need a partner, not a
            vendor.
          </motion.p>

          <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-3">
            <a
              href="https://www.linkedin.com/in/iago-mussel/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card/50 px-4 py-2.5 font-heading text-sm text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
            >
              <Linkedin size={15} />
              LinkedIn
            </a>
            <a
              href="https://github.com/iagomussel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card/50 px-4 py-2.5 font-heading text-sm text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
            >
              <Github size={15} />
              GitHub
            </a>
            <a
              href="https://wa.me/5521995775689"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card/50 px-4 py-2.5 font-heading text-sm text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
            <a
              href="mailto:contact@huntermussel.com"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card/50 px-4 py-2.5 font-heading text-sm text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
            >
              <Mail size={15} />
              contact@huntermussel.com
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Journey Timeline ── */}
      <section className="relative z-10 border-t border-border py-24">
        <div className="container px-6">
          <div className="mx-auto max-w-4xl">
            <motion.div {...fadeUp()}>
              <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
                // journey
              </span>
              <h2 className="mb-16 font-heading text-3xl font-bold tracking-tight md:text-4xl">
                Sixteen years.{" "}
                <span className="gradient-text">Always going deeper.</span>
              </h2>
            </motion.div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-0 top-2 h-full w-px bg-border md:left-[140px]" />

              <div className="flex flex-col gap-12">
                {timeline.map((item, i) => (
                  <motion.div
                    key={item.era}
                    {...fadeUp(i * 0.08)}
                    className="relative flex flex-col gap-4 pl-6 md:flex-row md:gap-10 md:pl-0"
                  >
                    {/* Era label */}
                    <div className="md:w-[140px] md:shrink-0 md:pt-0.5 md:text-right">
                      <span className="font-heading text-xs font-semibold uppercase tracking-wider text-primary">
                        {item.era}
                      </span>
                    </div>

                    {/* Dot */}
                    <div className="absolute left-[-4px] top-1 h-2 w-2 rounded-full bg-primary md:relative md:left-auto md:top-auto md:mt-1.5 md:h-2.5 md:w-2.5 md:shrink-0" />

                    {/* Content */}
                    <div className="flex-1 rounded-lg border border-border bg-card/30 p-6">
                      <p className="mb-1 font-heading text-[10px] font-medium uppercase tracking-widest text-primary/70">
                        {item.label}
                      </p>
                      <h3 className="mb-3 font-heading text-base font-bold text-foreground">
                        {item.role}
                      </h3>
                      <p className="mb-4 font-body text-sm leading-relaxed text-muted-foreground">
                        {item.narrative}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded border border-border bg-muted/30 px-2 py-0.5 font-heading text-[10px] text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stack ── */}
      <section className="relative z-10 border-t border-border py-24">
        <div className="container px-6">
          <div className="mx-auto max-w-4xl">
            <motion.div {...fadeUp()}>
              <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
                // stack
              </span>
              <h2 className="mb-12 font-heading text-3xl font-bold tracking-tight md:text-4xl">
                Technologies, by depth — not{" "}
                <span className="gradient-text">by resume.</span>
              </h2>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stackGroups.map((group, i) => (
                <motion.div
                  key={group.label}
                  {...fadeUp(i * 0.07)}
                  className="rounded-lg border border-border bg-card/30 p-5"
                >
                  <p className="mb-3 font-heading text-[10px] font-semibold uppercase tracking-widest text-primary">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded border border-border bg-muted/30 px-2 py-1 font-heading text-xs text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* The student who never stopped */}
            <motion.div
              {...fadeUp(0.2)}
              className="mt-10 rounded-lg border border-primary/20 bg-primary/5 p-6"
            >
              <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-widest text-primary">
                // always building
              </p>
              <p className="font-body text-sm leading-relaxed text-muted-foreground">
                Systems Analysis at university. Three semesters of Mathematics —
                out of love for rigor, not obligation. An evolutionary motor
                optimization simulator with genetic algorithms and real physics
                simulation. An LLM agent written in Go with token optimization
                middleware. None of these were client projects. They were the work
                of someone who needs to understand how things work from the inside
                out.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Beyond the code ── */}
      <section className="relative z-10 border-t border-border py-24">
        <div className="container px-6">
          <div className="mx-auto max-w-4xl">
            <motion.div {...fadeUp()}>
              <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
                // beyond the code
              </span>
              <h2 className="mb-8 font-heading text-3xl font-bold tracking-tight md:text-4xl">
                The man behind the{" "}
                <span className="gradient-text">Tech Lead.</span>
              </h2>
            </motion.div>

            <motion.div
              {...fadeUp(0.1)}
              className="grid gap-6 md:grid-cols-3"
            >
              <div className="rounded-lg border border-border bg-card/30 p-6">
                <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-widest text-primary">
                  Father
                </p>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  Father to Olivia. He organizes a birthday party with the same
                  care applied to designing a cloud architecture.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card/30 p-6">
                <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-widest text-primary">
                  Community
                </p>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  Active member of his local church, running a weekly pastoral
                  letter project for small groups. Structure and care applied
                  beyond software.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card/30 p-6">
                <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-widest text-primary">
                  The Pattern
                </p>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  Faith, family, and code coexist — not as separate compartments,
                  but as expressions of the same character: someone who genuinely
                  cares about what he builds.
                </p>
              </div>
            </motion.div>

            <motion.blockquote
              {...fadeUp(0.2)}
              className="mt-10 border-l-2 border-primary pl-6"
            >
              <p className="font-heading text-lg italic text-foreground">
                "Go deep. Build for real. Never wait for the path to be laid out
                first."
              </p>
              <footer className="mt-3 font-body text-sm text-muted-foreground">
                — The through line of sixteen years.
              </footer>
            </motion.blockquote>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 border-t border-border py-24">
        <div className="container px-6">
          <motion.div
            {...fadeUp()}
            className="mx-auto max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 p-12 text-center backdrop-blur-md"
          >
            <h2 className="mb-4 font-heading text-2xl font-bold">
              Ready to work together?
            </h2>
            <p className="mb-8 font-body text-muted-foreground">
              Whether you need a solution architect, a tech lead, or a partner
              to build something real — let's talk.
            </p>
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 font-heading text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_hsl(145_80%_50%/0.3)]"
            >
              Get in Touch
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
