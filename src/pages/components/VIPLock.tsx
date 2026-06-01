import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { Card, Input, Button, Checkbox, Form, Message, Modal, Typography, Space } from "@arco-design/web-react";
import { IconLock, IconCheckCircle, IconIdcard } from "@arco-design/web-react/icon";
import { checkVIPStatus, verifyLicenseKeyOnline, getInstallationFingerprint, checkRevocationStatus, preVerifyLicenseKeyOnline } from "@App/app/vip-service";

const { Title, Text, Paragraph } = Typography;

interface VIPLockProps {
  children: ReactNode;
}

export default function VIPLock({ children }: VIPLockProps) {
  const isMiniMode = typeof window !== "undefined" && window.location.pathname.includes("popup.html");
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [isRevoked, setIsRevoked] = useState(false);
  const [revokeMessage, setRevokeMessage] = useState("");
  
  // Form step: 1 = Key Input, 2 = Name/Age/Legal Notice, 3 = Welcome Screen
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [licenseKeyInput, setLicenseKeyInput] = useState("");
  const [validatedExpiry, setValidatedExpiry] = useState<number>(0);
  
  // Registration States
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const revocationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    console.log("[VIPLock] Component mounted. Initiating VIP check...");
    checkActivation();

    // Cleanup interval on unmount
    return () => {
      if (revocationIntervalRef.current) {
        clearInterval(revocationIntervalRef.current);
      }
    };
  }, []);

  // Start periodic revocation checking (every 2 minutes)
  const startRevocationPolling = () => {
    if (revocationIntervalRef.current) return; // Already polling
    console.log("[VIPLock] Starting periodic revocation polling (every 2 min)");
    revocationIntervalRef.current = setInterval(async () => {
      try {
        console.log("[VIPLock] Periodic revocation check...");
        const result = await checkRevocationStatus();
        if (result.revoked) {
          console.log("[VIPLock] REVOKED detected during periodic check!");
          // Clear ALL VIP data from storage
          if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
            chrome.storage.local.remove(["vip_active", "vip_key", "vip_name", "vip_age", "vip_expires", "vip_plan_type", "vip_activated_at"]);
          }
          setIsRevoked(true);
          setRevokeMessage(result.message);
          setIsLocked(true);
          // Stop polling
          if (revocationIntervalRef.current) {
            clearInterval(revocationIntervalRef.current);
            revocationIntervalRef.current = null;
          }
        }
      } catch (e) {
        console.warn("[VIPLock] Periodic revocation check failed:", e);
      }
    }, 2 * 60 * 1000); // Every 2 minutes
  };

  const checkActivation = async () => {
    try {
      const status = await checkVIPStatus();
      console.log("[VIPLock] checkVIPStatus result:", status);
      if (status.active) {
        // Unlock immediately for instant loading
        setIsLocked(false);
        setLoading(false);
        console.log("[VIPLock] Local check passed. UI unlocked. Checking server for revocation in background...");

        // Server-side revocation check in the background (non-blocking)
        checkRevocationStatus().then((revocationResult) => {
          if (revocationResult.revoked) {
            console.log("[VIPLock] KEY REVOKED BY ADMIN in background check!");
            // Clear ALL VIP data from storage
            if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
              chrome.storage.local.remove(["vip_active", "vip_key", "vip_name", "vip_age", "vip_expires", "vip_plan_type", "vip_activated_at"]);
            }
            setIsRevoked(true);
            setRevokeMessage(revocationResult.message);
            setIsLocked(true);
          } else {
            // Start periodic revocation polling while unlocked
            startRevocationPolling();
          }
        }).catch((revErr) => {
          // If revocation check fails (network), keep unlocked and start polling
          console.warn("[VIPLock] Background revocation check failed, keeping unlocked:", revErr);
          startRevocationPolling();
        });
      } else {
        console.log("[VIPLock] Activation check failed or no license key found. Locking content.");
        setIsLocked(true);
        setLoading(false);
      }
    } catch (e) {
      console.error("[VIPLock] Error checking status:", e);
      setIsLocked(true);
      setLoading(false);
    }
  };

  const handleVerifyKey = async () => {
    const key = licenseKeyInput.trim();
    if (!key) {
      Message.warning("Please enter your license key");
      return;
    }
    
    setIsActivating(true);
    try {
      // Step 1: Pre-verify the license key on the server (without locking or registering details).
      const result = await preVerifyLicenseKeyOnline(key);
      if (!result.valid) {
        Message.error(result.error || "Invalid or Expired License Key. Please purchase a valid key.");
        return;
      }

      setValidatedExpiry(result.expires);
      Message.success("License key verified successfully!");
      setStep(2); // Move to Name/Age step
    } catch (err: any) {
      Message.error("Verification failed: " + (err.message || err));
    } finally {
      setIsActivating(false);
    }
  };

  const handleActivate = async () => {
    if (!name.trim()) {
      Message.warning("Please enter your name");
      return;
    }
    if (!age.trim() || isNaN(Number(age)) || Number(age) <= 0) {
      Message.warning("Please enter a valid age");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      Message.warning("Please enter a valid Gmail/Email address");
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      Message.warning("Please enter a valid Phone Number");
      return;
    }
    if (!agree) {
      Message.warning("You must accept the Legal Notice to proceed");
      return;
    }

    setIsActivating(true);
    try {
      const fingerprint = await getInstallationFingerprint();
      // Register with the server using the entered details
      const result = await verifyLicenseKeyOnline(
        licenseKeyInput.trim(),
        fingerprint,
        name.trim(),
        Number(age),
        email.trim(),
        phone.trim()
      );
      if (!result.valid) {
        Message.error(result.error || "Activation failed on the server.");
        return;
      }
      
      // Save to storage
      chrome.storage.local.set(
        {
          vip_active: true,
          vip_name: name.trim(),
          vip_age: Number(age),
          vip_email: email.trim(),
          vip_phone: phone.trim(),
          vip_expires: result.expires,
          vip_key: licenseKeyInput.trim(),
          vip_plan_type: result.plan_type || "",
          vip_activated_at: result.activated_at || Math.floor(Date.now() / 1000),
        },
        () => {
          setStep(3); // Set to Welcome Screen step
        }
      );
    } catch (err: any) {
      Message.error("Activation failed: " + (err.message || err));
    } finally {
      setIsActivating(false);
    }
  };

  if (loading) {
    console.log("[VIPLock] Rendering Loading screen.");
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          width: "100%",
          background: "#09070f",
          color: "#fff",
          boxSizing: "border-box",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        Loading RoyExt Activation Vault...
      </div>
    );
  }

  if (!isLocked) {
    console.log("[VIPLock] Rendering unlocked children content.");
    return <>{children}</>;
  }

  // Revoked by Admin — fullscreen blocking popup
  if (isRevoked) {
    console.log("[VIPLock] Rendering REVOKED screen.");
    return (
      <div
        style={{
          minHeight: isMiniMode ? "100%" : "100vh",
          height: isMiniMode ? "100%" : undefined,
          width: "100%",
          background: "linear-gradient(135deg, #0a0208 0%, #1a0a0a 50%, #0a0208 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMiniMode ? 10 : 20,
          boxSizing: "border-box",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 480,
            borderRadius: isMiniMode ? 12 : 16,
            border: "2px solid #dc2626",
            background: "linear-gradient(135deg, #1a0a0a 0%, #200d0d 100%)",
            boxShadow: "0 10px 60px rgba(220, 38, 38, 0.3), 0 0 100px rgba(220, 38, 38, 0.1)",
          }}
          bodyStyle={{ padding: isMiniMode ? 16 : 40 }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                background: "rgba(220, 38, 38, 0.15)",
                borderRadius: "50%",
                width: isMiniMode ? 44 : 80,
                height: isMiniMode ? 44 : 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: isMiniMode ? "0 auto 10px auto" : "0 auto 20px auto",
                boxShadow: "0 0 30px rgba(220, 38, 38, 0.3)",
                animation: "pulse 2s infinite",
              }}
            >
              <span style={{ fontSize: isMiniMode ? 20 : 40 }}>🚫</span>
            </div>
            <Title heading={isMiniMode ? 5 : 3} style={{ margin: 0, fontWeight: 800, color: "#ef4444", marginBottom: 8 }}>
              Access Revoked
            </Title>
            <Paragraph style={{ fontSize: isMiniMode ? 12 : 15, color: "#fca5a5", lineHeight: 1.5, marginBottom: 4 }}>
              {revokeMessage || "Your access has been revoked by the Admin."}
            </Paragraph>
            <Paragraph style={{ fontSize: isMiniMode ? 10 : 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.4, marginTop: 0 }}>
              Your RoyExt license has been deactivated. You can no longer use this extension until your access is restored.
            </Paragraph>

            <div
              style={{
                marginTop: isMiniMode ? 12 : 28,
                padding: isMiniMode ? "10px 12px" : "16px 20px",
                background: "rgba(220, 38, 38, 0.08)",
                borderRadius: 12,
                border: "1px solid rgba(220, 38, 38, 0.2)",
              }}
            >
              <Text style={{ fontSize: isMiniMode ? 10 : 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>
                Think this is a mistake? Contact the Admin:
              </Text>
              <a
                href="https://wa.link/pb3pwk"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: isMiniMode ? "6px 14px" : "12px 28px",
                  background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
                  color: "#fff",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: isMiniMode ? 11 : 14,
                  textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(37, 211, 102, 0.3)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(37, 211, 102, 0.4)";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(37, 211, 102, 0.3)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contact Admin
              </a>
            </div>
          </div>
        </Card>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(220, 38, 38, 0.3); }
            50% { transform: scale(1.05); box-shadow: 0 0 50px rgba(220, 38, 38, 0.5); }
          }
        `}</style>
      </div>
    );
  }

  console.log("[VIPLock] Rendering Activation Required Lock UI. Step:", step);
  return (
    <div
      style={{
        minHeight: isMiniMode ? "100%" : "100vh",
        height: isMiniMode ? "100%" : undefined,
        width: "100%",
        background: "linear-gradient(135deg, #09070f 0%, #120f1c 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMiniMode ? 10 : 20,
        boxSizing: "border-box",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 480,
          borderRadius: isMiniMode ? 12 : 16,
          border: "2px solid #7c3aed",
          background: "#120f1c",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
        }}
        bodyStyle={{ padding: isMiniMode ? 16 : 32 }}
      >
        <div style={{ textAlign: "center", marginBottom: isMiniMode ? 12 : 28 }}>
          <div
            style={{
              background: "rgba(124, 58, 237, 0.15)",
              borderRadius: "50%",
              width: isMiniMode ? 44 : 60,
              height: isMiniMode ? 44 : 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: isMiniMode ? "0 auto 10px auto" : "0 auto 16px auto",
              boxShadow: "0 0 15px rgba(124, 58, 237, 0.2)",
            }}
          >
            {step === 1 ? (
              <IconLock style={{ fontSize: isMiniMode ? 20 : 28, color: "#a78bfa" }} />
            ) : step === 2 ? (
              <IconIdcard style={{ fontSize: isMiniMode ? 20 : 28, color: "#f7ba1e" }} />
            ) : (
              <span style={{ fontSize: isMiniMode ? 24 : 32 }}>👑</span>
            )}
          </div>
          <Title heading={isMiniMode ? 5 : 3} style={{ margin: 0, fontWeight: 700, color: "#fff" }}>
            {step === 1
              ? "RoyExt Activation Required"
              : step === 2
              ? "VIP Member Registration"
              : "Welcome to VIP Royal!"}
          </Title>
          <Paragraph style={{ fontSize: isMiniMode ? 11 : 13, color: "var(--color-text-3)", marginTop: 6, marginBottom: 0 }}>
            {step === 1
              ? "Please enter your paid license key code to unlock this extension."
              : step === 2
              ? "Complete your VIP details to initialize your membership profile."
              : "Thank you for joining VIP Royal Membership."}
          </Paragraph>
        </div>

        {step === 1 ? (
          <Space direction="vertical" size={isMiniMode ? "small" : "medium"} style={{ width: "100%" }}>
            <Input.Password
              value={licenseKeyInput}
              onChange={(v) => setLicenseKeyInput(v)}
              placeholder="Paste License Key here..."
              style={{
                height: isMiniMode ? 38 : 44,
                borderRadius: 8,
                background: "var(--color-bg-1)",
                border: "1px solid var(--color-border-2)",
              }}
            />
            <Button
              type="primary"
              size="large"
              style={{
                width: "100%",
                height: isMiniMode ? 38 : 44,
                borderRadius: 8,
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                border: "none",
                fontWeight: 600,
                boxShadow: "0 4px 10px rgba(124, 58, 237, 0.2)",
              }}
              onClick={handleVerifyKey}
            >
              Verify License Key
            </Button>
            <div style={{ textAlign: "center", marginTop: isMiniMode ? 8 : 12 }}>
              <Text style={{ fontSize: isMiniMode ? 11 : 12, color: "var(--color-text-3)" }}>
                Don't have a VIP License?{" "}
                <a
                  href="https://wa.link/pb3pwk"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#a78bfa", fontWeight: 600 }}
                >
                  Buy Premium on Whatsapp
                </a>
              </Text>
            </div>
          </Space>
        ) : step === 2 ? (
          <Space direction="vertical" size={isMiniMode ? "small" : "medium"} style={{ width: "100%" }}>
            <div style={{ display: "flex", flexDirection: isMiniMode ? "column" : "row", gap: isMiniMode ? 8 : 12 }}>
              <div style={{ flex: 2 }}>
                <Text style={{ fontSize: isMiniMode ? 11 : 12, color: "#fff", display: "block", marginBottom: isMiniMode ? 3 : 6 }}>Full Name</Text>
                <Input
                  value={name}
                  onChange={(v) => setName(v)}
                  placeholder="Enter name..."
                  style={{ height: isMiniMode ? 34 : 40, borderRadius: 8, background: "var(--color-bg-1)" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Text style={{ fontSize: isMiniMode ? 11 : 12, color: "#fff", display: "block", marginBottom: isMiniMode ? 3 : 6 }}>Age</Text>
                <Input
                  value={age}
                  onChange={(v) => setAge(v)}
                  placeholder="Age..."
                  type="number"
                  style={{ height: isMiniMode ? 34 : 40, borderRadius: 8, background: "var(--color-bg-1)" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: isMiniMode ? "column" : "row", gap: isMiniMode ? 8 : 12 }}>
              <div style={{ flex: 1 }}>
                <Text style={{ fontSize: isMiniMode ? 11 : 12, color: "#fff", display: "block", marginBottom: isMiniMode ? 3 : 6 }}>Gmail / Email</Text>
                <Input
                  value={email}
                  onChange={(v) => setEmail(v)}
                  placeholder="name@gmail.com"
                  type="email"
                  style={{ height: isMiniMode ? 34 : 40, borderRadius: 8, background: "var(--color-bg-1)" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Text style={{ fontSize: isMiniMode ? 11 : 12, color: "#fff", display: "block", marginBottom: isMiniMode ? 3 : 6 }}>Phone Number</Text>
                <Input
                  value={phone}
                  onChange={(v) => setPhone(v)}
                  placeholder="+1 234..."
                  style={{ height: isMiniMode ? 34 : 40, borderRadius: 8, background: "var(--color-bg-1)" }}
                />
              </div>
            </div>

            <div
              style={{
                background: "var(--color-bg-1)",
                border: "1px solid var(--color-border-2)",
                borderRadius: 8,
                padding: isMiniMode ? 8 : 12,
                maxHeight: isMiniMode ? 65 : 110,
                overflowY: "auto",
                fontSize: 11,
                lineHeight: 1.5,
                color: "var(--color-text-3)",
              }}
            >
              <Text bold style={{ color: "#fff", display: "block", marginBottom: 4 }}>
                Legal Notice & Policy
              </Text>
              RoyExt is a premium utility developed by Sohail Syed. This extension is designed solely for educational,
              testing, and personal productivity purposes. By activating and using this software, you agree that the
              developer (Sohail Syed) bears absolutely no responsibility or liability for any of your actions, queries,
              scripts executed, data processed, or any damages/consequences arising from the use of this extension. Use
              responsibly and in compliance with all relevant website terms of service.
            </div>

            <Checkbox checked={agree} onChange={(checked) => setAgree(checked)} style={{ fontSize: isMiniMode ? 11 : 12 }}>
              <span style={{ color: "var(--color-text-2)" }}>I agree to the Legal Notice, Rules, and Policies</span>
            </Checkbox>

            <Button
              type="primary"
              size="large"
              loading={isActivating}
              style={{
                width: "100%",
                height: isMiniMode ? 38 : 44,
                borderRadius: 8,
                background: "linear-gradient(135deg, #f7ba1e 0%, #d25f00 100%)",
                border: "none",
                fontWeight: 700,
                color: "#fff",
                boxShadow: "0 4px 10px rgba(247, 186, 30, 0.2)",
              }}
              onClick={handleActivate}
            >
              Activate RoyExt VIP
            </Button>
          </Space>
        ) : (
          <Space direction="vertical" size={isMiniMode ? "small" : "medium"} style={{ width: "100%", textAlign: "center" }}>
            <Paragraph style={{ color: "#d8b4fe", fontSize: isMiniMode ? 12 : 14, lineHeight: 1.6, marginTop: 10 }}>
              Welcome, <strong style={{ color: "#fff" }}>{name.trim()}</strong>!<br />
              All premium features are now unlocked. Enjoy your browsing experience!
            </Paragraph>
            <Button
              type="primary"
              size="large"
              style={{
                width: "100%",
                height: isMiniMode ? 38 : 44,
                borderRadius: 8,
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                border: "none",
                fontWeight: 600,
                marginTop: 12,
                boxShadow: "0 4px 10px rgba(124, 58, 237, 0.2)",
              }}
              onClick={() => {
                setIsLocked(false);
              }}
            >
              Enter Extension
            </Button>
          </Space>
        )}
      </Card>
    </div>
  );
}

