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
              Software engineering
              <br />
              <span className="gradient-text">built for scale</span>
            </h2>
            <p className="mb-6 font-body text-base leading-relaxed text-muted-foreground">
              HunterMussel is a software house driven by a passion for solving
              complex problems. We combine robust custom development, cloud
              operations (Ops), and technical SEO to build highly scalable
              systems.
            </p>
            <p className="mb-6 font-body text-base leading-relaxed text-muted-foreground">
              Operating from the Americas (GMT-3), we collaborate in real-time
              with global teams to deliver high-impact solutions.
            </p>
            <p className="font-body text-base leading-relaxed text-muted-foreground">
              We don't just build software; we architect scalable infrastructure
              and integrate AI the right way, ensuring high performance,
              reliable operations, and strong search engine visibility.
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
                <p className="font-body text-sm text-primary">CEO & Founder</p>
              </div>
            </div>
            <p className="mb-6 font-body text-sm leading-relaxed text-muted-foreground">
              Software engineer with deep expertise in distributed
              architectures, cloud operations, and SEO marketing. Passionate
              about building scalable systems, high-performance teams, and
              integrating AI seamlessly.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/in/iago-mussel/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border p-2.5 text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://github.com/iagomussel"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border p-2.5 text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
              >
                <Github size={16} />
              </a>
              <a
                href="mailto:contact@huntermussel.com"
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
