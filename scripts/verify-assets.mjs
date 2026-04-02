#!/usr/bin/env node
/**
 * Checks that URLs under https://assets.huntermussel.com referenced in src/ return HTTP 200.
 * Run after uploading the same paths to R2 (or your CDN). Usage: node scripts/verify-assets.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src");

const ASSET_URL_RE = /https:\/\/assets\.huntermussel\.com[^\s"'>)]+/g;

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules") continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (/\.(md|astro|tsx|ts|jsx|js)$/.test(name)) files.push(p);
  }
  return files;
}

const urls = new Set();
for (const file of walk(srcDir)) {
  const text = readFileSync(file, "utf8");
  let m;
  ASSET_URL_RE.lastIndex = 0;
  while ((m = ASSET_URL_RE.exec(text)) !== null) {
    urls.add(m[0].replace(/[,;.]+$/, ""));
  }
}

const list = [...urls].sort();
if (list.length === 0) {
  console.log("No asset URLs found under src/.");
  process.exit(0);
}

const failures = [];
for (const url of list) {
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow" });
    const ok = res.ok;
    process.stdout.write(ok ? "." : "x");
    if (!ok) failures.push({ url, code: String(res.status) });
  } catch {
    process.stdout.write("x");
    failures.push({ url, code: "error" });
  }
}

console.log(`\n${list.length} URL(s) checked.`);

if (failures.length > 0) {
  console.error("\nFailed:");
  for (const f of failures) {
    console.error(`  [${f.code}] ${f.url}`);
  }
  process.exit(1);
}

console.log("All asset URLs returned 2xx.");
