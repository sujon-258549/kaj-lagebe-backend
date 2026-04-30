import httpStatus from "http-status";
import ApiError from "../../middleware/apiError.ts";
import prisma from "../../utils/prismaClient.ts";
import type { Prisma } from "@prisma/client";
import { subCategorySearchableFields } from "./subCategory.constant.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import slugCreate from "../../utils/slugCreate.ts";

const createSubCategory = async (payload: any, userId?: string) => {
  const slug = payload.slug || slugCreate(payload.name);
  const data: any = { 
    ...payload, 
    slug,
    createdById: userId ?? null,
    updatedById: userId ?? null,
    imageId: payload.imageId ?? null
  };
  if (payload.createdAt) data.createdAt = new Date(payload.createdAt);
  if (payload.updatedAt) data.updatedAt = new Date(payload.updatedAt);

  const result = await prisma.subCategory.create({
    data,
  });
  return result;
};

const getAllSubCategory = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const andCondition: Prisma.SubCategoryWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: subCategorySearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Handle Boolean filter for status
  if (queryFilter.status) {
    queryFilter.status = queryFilter.status === "true";
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
    include: {
      category: {
        select: {
          name: true,
          slug: true,
          image: true,
        },
      },
      image: true,
      createdBy: {
        select: { id: true, email: true, profile: { select: { name: true } } },
      },
      updatedBy: {
        select: { id: true, email: true, profile: { select: { name: true } } },
      },
    },
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
    include: {
      category: {
        select: {
          name: true,
          id: true,
          slug: true,
        },
      },
      image: true,
    },
  });
  if (!result)
    throw new ApiError(httpStatus.NOT_FOUND, "SubCategory not found");
  return result;
};

const getSubCategoryBySlug = async (slug: string) => {
  const result = await prisma.subCategory.findUnique({
    where: { slug },
    include: {
      category: {
        select: {
          name: true,
          id: true,
          slug: true,
        },
      },
      image: true,
    },
  });
  if (!result)
    throw new ApiError(httpStatus.NOT_FOUND, "SubCategory not found");
  return result;
};

const updateSubCategory = async (id: string, payload: any, userId?: string) => {
  const existingSubCategory = await prisma.subCategory.findUnique({
    where: { id },
  });
  if (!existingSubCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, "SubCategory not found");
  }

  const updateData: Partial<Prisma.SubCategoryUpdateInput> = {};

  if (payload.name) {
    updateData.name = payload.name;
    updateData.slug = payload.slug || slugCreate(payload.name);
  } else if (payload.slug) {
    updateData.slug = payload.slug;
  }

  if (payload.categoryId) {
    updateData.category = {
      connect: { id: payload.categoryId },
    };
  }
  if (payload.icon) updateData.icon = payload.icon;
  if (payload.description) updateData.description = payload.description;
  if (payload.status !== undefined) {
    updateData.status = payload.status === true || payload.status === "true";
  }
  if (payload.imageId) updateData.image = { connect: { id: payload.imageId } };
  if (payload.createdAt) updateData.createdAt = new Date(payload.createdAt);
  if (payload.updatedAt) updateData.updatedAt = new Date(payload.updatedAt);

  if (userId) {
    updateData.updatedBy = { connect: { id: userId } };
  }

  const result = await prisma.subCategory.update({
    where: { id },
    data: updateData,
  });
  return result;
};

const deleteSubCategory = async (id: string) => {
  await prisma.subCategory.delete({ where: { id } });
  return { message: "SubCategory deleted successfully" };
};
const updateSubCategoryStatus = async (id: string, userId?: string) => {
  const existingSubCategory = await prisma.subCategory.findUnique({
    where: { id },
  });
  if (!existingSubCategory)
    throw new ApiError(httpStatus.NOT_FOUND, "SubCategory not found");

  const result = await prisma.subCategory.update({
    where: { id },
    data: { 
      status: !existingSubCategory.status,
      updatedById: userId ?? null
    },
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
