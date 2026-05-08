import type { Request } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../../utils/prismaClient.ts";
import config from "../../config/index.ts";
import { JwtHelpers } from "../../utils/jwtHelpers.ts";
import { parseClient, getIp } from "./analytics.parser.ts";
import {
  bucketKey,
  bucketLabel,
  buildBucketTimeline,
  previousRange,
  resolveRange,
  type DateRangeKey,
} from "../../shared/dateRange.ts";

export interface TrackInput {
  sessionId: string;
  path: string;
  fullUrl?: string;
  title?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  durationMs?: number;
  source?: string;
  country?: string;
  city?: string;
  region?: string;
}

const resolveUserId = (req: Request): string | null => {
  const auth = req.headers?.authorization;
  if (!auth) return null;
  try {
    const raw = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
    const decoded: any = JwtHelpers.verifyToken(
      raw,
      config.accessSecret as string,
    );
    return decoded?.data?.id || decoded?.data?.userId || null;
  } catch {
    return null;
  }
};

const isUniqueForToday = async (sessionId: string): Promise<boolean> => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const existing = await prisma.pageView.findFirst({
    where: { sessionId, createdAt: { gte: start } },
    select: { id: true },
  });
  return !existing;
};

const track = async (req: Request, body: TrackInput) => {
  const ua = req.headers["user-agent"]?.toString() ?? "";
  const client = parseClient(ua);
  const ip = getIp(req) ?? null;
  const userId = resolveUserId(req);
  const isUnique = await isUniqueForToday(body.sessionId);

  await prisma.pageView.create({
    data: {
      sessionId: body.sessionId,
      userId,
      path: body.path,
      fullUrl: body.fullUrl ?? null,
      title: body.title ?? null,
      referrer: body.referrer ?? null,
      utmSource: body.utmSource ?? null,
      utmMedium: body.utmMedium ?? null,
      utmCampaign: body.utmCampaign ?? null,
      ip,
      country: body.country ?? null,
      city: body.city ?? null,
      region: body.region ?? null,
      device: client.device,
      browser: client.browser,
      os: client.os,
      userAgent: ua || null,
      durationMs: body.durationMs ?? null,
      isBot: client.isBot,
      isUnique,
      source: body.source || "admin",
    },
  });
  return { ok: true, isUnique };
};

const baseWhere = (
  range: ReturnType<typeof resolveRange>,
  source?: string,
): Prisma.PageViewWhereInput => {
  const where: Prisma.PageViewWhereInput = {
    isBot: false,
    createdAt: { gte: range.from, lte: range.to },
  };
  if (source) where.source = source;
  return where;
};

const computeKpis = async (
  range: ReturnType<typeof resolveRange>,
  source?: string,
) => {
  const where = baseWhere(range, source);
  const [pageViews, sessions, users] = await Promise.all([
    prisma.pageView.count({ where }),
    prisma.pageView.findMany({
      where,
      distinct: ["sessionId"],
      select: { sessionId: true },
    }),
    prisma.pageView.findMany({
      where: { ...where, userId: { not: null } },
      distinct: ["userId"],
      select: { userId: true },
    }),
  ]);
  return {
    pageViews,
    sessions: sessions.length,
    uniqueUsers: users.length,
  };
};

const trafficStats = async (rangeKey: DateRangeKey, source?: string) => {
  const range = resolveRange(rangeKey);
  const prev = previousRange(range);

  const [current, previous] = await Promise.all([
    computeKpis(range, source),
    computeKpis(prev, source),
  ]);

  const pct = (a: number, b: number) =>
    b === 0 ? (a > 0 ? 100 : 0) : ((a - b) / b) * 100;

  return {
    range: { from: range.from, to: range.to, label: range.label },
    pageViews: current.pageViews,
    sessions: current.sessions,
    uniqueUsers: current.uniqueUsers,
    deltas: {
      pageViews: Number(pct(current.pageViews, previous.pageViews).toFixed(1)),
      sessions: Number(pct(current.sessions, previous.sessions).toFixed(1)),
      uniqueUsers: Number(
        pct(current.uniqueUsers, previous.uniqueUsers).toFixed(1),
      ),
    },
    previous,
  };
};

const trafficTimeseries = async (rangeKey: DateRangeKey, source?: string) => {
  const range = resolveRange(rangeKey);
  const where = baseWhere(range, source);

  const rows = await prisma.pageView.findMany({
    where,
    select: { createdAt: true, sessionId: true },
  });

  const series: Record<
    string,
    { pageViews: number; sessions: Set<string> }
  > = {};

  for (const key of buildBucketTimeline(range)) {
    series[key] = { pageViews: 0, sessions: new Set() };
  }

  for (const r of rows) {
    const k = bucketKey(r.createdAt, range.bucket);
    if (!series[k]) series[k] = { pageViews: 0, sessions: new Set() };
    series[k].pageViews += 1;
    series[k].sessions.add(r.sessionId);
  }

  return Object.entries(series).map(([k, v]) => ({
    key: k,
    label: bucketLabel(k, range.bucket),
    pageViews: v.pageViews,
    sessions: v.sessions.size,
  }));
};

const topPages = async (
  rangeKey: DateRangeKey,
  limit = 10,
  source?: string,
) => {
  const range = resolveRange(rangeKey);
  const where = baseWhere(range, source);

  const grouped = await prisma.pageView.groupBy({
    by: ["path"],
    where,
    _count: { _all: true },
    orderBy: { _count: { path: "desc" } },
    take: limit,
  });

  return grouped.map((g) => ({
    path: g.path,
    views: g._count._all,
  }));
};

const groupBreakdown = async (
  field: "country" | "device" | "browser" | "os",
  rangeKey: DateRangeKey,
  source?: string,
  limit = 10,
) => {
  const range = resolveRange(rangeKey);
  const where = baseWhere(range, source);

  const grouped = await prisma.pageView.groupBy({
    by: [field],
    where,
    _count: { _all: true },
    orderBy: { _count: { [field]: "desc" } as any },
    take: limit,
  });

  return grouped.map((g: any) => ({
    label: g[field] ?? "Unknown",
    value: g._count._all,
  }));
};

const topReferrers = async (
  rangeKey: DateRangeKey,
  source?: string,
  limit = 10,
) => {
  const range = resolveRange(rangeKey);
  const where = baseWhere(range, source);

  const grouped = await prisma.pageView.groupBy({
    by: ["referrer"],
    where: { ...where, referrer: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { referrer: "desc" } },
    take: limit,
  });

  return grouped.map((g) => ({
    referrer: g.referrer ?? "Direct",
    views: g._count._all,
  }));
};

const liveVisitors = async () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const recent = await prisma.pageView.findMany({
    where: { createdAt: { gte: fiveMinutesAgo }, isBot: false },
    distinct: ["sessionId"],
    select: { sessionId: true },
  });
  return { live: recent.length };
};

export const AnalyticsServices = {
  track,
  trafficStats,
  trafficTimeseries,
  topPages,
  groupBreakdown,
  topReferrers,
  liveVisitors,
};
