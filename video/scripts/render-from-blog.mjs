import {spawnSync} from "node:child_process";
import path from "node:path";
import process from "node:process";
import fs from "node:fs";
import {fileURLToPath} from "node:url";
import {blogToProps} from "./blog-to-props.mjs";
import {loadDotEnv} from "./load-dotenv.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VIDEO_ROOT = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const out = {slug: "", format: "landscape", out: "", narration: true, voiceId: ""};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--slug") out.slug = argv[++i] ?? "";
    if (a === "--format") out.format = argv[++i] ?? "landscape";
    if (a === "--out") out.out = argv[++i] ?? "";
    if (a === "--no-narration") out.narration = false;
    if (a === "--voice-id") out.voiceId = argv[++i] ?? "";
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
loadDotEnv(path.join(VIDEO_ROOT, ".env"));
if (!args.slug) {
  process.stderr.write("Usage: npm run render:blog -- --slug <post-slug>\n");
  process.exit(2);
}

const compositionId = args.format === "portrait" ? "BlogPromoIG" : "BlogPromo";
const defaultOut = path.join("out", `${args.slug}-${args.format === "portrait" ? "vertical" : "horizontal"}.mp4`);
const outFile = args.out || defaultOut;

const props = blogToProps({slug: args.slug});

if (args.narration) {
  const ttsResult = spawnSync(
    process.platform === "win32" ? "node.exe" : "node",
    [path.join("scripts", "tts-elevenlabs.mjs"), "--slug", args.slug],
    {cwd: VIDEO_ROOT, stdio: "inherit"}
  );

  if ((ttsResult.status ?? 1) !== 0) process.exit(ttsResult.status ?? 1);

  const metaPath = path.join(VIDEO_ROOT, "out", `${args.slug}.voiceover.json`);
  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    if (meta.optimized_title) props.title = meta.optimized_title;
    if (meta.optimized_subtitle) props.subtitle = meta.optimized_subtitle;
    if (meta.audioFile) props.audioFile = meta.audioFile;
    
    if (meta.scenes) {
      props.scenes = await Promise.all(meta.scenes.map(async (s, idx) => {
        let imageFile = s.imageFile;
        if (s.image_search) {
          const searchSlug = s.image_search.toLowerCase().replace(/[^a-z0-9]/g, "-");
          const destFile = `blog/pexels-${args.slug}-${idx}-${searchSlug}.jpg`;
          const destPath = path.join(VIDEO_ROOT, "public", destFile);

          if (!fs.existsSync(destPath)) {
            process.stdout.write(`Fetching image for: "${s.image_search}"...\n`);
            try {
              const pexelsKey = process.env.PEXELS_API_KEY;
              let imageUrl = `https://loremflickr.com/1920/1080/${encodeURIComponent(s.image_search)}`;
              if (pexelsKey) {
                const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(s.image_search)}&per_page=1`, {
                  headers: { Authorization: pexelsKey }
                });
                if (res.ok) {
                  const data = await res.json();
                  if (data.photos?.length > 0) imageUrl = data.photos[0].src.large2x;
                }
              }
              const imgRes = await fetch(imageUrl);
              if (imgRes.ok) {
                fs.mkdirSync(path.dirname(destPath), {recursive: true});
                fs.writeFileSync(destPath, Buffer.from(await imgRes.arrayBuffer()));
                imageFile = destFile;
              }
            } catch (err) {
              process.stderr.write(`Failed to fetch image: ${err.message}\n`);
            }
          } else {
            imageFile = destFile;
          }
        }
        return {...s, imageFile: imageFile || ((s.type === 'image' || s.type === 'full-image') ? props.imageFile : undefined)};
      }));
    }
  } else {
    props.audioFile = path.posix.join("voiceover", `${args.slug}.mp3`);
  }
}

const propsPath = path.join(VIDEO_ROOT, "out", `${args.slug}.props.json`);
fs.mkdirSync(path.dirname(propsPath), {recursive: true});
fs.writeFileSync(propsPath, JSON.stringify(props, null, 2));

const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["remotion", "render", "src/index.ts", compositionId, outFile, "--props", propsPath, "--browser-executable=/usr/bin/google-chrome"],
  {cwd: VIDEO_ROOT, stdio: "inherit"}
);
process.exit(result.status ?? 1);
