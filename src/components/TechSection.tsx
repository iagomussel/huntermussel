import { motion } from "framer-motion";

const techs = [
  "OpenAI", "LangChain", "Python", "TensorFlow", "RAG",
  "React", "Node.js", "TypeScript", "Go",
  "AWS", "Docker", "Kubernetes", "Terraform",
  "GitHub Actions", "PostgreSQL", "n8n", "Zapier",
];

const TechSection = () => {
  return (
    <section id="technologies" className="relative border-t border-border py-24">
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
            Technologies We Master
          </h2>
        </motion.div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="flex w-full overflow-hidden">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-50%" }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex flex-nowrap gap-8 py-4"
              style={{ width: "max-content" }}
            >
              {[...techs, ...techs, ...techs, ...techs].map((tech, i) => (
                <span
                  key={`${tech}-${i}`}
                  className="whitespace-nowrap rounded-md border border-border bg-card/50 px-6 py-3 font-heading text-sm text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
                >
                  {tech}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechSection;
