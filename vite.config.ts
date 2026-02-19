
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      "/siem": {
        target: "https://safepoint-tech.ir",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});