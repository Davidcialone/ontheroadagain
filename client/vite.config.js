import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, ""),
  build: {
    outDir: "dist",
    rollupOptions: {
      external: ["jwt-decode", "exif-js", "react-leaflet"],
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      process: "process/browser",
      buffer: "buffer",
      leaflet: path.resolve(__dirname, "node_modules/leaflet"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
    include: ["leaflet"],
  },
  css: {
    preprocessorOptions: {
      css: {
        includePaths: [path.resolve(__dirname, "node_modules")],
      },
    },
  },
});
