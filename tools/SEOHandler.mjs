import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const SITE_URL = (process.env.SITE_URL || "https://huntermussel.com").replace(/\/+$/, "");

const BLOG_DIR = path.join(ROOT, "src", "content", "blog");
const SITEMAP_PATH = path.join(ROOT, "public", "sitemap.xml");
const DIST_DIR = path.join(ROOT, "dist");

const SITE_NAME = "HunterMussel";
const DEFAULT_DESCRIPTION =
  "Automate and optimize your company's process management with Artificial Intelligence, intelligent automation, and DevOps.";
const DEFAULT_IMAGE = `${SITE_URL}/placeholder.svg`;
const DEFAULT_KEYWORDS =
  "process management, artificial intelligence, AI automation, DevOps, workflow automation, RPA, cloud infrastructure, software engineering, digital transformation";
const AUTHOR_NAME = "Iago Mussel";

function toIsoDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function toIsoDateOnly(value) {
  const iso = toIsoDate(value);
  return iso ? iso.split("T")[0] : null;
}

function xmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function escapeHtmlAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function ensureAbsoluteUrl(value) {
  if (!value || typeof value !== "string") return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function markdownToExcerpt(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[#>*_\-\n]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function replaceOrInsert(html, pattern, replacement) {
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace("</head>", `  ${replacement}\n</head>`);
}

function buildArticleJsonLd({ title, description, canonicalUrl, imageUrl, publishedDate, modifiedDate }) {
  const publishedIso = toIsoDate(publishedDate);
  const modifiedIso = toIsoDate(modifiedDate) || publishedIso;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    url: canonicalUrl,
    datePublished: publishedIso,
    dateModified: modifiedIso,
    isAccessibleForFree: true,
    inLanguage: "en",
    image: [imageUrl],
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: DEFAULT_IMAGE,
      },
    },
  };
}

function applyBlogMetadata(html, { title, description, canonicalUrl, imageUrl, keywords, jsonLd }) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const escapedTitle = escapeHtmlAttribute(fullTitle);
  const escapedDescription = escapeHtmlAttribute(description);
  const escapedCanonical = escapeHtmlAttribute(canonicalUrl);
  const escapedImage = escapeHtmlAttribute(imageUrl);
  const escapedKeywords = escapeHtmlAttribute(keywords);
  const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  let result = html;
  result = replaceOrInsert(result, /<title>[\s\S]*?<\/title>/i, `<title>${escapedTitle}</title>`);
  result = replaceOrInsert(
    result,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapedDescription}" />`,
  );
  result = replaceOrInsert(
    result,
    /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="keywords" content="${escapedKeywords}" />`,
  );
  result = replaceOrInsert(
    result,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapedCanonical}" />`,
  );

  result = replaceOrInsert(
    result,
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:type" content="article" />`,
  );
  result = replaceOrInsert(
    result,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapedTitle}" />`,
  );
  result = replaceOrInsert(
    result,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapedDescription}" />`,
  );
  result = replaceOrInsert(
    result,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapedCanonical}" />`,
  );
  result = replaceOrInsert(
    result,
    /<meta\s+property="og:site_name"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
  );
  result = replaceOrInsert(
    result,
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${escapedImage}" />`,
  );

  result = replaceOrInsert(
    result,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapedTitle}" />`,
  );
  result = replaceOrInsert(
    result,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapedDescription}" />`,
  );
  result = replaceOrInsert(
    result,
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${escapedImage}" />`,
  );

  result = result.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script type="application/ld+json">${jsonLdHtml}</script>`,
  );

  return result;
}

async function readPublishedBlogPosts() {
  const now = new Date();
  const files = await fs.readdir(BLOG_DIR);
  const posts = [];

  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    const fullPath = path.join(BLOG_DIR, file);
    const raw = await fs.readFile(fullPath, "utf8");
    const parsed = matter(raw);
    const status = parsed.data.status || "published";
    const publishedDate = parsed.data.date || null;
    const parsedDate = publishedDate ? new Date(publishedDate) : null;
    const isFuture = parsedDate && !Number.isNaN(parsedDate.getTime()) && parsedDate > now;
    if (status === "draft" || isFuture) continue;

    const slug = file.replace(/\.md$/, "");
    const excerpt = markdownToExcerpt(parsed.content);
    const description = String(parsed.data.description || "").trim() || excerpt.slice(0, 180) || DEFAULT_DESCRIPTION;

    posts.push({
      slug,
      title: String(parsed.data.title || slug),
      description,
      publishedDate,
      modifiedDate: parsed.data.updated || publishedDate,
      imageUrl: ensureAbsoluteUrl(parsed.data.image || DEFAULT_IMAGE),
      keywords: String(parsed.data.keywords || parsed.data.tags || DEFAULT_KEYWORDS),
    });
  }

  return posts.sort((a, b) => (a.slug < b.slug ? -1 : 1));
}

function buildSitemapXml(entries) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const entry of entries) {
    lines.push("  <url>");
    lines.push(`    <loc>${xmlEscape(entry.loc)}</loc>`);
    if (entry.lastmod) lines.push(`    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>`);
    if (entry.changefreq) lines.push(`    <changefreq>${xmlEscape(entry.changefreq)}</changefreq>`);
    if (entry.priority) lines.push(`    <priority>${xmlEscape(String(entry.priority))}</priority>`);
    lines.push("  </url>");
  }

  lines.push("</urlset>", "");
  return lines.join("\n");
}

async function generateSitemap(posts) {
  const today = toIsoDateOnly(new Date());
  const staticPages = [
    { loc: `${SITE_URL}/`, lastmod: today, changefreq: "monthly", priority: "1.0" },
    { loc: `${SITE_URL}/blog`, lastmod: today, changefreq: "weekly", priority: "0.9" },
  ];
  const blogPages = posts.map((post) => ({
    loc: `${SITE_URL}/blog/${post.slug}`,
    lastmod: toIsoDateOnly(post.modifiedDate || post.publishedDate),
    changefreq: "monthly",
    priority: "0.8",
  }));

  const xml = buildSitemapXml([...staticPages, ...blogPages]);
  await fs.writeFile(SITEMAP_PATH, xml, "utf8");
  console.log(`Generated sitemap with ${staticPages.length + blogPages.length} URLs at ${SITEMAP_PATH}`);
}

async function generatePrerenderedBlogPages(posts) {
  const templatePath = path.join(DIST_DIR, "index.html");
  const template = await fs.readFile(templatePath, "utf8");

  for (const post of posts) {
    const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
    const jsonLd = buildArticleJsonLd({
      title: post.title,
      description: post.description,
      canonicalUrl,
      imageUrl: post.imageUrl,
      publishedDate: post.publishedDate,
      modifiedDate: post.modifiedDate,
    });

    const html = applyBlogMetadata(template, {
      title: post.title,
      description: post.description,
      canonicalUrl,
      imageUrl: post.imageUrl,
      keywords: post.keywords,
      jsonLd,
    });

    const outputDir = path.join(DIST_DIR, "blog", post.slug);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(path.join(outputDir, "index.html"), html, "utf8");
  }

  console.log(`Generated ${posts.length} prerendered blog page(s) in dist/blog/*`);
}

async function run(mode) {
  const posts = await readPublishedBlogPosts();
  await generateSitemap(posts);

  if (mode === "pre") {
    console.log("SEO prebuild completed.");
    return;
  }

  await generatePrerenderedBlogPages(posts);
}

const mode = process.argv.includes("--pre") ? "pre" : "post";
run(mode).catch((error) => {
  console.error("SEOHandler failed:", error);
  process.exitCode = 1;
});
