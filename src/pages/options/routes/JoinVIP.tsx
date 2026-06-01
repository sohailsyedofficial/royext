import React from "react";
import { Button, Card, Divider, Space, Typography, Tag } from "@arco-design/web-react";
import { FaCheck, FaWhatsapp } from "react-icons/fa";
import VipBadgeIcon from "@App/pages/components/VipBadgeIcon";

const { Title, Text, Paragraph } = Typography;

export default function JoinVIP() {
  const whatsappLink = "https://wa.link/pb3pwk";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100%",
        padding: "40px 20px",
        overflowY: "auto",
        background: "var(--color-bg-1)",
        fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header Section */}
      <div style={{ textAlign: "center", marginBottom: 40, maxWidth: 600 }}>
        <Space direction="vertical" size="medium" align="center">
          <div
            style={{
              background: "linear-gradient(135deg, #a78bfa 0%, #f7ba1e 100%)",
              borderRadius: "50%",
              width: 70,
              height: 70,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(167, 139, 250, 0.4)",
              marginBottom: 10,
            }}
          >
            <VipBadgeIcon size={36} />
          </div>
          <Title heading={2} style={{ margin: 0, fontWeight: 700, letterSpacing: "-0.02em" }}>
            RoyExt VIP Royal Membership
          </Title>
          <Paragraph
            style={{
              fontSize: 16,
              color: "var(--color-text-2)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Get exclusive access to premium scripts, VIP features, and dedicated support. Join our elite club to supercharge your browsing experience today.
          </Paragraph>
        </Space>
      </div>

      {/* Pricing Cards Container */}
      <div
        className="tw-flex tw-flex-col md:tw-flex-row tw-gap-8 tw-justify-center tw-items-stretch tw-w-full"
        style={{
          maxWidth: 900,
        }}
      >
        {/* Yearly VIP Card */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "var(--color-bg-2)",
            border: "2px solid var(--color-border-2)",
            borderRadius: 16,
            padding: 32,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            position: "relative",
            transition: "all 0.3s ease",
            transform: "translateY(0)",
          }}
          className="hover:tw-scale-[1.02] hover:tw-shadow-[0_8px_30px_rgba(124,58,237,0.2)]"
        >
          <div style={{ marginBottom: 20 }}>
            <Tag color="arcoblue" bordered style={{ marginBottom: 12, fontWeight: 600 }}>
              YEARLY ACCESS
            </Tag>
            <Title heading={3} style={{ margin: "4px 0 0 0", fontWeight: 700 }}>
              Yearly VIP
            </Title>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", marginBottom: 24 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: "var(--color-text-1)" }}>$15</span>
            <span style={{ fontSize: 16, color: "var(--color-text-3)", marginLeft: 6 }}>/ year</span>
          </div>

          <Divider style={{ margin: "0 0 24px 0" }} />

          <div style={{ flex: 1, marginBottom: 32 }}>
            <Space direction="vertical" size="medium" style={{ width: "100%" }}>
              {[
                "Unlock All Premium Scripts",
                "VIP Royal Member Access",
                "Advanced Customizations",
                "24/7 Smart Script Management",
                "Dedicated Email Support",
              ].map((feature, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      background: "rgba(124, 58, 237, 0.15)",
                      borderRadius: "50%",
                      width: 22,
                      height: 22,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaCheck size={10} color="#a78bfa" />
                  </div>
                  <Text style={{ fontSize: 14, color: "var(--color-text-2)" }}>{feature}</Text>
                </div>
              ))}
            </Space>
          </div>

          <a href={whatsappLink} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <Button
              type="secondary"
              size="large"
              style={{
                width: "100%",
                height: 48,
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                border: "1px solid #7c3aed",
                color: "#a78bfa",
                background: "transparent",
                transition: "all 0.2s ease",
              }}
              className="hover:tw-bg-[rgba(124,58,237,0.1)]"
            >
              <FaWhatsapp size={18} />
              Buy Yearly VIP
            </Button>
          </a>
        </div>

        {/* Lifetime VIP Card */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "var(--color-bg-2)",
            border: "2px solid #f7ba1e",
            borderRadius: 16,
            padding: 32,
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
            position: "relative",
            transition: "all 0.3s ease",
            transform: "translateY(0)",
          }}
          className="hover:tw-scale-[1.02] hover:tw-shadow-[0_8px_30px_rgba(247,186,30,0.25)]"
        >
          <div
            style={{
              position: "absolute",
              top: -12,
              right: 20,
              background: "linear-gradient(135deg, #f7ba1e 0%, #d25f00 100%)",
              color: "#fff",
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
              boxShadow: "0 4px 10px rgba(247, 186, 30, 0.3)",
              letterSpacing: "0.05em",
            }}
          >
            BEST VALUE
          </div>

          <div style={{ marginBottom: 20 }}>
            <Tag color="gold" bordered style={{ marginBottom: 12, fontWeight: 600 }}>
              LIFETIME ACCESS
            </Tag>
            <Title heading={3} style={{ margin: "4px 0 0 0", fontWeight: 700 }}>
              Lifetime VIP
            </Title>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", marginBottom: 24 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: "var(--color-text-1)" }}>$25</span>
            <span style={{ fontSize: 16, color: "var(--color-text-3)", marginLeft: 6 }}>/ once</span>
          </div>

          <Divider style={{ margin: "0 0 24px 0" }} />

          <div style={{ flex: 1, marginBottom: 32 }}>
            <Space direction="vertical" size="medium" style={{ width: "100%" }}>
              {[
                "Unlock All Premium Scripts",
                "VIP Royal Member Access",
                "Advanced Customizations",
                "24/7 Smart Script Management",
                "Lifetime Free Updates",
                "Priority VIP Support",
              ].map((feature, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      background: "rgba(247, 186, 30, 0.15)",
                      borderRadius: "50%",
                      width: 22,
                      height: 22,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaCheck size={10} color="#f7ba1e" />
                  </div>
                  <Text style={{ fontSize: 14, color: "var(--color-text-2)" }}>{feature}</Text>
                </div>
              ))}
            </Space>
          </div>

          <a href={whatsappLink} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <Button
              type="primary"
              size="large"
              style={{
                width: "100%",
                height: 48,
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "linear-gradient(135deg, #f7ba1e 0%, #d25f00 100%)",
                border: "none",
                color: "#fff",
                boxShadow: "0 4px 12px rgba(247, 186, 30, 0.3)",
                transition: "all 0.2s ease",
              }}
              className="hover:tw-opacity-90"
            >
              <FaWhatsapp size={18} />
              Buy Lifetime VIP
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
