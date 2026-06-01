import React from "react";
import { Card, Button, Typography, Tag, Space, Message } from "@arco-design/web-react";
import {
  IconUser,
  IconCode,
  IconCheckCircle,
  IconEmail,
  IconPhone,
  IconShareExternal,
} from "@arco-design/web-react/icon";
import { FaWhatsapp, FaYoutube, FaTelegram, FaGlobe, FaArrowRight, FaCode, FaLaptopCode, FaWrench } from "react-icons/fa";

const { Title, Text, Paragraph } = Typography;

const cssStyles = `
/* Custom styled developer profile layout */
.developer-container {
  min-height: 100% !important;
  box-sizing: border-box !important;
  padding: 16px !important;
  animation: fadeInDev 0.6s ease-out;
}

@keyframes fadeInDev {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes floatDev {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
}

@keyframes glowBorderPurple {
  0% { border-color: rgba(124, 58, 237, 0.2); box-shadow: 0 0 15px rgba(124, 58, 237, 0.05); }
  50% { border-color: rgba(124, 58, 237, 0.45); box-shadow: 0 0 25px rgba(124, 58, 237, 0.15); }
  100% { border-color: rgba(124, 58, 237, 0.2); box-shadow: 0 0 15px rgba(124, 58, 237, 0.05); }
}

/* Glassmorphic card theme matching the VIP Shop */
.dev-glass-card {
  backdrop-filter: blur(16px) !important;
  border-radius: 20px !important;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
  position: relative;
  overflow: hidden;
}

body[arco-theme='dark'] .dev-glass-card {
  background: rgba(18, 15, 28, 0.4) !important;
  border: 1px solid rgba(124, 58, 237, 0.18) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24) !important;
}

body[arco-theme='light'] .dev-glass-card {
  background: rgba(255, 255, 255, 0.8) !important;
  border: 1px solid rgba(124, 58, 237, 0.12) !important;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.04) !important;
}

.dev-glass-card:hover {
  transform: translateY(-4px);
}

body[arco-theme='dark'] .dev-glass-card:hover {
  border-color: rgba(124, 58, 237, 0.4) !important;
  box-shadow: 0 16px 40px rgba(124, 58, 237, 0.18) !important;
}

body[arco-theme='light'] .dev-glass-card:hover {
  border-color: rgba(124, 58, 237, 0.25) !important;
  box-shadow: 0 16px 30px rgba(124, 58, 237, 0.08) !important;
}

/* Developer Profile Picture Glow */
.profile-avatar-wrapper {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto 20px auto;
}

.profile-avatar-glow {
  position: absolute;
  top: -5px; left: -5px; right: -5px; bottom: -5px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #a78bfa, #db2777);
  opacity: 0.85;
  filter: blur(4px);
  z-index: 1;
  animation: rotateGlow 10s linear infinite;
}

@keyframes rotateGlow {
  100% { transform: rotate(360deg); }
}

.profile-avatar-img {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #09070f;
  object-fit: cover;
  z-index: 2;
  transition: all 0.3s ease;
}

.dev-glass-card:hover .profile-avatar-img {
  transform: scale(1.05);
}

/* Skills badge styling */
.skill-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.3s ease;
}

body[arco-theme='dark'] .skill-card:hover {
  background: rgba(124, 58, 237, 0.06);
  border-color: rgba(124, 58, 237, 0.3);
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.1);
}

body[arco-theme='light'] .skill-card:hover {
  background: rgba(124, 58, 237, 0.03);
  border-color: rgba(124, 58, 237, 0.2);
}

.skill-icon-wrapper {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(124, 58, 237, 0.12);
  color: #a78bfa;
  font-size: 18px;
}

/* Banner/CTA Card details */
.cta-banner-wrapper {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  margin-top: 24px;
  border: 1px solid rgba(124, 58, 237, 0.2);
  animation: glowBorderPurple 8s infinite ease-in-out;
}

.cta-banner-img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.6s ease;
}

.cta-banner-wrapper:hover .cta-banner-img {
  transform: scale(1.025);
}

.cta-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(180deg, rgba(9, 7, 15, 0.1) 40%, rgba(9, 7, 15, 0.8) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px;
}

/* Custom interactive social button */
.dev-social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 48px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  border: none;
  text-decoration: none;
}

.dev-social-btn-whatsapp {
  background: #25d366 !important;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2);
}
.dev-social-btn-whatsapp:hover {
  transform: scale(1.04);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
}

.dev-social-btn-youtube {
  background: #ff0000 !important;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(255, 0, 0, 0.25);
}
.dev-social-btn-youtube:hover {
  transform: scale(1.04);
  box-shadow: 0 6px 20px rgba(255, 0, 0, 0.4);
}

.dev-social-btn-telegram {
  background: #0088cc !important;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(0, 136, 204, 0.25);
}
.dev-social-btn-telegram:hover {
  transform: scale(1.04);
  box-shadow: 0 6px 20px rgba(0, 136, 204, 0.4);
}

.dev-social-btn-website {
  background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%) !important;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}
.dev-social-btn-website:hover {
  transform: scale(1.04);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.5);
}

.dev-contact-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dev-contact-row:hover {
  background: rgba(124, 58, 237, 0.05);
  border-color: rgba(124, 58, 237, 0.25);
}

.dev-contact-icon {
  color: #a78bfa;
  font-size: 16px;
}

.brand-badge {
  background: rgba(124, 58, 237, 0.08);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 8px;
  padding: 8px 14px;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.05em;
  color: var(--color-text-2);
  display: inline-block;
  margin: 4px;
  transition: all 0.2s ease;
}

.brand-badge:hover {
  background: rgba(124, 58, 237, 0.15);
  border-color: #7c3aed;
  color: #fff;
  transform: translateY(-2px);
}
`;

const AboutDeveloper: React.FC = () => {
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    Message.success(`${label} copied to clipboard!`);
  };

  return (
    <div className="developer-container">
      <style dangerouslySetInnerHTML={{ __html: cssStyles }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
        
        {/* Left Side Profile Card */}
        <Card className="dev-glass-card" style={{ height: "fit-content" }} bordered={false}>
          <div style={{ textAlign: "center", paddingTop: 12 }}>
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar-glow" />
              <img
                src="/assets/images/developer_profile.jpg"
                alt="Syed Sohail Safdar"
                className="profile-avatar-img"
                onError={(e) => {
                  // Fallback if image doesn't render immediately
                  (e.target as HTMLImageElement).src = "https://sohailsyed.com/wp-content/uploads/2024/09/cropped-sohail-profile.jpg";
                }}
              />
            </div>
            
            <Title heading={3} style={{ margin: "0 0 4px 0", fontWeight: 800, background: "linear-gradient(90deg, #a78bfa, #db2777)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Syed Sohail Safdar
            </Title>
            
            <Text style={{ fontSize: 13, color: "var(--color-text-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Senior Web Developer & Designer
            </Text>
            
            <div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "16px 0 24px 0" }}>
              <Tag color="purple" bordered style={{ borderRadius: 6, fontWeight: 700 }}>WORDPRESS EXPERT</Tag>
              <Tag color="pink" bordered style={{ borderRadius: 6, fontWeight: 700 }}>SHOPIFY EXPERT</Tag>
              <Tag color="gold" bordered style={{ borderRadius: 6, fontWeight: 700 }}>FULL STACK</Tag>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: 20 }}>
            <Title heading={5} style={{ marginTop: 0, marginBottom: 16, fontWeight: 800 }}>
              Contact Details
            </Title>
            
            <div className="dev-contact-row" onClick={() => window.open("mailto:hello@sohailsyed.com", "_blank")}>
              <IconEmail className="dev-contact-icon" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--color-text-3)", fontWeight: 600 }}>Email Address</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>hello@sohailsyed.com</div>
              </div>
              <Button size="mini" type="text" onClick={(e) => { e.stopPropagation(); handleCopy("hello@sohailsyed.com", "Email"); }}>Copy</Button>
            </div>

            <div className="dev-contact-row" onClick={() => window.open("https://sohailsyed.com", "_blank")}>
              <FaGlobe className="dev-contact-icon" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--color-text-3)", fontWeight: 600 }}>Personal Website</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>sohailsyed.com</div>
              </div>
              <IconShareExternal style={{ color: "var(--color-text-3)", fontSize: 14 }} />
            </div>

            <div className="dev-contact-row" onClick={() => window.open("tel:+92370672624", "_self")}>
              <IconPhone className="dev-contact-icon" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--color-text-3)", fontWeight: 600 }}>Direct Line</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>+92370672624</div>
              </div>
              <Button size="mini" type="text" onClick={(e) => { e.stopPropagation(); handleCopy("+92370672624", "Phone number"); }}>Copy</Button>
            </div>
          </div>
        </Card>

        {/* Right Side Bio & Skill Hub */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Professional Bio */}
          <Card className="dev-glass-card" bordered={false}>
            <Title heading={4} style={{ marginTop: 0, marginBottom: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
              <span>🚀</span> About Me
            </Title>
            <Paragraph style={{ fontSize: 14, lineHeight: "1.6", color: "var(--color-text-2)", margin: 0 }}>
              I am a passionate Full Stack Developer and Designer dedicated to building high-performance, search engine optimized, and visually stunning web applications. With years of experience across multiple platforms, I craft tailored digital solutions that help brands stand out and scale operations seamlessly. 
            </Paragraph>
            <Paragraph style={{ fontSize: 14, lineHeight: "1.6", color: "var(--color-text-2)", marginTop: 12, marginBottom: 0 }}>
              My focus is always on speed, security, clean code architecture, and high-impact visual design. I ensure that every website doesn't just look amazing, but delivers tangible business results.
            </Paragraph>
          </Card>

          {/* Skill Matrix */}
          <Card className="dev-glass-card" bordered={false}>
            <Title heading={4} style={{ marginTop: 0, marginBottom: 16, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
              <span>⚡</span> Skill Matrix & Specialties
            </Title>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              <div className="skill-card">
                <div className="skill-icon-wrapper"><FaCode /></div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>Web Development</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-3)" }}>HTML5, CSS3, ES6+ JS</div>
                </div>
              </div>
              <div className="skill-card">
                <div className="skill-icon-wrapper"><FaLaptopCode /></div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>CMS Expert</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-3)" }}>WordPress, Elementor</div>
                </div>
              </div>
              <div className="skill-card">
                <div className="skill-icon-wrapper"><FaWrench /></div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>E-Commerce</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-3)" }}>Shopify, Wix Storefront</div>
                </div>
              </div>
              <div className="skill-card">
                <div className="skill-icon-wrapper"><IconUser /></div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>UI & UX Design</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-3)" }}>Premium Glassmorphism</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Brands & Featured Projects */}
          <Card className="dev-glass-card" bordered={false}>
            <Title heading={4} style={{ marginTop: 0, marginBottom: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
              <span>🏆</span> Featured Brands & Work
            </Title>
            <Text style={{ fontSize: 13, color: "var(--color-text-3)", display: "block", marginBottom: 12 }}>
              Proudly designed, developed, or optimized core elements for these projects:
            </Text>
            <div style={{ display: "flex", flexWrap: "wrap", margin: "-4px" }}>
              <span className="brand-badge">🍔 FOODBOOK</span>
              <span className="brand-badge">🛡️ HACKSHELP</span>
              <span className="brand-badge">💻 CodeWithBpers</span>
              <span className="brand-badge">📈 COIN CURRENT NEWS</span>
            </div>
          </Card>
        </div>
      </div>

      {/* CTA & Banner Showcase Card */}
      <Card className="dev-glass-card" style={{ marginTop: 24, padding: 0 }} bodyStyle={{ padding: 0 }} bordered={false}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", alignItems: "center" }}>
          
          <div style={{ padding: "36px 40px" }}>
            <Tag color="red" bordered style={{ marginBottom: 12, borderRadius: 6, fontWeight: 800 }}>COLLABORATE</Tag>
            <Title heading={3} style={{ margin: "0 0 12px 0", fontWeight: 800, fontSize: 24 }}>
              Let's Build Something Amazing
            </Title>
            <Paragraph style={{ color: "var(--color-text-2)", fontSize: 14, lineHeight: "1.6", marginBottom: 24 }}>
              Need a custom web extension, a beautiful business landing page, or a high-converting e-commerce shop? Connect with me directly and let's turn your vision into reality.
            </Paragraph>
            <Button
              className="dev-social-btn dev-social-btn-website"
              style={{ width: "fit-content", padding: "0 32px" }}
              onClick={() => window.open("https://sohailsyed.com", "_blank")}
            >
              Get In Touch <FaArrowRight />
            </Button>
          </div>

          <div style={{ padding: 24 }}>
            <div className="cta-banner-wrapper">
              <img
                src="/assets/images/developer_banner.png"
                alt="Syed Sohail Safdar Work Banner"
                className="cta-banner-img"
                onError={(e) => {
                  // Hide or load fallback banner if missing
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Social Connection Matrix */}
      <Card className="dev-glass-card" style={{ marginTop: 24 }} bordered={false}>
        <Title heading={4} style={{ marginTop: 0, marginBottom: 18, fontWeight: 800, textAlign: "center" }}>
          Join My Official Developer Channels
        </Title>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <a
            href="https://whatsapp.com/channel/0029Vb7TK7QFnSz3jsheO40D"
            target="_blank"
            rel="noreferrer"
            className="dev-social-btn dev-social-btn-whatsapp"
          >
            <FaWhatsapp size={18} /> WhatsApp Channel
          </a>
          <a
            href="https://www.youtube.com/@opsteamss"
            target="_blank"
            rel="noreferrer"
            className="dev-social-btn dev-social-btn-youtube"
          >
            <FaYoutube size={18} /> YouTube Channel
          </a>
          <a
            href="https://t.me/official_pcss"
            target="_blank"
            rel="noreferrer"
            className="dev-social-btn dev-social-btn-telegram"
          >
            <FaTelegram size={18} /> Telegram Channel
          </a>
        </div>
      </Card>
    </div>
  );
};

export default AboutDeveloper;
