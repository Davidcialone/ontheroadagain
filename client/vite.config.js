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
        {
          src: "node_modules/leaflet/dist/images/*", // Ajout pour les images
          dest: "assets/images",
        },
      ],
    }),
  ],
  optimizeDeps: {
    include: ["@mui/icons-material"],
  },
  root: path.resolve(__dirname, ""),
  build: {
    outDir: "dist",
    rollupOptions: {
      external: [
        // Liste des modules externes
        "jwt-decode",
        "exif-js",
        "react-leaflet",
        "framer-motion/client",
        "@mui/material",
        "@mui/material/styles/shadows",
        "@mui/material/Grid2",
        "@mui/material/Alert",
        "piexifjs",
        "@mui/icons-material",
        "@mui/icons-material/CalendarToday",
        "leaflet/dist/leaflet.css",
      ],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith(".png")) {
            return "assets/images/[name]-[hash][extname]"; // Chemin des images
          }
          return "assets/[name]-[hash][extname]"; // Chemin par défaut
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
    port: 3000, // Assurez-vous que c'est le port que vous souhaitez
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
    include: [
      "@mui/material",
      "@mui/icons-material",
      "react-leaflet",
      "jwt-decode",
      "framer-motion",
      "piexifjs",
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
