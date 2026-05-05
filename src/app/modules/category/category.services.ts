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

  if (payload.imageId) {
    const imageExists = await prisma.image.findUnique({ where: { id: payload.imageId } });
    if (!imageExists) throw new ApiError(httpStatus.NOT_FOUND, "Associated Image not found");
  }

  try {
    const result = await prisma.category.create({
      data,
      include: { image: true },
    });

    // History record
    await prisma.categoryHistory.create({
      data: {
        categoryId: result.id,
        oldData: null as any,
        newData: result as any,
        updatedById: userId ?? null,
      },
    });

    return {
      ...result,
      image: result.image?.url || null,
      url: result.image?.url || null,
    };
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new ApiError(httpStatus.CONFLICT, "A category with this name already exists. Please use a unique name.");
    }
    throw new ApiError(httpStatus.BAD_REQUEST, error.message || "Failed to create category");
  }
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
    ...(page ? { take: limitNumber, skip: skip } : {}),
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
    data: result.map((curr: any) => ({
      ...curr,
      image: curr.image?.url || null,
      url: curr.image?.url || null,
      subCategories: curr.subCategories.map((sub: any) => ({
        ...sub,
        image: sub.image?.url || null,
        url: sub.image?.url || null,
      })),
    })),
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total: total,
    },
  };
};

const getCategoryByIdentifier = async (identifier: string) => {
  const result = await prisma.category.findFirst({
    where: {
      OR: [
        { id: identifier },
        { slug: identifier },
        { name: identifier },
      ],
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
        take: 10,
        include: {
          updatedBy: { select: { id: true, email: true } },
        },
      },
    },
  });

  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Category not found");

  return {
    ...result,
    image: result.image?.url || null,
    url: result.image?.url || null,
    subCategories: result.subCategories.map((sub: any) => ({
      ...sub,
      image: sub.image?.url || null,
      url: sub.image?.url || null,
    })),
  };
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
    const result = await prisma.category.update({
      where: { id },
      data: updateData,
      include: { image: true },
    });

    // History record
    await prisma.categoryHistory.create({
      data: {
        categoryId: result.id,
        oldData: existingCategory as any,
        newData: result as any,
        updatedById: userId ?? null,
      },
    });

    return {
      ...result,
      image: result.image?.url || null,
      url: result.image?.url || null,
    };
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new ApiError(httpStatus.CONFLICT, "A category with this name already exists. Please use a unique name.");
    }
    throw new ApiError(httpStatus.BAD_REQUEST, error.message || "Failed to update category");
  }
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
  getCategoryByIdentifier,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
};
