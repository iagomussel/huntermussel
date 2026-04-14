"use client";

import { useEffect, useId, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

declare global {
  interface Window {
    Cal?: {
      (...args: unknown[]): void;
      loaded?: boolean;
      ns?: Record<string, { q?: unknown[] } & ((...args: unknown[]) => void)>;
      q?: unknown[];
    };
  }
}

const CAL_SCRIPT_URL = "https://app.cal.com/embed/embed.js";
const CAL_NAMESPACE = "secret";
const CAL_ORIGIN = "https://app.cal.com";
const CAL_LINK = "iago-mussel-2zqprh/secret";

/** Cal.com embed queue stub (official pattern). First `Cal(...)` call injects `embed.js`. */
const initializeCal = () => {
  const C = window;
  const d = C.document;

  C.Cal =
    C.Cal ||
    function (...args: unknown[]) {
      const cal = C.Cal!;

      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        const script = d.createElement("script");
        script.src = CAL_SCRIPT_URL;
        script.async = true;
        d.head.appendChild(script);
        cal.loaded = true;
      }

      if (args[0] === "init") {
        const namespace = args[1];
        const api = function (...apiArgs: unknown[]) {
          api.q = api.q || [];
          api.q.push(apiArgs);
        };

        api.q = api.q || [];

        if (typeof namespace === "string") {
          cal.ns = cal.ns || {};
          cal.ns[namespace] = cal.ns[namespace] || api;
          cal.ns[namespace].q = cal.ns[namespace].q || [];
          cal.ns[namespace].q?.push(args);
          cal.q = cal.q || [];
          cal.q.push(["initNamespace", namespace]);
        } else {
          cal.q = cal.q || [];
          cal.q.push(args);
        }

        return;
      }

      cal.q = cal.q || [];
      cal.q.push(args);
    };
};

function getCalScriptElement(): HTMLScriptElement | null {
  return document.querySelector<HTMLScriptElement>(`script[src="${CAL_SCRIPT_URL}"]`);
}

function whenScriptReady(script: HTMLScriptElement | null): Promise<void> {
  if (!script) {
    return Promise.resolve();
  }
  if (script.getAttribute("data-cal-embed-ready") === "1") {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const done = () => {
      script.setAttribute("data-cal-embed-ready", "1");
      resolve();
    };
    if (script.complete) {
      queueMicrotask(done);
      return;
    }
    script.addEventListener("load", done, { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("Cal embed script failed to load")),
      { once: true },
    );
  });
}

const CalSchedulerEmbed = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reactId = useId();
  const containerDomId = `cal-inline-${reactId.replace(/:/g, "")}`;

  useEffect(() => {
    const host = containerRef.current;
    if (!host || typeof window === "undefined") {
      return;
    }

    let cancelled = false;

    const wireEventsAndInline = () => {
      if (cancelled || !document.body.contains(host)) {
        return;
      }

      host.innerHTML = "";

      window.Cal?.ns?.[CAL_NAMESPACE]?.("on", {
        action: "bookerReady",
        callback: () => {
          if (cancelled) {
            return;
          }
          trackEvent("scheduler_embed_ready", {
            scheduler_vendor: "cal",
            scheduler_surface: "contact",
          });
        },
      });
      window.Cal?.ns?.[CAL_NAMESPACE]?.("on", {
        action: "bookerViewed",
        callback: () => {
          if (cancelled) {
            return;
          }
          trackEvent("scheduler_embed_view", {
            scheduler_vendor: "cal",
            scheduler_surface: "contact",
          });
        },
      });
      window.Cal?.ns?.[CAL_NAMESPACE]?.("on", {
        action: "bookingSuccessfulV2",
        callback: () => {
          if (cancelled) {
            return;
          }
          trackEvent("scheduler_booking_success", {
            scheduler_vendor: "cal",
            scheduler_surface: "contact",
          });
          trackEvent("generate_lead", {
            lead_method: "scheduled_call",
            scheduler_vendor: "cal",
          });
        },
      });
      window.Cal?.ns?.[CAL_NAMESPACE]?.("on", {
        action: "linkFailed",
        callback: () => {
          if (cancelled) {
            return;
          }
          trackEvent("scheduler_embed_error", {
            scheduler_vendor: "cal",
            scheduler_surface: "contact",
          });
        },
      });

      window.Cal?.ns?.[CAL_NAMESPACE]?.("inline", {
        elementOrSelector: host,
        config: {
          layout: "week_view",
          useSlotsViewOnSmallScreen: true,
          theme: "dark",
        },
        calLink: CAL_LINK,
      });
      window.Cal?.ns?.[CAL_NAMESPACE]?.("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          dark: {
            "cal-brand": "#ffffff",
          },
        },
        hideEventTypeDetails: true,
        layout: "week_view",
      });
    };

    void (async () => {
      try {
        initializeCal();

        window.Cal?.("init", CAL_NAMESPACE, { origin: CAL_ORIGIN });

        const script = getCalScriptElement();
        await whenScriptReady(script);

        requestAnimationFrame(() => {
          if (!cancelled && document.body.contains(host)) {
            wireEventsAndInline();
          }
        });
      } catch {
        if (!cancelled) {
          trackEvent("scheduler_embed_error", {
            scheduler_vendor: "cal",
            scheduler_surface: "contact",
            load_failed: true,
          });
        }
      }
    })();

    return () => {
      cancelled = true;
      host.innerHTML = "";
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-heading text-lg font-semibold text-foreground">
            Book a time directly
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a slot on the calendar below to schedule a consultation.
          </p>
        </div>
        <a
          href={`https://cal.com/${CAL_LINK}`}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="scheduler_open_external"
          data-analytics-label="open_in_cal"
          data-analytics-location="contact_scheduler"
          data-analytics-destination={`https://cal.com/${CAL_LINK}`}
          className="shrink-0 rounded-md border border-border bg-muted/40 px-3 py-2 font-heading text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          Open in Cal
        </a>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-muted/20">
        <div
          id={containerDomId}
          ref={containerRef}
          className="h-[720px] w-full overflow-y-auto"
        />
      </div>
    </div>
  );
};

export default CalSchedulerEmbed;
