import * as CryptoJS from "crypto-js";
import { ONLINE_VALIDATION, VALIDATION_API_URL, SCRIPTS_API_URL, SCRIPTS_CACHE_TTL, VIP_SCRIPTS_FALLBACK, type VIPScript } from "./vip-config";

export interface LicenseCheckResult {
  valid: boolean;
  expires: number; // timestamp, or -1 for lifetime
  keyId: string;
  error?: string;
  plan_type?: string;
  activated_at?: number;
}

/**
 * Generates or retrieves a unique installation fingerprint stored in local storage.
 */
export function getInstallationFingerprint(): Promise<string> {
  return new Promise((resolve) => {
    if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
      resolve("local-dev-fingerprint");
      return;
    }
    chrome.storage.local.get(["vip_fingerprint"], (res) => {
      if (res.vip_fingerprint) {
        resolve(res.vip_fingerprint);
      } else {
        const array = new Uint8Array(16);
        if (typeof crypto !== "undefined" && crypto.getRandomValues) {
          crypto.getRandomValues(array);
        } else {
          // Fallback random generation
          for (let i = 0; i < 16; i++) {
            array[i] = Math.floor(Math.random() * 256);
          }
        }
        const fingerprint = "royext-" + Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
        chrome.storage.local.set({ vip_fingerprint: fingerprint }, () => {
          resolve(fingerprint);
        });
      }
    });
  });
}

/**
 * Synchronous local cryptographic check of the license key
 */
export function verifyLicenseKey(licenseKey: string): LicenseCheckResult {
  if (!licenseKey) return { valid: false, expires: 0, keyId: "", error: "Key is empty" };
  return { valid: false, expires: 0, keyId: "", error: "Local verification is disabled. Please verify online." };
}

/**
 * Asynchronous online check against the PHP/Hostinger database
 */
export async function verifyLicenseKeyOnline(
  licenseKey: string,
  fingerprint: string,
  name: string = "VIP Member",
  age: number = 0,
  email: string = "",
  phone: string = ""
): Promise<LicenseCheckResult> {
  // If online check is disabled, fall back to local validation
  if (!ONLINE_VALIDATION) {
    return verifyLicenseKey(licenseKey);
  }

  try {
    const response = await fetch(VALIDATION_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: licenseKey.trim(),
        fingerprint: fingerprint,
        name: name,
        age: age,
        email: email,
        phone: phone,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    if (data && data.valid) {
      return {
        valid: true,
        expires: data.expires,
        keyId: data.key_id || "online",
        plan_type: data.plan_type || undefined,
        activated_at: data.activated_at || undefined,
      };
    } else {
      return {
        valid: false,
        expires: 0,
        keyId: "",
        error: data.error || "Key validation failed.",
      };
    }
  } catch (e: any) {
    console.error("Online validation request failed:", e);
    return {
      valid: false,
      expires: 0,
      keyId: "",
      error: "Could not connect to verification server. Please check your internet connection.",
    };
  }
}

/**
 * Asynchronous online check to pre-verify license key before registering info
 */
export async function preVerifyLicenseKeyOnline(licenseKey: string): Promise<LicenseCheckResult> {
  try {
    const response = await fetch(VALIDATION_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "pre_verify",
        key: licenseKey.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    if (data && data.valid) {
      return {
        valid: true,
        expires: data.expires,
        keyId: "pre_verify",
      };
    } else {
      return {
        valid: false,
        expires: 0,
        keyId: "",
        error: data.error || "Key validation failed.",
      };
    }
  } catch (e: any) {
    console.error("Pre-verification online request failed:", e);
    return {
      valid: false,
      expires: 0,
      keyId: "",
      error: "Could not connect to verification server. Please check your internet connection.",
    };
  }
}

/**
 * Checks overall VIP status of the extension
 */
export function checkVIPStatus(): Promise<{ active: boolean; name: string; age: number; email?: string; phone?: string; expires: number; plan_type?: string; activated_at?: number }> {
  return new Promise((resolve) => {
    if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
      resolve({ active: false, name: "", age: 0, expires: 0 });
      return;
    }
    chrome.storage.local.get(["vip_active", "vip_name", "vip_age", "vip_email", "vip_phone", "vip_expires", "vip_key", "vip_plan_type", "vip_activated_at"], (res) => {
      if (!res.vip_active || !res.vip_key) {
        resolve({ active: false, name: "", age: 0, expires: 0 });
        return;
      }
      
      const expires = res.vip_expires || 0;
      const isExpired = expires !== -1 && Date.now() > expires;
      
      if (isExpired) {
        chrome.storage.local.set({ vip_active: false });
        resolve({ active: false, name: res.vip_name || "", age: res.vip_age || 0, expires });
      } else {
        let activatedAt = res.vip_activated_at;
        if (!activatedAt) {
          activatedAt = Math.floor(Date.now() / 1000);
          chrome.storage.local.set({ vip_activated_at: activatedAt });
        }
        resolve({
          active: true,
          name: res.vip_name || "",
          age: res.vip_age || 0,
          email: res.vip_email || "",
          phone: res.vip_phone || "",
          expires: expires,
          plan_type: res.vip_plan_type || "",
          activated_at: activatedAt,
        });
      }
    });
  });
}

/**
 * Fetch VIP scripts dynamically from the server.
 * Uses chrome.storage.local cache with TTL fallback.
 */
export async function fetchVIPScripts(): Promise<VIPScript[]> {
  // Retrieve local key and fingerprint
  const keyData = await new Promise<{ key?: string; fingerprint?: string }>((resolve) => {
    if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
      resolve({});
      return;
    }
    chrome.storage.local.get(["vip_key", "vip_fingerprint"], (res) => {
      resolve({ key: res.vip_key, fingerprint: res.vip_fingerprint });
    });
  });

  const vipKey = keyData.key || "";
  const vipFingerprint = keyData.fingerprint || "";

  const appendCredentials = (scriptsList: VIPScript[]): VIPScript[] => {
    if (!vipKey || !vipFingerprint) return scriptsList;
    return scriptsList.map((s) => ({
      ...s,
      downloadUrl: `${s.downloadUrl}&key=${encodeURIComponent(vipKey)}&fingerprint=${encodeURIComponent(vipFingerprint)}`,
    }));
  };

  // Try reading from cache first
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    const cached = await new Promise<{ scripts?: VIPScript[]; cachedAt?: number }>((resolve) => {
      chrome.storage.local.get(["vip_scripts_cache", "vip_scripts_cached_at"], (res) => {
        resolve({ scripts: res.vip_scripts_cache, cachedAt: res.vip_scripts_cached_at });
      });
    });

    if (cached.scripts && cached.cachedAt && (Date.now() - cached.cachedAt) < SCRIPTS_CACHE_TTL) {
      return appendCredentials(cached.scripts);
    }
  }

  // Fetch from server
  try {
    const response = await fetch(SCRIPTS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "list",
        key: vipKey,
        fingerprint: vipFingerprint,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    if (data.success && Array.isArray(data.scripts)) {
      const scripts: VIPScript[] = data.scripts;

      // Cache the raw scripts list (without user-specific parameters appended)
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({
          vip_scripts_cache: scripts,
          vip_scripts_cached_at: Date.now(),
        });
      }

      return appendCredentials(scripts);
    } else {
      throw new Error(data.error || "Invalid response format from scripts API");
    }
  } catch (e: any) {
    console.warn("Failed to fetch VIP scripts from server, checking cache:", e);
    // If we have stale cache, return it rather than completely failing
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      const cached = await new Promise<{ scripts?: VIPScript[] }>((resolve) => {
        chrome.storage.local.get(["vip_scripts_cache"], (res) => {
          resolve({ scripts: res.vip_scripts_cache });
        });
      });
      if (cached.scripts && cached.scripts.length > 0) {
        console.log("Returning stale cached scripts after fetch failure");
        return appendCredentials(cached.scripts);
      }
    }
    // No cache and fetch failed — throw the error so the UI can notify the user
    throw new Error(e.message || "Failed to connect to the scripts server.");
  }
}

/**
 * Check if any scripts have been updated since the given timestamp.
 */
export async function checkScriptUpdates(sinceTimestamp: number): Promise<{ hasUpdates: boolean; updatedScripts: { id: string; name: string; version: string }[] }> {
  try {
    const keyData = await new Promise<{ key?: string; fingerprint?: string }>((resolve) => {
      if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
        resolve({});
        return;
      }
      chrome.storage.local.get(["vip_key", "vip_fingerprint"], (res) => {
        resolve({ key: res.vip_key, fingerprint: res.vip_fingerprint });
      });
    });

    const response = await fetch(SCRIPTS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "check_updates",
        since: sinceTimestamp,
        key: keyData.key || "",
        fingerprint: keyData.fingerprint || "",
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (data.success) {
      return {
        hasUpdates: data.has_updates,
        updatedScripts: data.updated_scripts || [],
      };
    }
  } catch (e) {
    console.warn("Failed to check script updates:", e);
  }

  return { hasUpdates: false, updatedScripts: [] };
}

/**
 * Check if the current license key has been revoked by the admin.
 * Called on extension startup to enforce server-side revocation.
 */
export async function checkRevocationStatus(): Promise<{ revoked: boolean; message: string }> {
  try {
    // Get stored key from local storage
    const stored = await new Promise<{ key?: string }>((resolve) => {
      if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
        resolve({});
        return;
      }
      chrome.storage.local.get(["vip_key"], (res) => {
        resolve({ key: res.vip_key });
      });
    });

    if (!stored.key) {
      return { revoked: false, message: "" };
    }

    const response = await fetch(VALIDATION_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "check_status",
        key: stored.key,
      }),
    });

    if (!response.ok) {
      // If server is unreachable, don't block the user
      console.warn("Revocation check: server returned HTTP", response.status);
      return { revoked: false, message: "" };
    }

    const data = await response.json();
    if (data.revoked === true) {
      // Clear ALL VIP data from storage since the key has been revoked
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.remove(["vip_active", "vip_key", "vip_name", "vip_age", "vip_expires", "vip_plan_type", "vip_activated_at"]);
      }
      return {
        revoked: true,
        message: data.revoke_message || "Your access has been revoked by the Admin.",
      };
    }

    return { revoked: false, message: "" };
  } catch (e) {
    // Network error — don't block user if server is temporarily unreachable
    console.warn("Revocation check failed (network):", e);
    return { revoked: false, message: "" };
  }
}

/**
 * Back up local settings to the server
 */
export async function backupSettings(settingsJson: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const keyData = await new Promise<{ key?: string; fingerprint?: string }>((resolve) => {
      if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
        resolve({});
        return;
      }
      chrome.storage.local.get(["vip_key", "vip_fingerprint"], (res) => {
        resolve({ key: res.vip_key, fingerprint: res.vip_fingerprint });
      });
    });

    if (!keyData.key) throw new Error("No license key found.");

    const response = await fetch(SCRIPTS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "backup_settings",
        key: keyData.key,
        fingerprint: keyData.fingerprint || "",
        settings_json: settingsJson,
      }),
    });

    return await response.json();
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to connect to the backup server." };
  }
}

/**
 * Restore settings from the server
 */
export async function restoreSettings(): Promise<{ success: boolean; settings_json?: string; error?: string }> {
  try {
    const keyData = await new Promise<{ key?: string; fingerprint?: string }>((resolve) => {
      if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
        resolve({});
        return;
      }
      chrome.storage.local.get(["vip_key", "vip_fingerprint"], (res) => {
        resolve({ key: res.vip_key, fingerprint: res.vip_fingerprint });
      });
    });

    if (!keyData.key) throw new Error("No license key found.");

    const response = await fetch(SCRIPTS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "restore_settings",
        key: keyData.key,
        fingerprint: keyData.fingerprint || "",
      }),
    });

    return await response.json();
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to connect to the backup server." };
  }
}

export interface VIPAnnouncement {
  id: string;
  title: string;
  content: string;
  created_at: number;
  btn_text?: string;
  btn_link?: string;
}

/**
 * Fetch announcements from the server
 */
export async function fetchAnnouncements(): Promise<VIPAnnouncement[]> {
  try {
    const keyData = await new Promise<{ key?: string; fingerprint?: string }>((resolve) => {
      if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
        resolve({});
        return;
      }
      chrome.storage.local.get(["vip_key", "vip_fingerprint"], (res) => {
        resolve({ key: res.vip_key, fingerprint: res.vip_fingerprint });
      });
    });

    if (!keyData.key) return [];

    const response = await fetch(SCRIPTS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "announcements",
        key: keyData.key,
        fingerprint: keyData.fingerprint || "",
      }),
    });

    const data = await response.json();
    if (data.success && Array.isArray(data.announcements)) {
      const announcements: VIPAnnouncement[] = data.announcements;

      // Handle desktop notification triggering for new unseen announcements
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(["vip_seen_announcements"], (res) => {
          const seenIds: string[] = res.vip_seen_announcements || [];
          const newSeenIds = [...seenIds];
          let updated = false;

          announcements.forEach((ann) => {
            if (!seenIds.includes(ann.id)) {
              newSeenIds.push(ann.id);
              updated = true;

              // Trigger desktop notification
              if (chrome.notifications && chrome.notifications.create) {
                chrome.notifications.create({
                  type: "basic",
                  title: ann.title || "RoyExt System Announcement",
                  message: ann.content || "",
                  iconUrl: chrome.runtime.getURL("assets/logo.png"),
                });
              }
            }
          });

          if (updated) {
            chrome.storage.local.set({ vip_seen_announcements: newSeenIds });
          }
        });
      }

      return announcements;
    }
    return [];
  } catch (e) {
    console.warn("Failed to fetch announcements:", e);
    return [];
  }
}

/**
 * Submit user feedback or script request to the admin
 */
export async function submitFeedback(scriptId: string, feedbackType: string, message: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const keyData = await new Promise<{ key?: string; fingerprint?: string }>((resolve) => {
      if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
        resolve({});
        return;
      }
      chrome.storage.local.get(["vip_key", "vip_fingerprint"], (res) => {
        resolve({ key: res.vip_key, fingerprint: res.vip_fingerprint });
      });
    });

    if (!keyData.key) throw new Error("No license key found.");

    const response = await fetch(SCRIPTS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "submit_feedback",
        key: keyData.key,
        fingerprint: keyData.fingerprint || "",
        script_id: scriptId,
        feedback_type: feedbackType,
        message: message,
      }),
    });

    return await response.json();
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to submit feedback." };
  }
}
