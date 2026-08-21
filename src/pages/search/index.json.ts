import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getReadingTime } from "@/lib/reading-time";

export const GET: APIRoute = async ({ site }) => {
  const base = site?.toString().replace(/\/$/, "") ?? "";

  // ── Blog posts ──────────────────────────────────────────────
  const posts = await getCollection("blog", ({ data }) => data.status !== "draft");

  const blogEntries = posts.map((post) => ({
    type: "article",
    title: post.data.title,
    description: post.data.description ?? "",
    url: `${base}/blog/${post.id}/`,
    tags: post.data.tags ?? [],
    image: post.data.image ?? null,
    date: post.data.date ? new Date(post.data.date).toISOString() : null,
    readingTime: getReadingTime(post.body ?? "").text,
    body: (post.body ?? "").slice(0, 5000),
  }));

  // ── Cases ───────────────────────────────────────────────────
  const cases = await getCollection("cases");

  const caseEntries = cases.map((entry) => ({
    type: "case",
    title: entry.data.title,
    description: entry.data.description ?? "",
    url: `${base}/cases/${entry.id}/`,
    tags: entry.data.tags ?? [],
    image: entry.data.image ?? null,
    date: entry.data.date ? new Date(entry.data.date).toISOString() : null,
    body: (entry.body ?? "").slice(0, 5000),
  }));

  // ── Tools ───────────────────────────────────────────────────
  // Tools are individual .astro pages, not a content collection.
  // We maintain a static list here that mirrors src/pages/tools/.
  const tools = [
    { title: "AI Model Picker", slug: "ai-model-picker", description: "Compare AI models side-by-side and find the right one for your use case.", tags: ["AI", "Models"] },
    { title: "Alpha Channel Splitter", slug: "alpha-channel-splitter", description: "Split an image's alpha channel into a separate mask image, right in your browser.", tags: ["Image", "PNG"] },
    { title: "Background Remover", slug: "background-remover", description: "Remove image backgrounds instantly in the browser — no upload, no API, no server.", tags: ["Image", "AI"] },
    { title: "Base64 Converter", slug: "base64-converter", description: "Encode and decode Base64 strings — text, files, and images, all client-side.", tags: ["Encoding", "Developer"] },
    { title: "Chmod Calculator", slug: "chmod", description: "Calculate Unix file permissions with an interactive chmod calculator.", tags: ["Linux", "Developer"] },
    { title: "Commit Message Generator", slug: "commit-message-generator", description: "Generate conventional commit messages with a 6-step wizard — type, scope, description, and more.", tags: ["Git", "Developer"] },
    { title: "Cron Parser", slug: "cron-parser", description: "Parse and explain cron expressions with a visual schedule preview.", tags: ["DevOps", "Developer"] },
    { title: "Diff Viewer", slug: "diff-viewer", description: "Compare two text blocks side-by-side with syntax highlighting and inline diff.", tags: ["Developer", "Text"] },
    { title: "Estimators", slug: "estimators", description: "Project estimation tools for developers and teams — time, cost, and effort.", tags: ["Project Management", "Developer"] },
    { title: "Hash Generator", slug: "hash-generator", description: "Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text or files, instantly in your browser.", tags: ["Security", "Developer"] },
    { title: "HTTP Status Codes", slug: "http-status", description: "Reference for HTTP status codes with descriptions and usage examples.", tags: ["Web", "Developer"] },
    { title: "Image Color Palette", slug: "image-color-palette", description: "Extract a color palette from any image — dominant colors and hex codes, client-side.", tags: ["Image", "Design"] },
    { title: "Image Cropper", slug: "image-crop", description: "Crop images in your browser with a visual editor — no upload needed.", tags: ["Image", "Editor"] },
    { title: "Image Format Converter", slug: "image-format-converter", description: "Convert images between PNG, JPEG, WebP, and more — all in your browser.", tags: ["Image", "Converter"] },
    { title: "Image Optimizer", slug: "image-optimizer", description: "Compress and optimize images for the web — reduce file size without losing quality.", tags: ["Image", "Performance"] },
    { title: "Image Resizer", slug: "image-resize", description: "Resize images to any dimension in your browser — no upload, no server.", tags: ["Image", "Editor"] },
    { title: "JSON Formatter", slug: "json-formatter", description: "Format, validate, and minify JSON with syntax highlighting and tree view.", tags: ["JSON", "Developer"] },
    { title: "JWT Inspector", slug: "jwt-inspector", description: "Decode and inspect JWT tokens — header, payload, and signature, all client-side.", tags: ["Security", "Developer"] },
    { title: "LLM Cost Estimator", slug: "llm-cost-estimator", description: "Estimate API costs for LLM providers — OpenAI, Anthropic, Google, and more.", tags: ["AI", "Cost"] },
    { title: "Log Viewer", slug: "log-viewer", description: "Parse, filter, and search log files with syntax highlighting and level filtering.", tags: ["DevOps", "Developer"] },
    { title: "Markdown Editor", slug: "markdown-editor", description: "Write and preview Markdown side-by-side with live rendering and export.", tags: ["Markdown", "Editor"] },
    { title: "Metadata Remover", slug: "metadata-remover", description: "Strip EXIF and metadata from images before sharing — all in your browser.", tags: ["Image", "Privacy"] },
    { title: "Online Linters", slug: "online-linters", description: "Lint code for multiple languages — JavaScript, Python, CSS, and more, in your browser.", tags: ["Developer", "Code Quality"] },
    { title: "Persona Picker", slug: "persona-picker", description: "Pick an AI persona for your prompts — developer, marketer, writer, and more.", tags: ["AI", "Prompts"] },
    { title: "Prompt Optimizer", slug: "prompt-optimizer", description: "Multi-step wizard that assembles production-ready prompts for Claude, GPT-4, Gemini and open-source models.", tags: ["AI", "Prompts"] },
    { title: "Regex Tester", slug: "regex-tester", description: "Test and debug regular expressions with live matching and capture groups.", tags: ["Regex", "Developer"] },
    { title: "SLA Calculator", slug: "sla-calculator", description: "Calculate SLA uptime percentages and allowed downtime for your services.", tags: ["DevOps", "Business"] },
    { title: "Sprite Detector", slug: "sprite-detector", description: "Detect sprites in sprite sheets and extract individual frames automatically.", tags: ["Image", "Game Dev"] },
    { title: "Sprite Slicer", slug: "sprite-slicer", description: "Slice sprite sheets into individual frames with a visual editor.", tags: ["Image", "Game Dev"] },
    { title: "Sprite Splitter", slug: "sprite-splitter", description: "Split sprite sheets into separate image files — batch export in your browser.", tags: ["Image", "Game Dev"] },
    { title: "SVG to PNG", slug: "svg-to-png", description: "Convert SVG files to PNG with customizable resolution — all client-side.", tags: ["Image", "Converter"] },
    { title: "Timestamp Converter", slug: "timestamp", description: "Convert Unix timestamps to human-readable dates and back — supports multiple formats.", tags: ["Developer", "Time"] },
    { title: "Token Counter", slug: "token-counter", description: "Count tokens and estimate API costs for GPT-4o, Claude 3.5, Gemini, and more — in real-time.", tags: ["AI", "Cost"] },
    { title: "UUID Generator", slug: "uuid", description: "Generate UUIDs v4 and v7 in bulk — copy, export, all in your browser.", tags: ["Developer", "Generator"] },
    { title: "YAML/JSON Converter", slug: "yaml-json", description: "Convert between YAML and JSON formats instantly — bidirectional, client-side.", tags: ["YAML", "JSON", "Developer"] },
  ];

  const toolEntries = tools.map((tool) => ({
    type: "tool",
    title: tool.title,
    description: tool.description,
    url: `${base}/tools/${tool.slug}/`,
    tags: tool.tags,
    image: null,
    date: null,
    body: tool.description,
  }));

  const index = [...blogEntries, ...caseEntries, ...toolEntries];

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
};