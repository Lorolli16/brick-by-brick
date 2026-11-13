import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// Static, browser-only build used for the shareable page. `npm run build:share`.
export default defineConfig({
  root: __dirname,
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "../src") } },
  build: {
    outDir: path.resolve(__dirname, "../dist-share"),
    emptyOutDir: true,
    assetsInlineLimit: 100_000,
    rollupOptions: { output: { codeSplitting: false } },
  },
});
