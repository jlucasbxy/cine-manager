import { readFileSync } from "node:fs";
import { build } from "esbuild";

const pkg = JSON.parse(readFileSync("package.json", "utf-8"));

const external = Object.keys({
  ...pkg.dependencies,
  ...pkg.devDependencies,
}).filter((dep) => !dep.startsWith("@repo/"));

await build({
  entryPoints: ["src/main/index.ts"],
  outdir: "dist",
  format: "esm",
  target: "node22",
  platform: "node",
  external,
  alias: { "@/*": "./src/*" },
  sourcemap: true,
  splitting: true,
  bundle: true,
});
