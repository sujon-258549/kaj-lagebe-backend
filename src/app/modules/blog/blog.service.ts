import httpStatus from "http-status";
import prisma from "../../utils/prismaClient.ts";
import ApiError from "../../middleware/apiError.ts";

import slugCreate from "../../utils/slugCreate.ts";
import type { Prisma } from "@prisma/client";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { blogSearchableFields } from "./blog.constant.ts";

const blogInclude = {
  cover: {
    select: {
      id: true,
      url: true,
    },
  },
  author: {
    select: {
      id: true,
      mobile: true,
      profile: {
        select: {
          name: true,
          photo: true,
        },
      },
    },
  },
  updatedBy: {
    select: {
      id: true,
      email: true,
      profile: {
        select: {
          name: true,
        },
      },
    },
  },
};

const createBlog = async (payload: any, userId?: string) => {
  const { coverId, authorId, tags, authorName, coverImage, ...rest } = payload;
  const slug = payload.slug || slugCreate(payload.title);
  
  const creatorId = userId || authorId;

  const data: Prisma.BlogCreateInput = {
    ...rest,
    slug,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(",")) : [],
    author: creatorId ? { connect: { id: creatorId } } : undefined,
    updatedBy: creatorId ? { connect: { id: creatorId } } : undefined,
  };

  if (coverId) {
    data.cover = { connect: { id: coverId } };
  }

  if (payload.createdAt) data.createdAt = new Date(payload.createdAt);
  if (payload.updatedAt) data.updatedAt = new Date(payload.updatedAt);

  return await prisma.blog.create({
    data,
    include: blogInclude,
  });
};

const getAllBlog = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const andCondition: Prisma.BlogWhereInput[] = [];
  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  if (searchTerm) {
    andCondition.push({
      OR: blogSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (queryFilter.isPublished !== undefined) {
    queryFilter.isPublished = queryFilter.isPublished === "true";
  }

  const result = await prisma.blog.findMany({
    where: {
      AND: andCondition,
      ...queryFilter,
    },
    include: blogInclude,
    take: limitNumber,
    skip: skip,
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
  });

  const total = await prisma.blog.count({
    where: {
      AND: andCondition,
      ...queryFilter,
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

const getBlogById = async (id: string) => {
  const result = await prisma.blog.findFirst({
    where: {
      OR: [{ id: id }, { slug: id }],
    },
    include: blogInclude,
  });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  return result;
};

const updateBlog = async (id: string, payload: any, userId?: string) => {
  const existingBlog = await prisma.blog.findUnique({ where: { id } });
  if (!existingBlog) throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");

  const { tags, coverId, authorId, authorName, coverImage, ...rest } = payload;
  const updateData: Prisma.BlogUpdateInput = { ...rest };

  if (tags) {
    updateData.tags = Array.isArray(tags) ? tags : tags.split(",");
  }

  if (coverId) {
    updateData.cover = {
      connect: { id: coverId },
    };
  }

  if (userId || authorId) {
    updateData.updatedBy = {
      connect: { id: userId || authorId },
    };
  }

  if (payload.title) {
    updateData.title = payload.title;
    updateData.slug = payload.slug || slugCreate(payload.title);
  } else if (payload.slug) {
    updateData.slug = payload.slug;
  }

  if (payload.createdAt) updateData.createdAt = new Date(payload.createdAt);
  if (payload.updatedAt) updateData.updatedAt = new Date(payload.updatedAt);

  const result = await prisma.blog.update({
    where: { id },
    data: updateData,
    include: blogInclude,
  });
  return result;
};

const updateBlogStatus = async (id: string, userId?: string) => {
  const isBlogExist = await prisma.blog.findUnique({ where: { id } });
  if (!isBlogExist) throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");

  const result = await prisma.blog.update({
    where: { id },
    data: { 
      isPublished: !isBlogExist.isPublished, 
      publishedAt: !isBlogExist.isPublished ? new Date() : isBlogExist.publishedAt,
      updatedById: userId ?? null
    },
    include: blogInclude,
  });
  return result;
};

const deleteBlog = async (id: string) => {
  const isBlogExist = await prisma.blog.findUnique({ where: { id } });
  if (!isBlogExist) throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");

  await prisma.blog.delete({ where: { id } });
  return { message: "Blog deleted successfully" };
};

export const BlogServices = {
  createBlog,
  getAllBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
};
