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
    setupFiles: ["./src/__tests__/setup.js"],
    exclude: ["**/node_modules/**", "**/dist/**", ".claude/**"],
    coverage: {
      provider: "v8",
      include: [
        "src/config.js",
        "src/components.jsx",
        "src/nav-persistence.js",
        "src/chapters/**/*.jsx",
        "src/shared/**/*.jsx",
      ],
      exclude: ["src/main.jsx", "src/learn-ai.jsx"],
      thresholds: {
        lines: 100,
        branches: 100,
        functions: 100,
        statements: 100,
      },
    },
  },
});
