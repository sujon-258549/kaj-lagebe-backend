import type { Prisma } from "@prisma/client";
import ApiError from "../../middleware/apiError.ts";
import httpStatus from "http-status";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { departmentSearchableFields } from "./department.const.ts";
import prisma from "../../utils/prismaClient.ts";

const createDepartment = async (payload: any, userId?: string) => {
  const result = await prisma.department.create({
    data: {
      name: payload.name,
      description: payload.description,
      isActive: payload.isActive,
      createdById: userId ?? null,
      updatedById: userId ?? null,
    },
  });
  return result;
};

const getAllDepartment = async (query: any) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filter } = query;

  const andCondition: Prisma.DepartmentWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: departmentSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const result = await prisma.department.findMany({
    where: {
      AND: andCondition.length > 0 ? andCondition : undefined,
      ...filter,
    },
    take: limitNumber,
    skip: skip,
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
    include: {
      users: {
        select: {
          id: true,
          email: true,
          mobile: true,
          roleId: true,
        },
      },
      createdBy: {
        select: { id: true, email: true, profile: { select: { name: true } } },
      },
      updatedBy: {
        select: { id: true, email: true, profile: { select: { name: true } } },
      },
    },
  });

  const total = await prisma.department.count({
    where: {
      AND: andCondition.length > 0 ? andCondition : undefined,
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

const getDepartmentById = async (id: string) => {
  const result = await prisma.department.findUnique({
    where: { id: id },
    include: {
      users: {
        select: {
          id: true,
          email: true,
          mobile: true,
          roleId: true,
        },
      },
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

const updateDepartment = async (id: string, payload: any, userId?: string) => {
  const existingDepartment = await prisma.department.findUnique({
    where: { id },
  });
  if (!existingDepartment)
    throw new ApiError(httpStatus.NOT_FOUND, "Department not found");

  const result = await prisma.department.update({
    where: { id },
    data: {
      name: payload.name,
      description: payload.description,
      isActive: payload.isActive,
      updatedById: userId ?? null,
    },
  });
  return result;
};

const deleteDepartment = async (id: string) => {
  const existingDepartment = await prisma.department.findUnique({
    where: { id },
  });
  if (!existingDepartment)
    throw new ApiError(httpStatus.NOT_FOUND, "Department not found");

  const result = await prisma.department.delete({ where: { id } });
  return result;
};

const updateDepartmentStatus = async (id: string, userId?: string) => {
  const existingDepartment = await prisma.department.findUnique({
    where: { id },
  });

  if (!existingDepartment)
    throw new ApiError(httpStatus.NOT_FOUND, "Department not found");

  const result = await prisma.department.update({
    where: { id },
    data: {
      isActive: !existingDepartment.isActive,
      updatedById: userId ?? null,
    },
  });
  return result;
};

export const DepartmentServices = {
  createDepartment,
  getAllDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  updateDepartmentStatus,
};
