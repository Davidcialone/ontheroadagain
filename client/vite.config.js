import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

export default defineConfig({
  plugins: [react()],
  base: "/ontheroadagain/",
  root: path.resolve(__dirname, ""),
  build: {
    outDir: "public",
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
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
});
