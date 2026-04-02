#!/usr/bin/env node
/**
 * Upload public/images/** and public/img/** to Cloudflare R2 using .env:
 * CLOUDFLARE_R2_ENDPOINT, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY,
 * CLOUDFLARE_R2_BUCKET
 *
 * Object keys match URL paths: images/blog/foo.webp, img/logo.svg
 *
 * Usage: npm run upload:assets
 *        node scripts/upload-assets-to-r2.mjs --dry-run
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { loadDotEnv } from "./load-dotenv.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
loadDotEnv(join(root, ".env"));

const dryRun = process.argv.includes("--dry-run");

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

const MIME = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
};

function* walkFiles(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walkFiles(p);
    else yield p;
  }
}

function contentType(filePath) {
  const lower = filePath.toLowerCase();
  const dot = lower.lastIndexOf(".");
  const ext = dot >= 0 ? lower.slice(dot) : "";
  return MIME[ext] ?? "application/octet-stream";
}

const publicDir = join(root, "public");
const prefixes = ["images", "img"];
const files = [];

for (const prefix of prefixes) {
  const abs = join(publicDir, prefix);
  if (!existsSync(abs)) {
    console.warn(`Skip missing folder: public/${prefix}/`);
    continue;
  }
  for (const filePath of walkFiles(abs)) {
    const key = relative(publicDir, filePath).split("\\").join("/");
    files.push({ filePath, key });
  }
}

if (files.length === 0) {
  console.error(
    "No files under public/images/ or public/img/. Add blog/case images to public/images/ (same paths as in markdown) then run again.",
  );
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const bucket = process.env.CLOUDFLARE_R2_BUCKET;

let ok = 0;
for (const { filePath, key } of files) {
  const body = readFileSync(filePath);
  const ct = contentType(filePath);
  if (dryRun) {
    console.log(`[dry-run] ${key} (${body.length} bytes, ${ct})`);
    ok++;
    continue;
  }
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: ct,
      CacheControl: "public, max-age=86400",
    }),
  );
  console.log(`Uploaded ${key}`);
  ok++;
}

console.log(`\nDone: ${ok} object(s)${dryRun ? " (dry run)" : ""}.`);
const base =
  process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace(/\/$/, "") ||
  process.env.PUBLIC_ASSETS_URL?.replace(/\/$/, "") ||
  "https://assets.huntermussel.com";
console.log(`Public URL base: ${base}/`);
