import httpStatus from "http-status";
import prisma from "../../utils/prismaClient.ts";
import ApiError from "../../middleware/apiError.ts";
import slugCreate from "../../utils/slugCreate.ts";
import type { Prisma } from "@prisma/client";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { jobSearchableFields, jobFilterableFields } from "./job.constant.ts";

const createJob = async (userId: string, payload: any) => {
  // Parse fields if they are strings (JSON, Arrays, Booleans)
  if (typeof payload.isUrgent === "string")
    payload.isUrgent = payload.isUrgent === "true";
  if (typeof payload.isPublished === "string")
    payload.isPublished = payload.isPublished === "true";
  if (typeof payload.status === "string")
    payload.status = payload.status === "true";
  if (typeof payload.negotiable === "string")
    payload.negotiable = payload.negotiable === "true";
  if (typeof payload.visaSponsorship === "string")
    payload.visaSponsorship = payload.visaSponsorship === "true";
  if (typeof payload.relocationAssistance === "string")
    payload.relocationAssistance = payload.relocationAssistance === "true";
  if (typeof payload.performanceBonus === "string")
    payload.performanceBonus = payload.performanceBonus === "true";
  if (typeof payload.healthInsurance === "string")
    payload.healthInsurance = payload.healthInsurance === "true";

  // Parse JSON fields
  if (typeof payload.mapCoordinates === "string")
    payload.mapCoordinates = JSON.parse(payload.mapCoordinates);
  if (typeof payload.socialMedia === "string")
    payload.socialMedia = JSON.parse(payload.socialMedia);
  if (typeof payload.jobLocation === "string")
    payload.jobLocation = JSON.parse(payload.jobLocation);

  // Parse String Arrays
  const arrayFields = [
    "tags",
    "responsibilities",
    "requirements",
    "benefits",
    "skills",
    "tools",
    "languages",
    "keywords",
  ];
  arrayFields.forEach((field) => {
    if (typeof payload[field] === "string") {
      try {
        payload[field] = JSON.parse(payload[field]);
      } catch (e) {
        payload[field] = payload[field].split(",").map((s: string) => s.trim());
      }
    }
  });

  const slug =
    payload.slug || slugCreate(payload.title + " " + (payload.location || ""));

  const { authorId, userId: payloadUserId, categoryId, subCategoryId, ...rest } = payload;
  const result = await prisma.job.create({
    data: {
      ...rest,
      slug,
      authorId: userId as string,
      updatedById: userId ?? null,
      category: categoryId ? { connect: { id: categoryId } } : undefined,
      subCategory: subCategoryId ? { connect: { id: subCategoryId } } : undefined,
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      subCategory: {
        select: {
          name: true,
          slug: true,
        },
      },
      user: {
        select: {
          email: true,
          mobile: true,
          profile: {
            select: {
              name: true,
              photo: true,
            },
          },
        },
      },
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

  // Filter out any fields that are not allowed for filtering
  const filteredData: any = {};
  Object.keys(queryFilter).forEach((key) => {
    if (jobFilterableFields.includes(key) || key === "userId") {
      let value = queryFilter[key];
      // Handle boolean strings
      if (value === "true") value = true;
      if (value === "false") value = false;
      filteredData[key] = value;
    }
  });

  // Handle userId -> authorId mapping for backward compatibility
  if (filteredData.userId) {
    filteredData.authorId = filteredData.userId;
    delete filteredData.userId;
  }

  const result = await prisma.job.findMany({
    where: {
      AND: andCondition,
      ...filteredData,
      isDeleted: false,
    },
    take: limitNumber,
    skip: skip,
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      subCategory: {
        select: {
          name: true,
          slug: true,
        },
      },
      user: {
        select: {
          email: true,
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
          email: true,
          profile: { select: { name: true } },
        },
      },
    },
  });

  const total = await prisma.job.count({
    where: {
      AND: andCondition,
      ...filteredData,
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

const updateJob = async (id: string, payload: any, userId?: string) => {
  const isExist = await prisma.job.findUnique({ where: { id } });
  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, "Job not found");

  // Parse fields if they are strings (JSON, Arrays, Booleans)
  if (typeof payload.isUrgent === "string")
    payload.isUrgent = payload.isUrgent === "true";
  if (typeof payload.isPublished === "string")
    payload.isPublished = payload.isPublished === "true";
  if (typeof payload.status === "string")
    payload.status = payload.status === "true";
  if (typeof payload.negotiable === "string")
    payload.negotiable = payload.negotiable === "true";
  if (typeof payload.visaSponsorship === "string")
    payload.visaSponsorship = payload.visaSponsorship === "true";
  if (typeof payload.relocationAssistance === "string")
    payload.relocationAssistance = payload.relocationAssistance === "true";
  if (typeof payload.performanceBonus === "string")
    payload.performanceBonus = payload.performanceBonus === "true";
  if (typeof payload.healthInsurance === "string")
    payload.healthInsurance = payload.healthInsurance === "true";

  // Parse JSON fields
  if (typeof payload.mapCoordinates === "string")
    payload.mapCoordinates = JSON.parse(payload.mapCoordinates);
  if (typeof payload.socialMedia === "string")
    payload.socialMedia = JSON.parse(payload.socialMedia);
  if (typeof payload.jobLocation === "string")
    payload.jobLocation = JSON.parse(payload.jobLocation);

  // Parse String Arrays
  const arrayFields = [
    "tags",
    "responsibilities",
    "requirements",
    "benefits",
    "skills",
    "tools",
    "languages",
    "keywords",
  ];
  arrayFields.forEach((field) => {
    if (typeof payload[field] === "string") {
      try {
        payload[field] = JSON.parse(payload[field]);
      } catch (e) {
        payload[field] = payload[field].split(",").map((s: string) => s.trim());
      }
    }
  });

  if (payload.title) {
    payload.slug = payload.slug || slugCreate(payload.title);
  }

  const { categoryId, subCategoryId, authorId, userId: payloadUserId, ...updateData } = payload;
  
  if (categoryId) {
    updateData.category = { connect: { id: categoryId } };
  }
  if (subCategoryId) {
    updateData.subCategory = { connect: { id: subCategoryId } };
  }
  if (userId) {
    updateData.updatedById = userId ?? null;
  }

  const result = await prisma.job.update({
    where: { id },
    data: updateData,
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      subCategory: {
        select: {
          name: true,
          slug: true,
        },
      },
      user: {
        select: {
          email: true,
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
          email: true,
          profile: { select: { name: true } },
        },
      },
    },
  });
  return result;
};

const updateJobStatus = async (id: string, payload: any, userId?: string) => {
  const isExist = await prisma.job.findUnique({ where: { id } });
  if (!isExist) throw new ApiError(httpStatus.NOT_FOUND, "Job not found");

  const result = await prisma.job.update({
    where: { id },
    data: { 
      status: !isExist.status,
      updatedById: userId ?? null
    },
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
