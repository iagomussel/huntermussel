import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "src", "content", "blog");
const SITEMAP_PATH = path.join(ROOT, "public", "sitemap.xml");
const SITE_URL = (process.env.SITE_URL || "https://huntermussel.com").replace(/\/+$/, "");

function toIsoDate(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().split("T")[0];
}

function xmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  const lines = [
    "  <url>",
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod ? `    <lastmod>${xmlEscape(lastmod)}</lastmod>` : null,
    changefreq ? `    <changefreq>${xmlEscape(changefreq)}</changefreq>` : null,
    priority ? `    <priority>${xmlEscape(String(priority))}</priority>` : null,
    "  </url>",
  ].filter(Boolean);
  return lines.join("\n");
}

async function readBlogEntries() {
  const entries = [];
  const now = new Date();
  const files = await fs.readdir(BLOG_DIR);

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const fullPath = path.join(BLOG_DIR, file);
    const raw = await fs.readFile(fullPath, "utf8");
    const parsed = matter(raw);
    const status = parsed.data.status || "published";
    const rawDate = parsed.data.date || null;
    const date = rawDate ? new Date(rawDate) : null;
    const isFuture = date && !Number.isNaN(date.getTime()) && date > now;

    if (status === "draft" || isFuture) continue;

    const slug = file.replace(/\.md$/, "");
    const lastmod = toIsoDate(rawDate);
    entries.push({
      loc: `${SITE_URL}/blog/${slug}`,
      lastmod,
      changefreq: "monthly",
      priority: "0.8",
    });
  }

  return entries.sort((a, b) => (a.loc < b.loc ? -1 : 1));
}

async function generateSitemap() {
  const today = toIsoDate(new Date());
  const blogEntries = await readBlogEntries();
  const pages = [
    {
      loc: `${SITE_URL}/`,
      lastmod: today,
      changefreq: "monthly",
      priority: "1.0",
    },
    {
      loc: `${SITE_URL}/blog`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.9",
    },
    ...blogEntries,
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pages.map(urlEntry),
    "</urlset>",
    "",
  ].join("\n");

  await fs.writeFile(SITEMAP_PATH, xml, "utf8");
  console.log(`Generated sitemap with ${pages.length} URLs at ${SITEMAP_PATH}`);
}

generateSitemap().catch((error) => {
  console.error("Failed to generate sitemap:", error);
  process.exitCode = 1;
});
