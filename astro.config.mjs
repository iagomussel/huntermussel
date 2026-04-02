import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const assetsBase = (
    env.PUBLIC_ASSETS_URL ||
    env.CLOUDFLARE_R2_PUBLIC_URL ||
    "https://assets.huntermussel.com"
  ).replace(/\/$/, "");

  return {
    site: "https://huntermussel.com",
    trailingSlash: "always",

    integrations: [react()],
    vite: {
      define: {
        "import.meta.env.PUBLIC_ASSETS_URL": JSON.stringify(assetsBase),
      },
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
      },
    },
  };
});
