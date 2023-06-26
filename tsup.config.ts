import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    external: ["vite", "json-server", "connect", "connect-pause"],
    dts: {
      resolve: true,
    },
    clean: true,
    sourcemap: false,
  },
]);
