import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig({
  plugins: [
    react(),
    // Ajoutez des plugins supplémentaires si nécessaire
  ],
  base: "/ontheroadagain/",
  root: path.resolve(__dirname, ""),
  build: {
    outDir: "dist", // Assurez-vous que le répertoire de sortie est défini sur 'dist'
    rollupOptions: {
      // Excluez jwt-decode si vous le souhaitez
      external: ["jwt-decode"],
    },
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      process: "process/browser", // Polyfill pour 'process'
      buffer: "buffer", // Polyfill pour 'Buffer' si nécessaire
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Polyfill pour les globales de Node.js comme process et Buffer
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
});
