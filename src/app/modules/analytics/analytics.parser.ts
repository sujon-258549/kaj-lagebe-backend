import type { Request } from "express";

export type ParsedClient = {
  browser: string;
  os: string;
  device: "desktop" | "mobile" | "tablet" | "bot" | "unknown";
  isBot: boolean;
};

const BOT_TOKENS = [
  "bot",
  "crawler",
  "spider",
  "slurp",
  "facebookexternalhit",
  "embedly",
  "vkshare",
  "pinterest",
  "preview",
  "headless",
  "lighthouse",
];

const detectBrowser = (ua: string): string => {
  const u = ua.toLowerCase();
  if (u.includes("edg/") || u.includes("edge")) return "Edge";
  if (u.includes("opr/") || u.includes("opera")) return "Opera";
  if (u.includes("chrome") && !u.includes("chromium")) return "Chrome";
  if (u.includes("firefox")) return "Firefox";
  if (u.includes("safari") && !u.includes("chrome")) return "Safari";
  if (u.includes("msie") || u.includes("trident")) return "IE";
  if (u.includes("samsungbrowser")) return "Samsung";
  return "Other";
};

const detectOs = (ua: string): string => {
  const u = ua.toLowerCase();
  if (u.includes("windows")) return "Windows";
  if (u.includes("android")) return "Android";
  if (u.includes("iphone") || u.includes("ipad") || u.includes("ipod"))
    return "iOS";
  if (u.includes("mac os") || u.includes("macintosh")) return "macOS";
  if (u.includes("linux")) return "Linux";
  return "Other";
};

const detectDevice = (
  ua: string,
): "desktop" | "mobile" | "tablet" | "bot" | "unknown" => {
  const u = ua.toLowerCase();
  if (BOT_TOKENS.some((t) => u.includes(t))) return "bot";
  if (u.includes("ipad") || (u.includes("tablet") && !u.includes("mobile")))
    return "tablet";
  if (
    u.includes("mobile") ||
    u.includes("iphone") ||
    u.includes("android") ||
    u.includes("phone")
  )
    return "mobile";
  if (!u) return "unknown";
  return "desktop";
};

export const parseClient = (userAgent: string | undefined): ParsedClient => {
  const ua = userAgent || "";
  const device = detectDevice(ua);
  return {
    browser: detectBrowser(ua),
    os: detectOs(ua),
    device,
    isBot: device === "bot",
  };
};

export const getIp = (req: Request): string | undefined => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0]?.trim();
  return req.ip || req.socket?.remoteAddress || undefined;
};
