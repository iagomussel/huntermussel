#!/usr/bin/env node
/**
 * Post a generated blog video to Instagram as a Reel.
 *
 * Requires:
 *   - Instagram Professional account (Creator/Business)
 *   - Facebook app with instagram_basic, instagram_content_publish, pages_read_engagement
 *   - Long-lived access token in INSTAGRAM_ACCESS_TOKEN
 *   - Instagram account ID in INSTAGRAM_ACCOUNT_ID
 *
 * Usage:
 *   node scripts/post-to-instagram.mjs --slug modern-automation-stack-from-scratch --format vertical --dry-run
 *   node scripts/post-to-instagram.mjs --slug modern-automation-stack-from-scratch --format vertical --publish
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { loadDotEnv } from "./load-dotenv.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VIDEO_ROOT = path.resolve(__dirname, "..");
const ROOT = path.resolve(VIDEO_ROOT, "..");

const GRAPH_API_VERSION = "v19.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

function parseArgs(argv) {
  const out = {
    slug: "",
    format: "vertical",
    caption: "",
    captionFile: "",
    publish: false,
    dryRun: false,
    skipUpload: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--slug") out.slug = argv[++i] ?? "";
    if (a === "--format") out.format = argv[++i] ?? "vertical";
    if (a === "--caption") out.caption = argv[++i] ?? "";
    if (a === "--caption-file") out.captionFile = argv[++i] ?? "";
    if (a === "--publish") out.publish = true;
    if (a === "--dry-run") out.dryRun = true;
    if (a === "--skip-upload") out.skipUpload = true;
  }
  return out;
}

function getVideoFile(slug, format) {
  const formatName =
    format === "horizontal" || format === "landscape"
      ? "horizontal"
      : format === "square"
        ? "square"
        : "vertical";
  return path.join(VIDEO_ROOT, "out", `${slug}-${formatName}.mp4`);
}

function getPublicUrl(slug, format) {
  const formatName =
    format === "horizontal" || format === "landscape"
      ? "horizontal"
      : format === "square"
        ? "square"
        : "vertical";
  const key = `videos/blog/${slug}-${formatName}.mp4`;
  const base =
    process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace(/\/$/, "") ||
    process.env.PUBLIC_ASSETS_URL?.replace(/\/$/, "") ||
    "https://assets.huntermussel.com";
  return `${base}/${key}`;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data = {};
  let currentKey = "";
  let inArray = false;
  const arrayValues = [];
  for (const line of match[1].split("\n")) {
    if (inArray) {
      const item = line.match(/^\s+-\s+(.+)/);
      if (item) {
        arrayValues.push(item[1].replace(/^["']|["']$/g, ""));
        continue;
      }
      data[currentKey] = [...arrayValues];
      arrayValues.length = 0;
      inArray = false;
    }
    const kv = line.match(/^(\w[\w-]*)\s*:\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      const value = kv[2].trim();
      if (value === "") {
        inArray = true;
        continue;
      }
      data[currentKey] = value.replace(/^["']|["']$/g, "");
    }
  }
  if (inArray && arrayValues.length) data[currentKey] = [...arrayValues];
  return data;
}

function buildCaption({ title, description, url, tags, keywords }) {
  const hashtags = (keywords || tags || [])
    .slice(0, 8)
    .map((t) => `#${t.replace(/\s+/g, "")}`)
    .join(" ");
  return `${title}\n\n${description || ""}\n\nRead the full post: ${url}\n\n${hashtags}`.trim();
}

async function graphApi({ endpoint, method = "GET", body = null }) {
  const url = new URL(endpoint.startsWith("http") ? endpoint : `${GRAPH_BASE}${endpoint}`);
  const init = { method, headers: {} };
  if (body) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }
  const res = await fetch(url.toString(), init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    throw new Error(`Graph API error ${res.status}: ${JSON.stringify(data.error || data)}`);
  }
  return data;
}

async function waitForContainer(containerId, accessToken) {
  const maxAttempts = 30;
  const delayMs = 2000;
  for (let i = 0; i < maxAttempts; i++) {
    const status = await graphApi({
      endpoint: `/${containerId}?fields=status_code&access_token=${accessToken}`,
    });
    console.log(`Container status: ${status.status_code} (attempt ${i + 1}/${maxAttempts})`);
    if (status.status_code === "FINISHED") return true;
    if (status.status_code === "ERROR") throw new Error("Instagram media processing failed");
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error("Timeout waiting for Instagram media processing");
}

const args = parseArgs(process.argv.slice(2));
loadDotEnv(path.join(ROOT, ".env"));
loadDotEnv(path.join(VIDEO_ROOT, ".env"));

if (!args.slug) {
  console.error(
    "Usage: node scripts/post-to-instagram.mjs --slug <slug> [--format vertical|square|horizontal] [--publish] [--dry-run]"
  );
  process.exit(2);
}

const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
const accountId = process.env.INSTAGRAM_ACCOUNT_ID?.trim();

if (!accessToken || !accountId) {
  console.error("Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_ACCOUNT_ID in video/.env");
  console.error("Set them and try again.");
  process.exit(1);
}

const mdPath = path.join(ROOT, "src", "content", "blog", `${args.slug}.md`);
if (!fs.existsSync(mdPath)) {
  console.error(`Blog post not found: ${mdPath}`);
  process.exit(1);
}
const frontmatter = parseFrontmatter(fs.readFileSync(mdPath, "utf-8"));
const url = `https://huntermussel.com/blog/${args.slug}/`;

let caption = args.caption;
if (!caption && args.captionFile && fs.existsSync(args.captionFile)) {
  caption = fs.readFileSync(args.captionFile, "utf-8");
}
if (!caption) {
  caption = buildCaption({
    title: frontmatter.title || args.slug,
    description: frontmatter.description || "",
    url,
    tags: frontmatter.tags,
    keywords: frontmatter.keywords,
  });
}

const videoFile = getVideoFile(args.slug, args.format);
if (!fs.existsSync(videoFile)) {
  console.error(`Video file not found: ${videoFile}`);
  console.error("Generate it first with: npm run render:blog -- --slug " + args.slug + " --format " + args.format);
  process.exit(1);
}

let videoUrl = getPublicUrl(args.slug, args.format);

if (!args.skipUpload) {
  console.log("Uploading video to R2...");
  const uploadArgs = [
    path.join(__dirname, "upload-video-to-r2.mjs"),
    "--slug",
    args.slug,
    "--format",
    args.format,
  ];
  if (args.dryRun) uploadArgs.push("--dry-run");

  const uploadResult = spawnSync(
    process.platform === "win32" ? "node.exe" : "node",
    uploadArgs,
    { cwd: VIDEO_ROOT, stdio: "inherit" }
  );
  if ((uploadResult.status ?? 1) !== 0) {
    console.error("R2 upload failed. Aborting.");
    process.exit(uploadResult.status ?? 1);
  }
}

console.log("\nInstagram post plan:");
console.log(`  Account ID: ${accountId}`);
console.log(`  Video URL:  ${videoUrl}`);
console.log(`  Caption:\n${caption.split("\n").map((l) => "    " + l).join("\n")}\n`);

if (args.dryRun) {
  console.log("[dry-run] Would create Instagram media container.");
  console.log("[dry-run] To publish for real, add --publish (requires processed container).");
  process.exit(0);
}

console.log("Creating Instagram media container...");
const createRes = await graphApi({
  endpoint: `/${accountId}/media`,
  method: "POST",
  body: {
    media_type: "REELS",
    video_url: videoUrl,
    caption,
    share_to_feed: true,
    access_token: accessToken,
  },
});

const containerId = createRes.id;
console.log(`Container created: ${containerId}`);

if (!args.publish) {
  console.log("\nContainer is ready for review.");
  console.log(`To publish, run again with: --publish --skip-upload`);
  console.log(`  node scripts/post-to-instagram.mjs --slug ${args.slug} --format ${args.format} --publish --skip-upload`);
  process.exit(0);
}

console.log("Waiting for Instagram to finish processing...");
await waitForContainer(containerId, accessToken);

console.log("Publishing to Instagram...");
const publishRes = await graphApi({
  endpoint: `/${accountId}/media_publish`,
  method: "POST",
  body: {
    creation_id: containerId,
    access_token: accessToken,
  },
});

console.log(`Published! Media ID: ${publishRes.id}`);
console.log(`URL: https://instagram.com/p/${publishRes.id}`);
