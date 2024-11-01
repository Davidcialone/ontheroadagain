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
  root: path.resolve(__dirname, ""),
  build: {
    outDir: "dist",
    rollupOptions: {
      external: [
        // Liste des modules externes
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
    // ... autres options
  },
  server: {
    // Configuration du serveur
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
    // Optimisation des dépendances
  },
});
