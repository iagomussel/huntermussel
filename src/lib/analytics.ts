const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js",
      targetId: string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

function loadGtag(): void {
  if (typeof window === "undefined" || !MEASUREMENT_ID) return;
  if (window.gtag) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function initAnalytics(): void {
  if (!MEASUREMENT_ID) return;
  loadGtag();
  window.gtag("config", MEASUREMENT_ID, {
    send_page_view: false,
  });
}

export function trackPageView(path: string, title?: string): void {
  if (!MEASUREMENT_ID || typeof window === "undefined") return;
  if (!window.gtag) loadGtag();
  window.gtag("config", MEASUREMENT_ID, {
    page_path: path,
    page_title: title ?? document.title,
  });
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (!MEASUREMENT_ID || typeof window === "undefined") return;
  if (!window.gtag) loadGtag();
  window.gtag("event", eventName, params);
}
