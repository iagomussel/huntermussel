import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, MessageCircle } from "lucide-react";
import CalSchedulerEmbed from "@/components/react/CalSchedulerEmbed";
import { trackEvent } from "@/lib/analytics";

const ContactSection = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const surface = hideHeader ? "contact_page" : "homepage";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const hasStartedRef = useRef(false);

  const getMessageLengthBucket = (value: string) => {
    if (value.length >= 600) {
      return "600_plus";
    }
    if (value.length >= 250) {
      return "250_599";
    }
    if (value.length >= 100) {
      return "100_249";
    }
    if (value.length >= 1) {
      return "1_99";
    }
    return "empty";
  };

  const markStarted = () => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    trackEvent("contact_form_started", {
      form_id: "contact",
      form_surface: surface,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form: Starting submission...");
    markStarted();
    trackEvent("contact_form_submit", {
      form_id: "contact",
      form_surface: surface,
      has_phone: Boolean(phone.trim()),
      message_length_bucket: getMessageLengthBucket(message.trim()),
    });
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Contact form: Received non-JSON response:", text);
        trackEvent("contact_form_error", {
          form_id: "contact",
          form_surface: surface,
          error_type: "non_json_response",
        });
        setErrorMsg("I'm sorry, due the high demand we can't meet your request at moment. Hope we can talk soon.");
        setStatus("error");
        return;
      }

      if (!res.ok) {
        console.error("Contact form: API Error:", data);
        trackEvent("contact_form_error", {
          form_id: "contact",
          form_surface: surface,
          error_type: "request_failed",
        });
        setErrorMsg("I'm sorry, due the high demand we can't meet your request at moment. Hope we can talk soon.");
        setStatus("error");
        return;
      }
      console.log("Contact form: Success!");
      trackEvent("contact_form_success", {
        form_id: "contact",
        form_surface: surface,
      });
      trackEvent("generate_lead", {
        lead_method: "contact_form",
        form_surface: surface,
      });
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      console.error("Contact form: Connection error:", err);
      trackEvent("contact_form_error", {
        form_id: "contact",
        form_surface: surface,
        error_type: "network_error",
      });
      setErrorMsg("I'm sorry, due the high demand we can't meet your request at moment. Hope we can talk soon.");
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      data-analytics-section="contact"
      className="relative border-t border-border py-24"
    >
      <div className="container px-6">
        <div className="mx-auto max-w-6xl">
          {!hideHeader && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-2xl text-center"
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
          )}

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 rounded-lg border border-border bg-card/50 p-8"
            >
              <div className="space-y-3 text-left">
                <p className="font-heading text-lg font-semibold text-foreground">
                  Prefer writing first?
                </p>
                <p className="font-body text-sm leading-6 text-muted-foreground">
                  Send the project context, current constraints, and what kind of
                  outcome you need. If scheduling is easier, the live calendar is
                  available on the right.
                </p>
              </div>

              <form
                className="space-y-5 text-left"
                onSubmit={handleSubmit}
                onFocus={markStarted}
                onChange={markStarted}
              >
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
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block font-heading text-xs text-muted-foreground">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={status === "loading"}
                      autoComplete="name"
                      data-lpignore="true"
                      className="w-full rounded-md border border-border bg-muted/30 px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-heading text-xs text-muted-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={status === "loading"}
                      autoComplete="email"
                      data-lpignore="true"
                      className="w-full rounded-md border border-border bg-muted/30 px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-heading text-xs text-muted-foreground">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={status === "loading"}
                      autoComplete="tel"
                      data-lpignore="true"
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
                    id="message"
                    name="message"
                    placeholder="Describe your project..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={status === "loading"}
                    data-lpignore="true"
                    className="w-full resize-none rounded-md border border-border bg-muted/30 px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  data-analytics-event="lead_cta_click"
                  data-analytics-label="contact_form_submit_button"
                  data-analytics-location={surface}
                  data-analytics-destination="/contact"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-heading text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_hsl(145_80%_50%/0.3)] disabled:pointer-events-none disabled:opacity-60"
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </form>

              <div className="grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail size={14} className="text-primary" />
                  <a href="mailto:contact@huntermussel.com" className="transition-colors hover:text-primary">
                    contact@huntermussel.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle size={14} className="text-primary" />
                  <a href="https://wa.me/5521995775689" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">
                    WhatsApp
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} className="text-primary" />
                  Americas (GMT-3)
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-lg border border-border bg-card/50 p-6"
            >
              <CalSchedulerEmbed />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
