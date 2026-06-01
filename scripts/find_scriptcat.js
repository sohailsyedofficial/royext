import fs from "fs";
import path from "path";

const ignoreList = ["node_modules", ".git", "dist", "clean-extension", "scripts", "pnpm-lock.yaml"];

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (ignoreList.includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      searchDir(fullPath);
    } else {
      if (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".html") || file.endsWith(".json")) {
        const content = fs.readFileSync(fullPath, "utf8");
        if (/ScriptCat/i.test(content) || /脚本猫/i.test(content) || /腳本貓/i.test(content)) {
          console.log(`Found in: ${fullPath}`);
        }
      }
    }
  }
}

searchDir(".");
