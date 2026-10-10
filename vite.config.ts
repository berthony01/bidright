import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Static-only build: no SSR, no server functions.
// Output goes to dist/ and can be hosted on any static host (e.g. Cloudflare Pages).
export default defineConfig({
  plugins: [react()],
  base: "/bidright/",
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
});
