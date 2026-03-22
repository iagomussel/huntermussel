/**
 * RAG Content Pipeline
 *
 * Crawls site content (blog, services, FAQ, llms.txt), chunks it,
 * generates embeddings via Cloudflare Workers AI, and upserts into Vectorize.
 *
 * Usage:
 *   CLOUDFLARE_API_TOKEN=xxx CLOUDFLARE_ACCOUNT_ID=xxx npx tsx scripts/index-content.ts
 *
 * Optional env vars:
 *   VECTORIZE_INDEX=huntermussel-content (default)
 *   R2_BUCKET=huntermussel-content (default)
 *   DRY_RUN=true (skip upsert, just print chunks)
 */

import fs from "node:fs";
import path from "node:path";

// --- Configuration ---

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const VECTORIZE_INDEX = process.env.VECTORIZE_INDEX || "huntermussel-content";
const R2_BUCKET = process.env.R2_BUCKET || "huntermussel-content";
const DRY_RUN = process.env.DRY_RUN === "true";
const EMBEDDING_MODEL = "@cf/baai/bge-base-en-v1.5";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT_DIR = path.join(ROOT, "src", "content");
const FAQ_PATH = path.join(ROOT, "src", "data", "faq.ts");
const LLMS_TXT_PATH = path.join(ROOT, "public", "llms.txt");

// --- Types ---

interface ContentChunk {
  id: string;
  content: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceType: "blog" | "service" | "faq" | "homepage";
}

interface VectorEntry {
  id: string;
  values: number[];
  metadata: Record<string, string>;
}

// --- Markdown helpers ---

function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const yamlBlock = match[1];
  const content = match[2];

  const data: Record<string, unknown> = {};
  let currentKey = "";
  let inArray = false;
  const arrayValues: string[] = [];

  for (const line of yamlBlock.split("\n")) {
    if (inArray) {
      const arrayItem = line.match(/^\s+-\s+(.+)/);
      if (arrayItem) {
        arrayValues.push(arrayItem[1].replace(/^["']|["']$/g, ""));
        continue;
      } else {
        data[currentKey] = [...arrayValues];
        arrayValues.length = 0;
        inArray = false;
      }
    }

    const kvMatch = line.match(/^(\w[\w-]*)\s*:\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();
      if (value === "") {
        // Might be an array on next lines
        inArray = true;
        continue;
      }
      data[currentKey] = value.replace(/^["']|["']$/g, "");
    }
  }

  if (inArray && arrayValues.length > 0) {
    data[currentKey] = [...arrayValues];
  }

  return { data, content };
}

function stripMarkdown(text: string): string {
  return (
    text
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Remove markdown images
      .replace(/!\[.*?\]\(.*?\)/g, "")
      // Remove markdown links but keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Remove headers markers
      .replace(/^#{1,6}\s+/gm, "")
      // Remove bold/italic
      .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2")
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      // Remove inline code
      .replace(/`([^`]+)`/g, "$1")
      // Remove blockquotes
      .replace(/^>\s+/gm, "")
      // Remove horizontal rules
      .replace(/^[-*_]{3,}$/gm, "")
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, "")
      // Normalize whitespace
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

// --- Chunking ---

function estimateTokens(text: string): number {
  // Rough estimate: ~4 chars per token for English
  return Math.ceil(text.length / 4);
}

function chunkText(
  text: string,
  minTokens = 300,
  maxTokens = 800,
  overlapTokens = 50
): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const combined = current ? current + " " + sentence : sentence;

    if (estimateTokens(combined) > maxTokens && current) {
      chunks.push(current.trim());
      // Overlap: take last ~overlapTokens worth of text from current chunk
      const overlapChars = overlapTokens * 4;
      const overlap = current.slice(-overlapChars);
      current = overlap + " " + sentence;
    } else {
      current = combined;
    }
  }

  if (current.trim()) {
    // If last chunk is too small, merge with previous
    if (chunks.length > 0 && estimateTokens(current) < minTokens) {
      chunks[chunks.length - 1] += " " + current.trim();
    } else {
      chunks.push(current.trim());
    }
  }

  return chunks;
}

// --- Content Readers ---

function readMarkdownFiles(
  dir: string,
  sourceType: ContentChunk["sourceType"],
  urlPrefix: string
): ContentChunk[] {
  const chunks: ContentChunk[] = [];

  if (!fs.existsSync(dir)) return chunks;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = parseFrontmatter(raw);

    // Skip draft posts
    if (data.status === "draft") continue;

    const title = (data.title as string) || file.replace(/\.md$/, "");
    const slug = file.replace(/\.md$/, "");
    const url = `https://huntermussel.com${urlPrefix}${slug}/`;

    const cleanContent = stripMarkdown(content);
    const textChunks = chunkText(cleanContent);

    for (let i = 0; i < textChunks.length; i++) {
      chunks.push({
        id: `${sourceType}-${slug}-${i}`,
        content: textChunks[i],
        sourceTitle: title,
        sourceUrl: url,
        sourceType,
      });
    }
  }

  return chunks;
}

function readFaqContent(): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  const raw = fs.readFileSync(FAQ_PATH, "utf-8");

  // Extract FAQ arrays from the TypeScript file using regex
  const exportRegex =
    /export\s+const\s+(\w+)\s*(?::\s*\w+(?:<[^>]+>)?\s*)?=\s*(\[[\s\S]*?\n\];|\{[\s\S]*?\n\};)/g;
  let match;

  while ((match = exportRegex.exec(raw)) !== null) {
    const varName = match[1];
    const block = match[2];

    // Extract Q&A pairs
    const qaRegex =
      /question:\s*"([^"]+)"[\s\S]*?answer:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g;
    let qaMatch;

    while ((qaMatch = qaRegex.exec(block)) !== null) {
      const question = qaMatch[1];
      const answer = qaMatch[2].replace(/\\"/g, '"').replace(/\\n/g, "\n");

      chunks.push({
        id: `faq-${varName}-${chunks.length}`,
        content: `Q: ${question}\nA: ${answer}`,
        sourceTitle: `FAQ - ${question}`,
        sourceUrl: "https://huntermussel.com/#faq",
        sourceType: "faq",
      });
    }
  }

  return chunks;
}

function readLlmsTxt(): ContentChunk[] {
  const chunks: ContentChunk[] = [];

  if (!fs.existsSync(LLMS_TXT_PATH)) return chunks;

  const raw = fs.readFileSync(LLMS_TXT_PATH, "utf-8");
  const sections = raw.split(/^##\s+/m);

  for (const section of sections) {
    if (!section.trim()) continue;

    const lines = section.split("\n");
    const sectionTitle = lines[0]?.trim() || "HunterMussel";
    const sectionContent = lines.slice(1).join("\n").trim();

    if (!sectionContent) continue;

    const textChunks = chunkText(stripMarkdown(sectionContent));

    for (let i = 0; i < textChunks.length; i++) {
      chunks.push({
        id: `homepage-${sectionTitle.toLowerCase().replace(/\W+/g, "-")}-${i}`,
        content: textChunks[i],
        sourceTitle: `HunterMussel - ${sectionTitle}`,
        sourceUrl: "https://huntermussel.com/",
        sourceType: "homepage",
      });
    }
  }

  return chunks;
}

// --- Cloudflare API helpers ---

async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  if (!ACCOUNT_ID || !API_TOKEN) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN required");
  }

  const batchSize = 100;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${EMBEDDING_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: batch }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Embedding API error ${response.status}: ${error}`);
    }

    const result = (await response.json()) as {
      result: { data: number[][] };
    };
    allEmbeddings.push(...result.result.data);

    if (i + batchSize < texts.length) {
      // Small delay between batches to respect rate limits
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return allEmbeddings;
}

async function upsertVectors(vectors: VectorEntry[]): Promise<void> {
  if (!ACCOUNT_ID || !API_TOKEN) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN required");
  }

  const batchSize = 100;

  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);

    // Vectorize expects NDJSON format
    const ndjson = batch
      .map((v) => JSON.stringify(v))
      .join("\n");

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/vectorize/v2/indexes/${VECTORIZE_INDEX}/upsert`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/x-ndjson",
        },
        body: ndjson,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vectorize upsert error ${response.status}: ${error}`);
    }

    const result = await response.json();
    console.log(
      `  Upserted batch ${Math.floor(i / batchSize) + 1}: ${JSON.stringify(
        (result as Record<string, unknown>).result
      )}`
    );

    if (i + batchSize < vectors.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
}

async function uploadToR2(
  chunks: ContentChunk[]
): Promise<void> {
  if (!ACCOUNT_ID || !API_TOKEN) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN required");
  }

  for (const chunk of chunks) {
    const key = `chunks/${chunk.id}.json`;

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${R2_BUCKET}/objects/${encodeURIComponent(key)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chunk),
      }
    );

    if (!response.ok) {
      console.warn(
        `  Warning: R2 upload failed for ${chunk.id}: ${response.status}`
      );
    }
  }
}

// --- Main ---

async function main() {
  console.log("HunterMussel RAG Content Pipeline");
  console.log("=================================\n");

  // 1. Collect all content chunks
  console.log("1. Reading content sources...");

  const blogChunks = readMarkdownFiles(
    path.join(CONTENT_DIR, "blog"),
    "blog",
    "/blog/"
  );
  console.log(`   Blog: ${blogChunks.length} chunks from blog posts`);

  const serviceChunks = readMarkdownFiles(
    path.join(CONTENT_DIR, "services"),
    "service",
    "/services/"
  );
  console.log(`   Services: ${serviceChunks.length} chunks from service pages`);

  const faqChunks = readFaqContent();
  console.log(`   FAQ: ${faqChunks.length} chunks from FAQ data`);

  const homepageChunks = readLlmsTxt();
  console.log(`   Homepage: ${homepageChunks.length} chunks from llms.txt`);

  // Note: Cases excluded per PRD risk note (synthetic content)
  console.log("   Cases: SKIPPED (excluded per PRD - synthetic content)\n");

  const allChunks = [
    ...faqChunks,
    ...serviceChunks,
    ...blogChunks,
    ...homepageChunks,
  ];

  console.log(`Total chunks: ${allChunks.length}\n`);

  if (DRY_RUN) {
    console.log("DRY RUN — printing first 5 chunks:\n");
    for (const chunk of allChunks.slice(0, 5)) {
      console.log(`[${chunk.id}] ${chunk.sourceTitle}`);
      console.log(`  Type: ${chunk.sourceType}`);
      console.log(`  URL: ${chunk.sourceUrl}`);
      console.log(
        `  Content (${estimateTokens(chunk.content)} tokens): ${chunk.content.slice(0, 200)}...`
      );
      console.log();
    }
    console.log(`... and ${allChunks.length - 5} more chunks.`);
    return;
  }

  // 2. Generate embeddings
  console.log("2. Generating embeddings...");
  const texts = allChunks.map((c) => c.content);
  const embeddings = await generateEmbeddings(texts);
  console.log(`   Generated ${embeddings.length} embeddings\n`);

  // 3. Upsert into Vectorize
  console.log("3. Upserting into Vectorize...");
  const vectors: VectorEntry[] = allChunks.map((chunk, i) => ({
    id: chunk.id,
    values: embeddings[i],
    metadata: {
      content: chunk.content.slice(0, 1000), // Store truncated content in metadata for fast access
      sourceTitle: chunk.sourceTitle,
      sourceUrl: chunk.sourceUrl,
      sourceType: chunk.sourceType,
    },
  }));

  await upsertVectors(vectors);
  console.log(`   Upserted ${vectors.length} vectors\n`);

  // 4. Store full chunks in R2
  console.log("4. Uploading full chunks to R2...");
  await uploadToR2(allChunks);
  console.log(`   Uploaded ${allChunks.length} chunks\n`);

  console.log("Done! Content indexed successfully.");
  console.log(
    `  Vectorize index: ${VECTORIZE_INDEX} (${vectors.length} vectors)`
  );
  console.log(`  R2 bucket: ${R2_BUCKET} (${allChunks.length} objects)`);
}

main().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
