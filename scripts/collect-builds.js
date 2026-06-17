import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const rootIndex = path.join(root, "index.html");

if (fs.existsSync(rootIndex)) {
    fs.copyFileSync(rootIndex, path.join(dist, "index.html"));
}

function copy(from, to) {
    if (!fs.existsSync(from)) {
        console.warn(`Skipping missing build: ${from}`);
        return;
    }

    fs.cpSync(from, to, { recursive: true });
}

copy(path.join(root, "apps/shader/sinus-circle/dist"), path.join(dist, "shader/sinus-circle"));

copy(path.join(root, "apps/shader/particles-cursor-animation/dist"), path.join(dist, "shader/particles-cursor-animation"));

copy(path.join(root, "apps/shader/playground/dist"), path.join(dist, "shader/playground"));

copy(path.join(root, "apps/01-sinus-circle/dist"), path.join(dist, "01-sinus-circle"));
copy(path.join(root, "apps/02-particle-cursor-animation/dist"), path.join(dist, "02-particle-cursor-animation"));
copy(path.join(root, "apps/03-raging-sea/dist"), path.join(dist, "03-raging-sea"));


copy(path.join(root, "apps/04-book-of-shaders/dist"), path.join(dist, "04-book-of-shaders"));
