import httpStatus from "http-status";
import prisma from "../../utils/prismaClient.ts";
import ApiError from "../../middleware/apiError.ts";
import { Prisma } from "@prisma/client";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { blogCommentSearchableFields } from "./blogComment.constant.ts";
import { NotificationServices } from "../notification/notification.service.ts";
import { USER_ROLE } from "../users/user.constant.ts";
import { emitToUser } from "../../utils/socket.js";

const createBlogComment = async (payload: any, userId?: string) => {
  const { blogId, ...rest } = payload;

  // 1. Check if blog exists
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
  });

  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  // 2. Create Comment
  const result = await prisma.blogComment.create({
    data: {
      ...rest,
      blogId,
      userId: userId || payload.userId,
    },
    include: {
      blog: true,
      user: {
        select: {
          id: true,
          email: true,
          profile: true,
        },
      },
    },
  });

  // 3. Notify Admins
  const admins = await prisma.user.findMany({
    where: {
      role: {
        role: {
          in: [USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN],
        },
      },
    },
  });

  for (const admin of admins) {
    await NotificationServices.createNotification({
      userId: admin.id,
      type: "BLOG_COMMENT",
      message: `💬 নতুন ব্লগ কমেন্ট: "${blog.title}" ব্লগে ${payload.name} কমেন্ট করেছেন।`,
    });

    emitToUser(admin.id, "new-blog-comment", result);
  }

  return result;
};

const getAllBlogComments = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const andCondition: Prisma.BlogCommentWhereInput[] = [];
  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  if (searchTerm) {
    andCondition.push({
      OR: blogCommentSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const result = await prisma.blogComment.findMany({
    where: {
      AND: andCondition,
      ...queryFilter,
      isDeleted: false,
    },
    include: {
      blog: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          profile: true,
        },
      },
    },
    take: limitNumber,
    skip: skip,
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
  });

  const total = await prisma.blogComment.count({
    where: {
      AND: andCondition,
      ...queryFilter,
      isDeleted: false,
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

const getBlogCommentById = async (id: string) => {
  const result = await prisma.blogComment.findUnique({
    where: { id },
    include: {
      blog: true,
      user: true,
    },
  });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");
  return result;
};

const updateBlogComment = async (id: string, payload: any) => {
  const isExist = await prisma.blogComment.findUnique({ where: { id } });
  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");

  const result = await prisma.blogComment.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteBlogComment = async (id: string) => {
  const isExist = await prisma.blogComment.findUnique({ where: { id } });
  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");

  await prisma.blogComment.update({
    where: { id },
    data: { isDeleted: true },
  });
  return { message: "Comment deleted successfully" };
};

const getCommentsByBlogId = async (blogId: string) => {
  return await getAllBlogComments({ blogId, status: true });
};

export const BlogCommentServices = {
  createBlogComment,
  getAllBlogComments,
  getBlogCommentById,
  updateBlogComment,
  deleteBlogComment,
  getCommentsByBlogId,
};
