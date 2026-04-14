import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

const mode = process.env.NODE_ENV === "production" ? "production" : "development";
const env = loadEnv(mode, process.cwd(), "");
const assetsBase = (
  env.PUBLIC_ASSETS_URL ||
  env.CLOUDFLARE_R2_PUBLIC_URL ||
  "https://assets.huntermussel.com"
).replace(/\/$/, "");

export default defineConfig({
  site: "https://huntermussel.com",
  // "ignore" = /cases and /cases/ both match (dev + static). Canonical URLs in
  // Layout still use trailing slashes site-wide for a single SEO target.
  trailingSlash: "ignore",

  integrations: [react()],

  vite: {
    define: {
      "import.meta.env.PUBLIC_ASSETS_URL": JSON.stringify(assetsBase),
    },
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@/components/ui": fileURLToPath(
          new URL("./src/components/react/ui", import.meta.url),
        ),
        "@/hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
