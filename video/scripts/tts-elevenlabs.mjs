import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";
import {GoogleGenerativeAI} from "@google/generative-ai";
import * as googleTTS from "google-tts-api";
import {loadDotEnv} from "./load-dotenv.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VIDEO_ROOT = path.resolve(__dirname, "..");
const ROOT = path.resolve(VIDEO_ROOT, "..");

function parseArgs(argv) {
  const out = {
    slug: "",
    voiceId: "",
    modelId: "",
    outFile: "",
    dryRun: false,
    useLlm: true,
    provider: "elevenlabs",
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--slug") out.slug = argv[++i] ?? "";
    if (a === "--voice-id") out.voiceId = argv[++i] ?? "";
    if (a === "--model-id") out.modelId = argv[++i] ?? "";
    if (a === "--out") out.outFile = argv[++i] ?? "";
    if (a === "--dry-run") out.dryRun = true;
    if (a === "--no-llm") out.useLlm = false;
    if (a === "--provider") out.provider = argv[++i] ?? "elevenlabs";
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
      if (value === "") { inArray = true; continue; }
      data[currentKey] = value.replace(/^["']|["']$/g, "");
    }
  }
  if (inArray && arrayValues.length > 0) data[currentKey] = [...arrayValues];
  return {data, content};
}

function extractHeadings(markdown, max = 5) {
  const lines = markdown.split("\n");
  const headings = [];
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)\s*$/);
    if (h2) headings.push(h2[1].trim());
  }
  return headings.slice(0, max);
}

function stripMarkdown(text) {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^>\s+/gm, "")
    .replace(/^[-(*|_]{3,}$/gm, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function generateStoryboardWithLlm({title, subtitle, content, url}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return undefined;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  const writingRules = fs.existsSync(path.join(ROOT, "ArticleWritingRules.md"))
    ? fs.readFileSync(path.join(ROOT, "ArticleWritingRules.md"), "utf-8")
    : "";

  const prompt = `
You are a video producer. Based on the blog post below, generate a full storyboard and narration for a short promo video (25-30 seconds).

IMPORTANT: 
1. Generate a COHERENT full script first.
2. Then split that script into 5 logical scenes 6 seconds each.
3. Each scene must have its own 'narration' fragment that, when joined, forms the original full script perfectly.

Blog Title: ${title}
Blog Subtitle: ${subtitle}

Content (Sanitized):
${content.slice(0, 4000)}

Output format (JSON ONLY):
{
  "full_narration": "The complete, coherent 24-30 second script.",
  "optimized_title": "A punchy version of the title",
  "optimized_subtitle": "A punchy version of the subtitle",
  "scenes": [
    {
      "text": "The text to show on screen for this scene.",
      "narration": "The exact fragment of the 'full_narration' for this scene.",
      "type": "video | title | bullet | image | full-image | quote | feature",
      "search_asset": "A short, descriptive English keyword for a background video/image."
    }
  ]
}

- Generate only the CONTENT of the video. The closing CTA is handled separately.
- Do NOT include a "Find more" or "HunterMussel" scene.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("LLM response:", response.text());

    return JSON.parse(response.text().trim());
  } catch (err) {
    process.stderr.write(`LLM generation failed: ${err.message}.\n`);
    return undefined;
  }
}

function buildNarration({title, subtitle, headings, url}) {
  const top = headings.filter(Boolean).slice(0, 4);
  const lines = [`${title}.`];
  if (subtitle) lines.push(`${subtitle}.`);
  if (top.length) {
    lines.push("In this post:");
    for (const h of top) lines.push(`${h}.`);
  }
  lines.push("Read the full post at:");
  lines.push(url.replace(/^https?:\/\//, ""));
  return lines.join(" ");
}

async function elevenLabsTts({apiKey, voiceId, modelId, text}) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3 },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ElevenLabs error ${res.status}: ${body || res.statusText}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function googleTtsFallback({text}) {
  const results = googleTTS.getAllAudioUrls(text, {
    lang: "en", slow: false, host: "https://translate.google.com", splitPunct: ". ",
  });
  const buffers = [];
  for (const {url} of results) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Google TTS error: ${res.statusText}`);
    buffers.push(Buffer.from(await res.arrayBuffer()));
  }
  return Buffer.concat(buffers);
}

const args = parseArgs(process.argv.slice(2));
loadDotEnv(path.join(VIDEO_ROOT, ".env"));

if (!args.slug) {
  process.stderr.write("Usage: node scripts/tts-elevenlabs.mjs --slug <slug>\n");
  process.exit(2);
}

const mdPath = path.join(ROOT, "src", "content", "blog", `${args.slug}.md`);
if (!fs.existsSync(mdPath)) { process.exit(2); }

const raw = fs.readFileSync(mdPath, "utf-8");
const {data, content} = parseFrontmatter(raw);
const title = data.title || args.slug;
const subtitle = data.subtitle || data.description || "";
const headings = extractHeadings(content, 5);
const url = `https://huntermussel.com/blog/${args.slug}/`;
const sanitizedContent = stripMarkdown(content);

let llmPlan = null;
if (args.useLlm) {
  llmPlan = await generateStoryboardWithLlm({title, subtitle, content: sanitizedContent, url});
}

if (llmPlan?.scenes) {
  process.stdout.write(`Generating ${llmPlan.scenes.length} scene narrations...\n`);
  const voiceoverDir = path.join(VIDEO_ROOT, "public", "voiceover", args.slug);
  fs.mkdirSync(voiceoverDir, {recursive: true});

  for (let i = 0; i < llmPlan.scenes.length; i++) {
    const scene = llmPlan.scenes[i];
    const sceneText = scene.narration || scene.text;
    const sceneOutRel = path.posix.join("voiceover", args.slug, `scene-${i}.mp3`);
    const sceneOutPath = path.join(VIDEO_ROOT, "public", sceneOutRel);

    let audioBuffer;
    try {
      const apiKey = process.env.ELEVENLABS_API_KEY;
      const voiceId = args.voiceId || process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
      if (args.provider === "elevenlabs" && apiKey) {
        audioBuffer = await elevenLabsTts({apiKey, voiceId, modelId: "eleven_multilingual_v2", text: sceneText});
      } else {
        audioBuffer = await googleTtsFallback({text: sceneText});
      }
    } catch (err) {
      audioBuffer = await googleTtsFallback({text: sceneText});
    }
    fs.writeFileSync(sceneOutPath, audioBuffer);
    scene.audioFile = sceneOutRel;
  }
} else {
  const narration = buildNarration({title, subtitle, headings, url});
  const outRel = path.posix.join("voiceover", `${args.slug}.mp3`);
  const outPath = path.join(VIDEO_ROOT, "public", outRel);
  fs.mkdirSync(path.dirname(outPath), {recursive: true});
  const audioBuffer = await googleTtsFallback({text: narration});
  fs.writeFileSync(outPath, audioBuffer);
  llmPlan = { narration, scenes: [], audioFile: outRel };
}

const metaPath = path.join(VIDEO_ROOT, "out", `${args.slug}.voiceover.json`);
fs.mkdirSync(path.dirname(metaPath), {recursive: true});
fs.writeFileSync(metaPath, JSON.stringify({slug: args.slug, ...llmPlan, provider: args.provider}, null, 2));

process.stdout.write(`Storyboard and audio generated for ${args.slug}\n`);
