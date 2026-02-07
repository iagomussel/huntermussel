import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, MessageCircle } from "lucide-react";

const ContactSection = () => {
  const handleWhatsApp = () => {
    window.open("https://wa.me/5521995775689", "_blank");
  };

  return (
    <section id="contato" className="relative border-t border-border py-24">
      <div className="container px-6">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
              // contato
            </span>
            <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Vamos construir{" "}
              <span className="gradient-text">juntos?</span>
            </h2>
            <p className="mb-10 font-body text-base text-muted-foreground">
              Conte-nos sobre seu projeto. Respondemos em até 24 horas.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-lg border border-border bg-card/50 p-8"
          >
            <form className="space-y-5 text-left" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-heading text-xs text-muted-foreground">
                    Nome
                  </label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    className="w-full rounded-md border border-border bg-muted/30 px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-heading text-xs text-muted-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full rounded-md border border-border bg-muted/30 px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block font-heading text-xs text-muted-foreground">
                  Mensagem
                </label>
                <textarea
                  rows={4}
                  placeholder="Descreva seu projeto..."
                  className="w-full resize-none rounded-md border border-border bg-muted/30 px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-heading text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_hsl(145_80%_50%/0.3)]"
              >
                Enviar Mensagem
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={14} className="text-primary" />
              <a href="mailto:contato@huntermussel.com" className="hover:text-primary transition-colors">
                contato@huntermussel.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircle size={14} className="text-primary" />
              <a href="https://wa.me/5521995775689" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                +55 (21) 99577-5689
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} className="text-primary" />
              Brasil
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
