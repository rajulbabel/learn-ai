import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const BASE = "/learn-ai/";

const baseRedirect = {
  name: "base-trailing-slash-redirect",
  configurePreviewServer(server) {
    const bare = BASE.replace(/\/$/, "");
    server.middlewares.use((req, res, next) => {
      if (req.url === bare) {
        res.writeHead(301, { Location: BASE });
        res.end();
        return;
      }
      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), baseRedirect],
  base: BASE,
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
    env: { BASE_URL: "/learn-ai/" },
    setupFiles: ["./src/__tests__/setup.js"],
    exclude: ["**/node_modules/**", "**/dist/**", ".claude/**", ".worktrees/**"],
    coverage: {
      provider: "v8",
      include: [
        "src/config.js",
        "src/components.jsx",
        "src/nav-persistence.js",
        "src/url-routing.js",
        "src/url-sync.js",
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
