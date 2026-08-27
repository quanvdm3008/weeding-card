import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, "");
  const apiProxyTarget = env.VITE_API_PROXY_TARGET ?? "http://localhost:8080";
  const siteUrl = (process.env.VITE_SITE_URL || env.VITE_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

  return {
    server: {
      host: "::",
      port: 5173,
      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
        "/ws": {
          target: apiProxyTarget,
          changeOrigin: true,
          ws: true,
        },
      },
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      {
        name: "site-url-html",
        enforce: "pre",
        transformIndexHtml: (html) => html.replaceAll("__SITE_URL__", siteUrl),
      },
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});
