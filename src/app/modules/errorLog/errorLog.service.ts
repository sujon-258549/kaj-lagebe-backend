import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import prisma from "../../utils/prismaClient.ts";
import ApiError from "../../middleware/apiError.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { errorLogSearchableFields } from "./errorLog.constant.ts";

const getAllErrorLogs = async (query: any) => {
  const {
    searchTerm,
    page,
    limit,
    sortBy,
    sortOrder,
    from,
    to,
    resolved,
    statusCode,
    ...queryFilter
  } = query;

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const andCondition: Prisma.ErrorLogWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: errorLogSearchableFields.map((field) => ({
        [field]: { contains: String(searchTerm), mode: "insensitive" },
      })),
    });
  }

  if (resolved !== undefined && resolved !== "") {
    andCondition.push({ resolved: resolved === "true" || resolved === true });
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

  const whereCondition: Prisma.ErrorLogWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const [data, total] = await Promise.all([
    prisma.errorLog.findMany({
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
    prisma.errorLog.count({ where: whereCondition }),
  ]);

  return {
    data,
    meta: { page: pageNumber, limit: limitNumber, total },
  };
};

const getErrorLogById = async (id: string) => {
  const result = await prisma.errorLog.findUnique({
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
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Error log not found");
  return result;
};

const markResolved = async (id: string, resolved: boolean) => {
  return prisma.errorLog.update({
    where: { id },
    data: { resolved },
  });
};

const deleteErrorLog = async (id: string) => {
  await prisma.errorLog.delete({ where: { id } });
  return { message: "Error log deleted" };
};

const getErrorSummary = async (query: any) => {
  const { from, to } = query;
  const where: Prisma.ErrorLogWhereInput = {};
  if (from || to) {
    where.createdAt = {};
    if (from) (where.createdAt as Prisma.DateTimeFilter).gte = new Date(String(from));
    if (to) (where.createdAt as Prisma.DateTimeFilter).lte = new Date(String(to));
  }

  const [total, unresolved, byStatus, topRoutes] = await Promise.all([
    prisma.errorLog.count({ where }),
    prisma.errorLog.count({ where: { ...where, resolved: false } }),
    prisma.errorLog.groupBy({
      by: ["statusCode"],
      where,
      _count: { _all: true },
      orderBy: { _count: { statusCode: "desc" } },
    }),
    prisma.errorLog.groupBy({
      by: ["route", "method"],
      where,
      _count: { _all: true },
      orderBy: { _count: { route: "desc" } },
      take: 10,
    }),
  ]);

  return { total, unresolved, byStatus, topRoutes };
};

export const ErrorLogServices = {
  getAllErrorLogs,
  getErrorLogById,
  markResolved,
  deleteErrorLog,
  getErrorSummary,
};
