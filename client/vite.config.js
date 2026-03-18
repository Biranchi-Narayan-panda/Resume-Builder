import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://resume-builder-2-qljk.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
