import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

console.log("Current working directory:", process.cwd());
console.log("Output directory:", path.resolve(__dirname, "dist"));

export default defineConfig({
  base: "/client/",
  plugins: [react()],
  define: {
    "process.version": JSON.stringify("16.0.0"),
    "process.env": {},
  },
  resolve: {
    alias: {
      semver: "semver/preload.js",
      "@": path.resolve(__dirname, "./src"),
      process: "process/browser",
      buffer: "buffer",
      util: "util/",
      stream: "stream-browserify",
    },
  },
  root: path.resolve(__dirname, ""),
  build: {
    outDir: "client/dist",
    sourcemap: true,
    rollupOptions: {
      external: [
        // "jwt-decode",
        // "exif-js",
        // "react-leaflet",
        // "framer-motion/client",
        // "@mui/material",
        // "@mui/material/styles/shadows",
        // "@mui/material/Grid2",
        // "@mui/material/Alert",
        // "piexifjs",
        // "@mui/icons-material",
        // "@mui/icons-material/CalendarToday",
        // "@mui/icons-material/Edit",
        // "@mui/icons-material/Delete",
        // "@mui/icons-material/Visibility",
        // "@mui/icons-material/ChevronLeft",
        // "@mui/icons-material/ChevronRight",
      ],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".png")) {
            return "assets/images/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
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
  optimizeDeps: {
    include: [
      "buffer",
      "process",
      "@mui/material",
      "@mui/icons-material",
      "react-leaflet",
      "jwt-decode",
      "framer-motion",
      "piexifjs",
      "inherits",
      "util",
    ],
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
