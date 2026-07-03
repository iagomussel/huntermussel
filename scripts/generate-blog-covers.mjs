#!/usr/bin/env node
/**
 * Generates cover images for blog articles that are missing an `image:` field.
 *
 * Uses Cloudflare Workers AI (FLUX-1-schnell) with the same style as the
 * Fable 5 covers, converts the result to webp with sharp, saves it to
 * public/images/blog/, and adds the image URL to the article frontmatter.
 */
import { readFileSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import sharp from "sharp";

const ACCOUNT_ID = "3fb2e9d71ac242fbc959acd74e598ddf";
const MODEL = "@cf/black-forest-labs/flux-1-schnell";
const OUT_DIR = new URL("../public/images/blog/", import.meta.url).pathname;
const BLOG_DIR = new URL("../src/content/blog/", import.meta.url).pathname;

function getToken() {
  if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN;
  const cfg = readFileSync(
    path.join(homedir(), ".config/.wrangler/config/default.toml"),
    "utf8",
  );
  const m = cfg.match(/oauth_token\s*=\s*"([^"]+)"/);
  if (!m) throw new Error("No Cloudflare token found");
  return m[1];
}

const STYLE =
  "Modern editorial tech illustration, flat vector style with subtle grain texture, " +
  "deep navy background, electric blue and warm amber accent palette, clean minimal " +
  "composition, no text, no letters, no numbers";

const SCENES = {
  "ai-agent-vs-traditional-automation":
    "a branching diagram with two lanes, one lane filled with rigid robotic arms following fixed tracks and another lane with a glowing adaptive network of nodes making decisions, clean icons",
  "ai-automation-vs-rpa-when-to-use-each":
    "two parallel conveyor belts, one carrying simple identical boxes handled by classical mechanical arms, the other carrying varied irregular shapes guided by a luminous neural mesh, decision arrows between them",
  "automate-manual-processes-without-engineering-team":
    "a small team of figures watching a simple visual workflow builder on a floating screen while paper forms transform into flowing digital pipelines around them",
  "cicd-pipeline-from-scratch-github-actions-docker-kubernetes":
    "a layered pipeline machine with code entering as glowing blocks, passing through container boxes, then branching into pod clusters, status lights turning green",
  "devops-ai-what-changes-for-engineers-2026":
    "an engineer at a dashboard surrounded by autonomous repair drones and predictive graphs, while traditional alert towers fade into the background",
  "devops-retainer-5k-series-a":
    "a small startup team standing on a balanced scale with a modest coin on one side and a giant shield plus tool belt on the other, minimalist",
  "devsecops-security-in-cicd":
    "a fast-moving pipeline where code packages pass through a glowing security scanner gate that adds a thin protective shell without blocking the flow",
  "dirty-data-destroys-ai-projects":
    "a sparkling AI brain trying to drink from a polluted data pipeline filled with murky symbols and broken fragments, clean versus dirty contrast",
  "github-actions-vs-gitlab-ci-vs-azure-devops-2026":
    "three distinct control towers standing side by side over a shared city of pipelines, each with different architectural silhouettes",
  "hidden-devops-cost-moving-fast":
    "a speedometer needle deep in the red with small cracks spreading through the dashboard behind it, debt symbols piling up in the shadows",
  "how-to-measure-roi-ai-automation":
    "a clear dashboard showing before-and-after metric bars rising, coins flowing into a return funnel, with a calculator icon",
  "iac-terraform-small-team":
    "a small crew building the first modular infrastructure blocks from blue glowing plans, leaving most of the field open for later",
  "jenkins-vs-github-actions-how-to-choose":
    "a fork in a road with two signs, one pointing to a sturdy industrial factory and the other to a sleek cloud highway, a figure weighing options",
  "lessons-from-ai-automation-in-real-operations":
    "a journal or field notebook floating open over a battlefield of deployed automations, some robots helping workers and others wrapped in caution tape",
  "migrating-jenkins-to-github-actions-critical-systems":
    "a fragile bridge mid-construction spanning between two cliffs, one cliff covered in old machinery and the other in modern cloud architecture, warning markers",
  "modern-automation-stack-from-scratch":
    "a stack of cleanly layered building blocks glowing with connections, bottom layers solid and top layers flexible, assembled on an empty workbench",
  "modern-cicd-pipeline-where-ai-fits":
    "a transparent pipeline with code packages moving through build test deploy stages, with small AI assistants placed at specific stations only where they genuinely help",
  "scale-ai-automations-without-losing-control":
    "a growing network of automation nodes with glowing audit trails and circuit breakers between them, a central governance eye keeping order",
  "shadow-ai-risk-governance":
    "shadowy automation bots operating in dark corners of an office floor while a central dashboard shows missing connections and warning gaps",
  "tech-lead-role-when-ai-enters-development":
    "a tech lead figure standing between human developers and AI coding agents, holding a compass and guardrails, directing both sides",
  "what-i-look-for-in-startup-infra":
    "an inspector's magnifying glass moving over a startup infrastructure map, red and green markers appearing on servers, pipelines, and databases",
  "why-automation-projects-fail":
    "an automation project shown as a crumbling tower next to a solid one, with arrows pointing from missing governance, unclear scope, and poor data to the ruins",
};

const token = getToken();
mkdirSync(OUT_DIR, { recursive: true });

function* walkMarkdown(dir) {
  for (const name of readdirSync(dir)) {
    if (name.endsWith(".md")) yield path.join(dir, name);
  }
}

function extractFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  return { block: m[0], body: m[1] };
}

function hasImageField(body) {
  return /^image:/m.test(body);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateCover(slug, scene) {
  const outPath = path.join(OUT_DIR, `${slug}.webp`);
  console.log(`Generating ${slug}...`);

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `${STYLE}: ${scene}`,
        steps: 8,
        width: 1344,
        height: 768,
      }),
    },
  );

  const json = await res.json();
  if (!json.success) {
    throw new Error(
      `Cloudflare AI failed for ${slug}: ${JSON.stringify(json.errors)}`,
    );
  }

  const img = Buffer.from(json.result.image, "base64");
  await sharp(img).webp({ quality: 85 }).toFile(outPath);
  console.log(`  saved ${outPath} (${img.length} bytes source)`);
}

function addImageToFrontmatter(content, slug) {
  const fm = extractFrontmatter(content);
  if (!fm) return content;
  if (hasImageField(fm.body)) return content;

  const imageUrl = `https://assets.huntermussel.com/images/blog/${slug}.webp`;
  // Insert image after description line if present, otherwise after the title.
  const lines = fm.body.split("\n");
  let insertIndex = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (/^description:/.test(lines[i])) {
      insertIndex = i + 1;
      break;
    }
  }
  lines.splice(insertIndex, 0, `image: "${imageUrl}"`);
  const newBody = lines.join("\n");
  return content.replace(fm.block, `---\n${newBody}\n---`);
}

const posts = [];
for (const filePath of walkMarkdown(BLOG_DIR)) {
  const content = readFileSync(filePath, "utf8");
  const slug = path.basename(filePath, ".md");
  const fm = extractFrontmatter(content);
  if (!fm || hasImageField(fm.body)) continue;
  posts.push({ filePath, slug, content, title: fm.body.match(/^title:\s*"([^"]+)"/m)?.[1] || slug });
}

if (posts.length === 0) {
  console.log("No articles missing cover images.");
  process.exit(0);
}

console.log(`Found ${posts.length} articles missing covers.\n`);

let ok = 0;
let failed = 0;
for (const post of posts) {
  const scene =
    SCENES[post.slug] ||
    `an abstract editorial illustration about ${post.title}, clean tech minimal style`;
  try {
    await generateCover(post.slug, scene);
    const updated = addImageToFrontmatter(post.content, post.slug);
    writeFileSync(post.filePath, updated, "utf8");
    ok++;
  } catch (err) {
    console.error(`FAILED ${post.slug}:`, err.message);
    failed++;
  }
  // Small polite delay between requests to avoid rate limits.
  await sleep(2000);
}

console.log(`\nDone: ${ok} generated, ${failed} failed.`);
if (failed > 0) process.exitCode = 1;
