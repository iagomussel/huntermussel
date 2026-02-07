import { motion } from "framer-motion";

const techs = [
  "OpenAI", "LangChain", "Python", "TensorFlow", "RAG",
  "React", "Node.js", "TypeScript", "Go",
  "AWS", "Docker", "Kubernetes", "Terraform",
  "GitHub Actions", "PostgreSQL", "n8n", "Zapier",
];

const TechSection = () => {
  return (
    <section id="tecnologias" className="relative border-t border-border py-24">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
            // stack
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Tecnologias que dominamos
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {techs.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="rounded-md border border-border bg-card/50 px-4 py-2 font-heading text-xs text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechSection;
