import httpStatus from "http-status";
import prisma from "../../utils/prismaClient.ts";
import ApiError from "../../middleware/apiError.ts";
import type { Prisma } from "@prisma/client";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { commentSearchableFields } from "./comment.constant.ts";

const createComment = async (userId: string, payload: any) => {
  const isApplicationExist = await prisma.application.findUnique({
    where: { id: payload.applicationId },
  });

  if (!isApplicationExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const result = await prisma.comment.create({
    data: {
      ...payload,
      userId,
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  return result;
};

const getAllComments = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const andCondition: Prisma.CommentWhereInput[] = [];
  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  if (searchTerm) {
    andCondition.push({
      OR: commentSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const result = await prisma.comment.findMany({
    where: {
      AND: andCondition,
      ...queryFilter,
      isDeleted: false,
    },
    take: limitNumber,
    skip: skip,
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  const total = await prisma.comment.count({
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

const getCommentById = async (id: string) => {
  const result = await prisma.comment.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");
  return result;
};

const updateComment = async (id: string, payload: any) => {
  const isExist = await prisma.comment.findUnique({ where: { id } });
  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");

  const result = await prisma.comment.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteComment = async (id: string) => {
  const isExist = await prisma.comment.findUnique({ where: { id } });
  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");

  await prisma.comment.update({
    where: { id },
    data: { isDeleted: true },
  });

  return { message: "Comment deleted successfully" };
};

export const CommentServices = {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
};
