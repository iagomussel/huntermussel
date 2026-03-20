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
        const url = item.url;
        let priority = 0.7;
        if (
          url === "https://huntermussel.com/" ||
          url === "https://huntermussel.com/tools/"
        ) {
          priority = 1.0;
        } else if (
          url === "https://huntermussel.com/blog/" ||
          url === "https://huntermussel.com/cases/" ||
          url === "https://huntermussel.com/services/" ||
          url === "https://huntermussel.com/about/"
        ) {
          priority = 0.9;
        } else if (url === "https://huntermussel.com/contact/") {
          priority = 0.8;
        }
        return {
          ...item,
          changefreq: "weekly",
          priority,
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
