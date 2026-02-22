import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://huntermussel.com",
  base: "/tools",
  integrations: [react()],
});
