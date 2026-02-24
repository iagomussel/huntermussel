import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "public", "images", "blog");

const RATIOS = {
  "16x9": 16 / 9,
  "1x1": 1,
  "9x16": 9 / 16,
};

const MED_WIDTH = {
  "16x9": 1280,
  "1x1": 1024,
  "9x16": 1080,
};

const isVariantName = (name) => /_(16x9|1x1|9x16)_(thumb|low|med|high)\.webp$/i.test(name);

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

function createVariant(inputPath, outputPath, width, height, ratio) {
  // Scale to cover target box and crop center to exact ratio dimensions.
  const filter = `scale='if(gte(iw/ih,${ratio}),-2,${width})':'if(gte(iw/ih,${ratio}),${height},-2)',crop=${width}:${height}`;
  run("ffmpeg", [
    "-y",
    "-i",
    inputPath,
    "-vf",
    filter,
    "-c:v",
    "libwebp",
    "-q:v",
    "82",
    "-compression_level",
    "6",
    outputPath,
  ]);
}

function generateForImage(inputPath) {
  const parsed = path.parse(inputPath);
  if (isVariantName(parsed.base)) return;

  const basePath = path.join(parsed.dir, parsed.name);
  const widthsBySize = {
    thumb: 320,
    low: 640,
    med: null,
    high: 1920,
  };

  console.log(`Generating variants for ${path.relative(ROOT, inputPath)}`);

  for (const [ratioName, ratioVal] of Object.entries(RATIOS)) {
    widthsBySize.med = MED_WIDTH[ratioName];
    for (const [sizeName, width] of Object.entries(widthsBySize)) {
      const w = Number(width);
      const h = Math.round(w / ratioVal);
      const output = `${basePath}_${ratioName}_${sizeName}.webp`;
      createVariant(inputPath, output, w, h, ratioVal);
    }
  }
}

function resolveInputsFromArgs(args) {
  if (args.length === 0) {
    return fs
      .readdirSync(BLOG_DIR)
      .filter((name) => /\.(webp|png|jpe?g)$/i.test(name))
      .filter((name) => !isVariantName(name))
      .map((name) => path.join(BLOG_DIR, name));
  }

  return args.map((arg) => {
    const full = path.isAbsolute(arg) ? arg : path.join(ROOT, arg);
    if (!fs.existsSync(full)) throw new Error(`Input not found: ${arg}`);
    return full;
  });
}

function main() {
  const inputs = resolveInputsFromArgs(process.argv.slice(2));
  if (inputs.length === 0) {
    console.log("No base blog images found.");
    return;
  }

  for (const input of inputs) {
    generateForImage(input);
  }
}

main();
