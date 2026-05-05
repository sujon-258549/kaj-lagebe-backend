import type { NextFunction, Request, Response } from "express";
import { ActivityLogger } from "../utils/activityLogger.ts";

const activityTracker = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = Date.now();
  const fullUrl = `/api${req.url}`;

  if (ActivityLogger.isSkippedPath(fullUrl)) {
    return next();
  }

  res.on("finish", () => {
    const durationMs = Date.now() - startTime;
    const statusCode = res.statusCode;
    const success = statusCode < 400;

    void ActivityLogger.logActivity({
      userId: req.user?.id ?? null,
      email: req.user?.email ?? null,
      role: req.user?.role ?? null,
      action: `${req.method} ${req.baseUrl || ""}${req.route?.path || req.path}`.trim(),
      method: req.method,
      route: `${req.baseUrl || ""}${req.route?.path || req.path}`,
      url: fullUrl,
      statusCode,
      durationMs,
      ip: ActivityLogger.getIp(req) ?? null,
      userAgent: req.headers["user-agent"]?.toString() ?? null,
      success,
    });
  });

  next();
};

export default activityTracker;