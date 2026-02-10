import { motion } from "framer-motion";
import { Linkedin, Github, Mail } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="relative border-t border-border py-24">
      <div className="container px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
              // about
            </span>
            <h2 className="mb-6 font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Process management
              <br />
              <span className="gradient-text">empowered by AI</span>
            </h2>
            <p className="mb-6 font-body text-base leading-relaxed text-muted-foreground">
              HunterMussel was born from a passion for solving complex problems
              with technology and artificial intelligence. We combine AI, automation,
              and DevOps practices to transform business processes into
              intelligent and scalable operations.
            </p>
            <p className="font-body text-base leading-relaxed text-muted-foreground">
              Our mission is to eliminate inefficiencies with AI — automating
              decisions, optimizing flows, and delivering measurable results.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-lg border border-border bg-card/50 p-8"
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-heading text-lg font-bold text-primary">
                IM
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold">Iago Mussel</h3>
                <p className="font-body text-sm text-primary">
                  CEO & Founder
                </p>
              </div>
            </div>
            <p className="mb-6 font-body text-sm leading-relaxed text-muted-foreground">
              Software engineer with experience in artificial intelligence,
              distributed architectures, and DevOps culture. Passionate about applying
              AI in process management and building high-performance teams.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="rounded-md border border-border p-2.5 text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="#"
                className="rounded-md border border-border p-2.5 text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
              >
                <Github size={16} />
              </a>
              <a
                href="mailto:contato@huntermussel.com"
                className="rounded-md border border-border p-2.5 text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
              >
                <Mail size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
