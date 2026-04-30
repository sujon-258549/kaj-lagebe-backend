import { Prisma } from "@prisma/client";
import httpStatus from "http-status";
import prisma from "../../utils/prismaClient.ts";
import ApiError from "../../middleware/apiError.ts";
import { roleSearchableFields } from "./role.constant.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";

const createRole = async (payload: any, userId?: string) => {
  if (payload.role) {
    payload.role = payload.role.toUpperCase();
  }
  const isExist = await prisma.allRole.findFirst({
    where: { role: payload.role },
  });
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Role already exists");
  }
  const result = await prisma.allRole.create({ 
    data: {
      ...payload,
      createdById: userId ?? null,
      updatedById: userId ?? null
    } 
  });
  return result;
};

const getAllRole = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const andCondition: Prisma.AllRoleWhereInput[] = [];
  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  if (searchTerm) {
    andCondition.push({
      OR: roleSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(queryFilter).length > 0) {
    andCondition.push({
      AND: Object.keys(queryFilter).map((key: string) => ({
        [key]: {
          equals: queryFilter[key as keyof typeof queryFilter],
        },
      })),
    });
  }

  const whereCondition: Prisma.AllRoleWhereInput = {
    AND: andCondition,
  };

  const result = await prisma.allRole.findMany({
    where: whereCondition,
    skip,
    take: limitNumber,
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

  const total = await prisma.allRole.count({
    where: whereCondition,
  });

  return {
    data: result,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
  };
};

const getRoleById = async (id: string) => {
  const result = await prisma.allRole.findUnique({ 
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
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  return result;
};

const updateRole = async (id: string, payload: any, userId?: string) => {
  if (payload.role) {
    payload.role = payload.role.toUpperCase();
  }
  const result = await prisma.allRole.update({
    where: { id },
    data: {
      ...payload,
      updatedById: userId ?? null
    },
  });
  return result;
};

const deleteRole = async (id: string) => {
  await prisma.allRole.delete({ where: { id } });
  return { message: "Role deleted successfully" };
};

const updateRoleStatus = async (id: string, userId?: string) => {
  const isExist = await prisma.allRole.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  }
  const result = await prisma.allRole.update({
    where: { id },
    data: { 
      isActive: !isExist.isActive,
      updatedById: userId ?? null 
    },
  });
  return result;
};

export const RoleServices = {
  createRole,
  getAllRole,
  getRoleById,
  updateRole,
  deleteRole,
  updateRoleStatus,
};
