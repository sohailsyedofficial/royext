import fs from "fs";
import path from "path";

const colorMap = [
  { regex: /#165dff/gi, replacement: "#7c3aed" },
  { regex: /#e8f3ff/gi, replacement: "#ede9fe" },
  { regex: /#1890ff/gi, replacement: "#7c3aed" },
  { regex: /#096dd9/gi, replacement: "#6d28d9" },
  { regex: /#40a9ff/gi, replacement: "#a78bfa" },
  { regex: /#e6f7ff/gi, replacement: "#f5f3ff" }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      if (file !== "node_modules" && file !== ".git" && file !== "dist" && file !== "clean-extension") {
        processDirectory(fullPath);
      }
    } else if (file.endsWith(".css") || file.endsWith(".tsx") || file.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf8");
      let changed = false;
      for (const mapping of colorMap) {
        if (mapping.regex.test(content)) {
          content = content.replace(mapping.regex, mapping.replacement);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, "utf8");
        console.log(`Recolored file: ${fullPath}`);
      }
    }
  }
}

processDirectory("./src");
