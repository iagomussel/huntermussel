import { getCollection } from "astro:content";

const BASE = "https://huntermussel.com";
const lastmod = new Date().toISOString();

const STATIC_PAGES = [
  { url: `${BASE}/`,          priority: "1.0" },
  { url: `${BASE}/blog/`,     priority: "0.9" },
  { url: `${BASE}/cases/`,    priority: "0.9" },
  { url: `${BASE}/services/`, priority: "0.9" },
  { url: `${BASE}/about/`,    priority: "0.9" },
  { url: `${BASE}/contact/`,  priority: "0.8" },
  { url: `${BASE}/tools/`,    priority: "1.0" },
];

const TOOLS = [
  "alpha-channel-splitter",
  "base64-converter",
  "chmod",
  "cron-parser",
  "diff-viewer",
  "estimators",
  "hash-generator",
  "http-status",
  "image-color-palette",
  "image-format-converter",
  "image-optimizer",
  "json-formatter",
  "jwt-inspector",
  "log-viewer",
  "markdown-editor",
  "online-linters",
  "prompt-optimizer",
  "regex-tester",
  "sla-calculator",
  "sprite-slicer",
  "svg-to-png",
  "timestamp",
  "uuid",
  "yaml-json",
].map((slug) => ({ url: `${BASE}/tools/${slug}/`, priority: "0.7" }));

function entry(url: string, priority: string): string {
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET() {
  const [blogPosts, services, cases] = await Promise.all([
    getCollection("blog", ({ data }) => data.status === "published"),
    getCollection("services"),
    getCollection("cases"),
  ]);

  const blogEntries = blogPosts.map((p) =>
    entry(`${BASE}/blog/${p.slug}/`, "0.7")
  );
  const serviceEntries = services.map((s) =>
    entry(`${BASE}/services/${s.slug}/`, "0.7")
  );
  const caseEntries = cases.map((c) =>
    entry(`${BASE}/cases/${c.slug}/`, "0.7")
  );
  const staticEntries = STATIC_PAGES.map((p) => entry(p.url, p.priority));
  const toolEntries = TOOLS.map((t) => entry(t.url, t.priority));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...toolEntries, ...blogEntries, ...serviceEntries, ...caseEntries].join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
