import React, { useState, useEffect } from "react";
import { Card, Input, Button, Typography, Tag, Space, Message, Spin, Modal, Form, Select, Switch, Alert } from "@arco-design/web-react";
import { IconSearch, IconDownload, IconRefresh, IconUser, IconCalendar, IconCloudDownload, IconCheckCircle, IconSettings, IconMessage, IconSync, IconNotification } from "@arco-design/web-react/icon";
import VipBadgeIcon, { VipShopIcon } from "@App/pages/components/VipBadgeIcon";
import { type VIPScript } from "@App/app/vip-config";
import { fetchVIPScripts, checkVIPStatus, backupSettings, restoreSettings, fetchAnnouncements, submitFeedback, type VIPAnnouncement } from "@App/app/vip-service";
import { useSearchParams } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface VIPPlanInfo {
  active: boolean;
  name: string;
  expires: number;
  plan_type?: string;
  activated_at?: number;
}

// Injected Custom CSS for layout fixes, global background overrides, and micro-interactions
const cssStyles = `
/* Unify background colors globally to fix the horizontal background split line */
body[arco-theme='dark'],
body[arco-theme='dark'] #root,
body[arco-theme='dark'] .arco-layout,
body[arco-theme='dark'] .arco-layout-content,
body[arco-theme='dark'] .arco-layout-sider {
  background-color: #09070f !important;
  background: #09070f !important;
}

body[arco-theme='light'],
body[arco-theme='light'] #root,
body[arco-theme='light'] .arco-layout,
body[arco-theme='light'] .arco-layout-content,
body[arco-theme='light'] .arco-layout-sider {
  background-color: #faf9ff !important;
  background: #faf9ff !important;
}

@keyframes pulseGlowGold {
  0% { box-shadow: 0 0 25px rgba(247, 186, 30, 0.15), inset 0 0 12px rgba(247, 186, 30, 0.05); }
  50% { box-shadow: 0 0 40px rgba(247, 186, 30, 0.35), inset 0 0 20px rgba(247, 186, 30, 0.1); }
  100% { box-shadow: 0 0 25px rgba(247, 186, 30, 0.15), inset 0 0 12px rgba(247, 186, 30, 0.05); }
}

@keyframes pulseGlowPurple {
  0% { box-shadow: 0 0 25px rgba(124, 58, 237, 0.15), inset 0 0 12px rgba(124, 58, 237, 0.05); }
  50% { box-shadow: 0 0 40px rgba(124, 58, 237, 0.35), inset 0 0 20px rgba(124, 58, 237, 0.1); }
  100% { box-shadow: 0 0 25px rgba(124, 58, 237, 0.15), inset 0 0 12px rgba(124, 58, 237, 0.05); }
}

.vip-shop-container {
  min-height: 100% !important;
  box-sizing: border-box !important;
}

body[arco-theme='dark'] .vip-shop-container {
  background-image: 
    radial-gradient(at 0% 0%, rgba(124, 58, 237, 0.06) 0, transparent 50%), 
    radial-gradient(at 100% 0%, rgba(247, 186, 30, 0.04) 0, transparent 50%) !important;
  background-attachment: fixed !important;
}

body[arco-theme='light'] .vip-shop-container {
  background-image: 
    radial-gradient(at 0% 0%, rgba(196, 181, 253, 0.2) 0, transparent 50%), 
    radial-gradient(at 100% 0%, rgba(253, 230, 138, 0.15) 0, transparent 50%) !important;
  background-attachment: fixed !important;
}

.futuristic-plan-hud {
  backdrop-filter: blur(20px);
  border-radius: 20px !important;
  padding: 32px !important;
  margin-bottom: 36px !important;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
}

body[arco-theme='dark'] .futuristic-plan-hud {
  background: rgba(26, 15, 46, 0.3) !important;
}

body[arco-theme='light'] .futuristic-plan-hud {
  background: rgba(255, 255, 255, 0.6) !important;
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.06) !important;
}

.futuristic-plan-hud-lifetime {
  border: 1px solid rgba(247, 186, 30, 0.25) !important;
  animation: pulseGlowGold 6s infinite ease-in-out;
}

.futuristic-plan-hud-active {
  border: 1px solid rgba(124, 58, 237, 0.25) !important;
  animation: pulseGlowPurple 6s infinite ease-in-out;
}

.vip-script-grid-card {
  backdrop-filter: blur(12px) !important;
  border-radius: 20px !important;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
  position: relative;
  overflow: hidden;
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
}

body[arco-theme='dark'] .vip-script-grid-card {
  background: rgba(18, 15, 28, 0.3) !important;
  border: 1px solid rgba(124, 58, 237, 0.15) !important;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2) !important;
}

body[arco-theme='light'] .vip-script-grid-card {
  background: rgba(255, 255, 255, 0.75) !important;
  border: 1px solid rgba(124, 58, 237, 0.15) !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.03) !important;
}

.vip-script-grid-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, #7c3aed, #db2777);
  opacity: 0.1;
  transition: all 0.4s ease;
}

.vip-script-grid-card:hover {
  transform: translateY(-6px);
}

body[arco-theme='dark'] .vip-script-grid-card:hover {
  border-color: rgba(124, 58, 237, 0.4) !important;
  box-shadow: 0 16px 40px rgba(124, 58, 237, 0.2), 0 0 20px rgba(124, 58, 237, 0.08) !important;
}

body[arco-theme='light'] .vip-script-grid-card:hover {
  border-color: rgba(124, 58, 237, 0.3) !important;
  box-shadow: 0 16px 40px rgba(124, 58, 237, 0.08) !important;
}

.vip-script-grid-card:hover::before {
  opacity: 1;
  background: linear-gradient(90deg, #db2777, #f7ba1e);
}

.vip-btn-gradient {
  background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%) !important;
  border: none !important;
  border-radius: 10px !important;
  font-weight: 700 !important;
  letter-spacing: 0.03em !important;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.25) !important;
  transition: all 0.3s ease !important;
  color: #fff !important;
}

.vip-btn-gradient:hover {
  transform: scale(1.04);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45) !important;
  color: #fff !important;
}

.vip-btn-gradient:active {
  transform: scale(0.98);
}

.vip-sync-btn {
  background: rgba(124, 58, 237, 0.08) !important;
  border: 1px solid rgba(124, 58, 237, 0.3) !important;
  color: #a78bfa !important;
  border-radius: 10px !important;
  transition: all 0.3s ease !important;
  font-weight: 600 !important;
}

.vip-sync-btn:hover {
  background: rgba(124, 58, 237, 0.15) !important;
  border-color: #7c3aed !important;
  color: #fff !important;
}

.futuristic-input .arco-input-inner-wrapper {
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
}

body[arco-theme='dark'] .futuristic-input .arco-input-inner-wrapper {
  background: rgba(18, 15, 28, 0.5) !important;
  border: 1px solid rgba(124, 58, 237, 0.2) !important;
}

body[arco-theme='dark'] .futuristic-input .arco-input-inner-wrapper:focus-within {
  border-color: #a78bfa !important;
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.25) !important;
}

body[arco-theme='light'] .futuristic-input .arco-input-inner-wrapper {
  background: rgba(255, 255, 255, 0.8) !important;
  border: 1px solid rgba(124, 58, 237, 0.15) !important;
}

body[arco-theme='light'] .futuristic-input .arco-input-inner-wrapper:focus-within {
  border-color: #7c3aed !important;
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.12) !important;
}

.vip-hologram-glow {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  opacity: 0.15;
  background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
}
`;

function PlanCard({ plan }: { plan: VIPPlanInfo }) {
  const isLifetime = plan.expires === -1;
  const expiryDate = isLifetime ? "Never" : plan.expires > 0 ? new Date(plan.expires).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Unknown";
  const memberSince = plan.activated_at ? new Date(plan.activated_at * 1000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  let daysRemaining = 0;
  let totalDays = 0;
  let progressPercent = 100;
  if (!isLifetime && plan.expires > 0 && plan.activated_at) {
    const now = Date.now();
    daysRemaining = Math.max(0, Math.ceil((plan.expires - now) / (1000 * 86400)));
    totalDays = Math.ceil((plan.expires - plan.activated_at * 1000) / (1000 * 86400));
    progressPercent = totalDays > 0 ? Math.round((daysRemaining / totalDays) * 100) : 0;
  }

  return (
    <div className={`futuristic-plan-hud ${isLifetime ? "futuristic-plan-hud-lifetime" : "futuristic-plan-hud-active"}`}>
      <div className="vip-hologram-glow" style={{ background: isLifetime ? "radial-gradient(circle, #f7ba1e 0%, transparent 70%)" : "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26, flexWrap: "wrap" }}>
        <div style={{
          width: 54, height: 54, borderRadius: 14,
          background: isLifetime
            ? "linear-gradient(135deg, #f7ba1e 0%, #d97706 100%)"
            : "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: isLifetime ? "0 4px 15px rgba(247,186,30,0.3)" : "0 4px 15px rgba(124,58,237,0.3)",
        }}>
          <VipBadgeIcon size={28} />
        </div>
        <div style={{ flex: 1 }}>
          <Title heading={5} style={{ margin: 0, fontWeight: 800, fontSize: 20, letterSpacing: "0.01em" }}>
            Member Passport
          </Title>
          <Text style={{ fontSize: 13, color: "var(--color-text-3)", fontWeight: 600 }}>
            Credentials for: <span style={{ color: "var(--color-text-1)", fontWeight: 800 }}>{plan.name || "VIP Member"}</span>
          </Text>
        </div>
        <Tag
          bordered
          style={{
            background: isLifetime ? "rgba(247, 186, 30, 0.08)" : "rgba(124, 58, 237, 0.08)",
            borderColor: isLifetime ? "#f7ba1e" : "#7c3aed",
            color: isLifetime ? "#f7ba1e" : "var(--color-text-2)",
            fontWeight: 800,
            padding: "8px 16px",
            height: "auto",
            borderRadius: 10,
            fontSize: 12,
            letterSpacing: "0.04em",
          }}
        >
          {isLifetime ? "👑 LIFETIME MEMBER" : "⭐ ACTIVE MEMBER"}
        </Tag>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 18, marginBottom: isLifetime ? 0 : 22,
      }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 22px" }}>
          <div style={{ fontSize: 11, color: "var(--color-text-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Membership Level</div>
          <div style={{ fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: isLifetime ? "#f7ba1e" : "#7c3aed" }}>⚡</span> {plan.plan_type || (isLifetime ? "Lifetime Royal Member" : "VIP Member")}
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 22px" }}>
          <div style={{ fontSize: 11, color: "var(--color-text-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Access Expiry</div>
          <div style={{ fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
            <IconCalendar style={{ color: "var(--color-text-3)" }} /> {expiryDate}
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 22px" }}>
          <div style={{ fontSize: 11, color: "var(--color-text-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Activation Date</div>
          <div style={{ fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
            <IconCheckCircle style={{ color: "#10b981" }} /> {memberSince}
          </div>
        </div>
        {!isLifetime && plan.expires > 0 && (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 22px" }}>
            <div style={{ fontSize: 11, color: "var(--color-text-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Days Left</div>
            <div style={{ fontSize: 16, color: daysRemaining < 7 ? "#ef4444" : "#10b981", fontWeight: 800 }}>
              ⏳ {daysRemaining} Days
            </div>
          </div>
        )}
      </div>

      {!isLifetime && plan.expires > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--color-text-3)", marginBottom: 8, fontWeight: 600 }}>
            <span>Cycle progress tracker</span>
            <span style={{ fontWeight: 800 }}>{progressPercent}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 4, transition: "width 1.2s cubic-bezier(0.1, 0.8, 0.25, 1)",
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function VIPShop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [scripts, setScripts] = useState<VIPScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planInfo, setPlanInfo] = useState<VIPPlanInfo | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Missed Features States
  const [announcements, setAnnouncements] = useState<VIPAnnouncement[]>([]);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsScript, setActiveSettingsScript] = useState<VIPScript | null>(null);
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [activeDescScript, setActiveDescScript] = useState<VIPScript | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  
  const [searchParams] = useSearchParams();
  const [feedbackForm] = Form.useForm();
  const [settingsForm] = Form.useForm();

  const loadScripts = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await fetchVIPScripts();
      setScripts(fetched);
      setLastSynced(new Date());
    } catch (e: any) {
      console.error("Failed to load scripts:", e);
      setError(e.message || "Failed to load scripts from server.");
      setScripts([]);
    }
    setLoading(false);
  };

  const loadPlanInfo = async () => {
    try {
      const status = await checkVIPStatus();
      if (status.active) {
        setPlanInfo(status);
      }
    } catch (e) {
      console.error("Failed to load plan info:", e);
    }
  };

  const loadAnnouncementsData = async () => {
    try {
      const fetched = await fetchAnnouncements();
      setAnnouncements(fetched);
    } catch (e) {
      console.warn("Failed to load announcements:", e);
    }
  };

  useEffect(() => {
    loadScripts();
    loadPlanInfo();
    loadAnnouncementsData();
  }, []);

  useEffect(() => {
    if (searchParams.get("action") === "feedback") {
      setIsFeedbackOpen(true);
    }
  }, [searchParams]);

  const filteredScripts = scripts.filter((script) =>
    script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (script.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInstall = (script: VIPScript) => {
    try {
      const installUrl = chrome.runtime.getURL(`/src/install.html?url=${encodeURIComponent(script.downloadUrl)}`);
      window.open(installUrl, "_blank");
      Message.info(`Opening installer for ${script.name}`);
    } catch (e) {
      window.open(`/src/install.html?url=${encodeURIComponent(script.downloadUrl)}`, "_blank");
    }
  };

  const handleRefresh = async () => {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.remove(["vip_scripts_cache", "vip_scripts_cached_at"]);
    }
    setError(null);
    await loadScripts();
    await loadAnnouncementsData();
    Message.success("Scripts refreshed from server!");
  };

  // Cloud Sync Handlers
  const handleBackup = async () => {
    if (typeof chrome === "undefined" || !chrome.storage || !chrome.storage.local) {
      Message.error("Extension storage is not available.");
      return;
    }
    setIsBackingUp(true);
    chrome.storage.local.get(null, async (allData) => {
      try {
        const payload = {
          vip_settings: {}
        } as any;
        for (const key in allData) {
          if (key.startsWith("vip_settings_")) {
            payload.vip_settings[key] = allData[key];
          }
        }
        const settingsStr = JSON.stringify(payload);
        const res = await backupSettings(settingsStr);
        if (res.success) {
          Message.success(res.message || "Settings backed up to cloud successfully!");
        } else {
          Message.error(res.error || "Backup failed.");
        }
      } catch (e: any) {
        Message.error("Backup failed: " + (e.message || e));
      } finally {
        setIsBackingUp(false);
      }
    });
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const res = await restoreSettings();
      if (res.success && res.settings_json) {
        const payload = JSON.parse(res.settings_json);
        if (payload.vip_settings && Object.keys(payload.vip_settings).length > 0) {
          chrome.storage.local.set(payload.vip_settings, () => {
            Message.success("Settings restored from cloud successfully!");
            // Reload page in 1s to apply changes
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          });
        } else {
          Message.warning("No custom script settings found in backup.");
        }
      } else {
        Message.error(res.error || "No settings backup found on server.");
      }
    } catch (e: any) {
      Message.error("Restore failed: " + (e.message || e));
    } finally {
      setIsRestoring(false);
    }
  };

  // Feedback Submission Handler
  const submitFeedbackForm = async () => {
    try {
      const values = await feedbackForm.validate();
      const res = await submitFeedback(values.script_id, values.feedback_type, values.message);
      if (res.success) {
        Message.success(res.message || "Feedback submitted successfully!");
        setIsFeedbackOpen(false);
        feedbackForm.resetFields();
      } else {
        Message.error(res.error || "Submission failed.");
      }
    } catch (e: any) {
      Message.error(e.message || "Please fill in required fields.");
    }
  };

  // Per-Script Settings Handlers
  const openSettingsModal = (script: VIPScript) => {
    setActiveSettingsScript(script);
    setIsSettingsOpen(true);
    
    // Load settings from storage
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([`vip_settings_${script.id}`], (res) => {
        const existing = res[`vip_settings_${script.id}`] || { delay: 0, auto_run: true, custom_keys: "" };
        settingsForm.setFieldsValue(existing);
      });
    } else {
      settingsForm.setFieldsValue({ delay: 0, auto_run: true, custom_keys: "" });
    }
  };

  const saveScriptSettings = async () => {
    if (!activeSettingsScript) return;
    try {
      const values = await settingsForm.validate();
      const storageKey = `vip_settings_${activeSettingsScript.id}`;
      
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ [storageKey]: values }, () => {
          Message.success(`Configuration saved for ${activeSettingsScript.name}`);
          setIsSettingsOpen(false);
        });
      } else {
        Message.warning("Extension local storage is not available.");
        setIsSettingsOpen(false);
      }
    } catch (e) {
      // Validate failed
    }
  };

  return (
    <div
      className="vip-shop-container"
      style={{
        padding: "24px 28px 100px 28px",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Inject custom styles globally for consistent backgrounds and transitions */}
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />

      {/* Current Plan Card */}
      {planInfo && planInfo.active && <PlanCard plan={planInfo} />}


      {/* Header Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 36,
          gap: 20,
        }}
      >
        <div>
          <Title heading={2} style={{ margin: 0, fontWeight: 800, display: "flex", alignItems: "center", gap: 14, fontSize: 26 }}>
            <VipShopIcon size={32} style={{ filter: "drop-shadow(0 2px 10px rgba(247,186,30,0.35))" }} /> RoyExt VIP Script Vault
          </Title>
          <Paragraph style={{ color: "var(--color-text-3)", marginTop: 8, marginBottom: 0, fontSize: 14, lineHeight: 1.6 }}>
            Premium certified userscripts created by Sohail Syed. Instantly download or update from your remote server repository.
          </Paragraph>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Button
            className="vip-sync-btn"
            icon={<IconMessage />}
            onClick={() => setIsFeedbackOpen(true)}
            style={{ height: 40, padding: "0 16px" }}
          >
            Feedback Board
          </Button>
          <Button.Group>
            <Button
              className="vip-sync-btn"
              icon={<IconSync />}
              onClick={handleBackup}
              loading={isBackingUp}
              style={{ height: 40, borderRight: "1px solid rgba(124, 58, 237, 0.15)" }}
            >
              Cloud Backup
            </Button>
            <Button
              className="vip-sync-btn"
              icon={<IconCloudDownload />}
              onClick={handleRestore}
              loading={isRestoring}
              style={{ height: 40 }}
            >
              Cloud Restore
            </Button>
          </Button.Group>
          <Button
            className="vip-sync-btn"
            icon={<IconRefresh />}
            onClick={handleRefresh}
            style={{ height: 40, padding: "0 16px" }}
          >
            Refresh Catalog
          </Button>
        </div>
      </div>

      {/* Filter / Search HUD Bar */}
      <div style={{ 
        background: "rgba(255,255,255,0.02)", 
        border: "1px solid rgba(255,255,255,0.05)", 
        padding: "18px 24px", 
        borderRadius: 16, 
        marginBottom: 36, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16
      }}>
        <Input
          className="futuristic-input"
          prefix={<IconSearch style={{ color: "var(--color-text-3)" }} />}
          placeholder="Filter scripts by name or metadata keyword..."
          value={searchQuery}
          onChange={(val) => setSearchQuery(val)}
          style={{
            width: "100%",
            maxWidth: 440,
            height: 44,
          }}
        />
        {lastSynced && (
          <Text style={{ fontSize: 12, color: "var(--color-text-3)", fontWeight: 600 }}>
            ⚡ Repository synced: {lastSynced.toLocaleTimeString()}
          </Text>
        )}
      </div>

      {/* Main Scripts Catalog Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "120px 24px" }}>
          <Spin size={36} />
          <div style={{ marginTop: 22, color: "var(--color-text-3)", fontSize: 14, fontWeight: 600, letterSpacing: "0.03em" }}>
            Querying secure script vault...
          </div>
        </div>
      ) : error ? (
        <Card
          style={{
            textAlign: "center",
            padding: "54px 24px",
            background: "rgba(239, 68, 68, 0.05)",
            borderRadius: 20,
            border: "1px solid rgba(239, 68, 68, 0.2)",
            boxShadow: "0 0 30px rgba(239, 68, 68, 0.03)",
          }}
        >
          <Text style={{ color: "#ef4444", display: "block", marginBottom: 22, fontSize: 14, fontWeight: 700 }}>
            ⚠️ System exception connecting to remote registry: {error}
          </Text>
          <Button
            className="vip-btn-gradient"
            type="primary"
            onClick={handleRefresh}
            style={{
              height: 42,
              padding: "0 28px",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            }}
          >
            Retry Connection
          </Button>
        </Card>
      ) : filteredScripts.length === 0 ? (
        <Card
          style={{
            textAlign: "center",
            padding: "70px 24px",
            background: "rgba(255, 255, 255, 0.01)",
            borderRadius: 20,
            border: "1px dashed rgba(255, 255, 255, 0.08)",
          }}
        >
          <Text style={{ color: "var(--color-text-3)", fontSize: 14, fontWeight: 600 }}>
            No authorized scripts detected in the remote repository.
          </Text>
        </Card>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
            gap: 28,
          }}
        >
          {filteredScripts.map((script) => (
            <Card
              key={script.id}
              className="vip-script-grid-card"
              style={{ display: "flex", flexDirection: "column", height: "100%" }}
              bodyStyle={{ 
                padding: "26px 26px 32px 26px", 
                display: "flex", 
                flexDirection: "column", 
                flex: 1, 
                justifyContent: "space-between", 
                minHeight: 280 
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 18, gap: 12 }}>
                  <Title heading={5} style={{ margin: 0, fontWeight: 800, fontSize: 17, lineHeight: 1.4 }}>
                    {script.name}
                  </Title>
                  <Tag
                    bordered
                    style={{
                      background: "rgba(124, 58, 237, 0.06)",
                      color: "#a78bfa",
                      borderColor: "rgba(124, 58, 237, 0.3)",
                      fontWeight: 800,
                      borderRadius: 6,
                      fontSize: 11,
                      padding: "2px 8px",
                      height: "auto",
                    }}
                  >
                    v{script.version}
                  </Tag>
                </div>
                <Paragraph
                  style={{
                    color: "var(--color-text-2)",
                    fontSize: 13,
                    lineHeight: 1.6,
                    marginBottom: 22,
                    fontWeight: 500,
                    height: 52,
                    overflow: "hidden",
                  }}
                >
                  {script.description && script.description.length > 90 ? (
                    <>
                      {script.description.slice(0, 87)}...{" "}
                      <span
                        onClick={() => {
                          setActiveDescScript(script);
                          setIsDescOpen(true);
                        }}
                        style={{
                          color: "#a78bfa",
                          cursor: "pointer",
                          fontWeight: 700,
                          textDecoration: "underline",
                        }}
                      >
                        Read More
                      </span>
                    </>
                  ) : (
                    script.description
                  )}
                </Paragraph>
              </div>

              <div>
                {/* Meta details badges */}
                <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
                  <Tag bordered size="small" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)", color: "var(--color-text-3)", borderRadius: 6 }}>
                    🛡️ Secure Script
                  </Tag>
                  <Tag bordered size="small" style={{ background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.25)", color: "#10b981", borderRadius: 6 }}>
                    ⚡ Fast Install
                  </Tag>
                </div>

                <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1, minWidth: 0, paddingRight: 10 }}>
                    <div style={{ fontSize: 11.5, color: "var(--color-text-3)", display: "flex", alignItems: "center", gap: 6 }}>
                      <IconUser style={{ color: "#a78bfa", fontSize: 12 }} />
                      <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        Dev: <strong style={{ color: "var(--color-text-1)", fontWeight: 800 }}>{script.author}</strong>
                      </span>
                    </div>
                    {script.download_count !== undefined && (
                      <div style={{ fontSize: 11.5, color: "var(--color-text-3)", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                        <IconCloudDownload style={{ color: "var(--color-text-3)", fontSize: 12 }} />
                        <span>Downloads: <strong style={{ color: "var(--color-text-1)", fontWeight: 800 }}>{script.download_count}</strong></span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Button
                      icon={<IconSettings />}
                      onClick={() => openSettingsModal(script)}
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        marginRight: 8,
                        color: "var(--color-text-2)",
                      }}
                      className="vip-sync-btn"
                    />
                    <Button
                      className="vip-btn-gradient"
                      type="primary"
                      icon={<IconDownload />}
                      onClick={() => handleInstall(script)}
                      style={{ height: 40, padding: "0 18px" }}
                    >
                      Install
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Missed Features Modals */}

      {/* 1. Feedback Modal */}
      <Modal
        title="Feedback & Request Board"
        visible={isFeedbackOpen}
        onOk={submitFeedbackForm}
        onCancel={() => {
          setIsFeedbackOpen(false);
          feedbackForm.resetFields();
        }}
        okText="Submit Feedback"
        cancelText="Cancel"
        style={{ maxWidth: 460 }}
      >
        <Form form={feedbackForm} layout="vertical">
          <Form.Item label="Target Script" field="script_id" initialValue="general">
            <Select>
              <Option value="general">General (Entire Extension)</Option>
              {scripts.map((s) => (
                <Option key={s.id} value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Feedback Type" field="feedback_type" initialValue="bug">
            <Select>
              <Option value="bug">🐛 Bug Report</Option>
              <Option value="request">📜 Script Request</Option>
              <Option value="suggestion">💡 Suggestion</Option>
            </Select>
          </Form.Item>
          <Form.Item 
            label="Message Details" 
            field="message" 
            rules={[{ required: true, message: "Please describe your feedback details..." }]}
          >
            <Input.TextArea placeholder="Enter details or script features requested..." rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 2. Per-Script Settings Modal */}
      <Modal
        title={`Settings: ${activeSettingsScript?.name}`}
        visible={isSettingsOpen}
        onOk={saveScriptSettings}
        onCancel={() => setIsSettingsOpen(false)}
        okText="Save Config"
        cancelText="Cancel"
        style={{ maxWidth: 460 }}
      >
        <Form form={settingsForm} layout="vertical">
          <Form.Item label="Execution Delay (ms)" field="delay" initialValue={0}>
            <Input type="number" placeholder="e.g. 500" />
          </Form.Item>
          <Form.Item label="Auto-Run Switch" field="auto_run" triggerPropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
          <Form.Item label="Custom Configuration Keys / Tokens" field="custom_keys">
            <Input.Password placeholder="e.g. API keys, auth tokens..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* 3. Script Description Details Modal */}
      <Modal
        title={`Script Details: ${activeDescScript?.name}`}
        visible={isDescOpen}
        onOk={() => setIsDescOpen(false)}
        onCancel={() => setIsDescOpen(false)}
        okText="Got it"
        cancelButtonProps={{ style: { display: "none" } }}
        style={{ maxWidth: 520, borderRadius: 16 }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
              Script Name
            </Text>
            <Title heading={4} style={{ margin: "4px 0 0 0", fontWeight: 800 }}>
              {activeDescScript?.name}
            </Title>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                Version
              </Text>
              <div>
                <Tag color="arcoblue" style={{ fontWeight: 700, borderRadius: 6, marginTop: 4 }}>
                  v{activeDescScript?.version}
                </Tag>
              </div>
            </div>
            <div style={{ flex: 2 }}>
              <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                Developer
              </Text>
              <div style={{ marginTop: 4, fontWeight: 600 }}>
                {activeDescScript?.author}
              </div>
            </div>
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
              Description
            </Text>
            <Paragraph style={{ marginTop: 8, whiteSpace: "pre-line", lineHeight: 1.6, color: "var(--color-text-1)" }}>
              {activeDescScript?.description}
            </Paragraph>
          </div>
        </div>
      </Modal>
    </div>
  );
}
