import { Prisma } from "@prisma/client";
import prisma from "../../utils/prismaClient.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { activityLogSearchableFields } from "./activityLog.constant.ts";

const getAllActivityLogs = async (query: any) => {
  const {
    searchTerm,
    page,
    limit,
    sortBy,
    sortOrder,
    from,
    to,
    success,
    statusCode,
    ...queryFilter
  } = query;

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const andCondition: Prisma.ActivityLogWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: activityLogSearchableFields.map((field) => ({
        [field]: { contains: String(searchTerm), mode: "insensitive" },
      })),
    });
  }

  if (success !== undefined && success !== "") {
    andCondition.push({ success: success === "true" || success === true });
  }

  if (statusCode !== undefined && statusCode !== "") {
    andCondition.push({ statusCode: Number(statusCode) });
  }

  if (from || to) {
    const createdAt: Prisma.DateTimeFilter = {};
    if (from) createdAt.gte = new Date(String(from));
    if (to) createdAt.lte = new Date(String(to));
    andCondition.push({ createdAt });
  }

  if (Object.keys(queryFilter).length > 0) {
    andCondition.push({
      AND: Object.keys(queryFilter).map((key) => ({
        [key]: { equals: queryFilter[key] },
      })),
    });
  }

  const whereCondition: Prisma.ActivityLogWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const [data, total] = await Promise.all([
    prisma.activityLog.findMany({
      where: whereCondition,
      skip,
      take: limitNumber,
      orderBy: { [sortByValue]: sortOrderValue },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            mobile: true,
            profile: { select: { name: true } },
            role: { select: { role: true } },
          },
        },
      },
    }),
    prisma.activityLog.count({ where: whereCondition }),
  ]);

  return {
    data,
    meta: { page: pageNumber, limit: limitNumber, total },
  };
};

const getActivityLogById = async (id: string) => {
  return prisma.activityLog.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          mobile: true,
          profile: { select: { name: true } },
          role: { select: { role: true } },
        },
      },
    },
  });
};

const getActivitySummary = async (query: any) => {
  const { from, to } = query;
  const where: Prisma.ActivityLogWhereInput = {};
  if (from || to) {
    where.createdAt = {};
    if (from) (where.createdAt as Prisma.DateTimeFilter).gte = new Date(String(from));
    if (to) (where.createdAt as Prisma.DateTimeFilter).lte = new Date(String(to));
  }

  const [total, success, failed, recentLogins, topUsers] = await Promise.all([
    prisma.activityLog.count({ where }),
    prisma.activityLog.count({ where: { ...where, success: true } }),
    prisma.activityLog.count({ where: { ...where, success: false } }),
    prisma.activityLog.findMany({
      where: { ...where, action: "LOGIN_SUCCESS" },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: { select: { name: true } },
            role: { select: { role: true } },
          },
        },
      },
    }),
    prisma.activityLog.groupBy({
      by: ["userId", "email"],
      where: { ...where, userId: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { userId: "desc" } },
      take: 10,
    }),
  ]);

  return { total, success, failed, recentLogins, topUsers };
};

export const ActivityLogServices = {
  getAllActivityLogs,
  getActivityLogById,
  getActivitySummary,
};
