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

function slugifySearch(term, fallback) {
  if (!term) return fallback;
  const slug = term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
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
console.log(`Rendering blog post "${props.title}" with composition "${compositionId}"...`);

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
      const pexelsKey = process.env.PEXELS_API_KEY;
      props.scenes = await Promise.all(meta.scenes.map(async (s, idx) => {
        let imageFile = s.imageFile;
        let videoFile = s.videoFile;
        const videoSlug = slugifySearch(s.search_asset ?? s.text, `scene-${idx}-video`);
        const imageSlug = slugifySearch(s.search_asset ?? s.text, `scene-${idx}-image`);
        const destImage = `blog/pexels-${args.slug}-${idx}-${imageSlug}.jpg`;
        const destVideo = `blog/pexels-${args.slug}-${idx}-${videoSlug}.mp4`;
        const destImagePath = path.join(VIDEO_ROOT, "public", destImage);
        const destVideoPath = path.join(VIDEO_ROOT, "public", destVideo);

       if (!fs.existsSync(destVideoPath)) {
            if (pexelsKey) {
              process.stdout.write(`Fetching video for: "${s.search_asset}"...\n`);
              try {
                const res = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(s.search_asset)}&per_page=1`, {
                  headers: { Authorization: pexelsKey }
                });
                if (res.ok) {
                  const data = await res.json();
                  const video = data.videos?.[0];
                  if (video?.video_files?.length) {
                    const videoId = video.id;
                    const pexelsDestVideo = `blog/pexels-${videoId}.mp4`;
                    const pexelsDestVideoPath = path.join(VIDEO_ROOT, "public", pexelsDestVideo);
                    
                    if (fs.existsSync(pexelsDestVideoPath)) {
                      videoFile = pexelsDestVideo;
                      process.stdout.write(`Using existing video for ID ${videoId}...\n`);
                    } else {
                      const sortedFiles = [...video.video_files].sort((a, b) => (a?.width ?? 9999) - (b?.width ?? 9999));
                      const candidate = sortedFiles.find((f) => f.quality === "sd") || sortedFiles[0];
                      const videoUrl = candidate?.link;
                      if (videoUrl) {
                        const videoRes = await fetch(videoUrl);
                        if (videoRes.ok) {
                          fs.mkdirSync(path.dirname(pexelsDestVideoPath), {recursive: true});
                          fs.writeFileSync(pexelsDestVideoPath, Buffer.from(await videoRes.arrayBuffer()));
                          videoFile = pexelsDestVideo;
                        }
                      }
                    }
                  }
                }
              } catch (err) {
                process.stderr.write(`Failed to fetch video: ${err.message}\n`);
              }
          }
        } else {
          videoFile = destVideo;
        }
        

          if (!fs.existsSync(destImagePath)) {
            process.stdout.write(`Fetching image for: "${s.search_asset}"...\n`);
            try {
              let imageUrl = `https://loremflickr.com/1920/1080/${encodeURIComponent(s.search_asset)}`;
              if (pexelsKey) {
                const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(s.search_asset)}&per_page=1`, {
                  headers: { Authorization: pexelsKey }
                });
                if (res.ok) {
                  const data = await res.json();
                  if (data.photos?.length > 0) {
                    const photo = data.photos[0];
                    const photoId = photo.id;
                    const pexelsDestImage = `blog/pexels-${photoId}.jpg`;
                    const pexelsDestImagePath = path.join(VIDEO_ROOT, "public", pexelsDestImage);
                    
                    if (fs.existsSync(pexelsDestImagePath)) {
                      imageFile = pexelsDestImage;
                      process.stdout.write(`Using existing image for ID ${photoId}...\n`);
                    } else {
                      imageUrl = photo.src.large2x;
                      const imgRes = await fetch(imageUrl);
                      if (imgRes.ok) {
                        fs.mkdirSync(path.dirname(pexelsDestImagePath), {recursive: true});
                        fs.writeFileSync(pexelsDestImagePath, Buffer.from(await imgRes.arrayBuffer()));
                        imageFile = pexelsDestImage;
                      }
                    }
                  }
                }
              } else {
                // Fallback to loremflickr if no pexels key
                const imgRes = await fetch(imageUrl);
                if (imgRes.ok) {
                  fs.mkdirSync(path.dirname(destImagePath), {recursive: true});
                  fs.writeFileSync(destImagePath, Buffer.from(await imgRes.arrayBuffer()));
                  imageFile = destImage;
                }
              }
            } catch (err) {
              process.stderr.write(`Failed to fetch image: ${err.message}\n`);
            }
          } else {
            imageFile = destImage;
          }
        

        return {...s,  imageFile , videoFile};
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
