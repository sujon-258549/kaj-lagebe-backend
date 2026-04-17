import type { Prisma } from "@prisma/client";
import ApiError from "../../middleware/apiError.ts";
import httpStatus from "http-status";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { departmentSearchableFields } from "./department.const.ts";
import prisma from "../../utils/prismaClient.ts";

const createDepartmentIntoDB = async (payload: any) => {
  const result = await prisma.department.create({
    data: {
      name: payload.name,
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
        }
      }
    }
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
        }
      }
    }
  });
  return result;
};

const updateDepartment = async (id: string, payload: any) => {
  const existingDepartment = await prisma.department.findUnique({ where: { id } });
  if (!existingDepartment)
    throw new ApiError(httpStatus.NOT_FOUND, "Department not found");

  const result = await prisma.department.update({
    where: { id },
    data: {
      name: payload.name,
    },
  });
  return result;
};

const deleteDepartment = async (id: string) => {
  const existingDepartment = await prisma.department.findUnique({ where: { id } });
  if (!existingDepartment)
    throw new ApiError(httpStatus.NOT_FOUND, "Department not found");

  const result = await prisma.department.delete({ where: { id } });
  return result;
};

export const DepartmentServices = {
  createDepartmentIntoDB,
  getAllDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
