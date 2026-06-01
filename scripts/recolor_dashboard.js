import fs from "fs";

const filePath = "./src/pages/options/routes/AnythingDashboard.tsx";
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, "utf8");
  
  // Replace primary blue with royal purple
  content = content.replace(/#165dff/g, "#7c3aed");
  // Replace light blue background with light purple/violet background
  content = content.replace(/#e8f3ff/g, "#ede9fe");
  
  fs.writeFileSync(filePath, content, "utf8");
  console.log("Recolored AnythingDashboard.tsx to royal purple theme.");
}
