import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const vinextCli = join(root, "node_modules", "vinext", "dist", "cli.js");
const environment = {
  ...process.env,
  WRANGLER_LOG_PATH: process.env.WRANGLER_LOG_PATH || ".wrangler/wrangler.log",
};

const build = spawnSync(process.execPath, [vinextCli, "build", "--prerender-all"], {
  cwd: root,
  env: environment,
  stdio: "inherit",
});

const serverOutput = join(root, "dist", "server", "index.js");
const prerenderRoot = join(root, "dist", "server", "prerendered-routes");
const indexSource = join(prerenderRoot, "index.html");
const privacySource = join(prerenderRoot, "privacy.html");
const requiredOutputExists = [serverOutput, indexSource, privacySource].every(existsSync);

if (build.status !== 0 && !(process.platform === "win32" && requiredOutputExists)) {
  process.exit(build.status ?? 1);
}

if (build.status !== 0) {
  console.warn("Vinext completed the Windows prerender output before a runtime shutdown warning; verified artifacts will be used.");
}

if (!requiredOutputExists) {
  throw new Error("Vinext did not emit all required prerendered routes.");
}

const clientRoot = join(root, "dist", "client");
const privacyDirectory = join(clientRoot, "privacy");
mkdirSync(privacyDirectory, { recursive: true });
cpSync(indexSource, join(clientRoot, "index.html"));
cpSync(privacySource, join(clientRoot, "privacy.html"));
cpSync(privacySource, join(privacyDirectory, "index.html"));

const notFoundSource = join(prerenderRoot, "404.html");
if (existsSync(notFoundSource)) cpSync(notFoundSource, join(clientRoot, "404.html"));

// The Cloudflare Vite plugin writes a Worker deployment redirect during the
// Vinext build. Pages must continue reading the root Pages configuration.
rmSync(join(root, ".wrangler", "deploy", "config.json"), { force: true });

console.log("Cloudflare Pages output prepared in dist/client.");
