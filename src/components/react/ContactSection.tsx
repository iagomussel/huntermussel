import { useRef, useState } from "react";
import { ArrowRight, Mail, MapPin, MessageCircle } from "lucide-react";
import AnimeScrollSection from "@/components/react/AnimeScrollSection";
import CalSchedulerEmbed from "@/components/react/CalSchedulerEmbed";
import HubSpotForm from "@/components/react/HubSpotForm";
import { useLang } from "@/context/LangContext";
import { contactT } from "@/data/translations";
import { trackEvent } from "@/lib/analytics";

const HUBSPOT_PORTAL_ID = import.meta.env.PUBLIC_HUBSPOT_PORTAL_ID || "";
const HUBSPOT_FORM_ID = import.meta.env.PUBLIC_HUBSPOT_FORM_ID || "";

const ContactSection = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const lang = useLang();
  const T = contactT[lang];
  const surface = "contact";
  const hasFormConfigured = Boolean(HUBSPOT_PORTAL_ID && HUBSPOT_FORM_ID);
  const hasStartedRef = useRef(false);
  const [showFallback, setShowFallback] = useState(false);

  const markStarted = () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    trackEvent("contact_form_started", {
      form_id: "contact",
      form_surface: surface,
    });
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

              {hasFormConfigured ? (
                <HubSpotForm portalId={HUBSPOT_PORTAL_ID} formId={HUBSPOT_FORM_ID} />
              ) : showFallback ? (
                <div className="space-y-4">
                  <p className="font-body text-sm text-muted-foreground">
                    The contact form is temporarily unavailable. Reach out directly and we'll respond within 24 hours.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="mailto:contact@huntermussel.com"
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/30 px-4 py-2 font-body text-sm transition-colors hover:border-primary/40"
                    >
                      <Mail size={16} className="text-primary" />
                      contact@huntermussel.com
                    </a>
                    <a
                      href="https://wa.me/5521995775689"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/30 px-4 py-2 font-body text-sm transition-colors hover:border-primary/40"
                    >
                      <MessageCircle size={16} className="text-primary" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3">
                  <p className="font-body text-sm text-destructive">
                    Contact form not configured. Add{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">PUBLIC_HUBSPOT_PORTAL_ID</code>{" "}
                    and{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">PUBLIC_HUBSPOT_FORM_ID</code>{" "}
                    to your environment.
                  </p>
                  <button
                    onClick={() => setShowFallback(true)}
                    className="mt-2 font-body text-sm text-primary underline"
                  >
                    Show direct contact options
                  </button>
                </div>
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
