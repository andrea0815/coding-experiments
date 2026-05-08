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

copy(path.join(root, "apps/hub/dist"), path.join(dist, "hub"));
copy(path.join(root, "apps/react-test/dist"), path.join(dist, "react-test"));
copy(path.join(root, "apps/project-name/dist"), path.join(dist, "project-name"));
copy(path.join(root, "apps/my-test/dist"), path.join(dist, "my-test"));

copy(path.join(root, "apps/shader/sinus-circle/dist"), path.join(dist, "shader/sinus-circle"));
