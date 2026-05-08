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

// 0. Update package.json name
const packageJsonPath = path.join(appDir, "package.json");

if (!fs.existsSync(packageJsonPath)) {
  console.error(`package.json does not exist: apps/${name}/package.json`);
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

// pnpm package names should not contain slashes unless scoped,
// so "shader/sinus-circle" becomes "shader-sinus-circle"
packageJson.name = name.replaceAll("/", "-");

fs.writeFileSync(
  packageJsonPath,
  JSON.stringify(packageJson, null, 2) + "\n"
);

// 0.1 Remove local lockfiles from copied app
const lockFiles = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb",
  "bun.lock"
];

for (const lockFile of lockFiles) {
  const lockFilePath = path.join(appDir, lockFile);

  if (fs.existsSync(lockFilePath)) {
    fs.rmSync(lockFilePath);
    console.log(`Deleted local lockfile: apps/${name}/${lockFile}`);
  }
}

// 1. Create or update vite.config.js
const viteConfigContent = `import { defineConfig } from "vite";

export default defineConfig({
  base: "/${name}/"
});
`;

if (!fs.existsSync(viteConfig)) {
  fs.writeFileSync(viteConfig, viteConfigContent);
} else {
  let configContent = fs.readFileSync(viteConfig, "utf8");

  if (configContent.includes("base:")) {
    configContent = configContent.replace(
      /base:\s*["'`][^"'`]*["'`]/,
      `base: "/${name}/"`
    );
  } else {
    configContent = configContent.replace(
      /defineConfig\(\s*\{/,
      `defineConfig({\n  base: "/${name}/",`
    );
  }

  fs.writeFileSync(viteConfig, configContent);
}

// 2. Add collector line if missing
const line = `copy(path.join(root, "apps/${name}/dist"), path.join(dist, "${name}"));`;

let content = fs.readFileSync(collector, "utf8");

if (!content.includes(line)) {
  content += `\n${line}\n`;
  fs.writeFileSync(collector, content);
}

console.log(`Added subpage: /${name}/`);