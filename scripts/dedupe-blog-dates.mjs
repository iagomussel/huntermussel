#!/usr/bin/env node
/**
 * Assign every blog article a unique publish date.
 *
 * Reads src/content/blog/*.md, sorts by current date + slug, then spreads
 * dates evenly from START_DATE through END_DATE. Rewrites only the `date`
 * frontmatter line, leaving everything else untouched.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const BLOG_DIR = new URL("../src/content/blog/", import.meta.url).pathname;
const START_DATE = new Date("2026-02-15T12:00:00Z");
const END_DATE = new Date("2026-07-02T12:00:00Z");

function* walkMarkdown(dir) {
  for (const name of readdirSync(dir)) {
    if (name.endsWith(".md")) yield join(dir, name);
  }
}

function extractDate(content) {
  const match = content.match(/^date:\s*["']?([^"'\n]+)["']?$/m);
  if (!match) return null;
  // Normalize any weird dashes (en/em dash) to ASCII hyphens
  const normalized = match[1].replace(/[–—]/g, "-");
  return new Date(`${normalized}T12:00:00Z`);
}

function formatDateISO(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

const posts = [];
for (const filePath of walkMarkdown(BLOG_DIR)) {
  const content = readFileSync(filePath, "utf8");
  const slug = filePath.split("/").pop().replace(/\.md$/, "");
  const date = extractDate(content) ?? new Date("2026-01-01T12:00:00Z");
  posts.push({ filePath, slug, content, date });
}

// Stable sort: by current date, then slug
posts.sort((a, b) => {
  const d = a.date.getTime() - b.date.getTime();
  return d !== 0 ? d : a.slug.localeCompare(b.slug);
});

const totalDays = Math.round((END_DATE - START_DATE) / 86_400_000);
const step = totalDays / (posts.length - 1);

let changed = 0;
for (let i = 0; i < posts.length; i++) {
  const post = posts[i];
  const newDate = addDays(START_DATE, Math.round(i * step));
  const newValue = formatDateISO(newDate);
  const oldMatch = post.content.match(/^date:\s*["']?([^"'\n]+)["']?$/m);
  const oldValue = oldMatch ? oldMatch[1].replace(/[–—]/g, "-") : null;

  if (oldValue !== newValue) {
    const newContent = post.content.replace(
      /^date:\s*["']?([^"'\n]+)["']?$/m,
      `date: "${newValue}"`,
    );
    writeFileSync(post.filePath, newContent, "utf8");
    console.log(`${post.slug}: ${oldValue ?? "missing"} → ${newValue}`);
    changed++;
  } else {
    console.log(`${post.slug}: ${newValue} (unchanged)`);
  }
}

console.log(`\nDone: ${changed}/${posts.length} files updated.`);
