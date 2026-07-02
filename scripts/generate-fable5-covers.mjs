// Generates the Fable 5 article cover images via Cloudflare Workers AI (FLUX-1-schnell)
// and writes them as webp to public/images/blog/. Auth: wrangler OAuth token
// (run `npx wrangler whoami` first if the token is stale), or CLOUDFLARE_API_TOKEN.
import { readFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import sharp from "sharp";

const ACCOUNT_ID = "3fb2e9d71ac242fbc959acd74e598ddf";
const MODEL = "@cf/black-forest-labs/flux-1-schnell";
const OUT_DIR = new URL("../public/images/blog/", import.meta.url).pathname;

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

const COVERS = {
  "claude-fable-5-actual-cost":
    "an enormous glowing fuel gauge pouring a stream of tiny luminous tokens into a small open wallet that overflows, a long paper receipt spiraling out of frame, dramatic scale contrast",
  "claude-fable-5-not-the-model-everyone-thinks":
    "two crowds of small figures shouting at each other across a gap, both pointing at a giant shrouded silhouette on a pedestal behind glass, while the real smaller unveiled figure stands quietly to the side unnoticed",
  "claude-fable-5-safety-classifiers-downgrade":
    "a glowing data stream flowing through a large railway-style track switch that silently diverts it from a bright powerful engine onto a smaller dimmer side track, a watchful mechanical eye above the junction",
  "should-your-team-use-claude-fable-5":
    "a small team of figures standing at a branching signpost where one path leads to a dazzling fireworks show on the horizon and the other leads to a modest sturdy workshop, one figure holding a clipboard weighing the choice",
  "swebench-pro-fable-5-benchmark-asterisk":
    "a towering podium trophy with a giant glowing asterisk symbol hovering above it casting a long shadow, a small figure below examining the podium base with a magnifying glass revealing cracks, confetti falling",
};

const token = getToken();
mkdirSync(OUT_DIR, { recursive: true });

for (const [slug, scene] of Object.entries(COVERS)) {
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
    console.error(`FAILED ${slug}:`, JSON.stringify(json.errors));
    process.exitCode = 1;
    continue;
  }
  const img = Buffer.from(json.result.image, "base64");
  const out = path.join(OUT_DIR, `${slug}.webp`);
  await sharp(img).webp({ quality: 85 }).toFile(out);
  console.log(`ok: ${out}`);
}
