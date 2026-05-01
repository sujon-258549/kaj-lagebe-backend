import { Prisma } from "@prisma/client";
import prisma from "../../utils/prismaClient.ts";
import type { IReview } from "./review.interface.ts";

const createReview = async (payload: IReview, userId?: string) => {
  const { imageId, ...rest } = payload;
  const data: Prisma.ReviewCreateInput = {
    ...rest,
  };

  if (userId) {
    data.createdBy = { connect: { id: userId } };
    data.updatedBy = { connect: { id: userId } };
  }

  //

  if (imageId) {
    data.imageRel = { connect: { id: imageId } };
  }

  const result = await prisma.review.create({
    data,
    include: {
      imageRel: true,
    },
  });
  return result;
};

const getAllReviews = async (query: any) => {
  const { searchTerm, ...filterData } = query;
  
  const andCondition: Prisma.ReviewWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { content: { contains: searchTerm, mode: "insensitive" } },
        { title: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (filterData.status !== undefined) {
    andCondition.push({
      status: filterData.status === "true",
    });
  }

  const result = await prisma.review.findMany({
    where: {
      AND: andCondition,
    },
    include: {
      imageRel: true,
    },
    orderBy: {
      order: "asc",
    },
  });
  return result;
};

const getReviewById = async (id: string) => {
  const result = await prisma.review.findUnique({
    where: { id },
    include: {
      imageRel: true,
    },
  });
  return result;
};

const updateReview = async (id: string, payload: Partial<IReview>, userId?: string) => {
  const { imageId, ...rest } = payload;
  const data: Prisma.ReviewUpdateInput = {
    ...rest,
  };

  if (userId) {
    data.updatedBy = { connect: { id: userId } };
  }

  if (imageId) {
    data.imageRel = { connect: { id: imageId } };
  }

  const result = await prisma.review.update({
    where: { id },
    data,
    include: {
      imageRel: true,
    },
  });
  return result;
};


const deleteReview = async (id: string) => {
  const result = await prisma.review.delete({
    where: { id },
  });
  return result;
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
