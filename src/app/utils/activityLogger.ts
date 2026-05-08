import type { Request } from "express";
import prisma from "./prismaClient.ts";

const SKIP_PATHS = [
  "/api/activity-log",
  "/api/error-log",
  "/api/notification",
  "/api/analytics/track",
  "/api/analytics/live",
];

const isSkippedPath = (url: string) =>
  SKIP_PATHS.some((p) => url.startsWith(p));

const getIp = (req: Request) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim();
  }
  return req.ip || req.socket?.remoteAddress || undefined;
};

type LogActivityInput = {
  userId?: string | null;
  email?: string | null;
  role?: string | null;
  action: string;
  method?: string | null;
  route?: string | null;
  url?: string | null;
  statusCode?: number | null;
  durationMs?: number | null;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
  success?: boolean;
};

const logActivity = async (input: LogActivityInput) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId: input.userId ?? null,
        email: input.email ?? null,
        role: input.role ?? null,
        action: input.action,
        method: input.method ?? null,
        route: input.route ?? null,
        url: input.url ?? null,
        statusCode: input.statusCode ?? null,
        durationMs: input.durationMs ?? null,
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
        metadata: (input.metadata as any) ?? undefined,
        success: input.success ?? true,
      },
    });
  } catch (err) {
    console.error("[activityLogger] failed to write activity log:", err);
  }
};

type LogErrorInput = {
  userId?: string | null;
  email?: string | null;
  method?: string | null;
  route?: string | null;
  url?: string | null;
  statusCode: number;
  message: string;
  stack?: string | null;
  body?: unknown;
  query?: unknown;
  params?: unknown;
  ip?: string | null;
  userAgent?: string | null;
};

const sanitize = (obj: unknown) => {
  if (!obj || typeof obj !== "object") return undefined;
  const clone: Record<string, unknown> = { ...(obj as Record<string, unknown>) };
  for (const key of Object.keys(clone)) {
    const lower = key.toLowerCase();
    if (
      lower.includes("password") ||
      lower.includes("token") ||
      lower.includes("secret") ||
      lower.includes("otp")
    ) {
      clone[key] = "[REDACTED]";
    }
  }
  return clone;
};

const logError = async (input: LogErrorInput) => {
  try {
    await prisma.errorLog.create({
      data: {
        userId: input.userId ?? null,
        email: input.email ?? null,
        method: input.method ?? null,
        route: input.route ?? null,
        url: input.url ?? null,
        statusCode: input.statusCode,
        message: input.message?.slice(0, 2000) ?? "Unknown error",
        stack: input.stack?.slice(0, 8000) ?? null,
        body: (sanitize(input.body) as any) ?? undefined,
        query: (sanitize(input.query) as any) ?? undefined,
        params: (sanitize(input.params) as any) ?? undefined,
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
      },
    });
  } catch (err) {
    console.error("[activityLogger] failed to write error log:", err);
  }
};

export const ActivityLogger = {
  logActivity,
  logError,
  getIp,
  isSkippedPath,
};