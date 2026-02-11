import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, "..", "static", "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
