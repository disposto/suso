import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    // Force a single, predictable dev port to avoid mismatch with Electron
    port: 5176,
    strictPort: true,
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5176,
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
