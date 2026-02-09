import { motion } from "framer-motion";
import { Truck, GraduationCap, Globe, Users, CalendarCheck } from "lucide-react";

const cases = [
  {
    icon: Truck,
    title: "Delivery App",
    category: "Automação & Logística",
    description:
      "Aplicativo de delivery com IA para otimização de rotas, previsão de demanda e gestão automatizada de pedidos em tempo real.",
  },
  {
    icon: GraduationCap,
    title: "LMS IA Powered",
    category: "Educação & IA",
    description:
      "Plataforma de ensino com trilhas adaptativas por IA, correção automática e analytics de performance dos alunos.",
  },
  {
    icon: Globe,
    title: "Site Institucional",
    category: "Presença Digital",
    description:
      "Website institucional com SEO avançado, CMS headless e integração com chatbot de atendimento inteligente.",
  },
  {
    icon: Users,
    title: "CRM Inteligente",
    category: "Gestão & Vendas",
    description:
      "CRM com scoring de leads por IA, automação de follow-ups e dashboards preditivos para equipes comerciais.",
  },
  {
    icon: CalendarCheck,
    title: "Agendador App",
    category: "Produtividade",
    description:
      "Sistema de agendamento inteligente com IA para otimização de horários, lembretes automáticos e gestão de disponibilidade.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CasesSection = () => {
  return (
    <section id="cases" className="relative border-t border-border py-24">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
            // cases
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Projetos que <span className="gradient-text">entregamos</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-base text-muted-foreground">
            Soluções reais construídas com IA, automação e engenharia de ponta.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {cases.map((c) => (
            <motion.article
              key={c.title}
              variants={item}
              className="group relative overflow-hidden rounded-lg border border-border bg-card/50 p-6 transition-all hover:border-primary/30 hover:bg-card"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="inline-flex rounded-md border border-border bg-muted/50 p-3 text-primary transition-all group-hover:border-glow group-hover:box-glow">
                  <c.icon size={22} />
                </div>
                <span className="rounded-full border border-border bg-muted/30 px-3 py-1 font-heading text-[10px] uppercase tracking-wider text-muted-foreground">
                  {c.category}
                </span>
              </div>
              <h3 className="mb-2 font-heading text-base font-semibold">
                {c.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-muted-foreground">
                {c.description}
              </p>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 border-t border-border pt-12 text-center"
        >
          <p className="mb-6 font-heading text-xs uppercase tracking-widest text-muted-foreground">
            Clientes satisfeitos
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="https://amparoeaconchego.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              amparoeaconchego.com
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CasesSection;
