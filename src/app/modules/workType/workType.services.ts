import type { Prisma } from "@prisma/client";
import ApiError from "../../middleware/apiError.ts";
import httpStatus from "http-status";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { workTypeSearchableFields } from "./workType.const.ts";
import prisma from "../../utils/prismaClient.ts";

const createWorkTypeIntoDB = async (payload: any) => {
  const result = await prisma.workType.create({
    data: payload,
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
  });
  return result;
};

const updateWorkType = async (id: string, payload: any) => {
  const existingWorkType = await prisma.workType.findUnique({ where: { id } });
  if (!existingWorkType)
    throw new ApiError(httpStatus.NOT_FOUND, "WorkType not found");

  const result = await prisma.workType.update({
    where: { id },
    data: payload,
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

const updateWorkTypeStatus = async (id: string) => {
    const existingWorkType = await prisma.workType.findUnique({ where: { id } });
    if (!existingWorkType)
      throw new ApiError(httpStatus.NOT_FOUND, "WorkType not found");
  
    const result = await prisma.workType.update({
      where: { id },
      data: { isActive: !existingWorkType.isActive },
    });
    return result;
  };

export const WorkTypeServices = {
  createWorkTypeIntoDB,
  getAllWorkType,
  getWorkTypeById,
  updateWorkType,
  deleteWorkType,
  updateWorkTypeStatus
};
