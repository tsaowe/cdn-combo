import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  root: "src",
  plugins: [react()],
  server: {
    port: 4000,
    open: true,
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
});
