import httpStatus from "http-status";
import prisma from "../../utils/prismaClient.ts";
import ApiError from "../../middleware/apiError.ts";
import slugCreate from "../../utils/slugCreate.ts";
import type { Prisma } from "@prisma/client";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { jobSearchableFields } from "./job.constant.ts";

const createJob = async (userId: string, payload: any) => {
  const slug = payload.slug || slugCreate(payload.title);

  const result = await prisma.job.create({
    data: {
      ...payload,
      slug,
      userId,
    },
  });

  return result;
};

const getAllJobs = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const andCondition: Prisma.JobWhereInput[] = [];
  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  if (searchTerm) {
    andCondition.push({
      OR: jobSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Handle boolean filters if passed as strings
  if (queryFilter.isUrgent !== undefined) {
    queryFilter.isUrgent = queryFilter.isUrgent === "true";
  }
  if (queryFilter.isPublished !== undefined) {
    queryFilter.isPublished = queryFilter.isPublished === "true";
  }
  if (queryFilter.status !== undefined) {
    queryFilter.status = queryFilter.status === "true";
  }

  const result = await prisma.job.findMany({
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
      category: true,
      subCategory: true,
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  const total = await prisma.job.count({
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

const getJobById = async (id: string) => {
  const result = await prisma.job.findFirst({
    where: {
      OR: [{ id: id }, { slug: id }],
      isDeleted: false,
    },
    include: {
      category: true,
      subCategory: true,
      user: {
        include: {
          profile: true,
        },
      },
      applications: {
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
    },
  });

  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
  return result;
};

const updateJob = async (id: string, payload: any) => {
  const isExist = await prisma.job.findUnique({ where: { id } });
  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, "Job not found");

  if (payload.title) {
    payload.slug = payload.slug || slugCreate(payload.title);
  }

  const result = await prisma.job.update({
    where: { id },
    data: payload,
  });
  return result;
};

const updateJobStatus = async (id: string, payload: any) => {
  const isExist = await prisma.job.findUnique({ where: { id } });
  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, "Job not found");

  const result = await prisma.job.update({
    where: { id },
    data: { status: !isExist.status },
  });
  return result;
};

const deleteJob = async (id: string) => {
  const isExist = await prisma.job.findUnique({ where: { id } });
  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, "Job not found");

  await prisma.job.update({
    where: { id },
    data: { isDeleted: true },
  });

  return { message: "Job deleted successfully" };
};

export const JobServices = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  updateJobStatus,
  deleteJob,
};
