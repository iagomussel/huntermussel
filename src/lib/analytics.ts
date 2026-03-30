type AnalyticsValue = string | number | boolean;
type AnalyticsParams = Record<string, AnalyticsValue | null | undefined>;

type AttributionSnapshot = {
  source: string;
  medium: string;
  campaign?: string;
  term?: string;
  content?: string;
  clickId?: string;
  referrerHost?: string;
  landingPath: string;
  landingUrl: string;
  capturedAt: string;
};

declare global {
  interface Window {
    __hmAnalyticsInitialized?: boolean;
    __hmAnalyticsMutationObserver?: MutationObserver;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const SESSION_ID_KEY = "hm_analytics_session_id";
const FIRST_TOUCH_KEY = "hm_analytics_first_touch";
const LAST_TOUCH_KEY = "hm_analytics_last_touch";
const OBSERVED_VIEW_FLAG = "analyticsViewBound";
const TRACKED_VIEW_FLAG = "analyticsViewTracked";
const SAME_ORIGIN_HOSTS = new Set(["huntermussel.com", "www.huntermussel.com"]);
const SEARCH_ENGINE_DOMAINS = [
  "google.",
  "bing.com",
  "duckduckgo.com",
  "search.yahoo.com",
  "baidu.com",
  "yandex.",
  "ecosia.org",
];

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function getStorage(type: "local" | "session"): Storage | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    return type === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function readJson<T>(storage: Storage | null, key: string): T | null {
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(storage: Storage | null, key: string, value: unknown) {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures. Analytics must not break the page.
  }
}

function getOrCreateSessionId() {
  const storage = getStorage("session");
  const existing = storage?.getItem(SESSION_ID_KEY);

  if (existing) {
    return existing;
  }

  const created =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `hm-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  try {
    storage?.setItem(SESSION_ID_KEY, created);
  } catch {
    // Ignore session storage write failures.
  }

  return created;
}

function normalizeText(value: string | undefined | null) {
  return value?.trim().replace(/\s+/g, " ") || undefined;
}

function slugify(value: string | undefined | null) {
  return normalizeText(value)
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getPageCategory(pathname: string) {
  if (pathname === "/") {
    return "home";
  }
  if (pathname.startsWith("/contact")) {
    return "contact";
  }
  if (pathname === "/services/" || pathname === "/services") {
    return "services_index";
  }
  if (pathname.startsWith("/services/")) {
    return "service_detail";
  }
  if (pathname === "/cases/" || pathname === "/cases") {
    return "cases_index";
  }
  if (pathname.startsWith("/cases/")) {
    return "case_detail";
  }
  if (pathname === "/blog/" || pathname === "/blog") {
    return "blog_index";
  }
  if (pathname.startsWith("/blog/")) {
    return "blog_detail";
  }
  if (pathname === "/tools/" || pathname === "/tools") {
    return "tools_index";
  }
  if (pathname.startsWith("/tools/")) {
    return "tool_detail";
  }
  if (pathname.startsWith("/about")) {
    return "about";
  }

  return "other";
}

function getReferrerHost(referrer: string) {
  if (!referrer) {
    return undefined;
  }

  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function isExternalReferrer(referrerHost: string | undefined) {
  if (!referrerHost) {
    return false;
  }

  return !SAME_ORIGIN_HOSTS.has(referrerHost);
}

function inferMediumFromReferrer(referrerHost: string | undefined) {
  if (!referrerHost) {
    return "none";
  }

  if (SEARCH_ENGINE_DOMAINS.some((domain) => referrerHost.includes(domain))) {
    return "organic";
  }

  return "referral";
}

function inferSourceFromReferrer(referrerHost: string | undefined) {
  if (!referrerHost) {
    return "direct";
  }

  return referrerHost;
}

function buildAttributionSnapshot(): AttributionSnapshot | null {
  if (!isBrowser()) {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const referrerHost = getReferrerHost(document.referrer);
  const hasCampaignParams =
    params.has("utm_source") ||
    params.has("utm_medium") ||
    params.has("utm_campaign") ||
    params.has("utm_term") ||
    params.has("utm_content") ||
    params.has("gclid") ||
    params.has("fbclid") ||
    params.has("msclkid");

  if (!hasCampaignParams && !isExternalReferrer(referrerHost)) {
    return null;
  }

  const clickId =
    params.get("gclid") || params.get("fbclid") || params.get("msclkid") || undefined;

  return {
    source: params.get("utm_source") || inferSourceFromReferrer(referrerHost),
    medium: params.get("utm_medium") || inferMediumFromReferrer(referrerHost),
    campaign: params.get("utm_campaign") || undefined,
    term: params.get("utm_term") || undefined,
    content: params.get("utm_content") || undefined,
    clickId,
    referrerHost,
    landingPath: window.location.pathname,
    landingUrl: window.location.href,
    capturedAt: new Date().toISOString(),
  };
}

function ensureAttribution() {
  const localStorage = getStorage("local");
  const sessionStorage = getStorage("session");
  const existingFirstTouch = readJson<AttributionSnapshot>(localStorage, FIRST_TOUCH_KEY);
  const existingLastTouch = readJson<AttributionSnapshot>(sessionStorage, LAST_TOUCH_KEY);
  const currentTouch = buildAttributionSnapshot();

  if (currentTouch) {
    if (!existingFirstTouch) {
      writeJson(localStorage, FIRST_TOUCH_KEY, currentTouch);
    }

    writeJson(sessionStorage, LAST_TOUCH_KEY, currentTouch);
  }

  if (!existingFirstTouch && !currentTouch && isBrowser()) {
    const directTouch: AttributionSnapshot = {
      source: "direct",
      medium: "none",
      landingPath: window.location.pathname,
      landingUrl: window.location.href,
      capturedAt: new Date().toISOString(),
    };
    writeJson(localStorage, FIRST_TOUCH_KEY, directTouch);
  }

  if (!existingLastTouch && !currentTouch && isBrowser()) {
    const directSessionTouch: AttributionSnapshot = {
      source: "direct",
      medium: "none",
      landingPath: window.location.pathname,
      landingUrl: window.location.href,
      capturedAt: new Date().toISOString(),
    };
    writeJson(sessionStorage, LAST_TOUCH_KEY, directSessionTouch);
  }
}

function getAttributionPayload() {
  const localStorage = getStorage("local");
  const sessionStorage = getStorage("session");
  const firstTouch = readJson<AttributionSnapshot>(localStorage, FIRST_TOUCH_KEY);
  const lastTouch = readJson<AttributionSnapshot>(sessionStorage, LAST_TOUCH_KEY);

  return {
    first_touch_source: firstTouch?.source,
    first_touch_medium: firstTouch?.medium,
    first_touch_campaign: firstTouch?.campaign,
    first_touch_landing_path: firstTouch?.landingPath,
    latest_touch_source: lastTouch?.source,
    latest_touch_medium: lastTouch?.medium,
    latest_touch_campaign: lastTouch?.campaign,
    latest_touch_referrer_host: lastTouch?.referrerHost,
    latest_touch_landing_path: lastTouch?.landingPath,
  };
}

function sanitizeParams(params: AnalyticsParams) {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null);
  return Object.fromEntries(entries) as Record<string, AnalyticsValue>;
}

function baseEventPayload() {
  if (!isBrowser()) {
    return {};
  }

  return {
    page_path: window.location.pathname,
    page_query: window.location.search || undefined,
    page_title: document.title || undefined,
    page_url: window.location.href,
    page_category: getPageCategory(window.location.pathname),
    session_id: getOrCreateSessionId(),
    ...getAttributionPayload(),
  };
}

function getSectionName(element: Element | null) {
  const section = element?.closest<HTMLElement>("[data-analytics-section]");
  return section?.dataset.analyticsSection;
}

function getClickLabel(element: HTMLElement) {
  return (
    element.dataset.analyticsLabel ||
    slugify(element.getAttribute("aria-label")) ||
    slugify(element.textContent)
  );
}

function getClickLocation(element: HTMLElement) {
  return element.dataset.analyticsLocation || getSectionName(element) || "unknown";
}

function pushToDataLayer(eventName: string, params: AnalyticsParams = {}) {
  if (!isBrowser()) {
    return;
  }

  const payload = sanitizeParams({
    event: eventName,
    ...baseEventPayload(),
    ...params,
  });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  pushToDataLayer(eventName, params);
}

export function trackPageView(path: string, title?: string) {
  trackEvent("hm_page_view", {
    page_path: path,
    page_title: title,
  });
}

function isLeadIntentHref(url: URL) {
  return (
    url.hash === "#contact" ||
    url.pathname === "/contact" ||
    url.pathname === "/contact/" ||
    (url.pathname === "/" && url.hash === "#contact")
  );
}

function handleClickTracking(event: MouseEvent) {
  if (!(event.target instanceof Element)) {
    return;
  }

  const clickable = event.target.closest<HTMLElement>("[data-analytics-event], a[href]");
  if (!clickable) {
    return;
  }

  if (clickable.dataset.analyticsEvent) {
    trackEvent(clickable.dataset.analyticsEvent, {
      cta_label: clickable.dataset.analyticsLabel || getClickLabel(clickable),
      cta_location: clickable.dataset.analyticsLocation || getClickLocation(clickable),
      destination: clickable.dataset.analyticsDestination,
      contact_channel: clickable.dataset.analyticsChannel,
    });
    return;
  }

  if (!(clickable instanceof HTMLAnchorElement)) {
    return;
  }

  const href = clickable.getAttribute("href");
  if (!href) {
    return;
  }

  if (href.startsWith("mailto:")) {
    trackEvent("contact_channel_click", {
      contact_channel: "email",
      cta_label: getClickLabel(clickable),
      cta_location: getClickLocation(clickable),
      destination: href,
    });
    return;
  }

  if (href.includes("wa.me") || href.includes("whatsapp")) {
    trackEvent("contact_channel_click", {
      contact_channel: "whatsapp",
      cta_label: getClickLabel(clickable),
      cta_location: getClickLocation(clickable),
      destination: href,
    });
    return;
  }

  if (href.includes("cal.com")) {
    trackEvent("scheduler_open_external", {
      cta_label: getClickLabel(clickable),
      cta_location: getClickLocation(clickable),
      destination: href,
    });
    return;
  }

  let url: URL;
  try {
    url = new URL(href, window.location.origin);
  } catch {
    return;
  }

  if (isLeadIntentHref(url)) {
    trackEvent("lead_cta_click", {
      cta_label: getClickLabel(clickable),
      cta_location: getClickLocation(clickable),
      destination: `${url.pathname}${url.hash}`,
    });
  }
}

function setupViewTracking() {
  if (!isBrowser() || typeof IntersectionObserver === "undefined") {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        const element = entry.target as HTMLElement;
        const eventName = element.dataset.analyticsViewEvent;

        if (!eventName || element.dataset[TRACKED_VIEW_FLAG] === "true") {
          observer.unobserve(element);
          continue;
        }

        element.dataset[TRACKED_VIEW_FLAG] = "true";
        trackEvent(eventName, {
          cta_label: element.dataset.analyticsLabel || undefined,
          cta_location: element.dataset.analyticsLocation || getClickLocation(element),
        });
        observer.unobserve(element);
      }
    },
    {
      threshold: 0.35,
    },
  );

  const registerViewElements = () => {
    const elements = document.querySelectorAll<HTMLElement>("[data-analytics-view-event]");
    for (const element of elements) {
      if (element.dataset[OBSERVED_VIEW_FLAG] === "true") {
        continue;
      }

      element.dataset[OBSERVED_VIEW_FLAG] = "true";
      observer.observe(element);
    }
  };

  registerViewElements();

  const mutationObserver = new MutationObserver(() => {
    registerViewElements();
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  window.__hmAnalyticsMutationObserver = mutationObserver;
}

export function initAnalytics() {
  if (!isBrowser() || window.__hmAnalyticsInitialized) {
    return;
  }

  window.__hmAnalyticsInitialized = true;
  ensureAttribution();
  trackPageView(window.location.pathname + window.location.search, document.title);
  document.addEventListener("click", handleClickTracking, { capture: true });
  setupViewTracking();
}
