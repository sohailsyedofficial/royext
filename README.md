<h1 align="center">
<img src="./src/assets/logo.png" width="128"/><br/>
RoyExt VIP
</h1>

<p align="center">A premium browser extension built for advanced script execution, featuring a robust custom licensing validation system, device-locked activation, and a modern VIP experience.</p>

---

## 🌟 About RoyExt VIP

**RoyExt VIP** is a highly customized and enhanced browser extension designed for secure, premium script execution. Built upon the foundation of the open-source ScriptCat project, RoyExt VIP elevates script management by adding proprietary server-side license verification, custom billing/VIP integration, and real-time script activation management.

This project was developed with a focus on delivering exclusive, device-locked userscripts (e.g., premium site unlockers) to licensed users securely.

---

## ✨ RoyExt VIP Exclusive Features

Unlike generic userscript managers, RoyExt VIP introduces unique features designed to support premium extension distribution:

### 🔑 Secure License Key Authentication
- **Remote Validation**: Real-time license check via `verify.php` API.
- **Single-Device Protection**: Device-locked activations ensuring license keys cannot be shared.
- **Auto-Revocation**: Immediate unregistration of scripts upon license expiration or key revocation.

### ⚡ Real-Time Injection Engine
- **No-Reload Setup**: Scripts matching active domains inject immediately into the `"MAIN"` world context the instant a valid license is pasted, without needing to reload the extension or page.
- **MV3 Native Support**: Rebuilt script event-listeners utilizing `window` targets to enable seamless execution and network hook interception (such as `unsafeWindow.fetch` overrides) inside isolated environments.

### 🎨 VIP Portal & Custom UI
- **Branded Panel**: Custom Options page with a dedicated **VIP Shop** and **Join VIP** onboarding portals.
- **Dynamic Indicators**: Premium license badges showing real-time activation details.

---

## 🛠️ Technology Stack & Architecture

- **Core Engine**: HTML5, TypeScript, React (options/popups), CSS.
- **Packaging**: Rspack for optimized Manifest V3 bundle size compilation.
- **Backend API**: PHP server checking local configuration and device activation constraints.

---

## 📄 Open Source Base & License

RoyExt VIP is built using the open-source codebase of **ScriptCat** as its core framework. 

This project is distributed under the [GPLv3](./LICENSE) license in compliance with its open-source requirements. 

- **Original Authors & Credits**: ScriptCat Org (CodFrm & contributors).
- **Custom Improvements & Enhancements**: Sohail Syed (sohailsyedofficial).
- **License Terms**: Under GPLv3, this code is provided open-source. Anyone using or modifying this codebase in their projects must also release it under the GPLv3 license and keep all copyright attributions intact.

---

*Copyright © 2026 sohailsyedofficial (RoyExt VIP). All rights reserved.*
