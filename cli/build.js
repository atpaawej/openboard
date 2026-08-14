import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const monorepoRoot = path.resolve(__dirname, '..');

console.log('[OpenBoard Build] Starting packaging build for openboard CLI...');

// 1. Ensure dist directory exists
fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });

// 2. Bundle CLI entrypoint and commands
console.log('[OpenBoard Build] Bundling CLI runtime via esbuild...');
await esbuild.build({
  entryPoints: [path.join(__dirname, 'src/index.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node18',
  outfile: path.join(__dirname, 'dist/index.js'),
  external: ['better-sqlite3', 'commander', 'cors', 'express', 'tldraw'],
  sourcemap: false,
  minify: false,
  logLevel: 'info',
});

// 3. Copy built Web assets from apps/web/dist to cli/web
const webSourceDist = path.resolve(monorepoRoot, 'apps/web/dist');
const webTargetDir = path.resolve(__dirname, 'web');

if (fs.existsSync(webSourceDist)) {
  console.log(`[OpenBoard Build] Embedding Web assets from ${webSourceDist} to ${webTargetDir}...`);
  fs.rmSync(webTargetDir, { recursive: true, force: true });
  fs.cpSync(webSourceDist, webTargetDir, { recursive: true });
  console.log('[OpenBoard Build] Web assets embedded successfully.');
} else {
  console.warn(
    `[OpenBoard Build] Warning: ${webSourceDist} does not exist. Run "npm run build" in apps/web first.`,
  );
}

// 4. Sync README and LICENSE
const rootReadme = path.resolve(monorepoRoot, 'README.md');
const rootLicense = path.resolve(monorepoRoot, 'LICENSE');

if (fs.existsSync(rootReadme)) {
  fs.copyFileSync(rootReadme, path.resolve(__dirname, 'README.md'));
}
if (fs.existsSync(rootLicense)) {
  fs.copyFileSync(rootLicense, path.resolve(__dirname, 'LICENSE'));
}

console.log('[OpenBoard Build] Build completed successfully.');
