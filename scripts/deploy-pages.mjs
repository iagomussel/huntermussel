import { readdirSync, statSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const projectName = process.env.CF_PAGES_PROJECT || "huntermussel";
const outputDir = process.env.CF_PAGES_OUTPUT_DIR || "dist";

function getCurrentBranch() {
  const result = spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    encoding: "utf8",
  });

  if (result.status !== 0) return "main";

  const branch = result.stdout.trim();
  return branch || "main";
}

function getCachedWranglerBinary() {
  const npxRoot = path.join(homedir(), ".npm", "_npx");

  if (!existsSync(npxRoot)) return null;

  const candidates = [];

  for (const entry of readdirSync(npxRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const binaryPath = path.join(
      npxRoot,
      entry.name,
      "node_modules",
      ".bin",
      "wrangler",
    );

    if (!existsSync(binaryPath)) continue;

    candidates.push({
      binaryPath,
      mtimeMs: statSync(binaryPath).mtimeMs,
    });
  }

  if (candidates.length === 0) return null;

  candidates.sort((left, right) => right.mtimeMs - left.mtimeMs);
  return candidates[0].binaryPath;
}

function getWranglerBinary() {
  if (process.env.WRANGLER_BIN) return process.env.WRANGLER_BIN;

  const localBinary = path.join(process.cwd(), "node_modules", ".bin", "wrangler");
  if (existsSync(localBinary)) return localBinary;

  return getCachedWranglerBinary();
}

const wranglerBinary = getWranglerBinary();

if (!wranglerBinary) {
  console.error("Wrangler was not found.");
  console.error("Install it locally with: npm install -D wrangler");
  process.exit(1);
}

const branch = process.env.CF_PAGES_BRANCH || getCurrentBranch();
const args = [
  "pages",
  "deploy",
  outputDir,
  "--project-name",
  projectName,
  "--branch",
  branch,
];

console.log(`Using Wrangler: ${wranglerBinary}`);
console.log(`Deploying ${outputDir} to Cloudflare Pages project "${projectName}" on branch "${branch}"`);

const result = spawnSync(wranglerBinary, args, {
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
