import type { Prisma } from "@prisma/client";
import ApiError from "../../middleware/apiError.ts";

import slugCreate from "../../utils/slugCreate.ts";
import httpStatus from "http-status";

import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { categorySearchableFields } from "./category.const.ts";
import prisma from "../../utils/prismaClient.ts";

const createCategoryIntoDB = async (payload: any, userId?: string) => {
  const slug = payload.slug || slugCreate(payload.name);

  const data: any = {
    name: payload.name,
    icon: payload.icon,
    slug: slug,
    description: payload.description,
    imageId: payload.imageId,
    createdById: userId,
    updatedById: userId,
  };

  if (payload.createdAt) data.createdAt = new Date(payload.createdAt);
  if (payload.updatedAt) data.updatedAt = new Date(payload.updatedAt);

  const result = await prisma.category.create({
    data,
  });

  // History record
  await prisma.categoryHistory.create({
    data: {
      categoryId: result.id,
      oldData: (null as any),
      newData: (result as any),
      updatedById: userId ?? null,
    },
  });

  return result;
};

const getAllCategory = async (query: any) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filter } = query;

  const andCondition: Prisma.CategoryWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: categorySearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (filter.status) {
    filter.status = filter.status === "true";
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
    include: {
      subCategories: {
        select: {
          name: true,
          icon: true,
          slug: true,
          id: true,
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
      histories: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          updatedBy: { select: { id: true, email: true } },
        },
      },
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
  const result = await prisma.category.findFirst({
    where: { OR: [{ id: id }, { slug: id }] },
    include: {
      subCategories: {
        select: {
          name: true,
          icon: true,
          slug: true,
          id: true,
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
      histories: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          updatedBy: { select: { id: true, email: true } },
        },
      },
    },
  });
  return result;
};

const updateCategory = async (id: string, payload: any, userId?: string) => {
  const existingCategory = await prisma.category.findUnique({ where: { id } });
  if (!existingCategory)
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");

  const updateData: Partial<Prisma.CategoryUpdateInput> = {};

  if (payload.name) {
    updateData.name = payload.name;
    updateData.slug = payload.slug || slugCreate(payload.name);
  } else if (payload.slug) {
    updateData.slug = payload.slug;
  }

  if (payload.icon) updateData.icon = payload.icon;
  if (payload.status !== undefined)
    updateData.status = payload.status === true || payload.status === "true";
  if (payload.description) updateData.description = payload.description;
  if (payload.imageId) updateData.image = { connect: { id: payload.imageId } };
  if (payload.createdAt) updateData.createdAt = new Date(payload.createdAt);
  if (payload.updatedAt) updateData.updatedAt = new Date(payload.updatedAt);

  if (userId) {
    updateData.updatedBy = { connect: { id: userId } };
  }

  const result = await prisma.category.update({
    where: { id },
    data: updateData,
  });

  // History record
  await prisma.categoryHistory.create({
    data: {
      categoryId: result.id,
      oldData: (existingCategory as any),
      newData: (result as any),
      updatedById: userId ?? null,
    },
  });

  return result;
};

const updateCategoryStatus = async (id: string, userId?: string) => {
  const existingCategory = await prisma.category.findUnique({ where: { id } });
  if (!existingCategory)
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");

  const result = await prisma.category.update({
    where: { id },
    data: { 
      status: !existingCategory.status,
      updatedById: userId ?? null 
    },
  });

  // History record
  await prisma.categoryHistory.create({
    data: {
      categoryId: result.id,
      oldData: (existingCategory as any),
      newData: (result as any),
      updatedById: userId ?? null,
    },
  });

  return result;
};

const deleteCategory = async (id: string) => {
  const existingCategory = await prisma.category.findUnique({ where: { id } });
  if (!existingCategory)
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");

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
