import { motion } from "framer-motion";
import { Linkedin, Github, Mail } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="sobre" className="relative border-t border-border py-24">
      <div className="container px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
              // sobre
            </span>
            <h2 className="mb-6 font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Gestão de processos
              <br />
              <span className="gradient-text">potencializada por IA</span>
            </h2>
            <p className="mb-6 font-body text-base leading-relaxed text-muted-foreground">
              A HunterMussel nasceu da paixão por resolver problemas complexos
              com tecnologia e inteligência artificial. Combinamos IA, automação
              e práticas DevOps para transformar processos empresariais em
              operações inteligentes e escaláveis.
            </p>
            <p className="font-body text-base leading-relaxed text-muted-foreground">
              Nossa missão é eliminar ineficiências com IA — automatizando
              decisões, otimizando fluxos e entregando resultados mensuráveis.
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
                  CEO & Fundador
                </p>
              </div>
            </div>
            <p className="mb-6 font-body text-sm leading-relaxed text-muted-foreground">
              Engenheiro de software com experiência em inteligência artificial,
              arquiteturas distribuídas e cultura DevOps. Apaixonado por aplicar
              IA na gestão de processos e construir times de alta performance.
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
