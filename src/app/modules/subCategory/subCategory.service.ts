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
  if (payload.categoryId) {
    const categoryExists = await prisma.category.findUnique({ where: { id: payload.categoryId } });
    if (!categoryExists) throw new ApiError(httpStatus.NOT_FOUND, "Selected Category not found");
  }

  if (payload.imageId) {
    const imageExists = await prisma.image.findUnique({ where: { id: payload.imageId } });
    if (!imageExists) throw new ApiError(httpStatus.NOT_FOUND, "Associated Image not found");
  }

  try {
    const result = await prisma.subCategory.create({
      data,
      include: { image: true },
    });
    return {
      ...result,
      image: result.image?.url || null,
      url: result.image?.url || null,
    };
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new ApiError(httpStatus.CONFLICT, "A sub-category with this name already exists. Please use a unique name.");
    }
    throw new ApiError(httpStatus.BAD_REQUEST, error.message || "Failed to create sub-category");
  }
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
          id: true,
          name: true,
          slug: true,
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
    ...((page || limit) ? { skip: skip, take: limitNumber } : {}),
  });

  const total = await prisma.subCategory.count({
    where: whereCondition,
  });

  return {
    data: result.map((curr: any) => ({
      ...curr,
      image: curr.image?.url || null,
      url: curr.image?.url || null,
    })),
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total: total,
    },
  };
};

const getSubCategoryByIdentifier = async (identifier: string) => {
  const result = await prisma.subCategory.findFirst({
    where: {
      OR: [
        { id: identifier },
        { slug: identifier },
        { name: identifier },
      ],
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

  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "SubCategory not found");

  return {
    ...result,
    image: result.image?.url || null,
    url: result.image?.url || null,
  };
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
    const categoryExists = await prisma.category.findUnique({ where: { id: payload.categoryId } });
    if (!categoryExists) throw new ApiError(httpStatus.NOT_FOUND, "Selected Category not found");
    updateData.category = { connect: { id: payload.categoryId } };
  }
  if (payload.icon) updateData.icon = payload.icon;
  if (payload.description) updateData.description = payload.description;
  if (payload.status !== undefined) {
    updateData.status = payload.status === true || payload.status === "true";
  }
  if (payload.imageId) {
    const imageExists = await prisma.image.findUnique({ where: { id: payload.imageId } });
    if (!imageExists) throw new ApiError(httpStatus.NOT_FOUND, "Associated Image not found");
    updateData.image = { connect: { id: payload.imageId } };
  }
  if (payload.createdAt) updateData.createdAt = new Date(payload.createdAt);
  if (payload.updatedAt) updateData.updatedAt = new Date(payload.updatedAt);

  if (userId) {
    updateData.updatedBy = { connect: { id: userId } };
  }

  try {
    const result = await prisma.subCategory.update({
      where: { id },
      data: updateData,
      include: { image: true },
    });
    return {
      ...result,
      image: result.image?.url || null,
      url: result.image?.url || null,
    };
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new ApiError(httpStatus.CONFLICT, "A sub-category with this name already exists. Please use a unique name.");
    }
    throw new ApiError(httpStatus.BAD_REQUEST, error.message || "Failed to update sub-category");
  }
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
  getSubCategoryByIdentifier,
  updateSubCategory,
  deleteSubCategory,
  updateSubCategoryStatus,
};
