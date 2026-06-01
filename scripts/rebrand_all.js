import fs from "fs";
import path from "path";

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf8");
      // Replace hardcoded "ScriptCat"
      if (content.includes("ScriptCat") || content.includes("脚本猫") || content.includes("腳本貓")) {
        content = content.replace(/ScriptCat/g, "RoyExt");
        content = content.replace(/脚本猫/g, "RoyExt");
        content = content.replace(/腳本貓/g, "RoyExt");
        fs.writeFileSync(fullPath, content, "utf8");
        console.log(`Rebranded pages file: ${fullPath}`);
      }
    }
  }
}

processDir("./src/pages");
