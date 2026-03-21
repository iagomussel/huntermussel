const SITE_URL = "https://huntermussel.com";
const ORGANIZATION_NAME = "HunterMussel";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_URL = `${SITE_URL}/img/logo.svg`;

type Thing = Record<string, unknown>;

interface OrganizationOverrides {
  description?: string;
  email?: string;
  sameAs?: string[];
  knowsAbout?: string[];
  founder?: Thing;
  contactPoint?: Thing | Thing[];
}

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface ArticleSchemaInput {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  };
  articleSection?: string;
  keywords?: string[];
  type?: "Article" | "BlogPosting";
}

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function organizationSchema(overrides: OrganizationOverrides = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: ORGANIZATION_NAME,
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
    },
    ...overrides,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: ORGANIZATION_NAME,
    url: `${SITE_URL}/`,
    publisher: {
      "@id": ORGANIZATION_ID,
    },
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

export function articleSchema(input: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "BlogPosting",
    headline: input.headline,
    description: input.description,
    image: input.image ? [absoluteUrl(input.image)] : undefined,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: input.author
      ? {
          "@type": "Person",
          name: input.author.name,
          url: input.author.url,
        }
      : undefined,
    publisher: {
      "@id": ORGANIZATION_ID,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
    articleSection: input.articleSection,
    keywords: input.keywords?.join(", "),
  };
}

export { LOGO_URL, ORGANIZATION_ID, ORGANIZATION_NAME, SITE_URL, WEBSITE_ID };
