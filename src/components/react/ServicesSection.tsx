import { motion } from "framer-motion";

import { Brain, Workflow, GitBranch, Shield, Cloud, Bot } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "AI Process Management",
    slug: "ai-process-management",
    description:
      "Mapping, automation, and optimization of business processes using artificial intelligence and machine learning.",
  },
  {
    icon: Bot,
    title: "Intelligent Automation",
    slug: "intelligent-automation",
    description:
      "Chatbots, RPA, and AI agents that eliminate repetitive tasks and accelerate decision-making.",
  },
  {
    icon: Workflow,
    title: "Workflows & BPM",
    slug: "workflows-bpm",
    description:
      "Design and implementation of automated workflows with real-time monitoring.",
  },
  {
    icon: GitBranch,
    title: "CI/CD & DevOps",
    slug: "ci-cd-devops",
    description:
      "Automated pipelines with DroneCI, GitHub Actions, GitLab CI, and Jenkins for continuous delivery.",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    slug: "security-compliance",
    description:
      "Security audits, LGPD/GDPR implementation, and sensitive data protection.",
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure & AI",
    slug: "cloud-infrastructure-ai",
    description:
      "Deployment of AI models in production with AWS, GCP, and Azure. On-demand scalability.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: (i: number) => ({ opacity: 0, x: i % 2 === 0 ? -50 : 50 }),
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 50, damping: 20 } as const },
};

const ServicesSection = () => {
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
            // services
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            What We Do
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              custom={index}
              variants={item}
              className="group rounded-lg border border-border bg-card/50 transition-all hover:border-primary/30 hover:bg-card"
            >
              <a href={`/services/${service.slug}`} className="block p-6 text-current no-underline hover:no-underline">
                <div className="mb-4 inline-flex rounded-md border border-border bg-muted/50 p-3 text-primary transition-all group-hover:border-glow group-hover:box-glow">
                  <service.icon size={22} />
                </div>
                <h3 className="mb-2 font-heading text-base font-semibold">
                  {service.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
