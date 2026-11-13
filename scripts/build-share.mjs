// Builds share/ and inlines the JS and CSS into one self-contained HTML file:
// dist-share/brick-by-brick.html (no <html>/<head>/<body>; the share host adds those).
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
execSync("npx vite build --config share/vite.config.ts", { cwd: root, stdio: "inherit" });

const assets = path.join(root, "dist-share", "assets");
const files = readdirSync(assets);
const read = (ext) => files.filter((f) => f.endsWith(ext)).map((f) => readFileSync(path.join(assets, f), "utf8")).join("\n");
const css = read(".css");
const js = read(".js").replace(/<\/script/gi, "<\/script");

const page = `<title>Brick by Brick</title>
<meta name="description" content="Fair chores for shared flats: split chores by effort points, approve each other's work and climb the best roommate leaderboard.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap">
<style>
${css}
html, body { background: var(--background); color: var(--foreground); }
</style>
<div id="root"></div>
<script type="module">
${js}
</script>
`;
const out = path.join(root, "dist-share", "brick-by-brick.html");
writeFileSync(out, page);
console.log(`wrote ${path.relative(root, out)} (${(page.length / 1024).toFixed(0)} KB)`);
