import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { fileURLToPath } from "node:url";

export default defineConfig({
  site: "https://huntermussel.com",

  integrations: [
    react(),
    sitemap({
      serialize(item) {
        // Find if this is a priority tools page
        const isToolsPriority = item.url === "https://huntermussel.com/tools/";

        return {
          ...item,
          changefreq: "weekly",
          priority: isToolsPriority ? 1.0 : 0.8,
          lastmod: new Date().toISOString(),
        };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
