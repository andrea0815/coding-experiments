import fs from "node:fs";
import path from "node:path";

const name = process.argv[2];

if (!name) {
  console.error("Usage: node scripts/add-subpage.js project-name");
  process.exit(1);
}

const root = process.cwd();
const appDir = path.join(root, "apps", name);
const viteConfig = path.join(appDir, "vite.config.js");
const collector = path.join(root, "scripts", "collect-builds.js");

if (!fs.existsSync(appDir)) {
  console.error(`App folder does not exist: apps/${name}`);
  process.exit(1);
}

// 1. Create vite.config.js if missing
if (!fs.existsSync(viteConfig)) {
  fs.writeFileSync(
    viteConfig,
    `import { defineConfig } from "vite";

export default defineConfig({
  base: "/${name}/"
});
`
  );
}

// 2. Add collector line if missing
const line = `copy(path.join(root, "apps/${name}/dist"), path.join(dist, "${name}"));`;

let content = fs.readFileSync(collector, "utf8");

if (!content.includes(line)) {
  content += `\n${line}\n`;
  fs.writeFileSync(collector, content);
}

console.log(`Added subpage: /${name}/`);