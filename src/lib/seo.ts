export const SITE_NAME = "HunterMussel";
export const SITE_URL = "https://huntermussel.com";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/placeholder.svg`;
export const DEFAULT_LOGO_IMAGE = `${SITE_URL}/placeholder.svg`;
export const DEFAULT_DESCRIPTION =
  "Automate and optimize your company's process management with Artificial Intelligence, intelligent automation, and DevOps.";
export const DEFAULT_KEYWORDS = [
  "process management",
  "artificial intelligence",
  "AI automation",
  "DevOps",
  "workflow automation",
  "RPA",
  "cloud infrastructure",
  "software engineering",
  "digital transformation",
];

type JsonLdObject = Record<string, unknown>;

export function toAbsoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function parseCsvValue(value: unknown): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function buildKeywords(...sources: Array<unknown>): string {
  const all = [...DEFAULT_KEYWORDS];

  for (const source of sources) {
    if (typeof source === "string") {
      all.push(...parseCsvValue(source));
      if (!source.includes(",")) {
        const trimmed = source.trim();
        if (trimmed) all.push(trimmed);
      }
      continue;
    }

    if (Array.isArray(source)) {
      for (const item of source) {
        if (typeof item === "string") all.push(item.trim());
      }
    }
  }

  return Array.from(new Set(all.filter(Boolean))).join(", ");
}

function toIsoDateTime(value: unknown): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

function isHttpsUrl(value: string): boolean {
  return /^https:\/\/[^\s]+$/i.test(value);
}

export function createOrganizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    logo: {
      "@type": "ImageObject",
      url: DEFAULT_LOGO_IMAGE,
    },
    founder: {
      "@type": "Person",
      name: "Iago Mussel",
      jobTitle: "CEO & Founder",
    },
    areaServed: "Worldwide",
    knowsAbout: [
      "Artificial Intelligence",
      "Process Management",
      "DevOps",
      "Automation",
      "Machine Learning",
    ],
    serviceType: [
      "AI Process Management",
      "Intelligent Automation",
      "CI/CD & DevOps",
      "Cloud Infrastructure",
    ],
  };
}

interface BlogPostingInput {
  title: string;
  description?: string;
  canonicalUrl: string;
  imageUrl: string;
  authorName: string;
  keywords?: string;
  publishedDate?: string;
  modifiedDate?: string;
}

export function createBlogPostingJsonLd(
  input: BlogPostingInput,
): JsonLdObject | null {
  if (!input.title) return null;
  if (!isHttpsUrl(input.canonicalUrl) || !isHttpsUrl(input.imageUrl))
    return null;

  const published = toIsoDateTime(input.publishedDate);
  const modified = toIsoDateTime(input.modifiedDate) ?? published;
  const description = input.description?.trim() || input.title;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.canonicalUrl,
    },
    url: input.canonicalUrl,
    datePublished: published,
    dateModified: modified,
    isAccessibleForFree: true,
    inLanguage: "en",
    image: [input.imageUrl],
    author: {
      "@type": "Person",
      name: input.authorName,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: DEFAULT_LOGO_IMAGE,
      },
    },
    keywords: input.keywords,
  };
}
