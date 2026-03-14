import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/learn-ai/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      provider: "v8",
      include: ["src/config.js", "src/components.jsx", "src/nav-persistence.js", "src/sections/**/*.jsx"],
      exclude: ["src/main.jsx", "src/learn-ai.jsx"],
      thresholds: {
        lines: 100,
        branches: 97,
      },
    },
  },
});
