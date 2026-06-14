import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",

    resolveId(id: string) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace(
          "figma:asset/",
          ""
        );

        return path.resolve(
          __dirname,
          "src/assets",
          filename
        );
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    figmaAssetResolver(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },

  assetsInclude: [
    "**/*.svg",
    "**/*.csv",
    "**/*.png",
    "**/*.jpg",
    "**/*.jpeg",
    "**/*.webp",
  ],

  server: {
    port: 5173,
  },
});
