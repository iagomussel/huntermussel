import { getCollection } from "astro:content";
import { basename } from "node:path";

const BASE = "https://huntermussel.com";
const today = new Date().toISOString().slice(0, 10);

const STATIC_PAGES = [
  { url: `${BASE}/`,          priority: "1.0" },
  { url: `${BASE}/blog/`,     priority: "0.9" },
  { url: `${BASE}/cases/`,    priority: "0.9" },
  { url: `${BASE}/services/`, priority: "0.9" },
  { url: `${BASE}/about/`,    priority: "0.9" },
  { url: `${BASE}/contact/`,  priority: "0.8" },
  { url: `${BASE}/tools/`,    priority: "1.0" },
  { url: `${BASE}/pt/`,       priority: "0.8" },
];

function discoverTools(): string[] {
  const toolFiles = import.meta.glob("./tools/*.astro");
  return Object.keys(toolFiles)
    .map((path) => basename(path, ".astro"))
    .filter((slug) => slug !== "index")
    .sort();
}

function formatDate(date: Date | string | undefined): string | undefined {
  if (!date) return undefined;
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

function entry(url: string, priority: string, lastmod?: string): string {
  const lastmodXml = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
  return `  <url>
    <loc>${url}</loc>${lastmodXml}
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

  const staticEntries = STATIC_PAGES.map((p) => entry(p.url, p.priority, today));

  const toolSlugs = discoverTools();
  const toolEntries = toolSlugs.map((slug) =>
    entry(`${BASE}/tools/${slug}/`, "0.7", today)
  );

  const blogEntries = blogPosts
    .sort((a, b) => (a.data.date && b.data.date ? b.data.date.getTime() - a.data.date.getTime() : 0))
    .map((p) => entry(`${BASE}/blog/${p.id}/`, "0.7", formatDate(p.data.date) || today));

  const serviceEntries = services.map((s) =>
    entry(`${BASE}/services/${s.id}/`, "0.7", formatDate(s.data.date) || today)
  );

  const caseEntries = cases.map((c) =>
    entry(`${BASE}/cases/${c.id}/`, "0.7", formatDate(c.data.date) || today)
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[
  ...staticEntries,
  ...toolEntries,
  ...blogEntries,
  ...serviceEntries,
  ...caseEntries,
].join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
