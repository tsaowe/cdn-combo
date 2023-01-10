import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
const config = defineConfig({
  root: path.resolve( "src"),
  plugins: [react()],
  server: {
    port: 4001,
    open: true,
    proxy: {
      "/api": "http://127.0.0.1:4000",
      "/v1": "http://127.0.0.1:4000",
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
      input: path.resolve("src", "index.jsx"),
    },
  }
});
console.log(config);
export default config;
