import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const repoBasePath = "/civilcost/";

function parsePort(value: string | undefined, fallback: number) {
  const port = Number(value);
  return Number.isFinite(port) && port > 0 ? port : fallback;
}

const devPort = parsePort(process.env.PORT, 5173);
const previewPort = parsePort(process.env.PORT, 4173);
const basePath =
  process.env.BASE_PATH ??
  (process.env.NODE_ENV === "production" ? repoBasePath : "/");

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: devPort,
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: previewPort,
    allowedHosts: true,
  },
});
