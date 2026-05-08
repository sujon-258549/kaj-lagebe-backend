import prisma from "../../../utils/prismaClient.ts";
import {
  resolveRange,
  type DateRangeKey,
} from "../../../shared/dateRange.ts";

const inRange = (rangeKey: DateRangeKey) => {
  const range = resolveRange(rangeKey);
  return { gte: range.from, lte: range.to };
};

const jobsByCategory = async (rangeKey: DateRangeKey) => {
  const createdAt = inRange(rangeKey);

  const grouped = await prisma.job.groupBy({
    by: ["categoryName"],
    where: { isDeleted: false, createdAt },
    _count: { _all: true },
    orderBy: { _count: { categoryName: "desc" } },
    take: 8,
  });

  return grouped.map((g) => ({
    label: g.categoryName ?? "Uncategorized",
    value: g._count._all,
  }));
};

const applicationStatusBreakdown = async (rangeKey: DateRangeKey) => {
  const createdAt = inRange(rangeKey);

  const grouped = await prisma.application.groupBy({
    by: ["applyStatus"],
    where: { isDeleted: false, createdAt },
    _count: { _all: true },
  });

  const order = ["PENDING", "REVIEWING", "ACCEPTED", "REJECTED"];
  const map = new Map(grouped.map((g) => [g.applyStatus, g._count._all]));
  return order.map((status) => ({
    status,
    count: map.get(status) ?? 0,
  }));
};

const hiringRate = async (rangeKey: DateRangeKey) => {
  const createdAt = inRange(rangeKey);

  const [total, accepted] = await Promise.all([
    prisma.application.count({ where: { isDeleted: false, createdAt } }),
    prisma.application.count({
      where: { isDeleted: false, applyStatus: "ACCEPTED", createdAt },
    }),
  ]);

  const rate = total === 0 ? 0 : Number(((accepted / total) * 100).toFixed(1));
  return { total, accepted, rate };
};

const recruitmentFunnel = async (rangeKey: DateRangeKey) => {
  const createdAt = inRange(rangeKey);

  const [
    sourced,
    pending,
    reviewing,
    accepted,
    rejected,
  ] = await Promise.all([
    prisma.application.count({ where: { isDeleted: false, createdAt } }),
    prisma.application.count({
      where: { isDeleted: false, applyStatus: "PENDING", createdAt },
    }),
    prisma.application.count({
      where: { isDeleted: false, applyStatus: "REVIEWING", createdAt },
    }),
    prisma.application.count({
      where: { isDeleted: false, applyStatus: "ACCEPTED", createdAt },
    }),
    prisma.application.count({
      where: { isDeleted: false, applyStatus: "REJECTED", createdAt },
    }),
  ]);

  return [
    { stage: "Applied", value: sourced },
    { stage: "Pending Review", value: pending + reviewing },
    { stage: "Reviewing", value: reviewing },
    { stage: "Accepted", value: accepted },
    { stage: "Rejected", value: rejected },
  ];
};

const salaryBenchmarks = async () => {
  const jobs = await prisma.job.findMany({
    where: {
      isDeleted: false,
      OR: [
        { salaryMin: { not: null } },
        { salaryMax: { not: null } },
      ],
    },
    select: {
      experience: true,
      salaryMin: true,
      salaryMax: true,
    },
  });

  const buckets: Record<string, { sum: number; count: number }> = {};

  const normalize = (exp?: string | null): string => {
    if (!exp) return "Unspecified";
    const lower = exp.toLowerCase();
    if (lower.includes("intern") || lower.includes("entry") || lower.includes("0")) return "Junior";
    if (lower.includes("junior") || lower.includes("1") || lower.includes("2")) return "Junior";
    if (lower.includes("mid") || lower.includes("3") || lower.includes("4")) return "Mid";
    if (lower.includes("senior") || lower.includes("5") || lower.includes("6")) return "Senior";
    if (lower.includes("lead") || lower.includes("7") || lower.includes("8")) return "Lead";
    if (lower.includes("manager") || lower.includes("director") || lower.includes("head"))
      return "Manager";
    return "Unspecified";
  };

  for (const j of jobs) {
    const min = j.salaryMin ?? 0;
    const max = j.salaryMax ?? min;
    const avg = (min + max) / 2;
    if (avg <= 0) continue;
    const key = normalize(j.experience);
    if (!buckets[key]) buckets[key] = { sum: 0, count: 0 };
    buckets[key].sum += avg;
    buckets[key].count += 1;
  }

  const order = ["Junior", "Mid", "Senior", "Lead", "Manager", "Unspecified"];
  return order
    .filter((k) => buckets[k] && buckets[k].count > 0)
    .map((k) => ({
      level: k,
      avgSalary: Math.round(buckets[k]!.sum / buckets[k]!.count),
      jobs: buckets[k]!.count,
    }));
};

export const ChartDashboardServices = {
  jobsByCategory,
  applicationStatusBreakdown,
  hiringRate,
  recruitmentFunnel,
  salaryBenchmarks,
};
