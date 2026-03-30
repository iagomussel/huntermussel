import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..", "..");
const VIDEO_ROOT = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const out = {slug: "", format: "landscape", outFile: ""};
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
  if (!match) return {data: {}, content: raw};

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

  return {data, content};
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

  return paragraphs.slice(0, max).map((p) => (p.length > 88 ? p.slice(0, 85) + "…" : p));
}

function safeMkdir(dir) {
  fs.mkdirSync(dir, {recursive: true});
}

function copyBlogImageToVideoPublic(imagePathFromFrontmatter) {
  if (!imagePathFromFrontmatter) return undefined;
  if (!imagePathFromFrontmatter.startsWith("/")) return undefined;

  const rel = imagePathFromFrontmatter.replace(/^\//, "");
  const srcPath = path.join(ROOT, "public", rel);
  if (!fs.existsSync(srcPath)) return undefined;

  const fileName = path.basename(imagePathFromFrontmatter);
  const destDir = path.join(VIDEO_ROOT, "public", "blog");
  const destPath = path.join(destDir, fileName);
  safeMkdir(destDir);
  fs.copyFileSync(srcPath, destPath);
  return path.posix.join("blog", fileName);
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

export function blogToProps({slug}) {
  if (!slug) throw new Error("Missing --slug");
  const mdPath = path.join(ROOT, "src", "content", "blog", `${slug}.md`);
  if (!fs.existsSync(mdPath)) throw new Error(`Blog post not found: ${mdPath}`);

  const raw = fs.readFileSync(mdPath, "utf-8");
  const {data, content} = parseFrontmatter(raw);

  const title = data.title || slug;
  const subtitle = data.subtitle || data.description || "";
  const bullets = extractBullets(content, 5);
  const url = `https://huntermussel.com/blog/${slug}/`;
  const imageFile = copyBlogImageToVideoPublic(data.image);

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
  const props = blogToProps({slug: args.slug});

  if (args.outFile) {
    const outPath = path.isAbsolute(args.outFile) ? args.outFile : path.join(VIDEO_ROOT, args.outFile);
    safeMkdir(path.dirname(outPath));
    fs.writeFileSync(outPath, JSON.stringify(props, null, 2));
    process.stdout.write(outPath + "\n");
  } else {
    process.stdout.write(JSON.stringify(props, null, 2) + "\n");
  }
}
