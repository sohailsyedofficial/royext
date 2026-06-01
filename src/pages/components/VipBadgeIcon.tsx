import React from "react";

interface VipBadgeIconProps {
  size?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

export default function VipBadgeIcon({ size = 16, style = {}, className = "" }: VipBadgeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      width={size}
      height={size}
      version="1.1"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      viewBox="0 0 360 511.48"
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      className={className}
    >
      <g id="Layer_x0020_1">
        <polygon fill="#D0401B" points="144.83,306.61 296.28,280.53 360,429.51 281.2,428.61 216.45,481.14 " />
        <polygon fill="#FF6600" points="231.94,290.08 69.57,294.38 0,459.86 78.8,458.95 143.55,511.48" />
        <path fill="#F5C800" d="M183.21 0.03c9.35,-0.4 16.72,2.86 24.15,7.59 9.44,5.98 20.06,17.8 33.17,25.3 18.45,10.54 52.61,-4 70.11,21.99 10.21,15.16 10.69,27.04 11.45,38.78 0.82,12.67 3.04,24.32 16,41.47 21.47,28.38 25.94,47.27 14.88,66.96 -7.54,13.42 -23.41,20.88 -27.09,29.38 -7.81,18.09 0.83,31.72 -9.87,52.81 -7.43,14.62 -18.89,24.26 -34.16,29.18 -12.88,4.14 -25.8,-1.85 -36.1,2.48 -18.12,7.61 -31.48,25.3 -45.89,29.77 -5.57,1.73 -11.11,2.58 -16.65,2.54 -5.53,0.04 -11.08,-0.81 -16.64,-2.54 -14.42,-4.47 -27.78,-22.16 -45.9,-29.77 -10.3,-4.33 -23.22,1.66 -36.1,-2.48 -15.26,-4.92 -26.73,-14.56 -34.16,-29.18 -10.7,-21.09 -2.06,-34.72 -9.87,-52.81 -3.68,-8.5 -19.55,-15.96 -27.09,-29.38 -11.06,-19.69 -6.58,-38.58 14.88,-66.96 12.96,-17.15 15.18,-28.8 16,-41.47 0.76,-11.74 1.24,-23.62 11.45,-38.78 17.5,-25.99 51.66,-11.45 70.11,-21.99 13.12,-7.5 23.73,-19.32 33.17,-25.3 7.44,-4.73 14.81,-7.99 24.15,-7.59z" />
        <path fill="#FFDD61" d="M183.21 0.04c9.35,-0.41 16.71,2.86 24.15,7.58 9.44,5.98 20.06,17.8 33.17,25.3 14.67,8.38 39.28,0.91 57.54,10.56l-206.12 271.42c-2.45,-0.2 -4.92,-0.62 -7.38,-1.41 -15.27,-4.92 -26.73,-14.55 -34.16,-29.18 -10.7,-21.09 -2.06,-34.72 -9.87,-52.81 -3.68,-8.5 -19.55,-15.96 -27.09,-29.38 -11.06,-19.69 -6.58,-38.58 14.87,-66.96 12.97,-17.14 15.19,-28.8 16.01,-41.47 0.76,-11.74 1.24,-23.62 11.44,-38.78 17.51,-26 51.68,-11.45 70.12,-21.99 13.12,-7.5 23.74,-19.32 33.17,-25.3 7.44,-4.72 14.81,-7.99 24.15,-7.58z" />
        <circle fill="#E37E00" cx="182.71" cy="176.83" r="130.04" />
        <path fill="#F5C800" d="M182.71 72.88c57.41,0 103.94,46.54 103.94,103.95 0,57.41 -46.53,103.95 -103.94,103.95 -57.41,0 -103.95,-46.54 -103.95,-103.95 0,-57.41 46.54,-103.95 103.95,-103.95z" />
        <path fill="#FFDD61" d="M182.71 72.88c27.48,0 52.49,10.67 71.07,28.09l-127.44 163.2c-4.62,-2.98 -8.99,-6.33 -13.07,-9.99 -21.18,-19.02 -34.51,-46.63 -34.51,-77.35 0,-57.41 46.54,-103.95 103.95,-103.95z" />
        <path fill="#E37E00" fill-rule="nonzero" d="M185.78 116.08l16.31 38.19 41.36 3.71c1.83,0.16 3.18,1.77 3.02,3.59 -0.07,0.89 -0.49,1.67 -1.12,2.21l0 0 -31.29 27.33 9.26 40.5c0.41,1.79 -0.71,3.57 -2.5,3.98 -0.92,0.21 -1.83,0.02 -2.56,-0.45l-35.55 -21.26 -35.66 21.32c-1.57,0.94 -3.61,0.43 -4.55,-1.14 -0.46,-0.77 -0.57,-1.64 -0.39,-2.45l0 0 9.26 -40.5 -31.3 -27.33c-1.38,-1.2 -1.52,-3.3 -0.31,-4.68 0.61,-0.7 1.46,-1.08 2.32,-1.13l41.26 -3.7 16.32 -38.21c0.72,-1.69 2.67,-2.47 4.35,-1.75 0.84,0.35 1.45,1 1.77,1.77l0 0z" />
      </g>
    </svg>
  );
}

export function VipShopIcon({ size = 16, style = {}, className = "" }: VipBadgeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      className={className}
    >
      {/* Handle */}
      <path
        d="M176 160c0-44.2 35.8-80 80-80s80 35.8 80 80"
        stroke="#FFDD61"
        strokeWidth="28"
        strokeLinecap="round"
      />
      {/* Bag Body */}
      <path
        d="M80 160h352c11 0 20 9 20 20v240c0 33.1-26.9 60-60 60H120c-33.1 0-60-26.9-60-60V180c0-11 9-20 20-20z"
        fill="url(#shopBodyGrad)"
      />
      {/* Inner VIP badge */}
      <circle cx="256" cy="300" r="60" fill="#E37E00" />
      <circle cx="256" cy="300" r="48" fill="#F5C800" />
      <path
        d="M256 275l7 14 15 2-11 10 3 15-14-7-14 7 3-15-11-10 15-2z"
        fill="#FFDD61"
      />
      <defs>
        <linearGradient id="shopBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#db2777" />
          <stop offset="100%" stopColor="#f7ba1e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function DeveloperIcon({ size = 16, style = {}, className = "" }: VipBadgeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      className={className}
    >
      {/* Shield/Circle Frame */}
      <circle cx="256" cy="256" r="220" stroke="url(#devBorderGrad)" strokeWidth="24" fill="url(#devBgGrad)" />
      
      {/* Stylized Developer Person */}
      {/* Head */}
      <circle cx="256" cy="180" r="64" fill="#FFDD61" />
      {/* Body / Shoulders */}
      <path
        d="M136 380c0-66.3 53.7-120 120-120s120 53.7 120 120v20H136v-20z"
        fill="#F5C800"
      />
      {/* Tie/Badge */}
      <path d="M256 260l12 30-12 15-12-15z" fill="#D0401B" />
      
      <defs>
        <linearGradient id="devBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
        <linearGradient id="devBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(26, 15, 46, 0.4)" />
          <stop offset="100%" stopColor="rgba(124, 58, 237, 0.2)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ScriptManagerIcon({ size = 16, style = {}, className = "" }: VipBadgeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      className={className}
    >
      <rect width="440" height="440" x="36" y="36" rx="90" fill="url(#scriptBg)" stroke="#FFDD61" strokeWidth="18" />
      <path d="M190 190l-70 66 70 66M322 190l70 66-70 66M280 160l-48 192" stroke="#FFDD61" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="scriptBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SubscribeIcon({ size = 16, style = {}, className = "" }: VipBadgeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      className={className}
    >
      <rect width="440" height="440" x="36" y="36" rx="90" fill="url(#subBg)" stroke="#FFDD61" strokeWidth="18" />
      <path d="M160 130h192c11 0 20 9 20 20v252c0 13-15 20-24 12l-72-60-72 60c-9 8-24 1-24-12V150c0-11 9-20 20-20z" fill="#FFDD61" />
      <defs>
        <linearGradient id="subBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogsIcon({ size = 16, style = {}, className = "" }: VipBadgeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      className={className}
    >
      <rect width="440" height="440" x="36" y="36" rx="90" fill="url(#logsBg)" stroke="#FFDD61" strokeWidth="18" />
      <path d="M160 130h160l60 60v192c0 22-18 40-40 40H160c-22 0-40-18-40-40V170c0-22 18-40 40-40z" fill="#FFDD61" />
      <path d="M170 210h120M170 270h170M170 330h170" stroke="#09070f" strokeWidth="24" strokeLinecap="round" />
      <defs>
        <linearGradient id="logsBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ToolsIcon({ size = 16, style = {}, className = "" }: VipBadgeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      className={className}
    >
      <rect width="440" height="440" x="36" y="36" rx="90" fill="url(#toolsBg)" stroke="#FFDD61" strokeWidth="18" />
      <path d="M344 140c-15.6-15.6-39.7-16.7-56.6-4.6l-50 50 20 56 56 20 50-50c12.1-16.9 11-41-4.6-56.6z" fill="#FFDD61" />
      <path d="M211 245l-95 95c-15.6 15.6-15.6 41 0 56.6s41 15.6 56.6 0l95-95" stroke="#FFDD61" strokeWidth="36" strokeLinecap="round" />
      <defs>
        <linearGradient id="toolsBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SettingsIcon({ size = 16, style = {}, className = "" }: VipBadgeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      className={className}
    >
      <rect width="440" height="440" x="36" y="36" rx="90" fill="url(#settingsBg)" stroke="#FFDD61" strokeWidth="18" />
      <circle cx="256" cy="256" r="64" stroke="#FFDD61" strokeWidth="32" />
      <path d="M256 96v40M256 376v40M96 256h40M376 256h40M143 143l28 28M341 341l28 28M143 341l28-28M341 143l28-28" stroke="#FFDD61" strokeWidth="36" strokeLinecap="round" />
      <defs>
        <linearGradient id="settingsBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>
      </defs>
    </svg>
  );
}
