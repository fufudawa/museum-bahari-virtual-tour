// Copies Pannellum's browser build (UMD script + CSS + sprite images) from
// node_modules into public/vendor/pannellum, where lib/pannellum.ts loads
// them at runtime via a plain <script>/<link> tag.
//
// Pannellum ships as a global-assigning UMD script with no ESM entry point,
// so it cannot be `import`ed into the Next.js bundle without a bundler-level
// shim. Self-hosting the vendored files (rather than pointing at a CDN) keeps
// the app working offline in development and avoids depending on a third
// party at runtime. Re-run automatically on `npm install` via the
// `postinstall` script, so the vendored copy never drifts from the
// `pannellum` version pinned in package.json.

import { existsSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(rootDir, "node_modules", "pannellum");
const dest = join(rootDir, "public", "vendor", "pannellum");

if (!existsSync(src)) {
  console.error(
    "[sync-pannellum-assets] node_modules/pannellum not found — skipping (did `npm install` run?)",
  );
  process.exit(0);
}

mkdirSync(join(dest, "img"), { recursive: true });

copyFileSync(join(src, "build", "pannellum.js"), join(dest, "pannellum.js"));
copyFileSync(join(src, "build", "pannellum.css"), join(dest, "pannellum.css"));

const imgSrcDir = join(src, "src", "css", "img");
for (const file of readdirSync(imgSrcDir)) {
  copyFileSync(join(imgSrcDir, file), join(dest, "img", file));
}

console.log("[sync-pannellum-assets] synced pannellum.js, pannellum.css, and img/* into public/vendor/pannellum");
