import type { Prisma } from "@prisma/client";
import ApiError from "../../middleware/apiError.ts";
import httpStatus from "http-status";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { workTypeSearchableFields } from "./workType.const.ts";
import prisma from "../../utils/prismaClient.ts";

const createWorkType = async (payload: any, userId?: string) => {
  const result = await prisma.workType.create({
    data: {
      ...payload,
      createdById: userId ?? null,
      updatedById: userId ?? null,
    },
  });
  return result;
};

const getAllWorkType = async (query: any) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filter } = query;

  const andCondition: Prisma.WorkTypeWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: workTypeSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (filter.isActive) {
    filter.isActive = filter.isActive === "true";
  }

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const result = await prisma.workType.findMany({
    where: {
      AND: andCondition,
      ...filter,
    },
    take: limitNumber,
    skip: skip,
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
    include: {
      createdBy: {
        select: { id: true, email: true, profile: { select: { name: true } } },
      },
      updatedBy: {
        select: { id: true, email: true, profile: { select: { name: true } } },
      },
    },
  });

  const total = await prisma.workType.count({
    where: {
      AND: andCondition,
      ...filter,
    },
  });

  return {
    data: result,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total: total,
    },
  };
};

const getWorkTypeById = async (id: string) => {
  const result = await prisma.workType.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: { id: true, email: true, profile: { select: { name: true } } },
      },
      updatedBy: {
        select: { id: true, email: true, profile: { select: { name: true } } },
      },
    },
  });
  return result;
};

const updateWorkType = async (id: string, payload: any, userId?: string) => {
  const existingWorkType = await prisma.workType.findUnique({ where: { id } });
  if (!existingWorkType)
    throw new ApiError(httpStatus.NOT_FOUND, "WorkType not found");

  const result = await prisma.workType.update({
    where: { id },
    data: {
      ...payload,
      updatedById: userId ?? null,
    },
  });
  return result;
};

const deleteWorkType = async (id: string) => {
  const existingWorkType = await prisma.workType.findUnique({ where: { id } });
  if (!existingWorkType)
    throw new ApiError(httpStatus.NOT_FOUND, "WorkType not found");

  const result = await prisma.workType.delete({ where: { id } });
  return result;
};

const updateWorkTypeStatus = async (id: string, userId?: string) => {
  const existingWorkType = await prisma.workType.findUnique({ where: { id } });
  if (!existingWorkType)
    throw new ApiError(httpStatus.NOT_FOUND, "WorkType not found");

  const result = await prisma.workType.update({
    where: { id },
    data: { 
      isActive: !existingWorkType.isActive,
      updatedById: userId ?? null,
    },
  });
  return result;
};

export const WorkTypeServices = {
  createWorkType,
  getAllWorkType,
  getWorkTypeById,
  updateWorkType,
  deleteWorkType,
  updateWorkTypeStatus
};
