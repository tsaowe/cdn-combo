import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  root: "src",
  plugins: [react()],
  server: {
    port: 4000,
    open: "/src/index.html",
    proxy: {
      "/api": "http://127.0.0.1:4001",
      "/v1": "http://127.0.0.1:4001",
    },
  },
  resolve: {
    alias: {
      "@server": "./server",
    },
  },
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: path.resolve(__dirname, "src", "index.jsx"),
    },
  }
});
