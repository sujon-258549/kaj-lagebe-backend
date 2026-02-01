import httpStatus from "http-status";
import ApiError from "../../middleware/apiError.ts";
import prisma from "../../utils/prismaClient.ts";
import type { Prisma } from "@prisma/client";
import { subCategorySearchableFields } from "./subCategory.constant.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";

const createSubCategory = async (payload: any) => {
  const result = await prisma.subCategory.create({ data: payload });
  return result;
};

const getAllSubCategory = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const andCondition: Prisma.SubCategoryWhereInput[] = [];

  if (query.searchTerm) {
    andCondition.push({
      OR: subCategorySearchableFields.map((text: string) => ({
        [text]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // queryFilter
  if (Object.keys(queryFilter).length > 0) {
    andCondition.push({
      AND: Object.keys(queryFilter).map((key: string) => ({
        [key]: {
          equals: queryFilter[key as keyof typeof queryFilter],
        },
      })),
    });
  }

  const whereCondition: Prisma.SubCategoryWhereInput = {
    AND: andCondition,
  };

  const result = await prisma.subCategory.findMany({
    where: whereCondition,
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
    skip: skip,
    take: limitNumber,
  });

  const total = await prisma.subCategory.count({
    where: whereCondition,
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

const getSubCategoryById = async (id: string) => {
  const result = await prisma.subCategory.findFirst({
    where: {
      OR: [{ id: id }, { slug: id }],
    },
  });
  if (!result)
    throw new ApiError(httpStatus.NOT_FOUND, "SubCategory not found");
  return result;
};

const getSubCategoryBySlug = async (slug: string) => {
  const result = await prisma.subCategory.findUnique({ where: { slug } });
  if (!result)
    throw new ApiError(httpStatus.NOT_FOUND, "SubCategory not found");
  return result;
};

const updateSubCategory = async (id: string, payload: any) => {
  const result = await prisma.subCategory.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteSubCategory = async (id: string) => {
  await prisma.subCategory.delete({ where: { id } });
  return { message: "SubCategory deleted successfully" };
};
const updateSubCategoryStatus = async (id: string) => {
  const existingSubCategory = await prisma.subCategory.findUnique({
    where: { id },
  });
  if (!existingSubCategory)
    throw new ApiError(httpStatus.NOT_FOUND, "SubCategory not found");

  const result = await prisma.subCategory.update({
    where: { id },
    data: { status: !existingSubCategory.status },
  });
  return result;
};

export const SubCategoryServices = {
  createSubCategory,
  getAllSubCategory,
  getSubCategoryById,
  getSubCategoryBySlug,
  updateSubCategory,
  deleteSubCategory,
  updateSubCategoryStatus,
};
