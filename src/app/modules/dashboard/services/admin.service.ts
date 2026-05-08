import prisma from "../../../utils/prismaClient.ts";
import {
  buildBucketTimeline,
  bucketKey,
  bucketLabel,
  previousRange,
  resolveRange,
  type DateRangeKey,
} from "../../../shared/dateRange.ts";

const pct = (a: number, b: number): number =>
  b === 0 ? (a > 0 ? 100 : 0) : Number((((a - b) / b) * 100).toFixed(1));

const adminKpis = async (rangeKey: DateRangeKey) => {
  const range = resolveRange(rangeKey);
  const prev = previousRange(range);

  const buildBatch = async (from: Date, to: Date) => {
    const where = { createdAt: { gte: from, lte: to } };
    const [
      users,
      jobs,
      applications,
      blogs,
      contacts,
      payments,
      activeJobs,
      acceptedApplications,
    ] = await Promise.all([
      prisma.user.count({ where: { ...where, isDeleted: false } }),
      prisma.job.count({ where: { ...where, isDeleted: false } }),
      prisma.application.count({ where: { ...where, isDeleted: false } }),
      prisma.blog.count({ where }),
      prisma.contact.count({ where }),
      prisma.payment.count({ where: { ...where, status: "SUCCESS" } }),
      prisma.job.count({
        where: { ...where, isDeleted: false, isPublished: true },
      }),
      prisma.application.count({
        where: { ...where, isDeleted: false, applyStatus: "ACCEPTED" },
      }),
    ]);

    return {
      users,
      jobs,
      applications,
      blogs,
      contacts,
      payments,
      activeJobs,
      acceptedApplications,
    };
  };

  const [current, previous, totals] = await Promise.all([
    buildBatch(range.from, range.to),
    buildBatch(prev.from, prev.to),
    Promise.all([
      prisma.user.count({ where: { isDeleted: false } }),
      prisma.job.count({ where: { isDeleted: false } }),
      prisma.application.count({ where: { isDeleted: false } }),
      prisma.blog.count(),
      prisma.contact.count(),
    ]).then(
      ([
        totalUsers,
        totalJobs,
        totalApplications,
        totalBlogs,
        totalContacts,
      ]) => ({
        totalUsers,
        totalJobs,
        totalApplications,
        totalBlogs,
        totalContacts,
      }),
    ),
  ]);

  const deltas: Record<string, number> = {};
  for (const k of Object.keys(current)) {
    deltas[k] = pct(
      (current as any)[k] as number,
      (previous as any)[k] as number,
    );
  }

  return {
    range: { from: range.from, to: range.to, label: range.label },
    totals,
    current,
    previous,
    deltas,
  };
};

const growthTimeseries = async (rangeKey: DateRangeKey) => {
  const range = resolveRange(rangeKey);
  const where = { createdAt: { gte: range.from, lte: range.to } };

  const [users, jobs, applications] = await Promise.all([
    prisma.user.findMany({ where, select: { createdAt: true } }),
    prisma.job.findMany({
      where: { ...where, isDeleted: false },
      select: { createdAt: true },
    }),
    prisma.application.findMany({
      where: { ...where, isDeleted: false },
      select: { createdAt: true },
    }),
  ]);

  const series: Record<
    string,
    { users: number; jobs: number; applications: number }
  > = {};

  for (const k of buildBucketTimeline(range)) {
    series[k] = { users: 0, jobs: 0, applications: 0 };
  }

  const bump = (
    arr: Array<{ createdAt: Date }>,
    field: "users" | "jobs" | "applications",
  ) => {
    for (const r of arr) {
      const k = bucketKey(r.createdAt, range.bucket);
      if (!series[k]) series[k] = { users: 0, jobs: 0, applications: 0 };
      series[k][field] += 1;
    }
  };

  bump(users, "users");
  bump(jobs, "jobs");
  bump(applications, "applications");

  return Object.entries(series).map(([k, v]) => ({
    key: k,
    label: bucketLabel(k, range.bucket),
    ...v,
  }));
};

const conversionFunnel = async (rangeKey: DateRangeKey) => {
  const range = resolveRange(rangeKey);
  const where = { createdAt: { gte: range.from, lte: range.to } };

  const [
    visitors,
    signups,
    applicationStarted,
    applicationsAccepted,
  ] = await Promise.all([
    prisma.pageView
      .findMany({
        where: { ...where, isBot: false },
        distinct: ["sessionId"],
        select: { sessionId: true },
      })
      .then((r) => r.length),
    prisma.user.count({ where: { ...where, isDeleted: false } }),
    prisma.application.count({ where: { ...where, isDeleted: false } }),
    prisma.application.count({
      where: {
        ...where,
        isDeleted: false,
        applyStatus: "ACCEPTED",
      },
    }),
  ]);

  const stages = [
    { name: "Visitors", value: visitors },
    { name: "Signups", value: signups },
    { name: "Applied", value: applicationStarted },
    { name: "Hired", value: applicationsAccepted },
  ];

  const top = stages[0]?.value ?? 0;
  return stages.map((s) => ({
    ...s,
    pct: top === 0 ? 0 : Number(((s.value / top) * 100).toFixed(1)),
  }));
};

const recentSignals = async () => {
  const [recentUsers, recentJobs, recentApplications, recentContacts] =
    await Promise.all([
      prisma.user.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          email: true,
          createdAt: true,
          profile: { select: { name: true, photo: true } },
          role: { select: { role: true } },
        },
      }),
      prisma.job.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          company: true,
          isPublished: true,
          createdAt: true,
          applicantsCount: true,
        },
      }),
      prisma.application.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          createdAt: true,
          applyStatus: true,
          job: { select: { id: true, title: true } },
          user: {
            select: {
              id: true,
              email: true,
              profile: { select: { name: true } },
            },
          },
        },
      }),
      prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          firstName: true,
          subject: true,
          createdAt: true,
        },
      }),
    ]);

  return { recentUsers, recentJobs, recentApplications, recentContacts };
};

export const AdminDashboardServices = {
  adminKpis,
  growthTimeseries,
  conversionFunnel,
  recentSignals,
};
