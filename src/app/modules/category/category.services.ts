import type { Prisma } from "@prisma/client";
import ApiError from "../../middleware/apiError.ts";
import prisma from "../../utils/prismaClient.js";
import slugCreate from "../../utils/slugCreate.ts";
import httpStatus from "http-status";
import { categorySearchText } from "./category.const.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";

const createCategoryIntoDB = async (payload: any) => {

  const slug = slugCreate(payload.name);

  const result = await prisma.category.create({
    data: {
      name: payload.name,
      icon: payload.icon,
      slug: slug,
      description: payload.description,
    },
  });
  return result;
};

const getAllCategory = async (query: any) => {
  const {page,limit,searchTerm,sortBy,sortOrder , ...filter}= query

  const andCondition: Prisma.CategoryWhereInput[] = []

  if(searchTerm){
    andCondition.push({
      OR: categorySearchText.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    })
  }

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const result = await prisma.category.findMany({
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

  const total = await prisma.category.count({
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

const getCategoryById = async (id: string) => {
  const result = await prisma.category.findFirst({ where: { OR: [{ id: id }, { slug: id }] } });
  return result;
  };

const updateCategory = async (id: string, payload: any) => {
  const existingCategory = await prisma.category.findUnique({ where: { id } });
  if (!existingCategory) throw new ApiError(httpStatus.NOT_FOUND, "Category not found");

  const result = await prisma.category.update({ where: { id }, data: payload });
  return result;
};

const updateCategoryStatus = async (id: string) => {
  const existingCategory = await prisma.category.findUnique({ where: { id } });
  if (!existingCategory) throw new ApiError(httpStatus.NOT_FOUND, "Category not found");

  const result = await prisma.category.update({ where: { id }, data: { status: !existingCategory.status } });
  return result;
};

const deleteCategory = async (id: string) => {
  const existingCategory = await prisma.category.findUnique({ where: { id } });
  if (!existingCategory) throw new ApiError(httpStatus.NOT_FOUND, "Category not found");

  const result = await prisma.category.delete({ where: { id } });
  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
};
