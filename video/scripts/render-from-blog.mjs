#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { blogToProps } from "./blog-to-props.mjs";
import { loadDotEnv } from "./load-dotenv.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VIDEO_ROOT = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const out = {
    slug: "",
    format: "vertical",
    out: "",
    narration: true,
    captions: true,
    music: true,
    pexels: true,
    browserExecutable: "",
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--slug") out.slug = argv[++i] ?? "";
    if (a === "--format") out.format = argv[++i] ?? "vertical";
    if (a === "--out") out.out = argv[++i] ?? "";
    if (a === "--no-narration") out.narration = false;
    if (a === "--no-captions") out.captions = false;
    if (a === "--no-music") out.music = false;
    if (a === "--no-pexels") out.pexels = false;
    if (a === "--browser-executable") out.browserExecutable = argv[++i] ?? "";
    if (a === "--dry-run") out.dryRun = true;
  }
  return out;
}

function slugifySearch(term, fallback) {
  if (!term) return fallback;
  const slug = term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

function isValidMediaFile(filePath, expectedType) {
  const ffprobe = spawnSync("ffprobe", [
    "-v", "error",
    "-show_entries", "stream=codec_type",
    "-of", "default=noprint_wrappers=1",
    filePath,
  ], { encoding: "utf-8" });
  if ((ffprobe.status ?? 1) !== 0) {
    process.stderr.write(`Invalid media file, removing: ${filePath}\n`);
    try { fs.unlinkSync(filePath); } catch {}
    return false;
  }
  const types = ffprobe.stdout
    .split("\n")
    .filter((line) => line.startsWith("codec_type="))
    .map((line) => line.replace("codec_type=", "").trim());
  if (expectedType === "video" && !types.includes("video")) {
    process.stderr.write(`Download is not a video, removing: ${filePath}\n`);
    try { fs.unlinkSync(filePath); } catch {}
    return false;
  }
  if (expectedType === "photo" && !types.includes("video")) {
    // Still images report a video stream in ffprobe.
    process.stderr.write(`Download is not an image, removing: ${filePath}\n`);
    try { fs.unlinkSync(filePath); } catch {}
    return false;
  }
  return true;
}

async function fetchPexelsAsset({ query, type, destPath }) {
  const pexelsKey = process.env.PEXELS_API_KEY;
  if (!pexelsKey) return undefined;

  const endpoint =
    type === "video"
      ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=1`
      : `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`;

  try {
    const res = await fetch(endpoint, { headers: { Authorization: pexelsKey } });
    if (!res.ok) return undefined;
    const data = await res.json();

    if (type === "video") {
      const video = data.videos?.[0];
      if (!video?.video_files?.length) return undefined;
      const sorted = [...video.video_files].sort((a, b) => (a?.width ?? 9999) - (b?.width ?? 9999));
      const candidate = sorted.find((f) => f.quality === "sd" || f.quality === "hd") || sorted[0];
      if (!candidate?.link) return undefined;
      const videoRes = await fetch(candidate.link);
      if (!videoRes.ok) return undefined;
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, Buffer.from(await videoRes.arrayBuffer()));
      return isValidMediaFile(destPath, "video") ? destPath : undefined;
    } else {
      const photo = data.photos?.[0];
      if (!photo?.src?.large2x) return undefined;
      const imgRes = await fetch(photo.src.large2x);
      if (!imgRes.ok) return undefined;
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, Buffer.from(await imgRes.arrayBuffer()));
      return isValidMediaFile(destPath, "photo") ? destPath : undefined;
    }
  } catch (err) {
    process.stderr.write(`Pexels ${type} fetch failed: ${err.message}\n`);
    return undefined;
  }
}

const args = parseArgs(process.argv.slice(2));
loadDotEnv(path.join(VIDEO_ROOT, ".env"));

const llmProvider = process.env.LLM_PROVIDER || "gemini";
const ttsProvider = process.env.TTS_PROVIDER || "elevenlabs";

if (!args.slug) {
  process.stderr.write(
    "Usage: npm run render:blog -- --slug <post-slug> [--format vertical|square|horizontal] [--no-narration] [--no-music] [--no-captions] [--no-pexels] [--browser-executable <path>]\n"
  );
  process.exit(2);
}

const compositionMap = {
  horizontal: "BlogPromo",
  vertical: "BlogPromoVertical",
  square: "BlogPromoSquare",
  landscape: "BlogPromo",
  portrait: "BlogPromoVertical",
};

const compositionId = compositionMap[args.format] || "BlogPromoVertical";
const defaultOut = path.join(
  "out",
  `${args.slug}-${compositionId === "BlogPromo" ? "horizontal" : compositionId === "BlogPromoSquare" ? "square" : "vertical"}.mp4`
);
const outFile = args.out || defaultOut;

const props = await blogToProps({ slug: args.slug });
console.log(`Rendering "${props.title}" with composition ${compositionId}...`);

if (args.dryRun) {
  const propsPath = path.join(VIDEO_ROOT, "out", `${args.slug}.props.json`);
  fs.mkdirSync(path.dirname(propsPath), { recursive: true });
  fs.writeFileSync(propsPath, JSON.stringify(props, null, 2));
  console.log(`[dry-run] props written to ${propsPath}`);
  process.exit(0);
}

if (args.narration) {
  const ttsArgs = [
    path.join("scripts", "tts-elevenlabs.mjs"),
    "--slug", args.slug,
    "--llm-provider", llmProvider,
    "--tts-provider", ttsProvider,
  ];
  const ttsResult = spawnSync(process.platform === "win32" ? "node.exe" : "node", ttsArgs, {
    cwd: VIDEO_ROOT,
    stdio: "inherit",
  });
  if ((ttsResult.status ?? 1) !== 0) process.exit(ttsResult.status ?? 1);

  const metaPath = path.join(VIDEO_ROOT, "out", `${args.slug}.voiceover.json`);
  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    if (meta.optimized_title) props.title = meta.optimized_title;
    if (meta.optimized_subtitle) props.subtitle = meta.optimized_subtitle;
    if (meta.audioFile) props.audioFile = meta.audioFile;

    if (meta.scenes?.length) {
      const scenes = meta.scenes.map((s, idx) => ({
        text: s.caption || s.text,
        type: s.scene_type || s.type || "point",
        narration: s.narration,
        audioFile: s.audioFile,
        search_asset: s.pexels_search_term || s.search_asset,
      }));

      if (args.pexels) {
        for (let i = 0; i < scenes.length; i++) {
          const s = scenes[i];
          if (!s.search_asset) continue;
          const videoSlug = slugifySearch(s.search_asset, `scene-${i}-video`);
          const imageSlug = slugifySearch(s.search_asset, `scene-${i}-image`);
          const destVideo = path.join(VIDEO_ROOT, "public", "blog", `pexels-${args.slug}-${i}-${videoSlug}.mp4`);
          const destImage = path.join(VIDEO_ROOT, "public", "blog", `pexels-${args.slug}-${i}-${imageSlug}.jpg`);

          const hasCachedVideo = fs.existsSync(destVideo) && isValidMediaFile(destVideo, "video");
          if (!hasCachedVideo) {
            const videoPath = await fetchPexelsAsset({ query: s.search_asset, type: "video", destPath: destVideo });
            if (videoPath) s.videoFile = path.posix.join("blog", path.basename(destVideo));
          } else {
            s.videoFile = path.posix.join("blog", path.basename(destVideo));
          }

          const hasCachedImage = fs.existsSync(destImage) && isValidMediaFile(destImage, "photo");
          if (!s.videoFile && !hasCachedImage) {
            const imagePath = await fetchPexelsAsset({ query: s.search_asset, type: "photo", destPath: destImage });
            if (imagePath) s.imageFile = path.posix.join("blog", path.basename(destImage));
          } else if (!s.videoFile) {
            s.imageFile = path.posix.join("blog", path.basename(destImage));
          }
        }
      }

      props.scenes = scenes;
    }
  }
}

const MUSIC_MOODS = ["corporate", "upbeat", "calm", "dramatic"];
if (args.music) {
  const metaPath = path.join(VIDEO_ROOT, "out", `${args.slug}.voiceover.json`);
  let mood = "corporate";
  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    if (MUSIC_MOODS.includes(meta.music_mood)) mood = meta.music_mood;
  }
  const musicPath = path.join(VIDEO_ROOT, "public", "static", "music", `${mood}.mp3`);
  if (fs.existsSync(musicPath)) {
    props.musicFile = `static/music/${mood}.mp3`;
  }
}

if (!args.captions) {
  props.scenes = (props.scenes || []).map((s) => ({ ...s, text: "" }));
}

const propsPath = path.join(VIDEO_ROOT, "out", `${args.slug}.props.json`);
fs.mkdirSync(path.dirname(propsPath), { recursive: true });
fs.writeFileSync(propsPath, JSON.stringify(props, null, 2));

const renderArgs = [
  "remotion",
  "render",
  "src/index.ts",
  compositionId,
  outFile,
  "--props",
  propsPath,
];

if (args.browserExecutable) {
  renderArgs.push(`--browser-executable=${args.browserExecutable}`);
}

const result = spawnSync(process.platform === "win32" ? "npx.cmd" : "npx", renderArgs, {
  cwd: VIDEO_ROOT,
  stdio: "inherit",
});

if ((result.status ?? 1) !== 0) {
  process.exit(result.status ?? 1);
}

const outFullPath = path.isAbsolute(outFile) ? outFile : path.join(VIDEO_ROOT, outFile);
if (fs.existsSync(outFullPath)) {
  const valid = isValidMediaFile(outFullPath, "video");
  if (!valid) {
    process.stderr.write(`Rendered file failed validation: ${outFullPath}\n`);
    process.exit(1);
  }
  const probe = spawnSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    outFullPath,
  ], { encoding: "utf-8" });
  if ((probe.status ?? 1) === 0) {
    console.log(`Validated output: ${outFullPath} (${parseFloat(probe.stdout.trim()).toFixed(2)}s)`);
  }
}

process.exit(0);
