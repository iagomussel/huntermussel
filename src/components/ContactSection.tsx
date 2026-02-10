import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, MessageCircle } from "lucide-react";

const ContactSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.details ? `${data.error} (${data.details})` : (data.error || "Falha ao enviar.");
        setErrorMsg(msg);
        setStatus("error");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setErrorMsg("Erro de conexão. Tente novamente.");
      setStatus("error");
    }
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
              // contact
            </span>
            <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
              Let's Build{" "}
              <span className="gradient-text">Together?</span>
            </h2>
            <p className="mb-10 font-body text-base text-muted-foreground">
              Tell us about your project. We'll respond within 24 hours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-lg border border-border bg-card/50 p-8"
          >
            <form className="space-y-5 text-left" onSubmit={handleSubmit}>
              {status === "success" && (
                <p className="rounded-md border border-primary/30 bg-primary/10 px-4 py-2.5 font-body text-sm text-primary">
                  Thank you for contacting us! Message sent. We'll respond shortly.
                </p>
              )}
              {status === "error" && errorMsg && (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2.5 font-body text-sm text-destructive">
                  {errorMsg}
                </p>
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-heading text-xs text-muted-foreground">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={status === "loading"}
                    className="w-full rounded-md border border-border bg-muted/30 px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-heading text-xs text-muted-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === "loading"}
                    className="w-full rounded-md border border-border bg-muted/30 px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-60"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block font-heading text-xs text-muted-foreground">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your project..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  disabled={status === "loading"}
                  className="w-full resize-none rounded-md border border-border bg-muted/30 px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-60"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-heading text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_hsl(145_80%_50%/0.3)] disabled:opacity-60 disabled:pointer-events-none"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
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
              Brazil
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
