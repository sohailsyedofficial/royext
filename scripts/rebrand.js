import fs from "fs";
import path from "path";

// 1. Update src/manifest.json
const manifestPath = "./src/manifest.json";
if (fs.existsSync(manifestPath)) {
  let manifest = fs.readFileSync(manifestPath, "utf8");
  manifest = manifest.replace(/"author":\s*"[^"]*"/, '"author": "Sohail Syed"');
  fs.writeFileSync(manifestPath, manifest, "utf8");
  console.log("Updated manifest.json author.");
}

// 2. Update assets locales messages.json files
const localesDir = "./src/assets/_locales";
if (fs.existsSync(localesDir)) {
  const folders = fs.readdirSync(localesDir);
  for (const folder of folders) {
    const filePath = path.join(localesDir, folder, "messages.json");
    if (fs.existsSync(filePath)) {
      let data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (data.scriptcat) {
        data.scriptcat.message = "RoyExt";
      }
      if (data.scriptcat_beta) {
        data.scriptcat_beta.message = "RoyExt Beta";
      }
      if (data.scriptcat_description) {
        data.scriptcat_description.message = "RoyExt is a premium browser extension built for VIP Royal Membership, designed to enhance browsing with smart script management, better control, and a smooth user experience.";
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
      console.log(`Updated assets locale: ${filePath}`);
    }
  }
}

// 3. Update react i18n locales translation.json files
const reactLocalesDir = "./src/locales";
if (fs.existsSync(reactLocalesDir)) {
  const folders = fs.readdirSync(reactLocalesDir);
  for (const folder of folders) {
    const filePath = path.join(reactLocalesDir, folder, "translation.json");
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, "utf8");
      // Replace variations
      content = content.replace(/ScriptCat/g, "RoyExt");
      content = content.replace(/脚本猫/g, "RoyExt");
      content = content.replace(/腳本貓/g, "RoyExt");
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`Updated react locale: ${filePath}`);
    }
  }
}

// 4. Update rspack.config.ts titles
const rspackConfigPath = "./rspack.config.ts";
if (fs.existsSync(rspackConfigPath)) {
  let content = fs.readFileSync(rspackConfigPath, "utf8");
  content = content.replace(/ScriptCat/g, "RoyExt");
  fs.writeFileSync(rspackConfigPath, content, "utf8");
  console.log("Updated rspack.config.ts.");
}

// 5. Update AnythingDashboard.tsx
const dashPath = "./src/pages/options/routes/AnythingDashboard.tsx";
if (fs.existsSync(dashPath)) {
  let content = fs.readFileSync(dashPath, "utf8");
  content = content.replace(/Anything AI UI/g, "RoyExt UI");
  content = content.replace(/Mock Dashboard/g, "RoyExt Dashboard");
  fs.writeFileSync(dashPath, content, "utf8");
  console.log("Updated AnythingDashboard.tsx.");
}
