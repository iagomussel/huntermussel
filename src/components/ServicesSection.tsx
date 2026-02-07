import { motion } from "framer-motion";
import { Brain, Workflow, GitBranch, Shield, Cloud, Bot } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "Gestão de Processos com IA",
    description:
      "Mapeamento, automação e otimização de processos empresariais utilizando inteligência artificial e machine learning.",
  },
  {
    icon: Bot,
    title: "Automação Inteligente",
    description:
      "Chatbots, RPA e agentes de IA que eliminam tarefas repetitivas e aceleram a tomada de decisão.",
  },
  {
    icon: Workflow,
    title: "Workflows & BPM",
    description:
      "Desenho e implementação de fluxos de trabalho automatizados com monitoramento em tempo real.",
  },
  {
    icon: GitBranch,
    title: "CI/CD & DevOps",
    description:
      "Pipelines automatizados com DroneCI, GitHub Actions, GitLab CI e Jenkins para entrega contínua.",
  },
  {
    icon: Shield,
    title: "Segurança & Compliance",
    description:
      "Auditorias de segurança, implementação de LGPD e proteção de dados sensíveis.",
  },
  {
    icon: Cloud,
    title: "Infraestrutura Cloud & IA",
    description:
      "Deploy de modelos de IA em produção com AWS, GCP e Azure. Escalabilidade sob demanda.",
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

const ServicesSection = () => {
  return (
    <section id="servicos" className="relative py-24">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
            // serviços
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            O que fazemos
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={item}
              className="group rounded-lg border border-border bg-card/50 p-6 transition-all hover:border-primary/30 hover:bg-card"
            >
              <div className="mb-4 inline-flex rounded-md border border-border bg-muted/50 p-3 text-primary transition-all group-hover:border-glow group-hover:box-glow">
                <service.icon size={22} />
              </div>
              <h3 className="mb-2 font-heading text-base font-semibold">
                {service.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
