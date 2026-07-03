#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..", "..");
const VIDEO_ROOT = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const out = { slug: "", format: "landscape", outFile: "" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--slug") out.slug = argv[++i] ?? "";
    if (a === "--format") out.format = argv[++i] ?? "landscape";
    if (a === "--out") out.outFile = argv[++i] ?? "";
  }
  return out;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const yamlBlock = match[1];
  const content = match[2];

  const data = {};
  let currentKey = "";
  let inArray = false;
  const arrayValues = [];

  for (const line of yamlBlock.split("\n")) {
    if (inArray) {
      const arrayItem = line.match(/^\s+-\s+(.+)/);
      if (arrayItem) {
        arrayValues.push(arrayItem[1].replace(/^["']|["']$/g, ""));
        continue;
      }
      data[currentKey] = [...arrayValues];
      arrayValues.length = 0;
      inArray = false;
    }

    const kvMatch = line.match(/^(\w[\w-]*)\s*:\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();
      if (value === "") {
        inArray = true;
        continue;
      }
      data[currentKey] = value.replace(/^["']|["']$/g, "");
    }
  }

  if (inArray && arrayValues.length > 0) data[currentKey] = [...arrayValues];

  return { data, content };
}

function extractBullets(markdown, max = 5) {
  const lines = markdown.split("\n");
  const headings = [];
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)\s*$/);
    if (h2) headings.push(h2[1].trim());
  }
  if (headings.length) return headings.slice(0, max);

  const paragraphs = markdown
    .replace(/```[\s\S]*?```/g, "")
    .split(/\n{2,}/)
    .map((p) => p.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .filter((p) => !p.startsWith("<!--"));

  return paragraphs
    .slice(0, max)
    .map((p) => (p.length > 88 ? p.slice(0, 85) + "…" : p));
}

function safeMkdir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Failed to download image ${url}: ${res.status}`);
      return false;
    }
    safeMkdir(path.dirname(destPath));
    fs.writeFileSync(destPath, Buffer.from(await res.arrayBuffer()));
    return true;
  } catch (err) {
    console.warn(`Error downloading image ${url}: ${err.message}`);
    return false;
  }
}

function copyLocalImage(srcPath, destPath) {
  try {
    safeMkdir(path.dirname(destPath));
    fs.copyFileSync(srcPath, destPath);
    return true;
  } catch (err) {
    console.warn(`Error copying local image ${srcPath}: ${err.message}`);
    return false;
  }
}

async function resolveCoverImage(slug, imageUrlFromFrontmatter) {
  const destDir = path.join(VIDEO_ROOT, "public", "blog");
  safeMkdir(destDir);

  // 1. Full CDN URL -> download to video/public/blog/<slug>.webp
  if (imageUrlFromFrontmatter?.startsWith("http")) {
    const ext = path.extname(new URL(imageUrlFromFrontmatter).pathname) || ".webp";
    const destName = `${slug}${ext}`;
    const destPath = path.join(destDir, destName);
    if (fs.existsSync(destPath)) return path.posix.join("blog", destName);
    const ok = await downloadImage(imageUrlFromFrontmatter, destPath);
    if (ok) return path.posix.join("blog", destName);
  }

  // 2. Local absolute path starting with /images/ or /blog/
  if (imageUrlFromFrontmatter?.startsWith("/")) {
    const rel = imageUrlFromFrontmatter.replace(/^\//, "");
    const srcPath = path.join(ROOT, "public", rel);
    if (fs.existsSync(srcPath)) {
      const destName = path.basename(rel);
      const destPath = path.join(destDir, destName);
      if (copyLocalImage(srcPath, destPath)) {
        return path.posix.join("blog", destName);
      }
    }
  }

  // 3. Try local generated cover in public/images/blog/<slug>.webp
  const localCover = path.join(ROOT, "public", "images", "blog", `${slug}.webp`);
  if (fs.existsSync(localCover)) {
    const destName = `${slug}.webp`;
    const destPath = path.join(destDir, destName);
    if (copyLocalImage(localCover, destPath)) {
      return path.posix.join("blog", destName);
    }
  }

  console.warn(`No cover image found for ${slug}. Video will render without a background image.`);
  return undefined;
}

function loadBrandConfig() {
  const brandPath = path.join(VIDEO_ROOT, "brand.json");
  if (!fs.existsSync(brandPath)) {
    return {
      name: "HunterMussel",
      website: "huntermussel.com",
      handle: "@huntermussel",
      primaryColor: "#00C2FF",
      secondaryColor: "#7C3AED",
      backgroundColor: "#050A14",
      textColor: "#F8FAFC",
      logoFile: "logo.svg",
    };
  }
  return JSON.parse(fs.readFileSync(brandPath, "utf-8"));
}

export async function blogToProps({ slug }) {
  if (!slug) throw new Error("Missing --slug");
  const mdPath = path.join(ROOT, "src", "content", "blog", `${slug}.md`);
  if (!fs.existsSync(mdPath)) throw new Error(`Blog post not found: ${mdPath}`);

  const raw = fs.readFileSync(mdPath, "utf-8");
  const { data, content } = parseFrontmatter(raw);

  const title = data.title || slug;
  const subtitle = data.subtitle || data.description || "";
  const bullets = extractBullets(content, 5);
  const url = `https://huntermussel.com/blog/${slug}/`;
  const imageFile = await resolveCoverImage(slug, data.image);

  return {
    title,
    subtitle,
    bullets,
    url,
    imageFile,
    brand: loadBrandConfig(),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const args = parseArgs(process.argv.slice(2));
  const props = await blogToProps({ slug: args.slug });

  if (args.outFile) {
    const outPath = path.isAbsolute(args.outFile)
      ? args.outFile
      : path.join(VIDEO_ROOT, args.outFile);
    safeMkdir(path.dirname(outPath));
    fs.writeFileSync(outPath, JSON.stringify(props, null, 2));
    process.stdout.write(outPath + "\n");
  } else {
    process.stdout.write(JSON.stringify(props, null, 2) + "\n");
  }
}
