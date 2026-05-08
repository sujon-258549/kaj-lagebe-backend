import prisma from "../../../utils/prismaClient.ts";
import {
  resolveRange,
  type DateRangeKey,
} from "../../../shared/dateRange.ts";

const inRange = (rangeKey: DateRangeKey) => {
  const range = resolveRange(rangeKey);
  return { gte: range.from, lte: range.to };
};

const recentJobs = async (rangeKey: DateRangeKey, limit = 10) => {
  const createdAt = inRange(rangeKey);

  const jobs = await prisma.job.findMany({
    where: { isDeleted: false, createdAt },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      categoryName: true,
      isPublished: true,
      applicantsCount: true,
      createdAt: true,
      company: true,
      _count: { select: { applications: true } },
    },
  });

  return jobs.map((j) => ({
    id: j.id,
    title: j.title,
    category: j.categoryName ?? "Uncategorized",
    company: j.company,
    apps: j._count.applications,
    status: j.isPublished ? "Active" : "Draft",
    createdAt: j.createdAt,
  }));
};

const topCandidates = async (rangeKey: DateRangeKey, limit = 10) => {
  const createdAt = inRange(rangeKey);

  const apps = await prisma.application.findMany({
    where: {
      isDeleted: false,
      createdAt,
      applyStatus: { in: ["REVIEWING", "ACCEPTED", "PENDING"] },
    },
    orderBy: [
      { applyStatus: "asc" },
      { createdAt: "desc" },
    ],
    take: limit * 2,
    select: {
      id: true,
      applyStatus: true,
      createdAt: true,
      job: { select: { id: true, title: true } },
      user: {
        select: {
          id: true,
          email: true,
          profile: { select: { name: true, photo: true } },
        },
      },
    },
  });

  const seen = new Set<string>();
  const unique = apps.filter((a) => {
    if (seen.has(a.user.id)) return false;
    seen.add(a.user.id);
    return true;
  });

  const stageMap: Record<string, string> = {
    PENDING: "Initial Call",
    REVIEWING: "Assessment",
    ACCEPTED: "Offer",
    REJECTED: "Rejected",
  };

  return unique.slice(0, limit).map((a) => ({
    id: a.user.id,
    name: a.user.profile?.name || a.user.email,
    email: a.user.email,
    photo: a.user.profile?.photo ?? null,
    job: a.job?.title ?? "—",
    stage: stageMap[a.applyStatus] ?? a.applyStatus,
    appliedAt: a.createdAt,
  }));
};

const jobsWithApplicants = async (rangeKey: DateRangeKey, jobLimit = 6) => {
  const createdAt = inRange(rangeKey);

  const jobs = await prisma.job.findMany({
    where: {
      isDeleted: false,
      createdAt,
      applicantsCount: { gt: 0 },
    },
    orderBy: { applicantsCount: "desc" },
    take: jobLimit,
    select: {
      id: true,
      title: true,
      company: true,
      applicantsCount: true,
      _count: { select: { applications: { where: { isRead: false } } } },
      applications: {
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          applyStatus: true,
          isRead: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              email: true,
              profile: { select: { name: true, photo: true } },
            },
          },
        },
      },
    },
  });

  const stageMap: Record<string, "New" | "Reviewed" | "Shortlisted"> = {
    PENDING: "New",
    REVIEWING: "Reviewed",
    ACCEPTED: "Shortlisted",
    REJECTED: "Reviewed",
  };

  return jobs.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company ?? "—",
    totalApplicants: j.applicantsCount,
    newApplicants: j._count.applications,
    applicants: j.applications.map((a) => ({
      id: a.id,
      name: a.user.profile?.name || a.user.email,
      photo: a.user.profile?.photo ?? null,
      status:
        (stageMap[a.applyStatus] ?? "New") as "New" | "Reviewed" | "Shortlisted",
      appliedAt: a.createdAt,
    })),
  }));
};

export const TableDashboardServices = {
  recentJobs,
  topCandidates,
  jobsWithApplicants,
};
