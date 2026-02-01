import httpStatus from "http-status";
import prisma from "../../utils/prismaClient.ts";
import ApiError from "../../middleware/apiError.ts";

import slugCreate from "../../utils/slugCreate.ts";
import type { Prisma } from "@prisma/client";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { blogSearchText } from "./blog.constant.ts";

const createBlog = async (payload: any) => {
  const slug = slugCreate(payload.title);
  const data = { ...payload, slug };
  return await prisma.blog.create({ data });
};

const getAllBlog = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const andCondition: Prisma.BlogWhereInput[] = [];
  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  if (query.searchTerm) {
    andCondition.push({
      OR: blogSearchText.map((text: string) => ({
        [text]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const result = await prisma.blog.findMany({
    where: {
      AND: andCondition,
      ...queryFilter,
    },
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
  });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  return result;
};

const updateBlog = async (id: string, payload: any) => {
  const result = await prisma.blog.update({
    where: { id },
    data: payload,
  });
  return result;
};

const updateBlogStatus = async (id: string) => {
  const isBlogExist = await prisma.blog.findUnique({ where: { id } });
  if (!isBlogExist) throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");

  const result = await prisma.blog.update({
    where: { id },
    data: { isPublished: !isBlogExist.isPublished, publishedAt: new Date() },
  });
  return result;
};

const deleteBlog = async (id: string) => {
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
