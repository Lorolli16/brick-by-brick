import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync } from "node:fs";
import path from "node:path";

const outDir = path.resolve(__dirname, "../dist-static");

// Static hosts serve 404.html for unknown paths; make it the app so deep links work.
const spaFallback = (): Plugin => ({
  name: "spa-404-fallback",
  closeBundle() {
    copyFileSync(path.join(outDir, "index.html"), path.join(outDir, "404.html"));
  },
});

// Static, browser-only build: `npm run build:static`.
// BASE_PATH sets where the site lives, e.g. "/brick-by-brick/" on GitHub Pages.
export default defineConfig({
  root: __dirname,
  base: process.env.BASE_PATH ?? "/",
  publicDir: path.resolve(__dirname, "../public"),
  plugins: [react(), tailwindcss(), spaFallback()],
  resolve: { alias: { "@": path.resolve(__dirname, "../src") } },
  build: { outDir, emptyOutDir: true },
});
