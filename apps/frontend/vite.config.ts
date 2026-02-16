import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  server: {
    proxy: {
      "/auth": { target: "http://localhost:3000", changeOrigin: true },
      "/movies": { target: "http://localhost:3000", changeOrigin: true },
      "/users": { target: "http://localhost:3000", changeOrigin: true },
      "/genres": { target: "http://localhost:3000", changeOrigin: true },
      "/languages": { target: "http://localhost:3000", changeOrigin: true },
      "/uploads": { target: "http://localhost:3000", changeOrigin: true }
    }
  }
});
