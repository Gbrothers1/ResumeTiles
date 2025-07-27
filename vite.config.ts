import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  // When building for production on GitHub Pages, serve the app from
  // `/<repo-name>/` instead of the domain root. We can deduce the repo name
  // from the `GITHUB_REPOSITORY` environment variable that GitHub Actions
  // sets (format: "owner/repo"). During local development the base should
  // stay "/" so nothing changes for `npm run dev`.
  base:
    (() => {
      if (process.env.NODE_ENV !== "production") return "/";

      // 1️⃣ CI environments (like GitHub Actions) expose GITHUB_REPOSITORY
      if (process.env.GITHUB_REPOSITORY) {
        return `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/`;
      }

      // 2️⃣ Local/npm builds expose the package.json homepage as npm_package_homepage
      //    (npm automatically injects it into the env when running scripts)
      if (process.env.npm_package_homepage) {
        const pathname = new URL(process.env.npm_package_homepage).pathname;
        return pathname.endsWith("/") ? pathname : `${pathname}/`;
      }

      // 3️⃣ Fallback to root
      return "/";
    })(),
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
