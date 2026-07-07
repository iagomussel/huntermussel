import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Mail, MapPin, MessageCircle } from "lucide-react";
import AnimeScrollSection from "@/components/react/AnimeScrollSection";
import CalSchedulerEmbed from "@/components/react/CalSchedulerEmbed";
import { useLang } from "@/context/LangContext";
import { contactT } from "@/data/translations";
import { trackEvent } from "@/lib/analytics";

type SubmitState = "idle" | "sending" | "success" | "error";

const ContactSection = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const lang = useLang();
  const T = contactT[lang];
  const surface = "contact";
  const hasStartedRef = useRef(false);
  const [status, setStatus] = useState<SubmitState>("idle");

  const markStarted = () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    trackEvent("contact_form_started", {
      form_id: "contact",
      form_surface: surface,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
        }),
      });

      if (!res.ok) throw new Error("request failed");

      setStatus("success");
      trackEvent("contact_form_submitted", {
        form_id: "contact",
        form_surface: surface,
      });
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimeScrollSection
      id="contact"
      data-analytics-section="contact"
      className="relative border-t border-border py-24"
    >
      <div className="container px-6">
        <div className="mx-auto max-w-6xl">
          {!hideHeader && (
            <div className="mx-auto max-w-2xl text-center">
              <span className="mb-4 inline-block font-heading text-xs font-medium uppercase tracking-widest text-primary">
                {T.label}
              </span>
              <h2 className="mb-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
                {T.headingPre}
                <span className="gradient-text">{T.headingHighlight}</span>
              </h2>
              <p className="mb-10 font-body text-base text-muted-foreground">
                {T.subtitle}
              </p>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
            <div
              className="space-y-6 rounded-lg border border-border bg-card/50 p-8"
              onFocus={markStarted}
              onClick={markStarted}
            >
              <div className="space-y-3 text-left">
                <p className="font-heading text-lg font-semibold text-foreground">
                  {T.preferWriting}
                </p>
                <p className="font-body text-sm leading-6 text-muted-foreground">
                  {T.formDescription}
                </p>
              </div>

              {status === "success" ? (
                <p className="font-body text-sm text-primary">{T.successMsg}</p>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="font-body text-sm text-muted-foreground">
                      {T.labelName}
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      maxLength={200}
                      placeholder={T.placeholderName}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 font-body text-sm outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="font-body text-sm text-muted-foreground">
                      {T.labelEmail}
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      maxLength={200}
                      placeholder="you@company.com"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 font-body text-sm outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-phone" className="font-body text-sm text-muted-foreground">
                      {T.labelPhone}
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      maxLength={50}
                      placeholder={T.placeholderPhone}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 font-body text-sm outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="font-body text-sm text-muted-foreground">
                      {T.labelMessage}
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      maxLength={5000}
                      rows={4}
                      placeholder={T.placeholderMessage}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 font-body text-sm outline-none focus:border-primary/50"
                    />
                  </div>
                  {status === "error" && (
                    <p className="font-body text-sm text-destructive">{T.errorMsg}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-body text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {status === "sending" ? T.btnSending : T.btnSend}
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}

              <div className="grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail size={14} className="text-primary" />
                  <a href="mailto:contact@huntermussel.com" className="transition-colors hover:text-primary">
                    contact@huntermussel.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle size={14} className="text-primary" />
                  <a
                    href="https://wa.me/5521995775689"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-primary"
                    onClick={() => {
                      if (typeof window !== "undefined" && typeof (window as Window & { gtag?: (...args: unknown[]) => void }).gtag === "function") {
                        (window as Window & { gtag: (...args: unknown[]) => void }).gtag("event", "conversion", {
                          send_to: "AW-16916178576/whatsapp_click_lead",
                        });
                      }
                    }}
                  >
                    WhatsApp
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} className="text-primary" />
                  Americas (GMT-3)
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card/50 p-6">
              <CalSchedulerEmbed />
            </div>
          </div>
        </div>
      </div>
    </AnimeScrollSection>
  );
};

export default ContactSection;
