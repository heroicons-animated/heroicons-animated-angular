/// <reference types="vitest" />
import { resolve } from "node:path";
import analog from "@analogjs/platform";
import { defineConfig } from "vite";

const deploymentPreset =
  process.env.BUILD_PRESET ?? (process.env.VERCEL ? "vercel" : undefined);

export default defineConfig({
  plugins: [
    analog({
      ssr: true,
      static: false,
      nitro: deploymentPreset ? { preset: deploymentPreset } : undefined,
      prerender: {
        routes: [],
      },
    }),
  ],
  resolve: {
    alias: {
      "@heroicons-animated/angular": resolve(
        import.meta.dirname,
        "packages/angular/src/index.ts"
      ),
    },
  },
  ssr: {
    noExternal: ["@analogjs/**", "@angular/**", "zone.js"],
  },
  build: {
    target: ["es2020"],
  },
});
