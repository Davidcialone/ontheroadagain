import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig({
  plugins: [react()],
  base: "/ontheroadagain/",
  root: path.resolve(__dirname, ""),
  build: {
    outDir: "dist", // Ensure the output directory is set to 'dist'
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      process: "process/browser", // Polyfill for 'process'
      buffer: "buffer", // Polyfill for 'Buffer' if needed
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Polyfill for Node.js globals like process and Buffer
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
});
