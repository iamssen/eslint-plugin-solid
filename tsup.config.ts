import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/configs/recommended.ts", "src/configs/typescript.ts"],
  format: ["esm"],
  dts: true,
  // experimentalDts: true,
  sourcemap: true,
  clean: true,
});
