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
  "ai-model-picker",
  "alpha-channel-splitter",
  "background-remover",
  "base64-converter",
  "chmod",
  "commit-message-generator",
  "cron-parser",
  "diff-viewer",
  "estimators",
  "hash-generator",
  "http-status",
  "image-color-palette",
  "image-crop",
  "image-format-converter",
  "image-optimizer",
  "image-resize",
  "jwt-inspector",
  "llm-cost-estimator",
  "log-viewer",
  "markdown-editor",
  "metadata-remover",
  "online-linters",
  "persona-picker",
  "prompt-optimizer",
  "regex-tester",
  "sla-calculator",
  "sprite-detector",
  "sprite-slicer",
  "sprite-splitter",
  "svg-to-png",
  "timestamp",
  "token-counter",
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
    getCollection("blog", ({ data }) => data.status !== "draft"),
    getCollection("services"),
    getCollection("cases"),
  ]);

  const blogEntries = blogPosts.map((p) =>
    entry(`${BASE}/blog/${p.id}/`, "0.7")
  );
  const serviceEntries = services.map((s) =>
    entry(`${BASE}/services/${s.id}/`, "0.7")
  );
  const caseEntries = cases.map((c) =>
    entry(`${BASE}/cases/${c.id}/`, "0.7")
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
