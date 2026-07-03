#!/usr/bin/env node
/**
 * Upload a generated video from video/out/ to Cloudflare R2.
 *
 * Usage:
 *   node scripts/upload-video-to-r2.mjs --slug modern-automation-stack-from-scratch --format vertical
 *   node scripts/upload-video-to-r2.mjs --file out/custom-video.mp4 --key videos/blog/custom.mp4
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { loadDotEnv } from "./load-dotenv.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VIDEO_ROOT = path.resolve(__dirname, "..");
const ROOT = path.resolve(VIDEO_ROOT, "..");

function parseArgs(argv) {
  const out = {
    slug: "",
    format: "vertical",
    file: "",
    key: "",
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--slug") out.slug = argv[++i] ?? "";
    if (a === "--format") out.format = argv[++i] ?? "vertical";
    if (a === "--file") out.file = argv[++i] ?? "";
    if (a === "--key") out.key = argv[++i] ?? "";
    if (a === "--dry-run") out.dryRun = true;
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

function getPublicUrl(key) {
  const base =
    process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace(/\/$/, "") ||
    process.env.PUBLIC_ASSETS_URL?.replace(/\/$/, "") ||
    "https://assets.huntermussel.com";
  return `${base}/${key}`;
}

const args = parseArgs(process.argv.slice(2));

// Load root .env first, then video/.env can override if needed
loadDotEnv(path.join(ROOT, ".env"));
loadDotEnv(path.join(VIDEO_ROOT, ".env"));

const required = [
  "CLOUDFLARE_R2_ENDPOINT",
  "CLOUDFLARE_R2_ACCESS_KEY_ID",
  "CLOUDFLARE_R2_SECRET_ACCESS_KEY",
  "CLOUDFLARE_R2_BUCKET",
];
for (const key of required) {
  if (!process.env[key]?.trim()) {
    console.error(`Missing ${key} in .env`);
    process.exit(1);
  }
}

let filePath = args.file;
let objectKey = args.key;

if (!filePath) {
  if (!args.slug) {
    console.error("Provide --file or --slug.");
    process.exit(2);
  }
  filePath = getVideoFile(args.slug, args.format);
}

if (!objectKey) {
  if (!args.slug) {
    console.error("Provide --key or --slug.");
    process.exit(2);
  }
  const formatName =
    args.format === "horizontal" || args.format === "landscape"
      ? "horizontal"
      : args.format === "square"
        ? "square"
        : "vertical";
  objectKey = `videos/blog/${args.slug}-${formatName}.mp4`;
}

const absoluteFilePath = path.isAbsolute(filePath) ? filePath : path.join(VIDEO_ROOT, filePath);
if (!fs.existsSync(absoluteFilePath)) {
  console.error(`Video file not found: ${absoluteFilePath}`);
  process.exit(1);
}

const body = fs.readFileSync(absoluteFilePath);

if (args.dryRun) {
  console.log(`[dry-run] Would upload ${absoluteFilePath}`);
  console.log(`[dry-run] Key: ${objectKey} (${body.length} bytes)`);
  console.log(`[dry-run] Public URL: ${getPublicUrl(objectKey)}`);
  process.exit(0);
}

const client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

await client.send(
  new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET,
    Key: objectKey,
    Body: body,
    ContentType: "video/mp4",
    CacheControl: "public, max-age=86400",
  })
);

const publicUrl = getPublicUrl(objectKey);
console.log(`Uploaded ${objectKey}`);
console.log(`Public URL: ${publicUrl}`);
console.log(`Size: ${(body.length / 1024 / 1024).toFixed(2)} MB`);
