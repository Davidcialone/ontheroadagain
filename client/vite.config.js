import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/leaflet/dist/leaflet.css",
          dest: "assets",
        },
      ],
    }),
  ],
  root: path.resolve(__dirname, ""),
  build: {
    outDir: "dist",
    rollupOptions: {
      // Externalisation plus large pour MUI
      external: [
        /^@mui\/material\//, // Externaliser tout `@mui/material`
        /^@mui\/icons-material\//, // Externaliser tout `@mui/icons-material`
        "leaflet/dist/leaflet.css", // Inclure le fichier CSS Leaflet
        "jwt-decode",
        "exif-js",
        "react-leaflet",
        "framer-motion/client",
        "piexifjs",
      ],
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
  },
});
