import httpStatus from "http-status";
import prisma from "../../utils/prismaClient.ts";
import ApiError from "../../middleware/apiError.ts";
import type { Prisma } from "@prisma/client";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { applicationSearchableFields } from "./application.constant.ts";
import { emitToUser } from "../../utils/socket.ts";

const createApplication = async (userId: string, payload: any) => {
  const isJobExist = await prisma.job.findUnique({
    where: { id: payload.jobId },
  });

  if (!isJobExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
  }

  const isAlreadyApplied = await prisma.application.findFirst({
    where: {
      jobId: payload.jobId,
      userId: userId,
    },
  });

  if (isAlreadyApplied) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Already applied for this job");
  }

  // Parse fields if they are strings (Booleans)
  if (typeof payload.isRead === "string")
    payload.isRead = payload.isRead === "true";
  if (typeof payload.status === "string")
    payload.status = payload.status === "true";
  if (typeof payload.isDeleted === "string")
    payload.isDeleted = payload.isDeleted === "true";

  try {
    const result = await prisma.application.create({
      data: {
        ...payload,
        userId,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
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

    // Create Notification for the Job Author (Employer)
    const notification = await prisma.notification.create({
      data: {
        userId: isJobExist.authorId,
        type: "NEW_APPLICATION",
        message: `${(result as any).user?.profile?.name || "A candidate"} applied for "${isJobExist.title}". ${payload.applyNote ? `Note: ${payload.applyNote}` : "Check the application for more details."}`,
        jobId: isJobExist.id,
        applicationId: result.id,
      },
    });

    // Real-time Notification via Socket.io
    emitToUser(isJobExist.authorId, "new-notification", notification);

    // Increment applicants count
    await prisma.job.update({
      where: { id: payload.jobId },
      data: {
        applicantsCount: {
          increment: 1,
        },
      },
    });

    return result;
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new ApiError(httpStatus.CONFLICT, "You have already applied for this job position.");
    }
    throw new ApiError(httpStatus.BAD_REQUEST, error.message || "Failed to submit job application");
  }
};

const getAllApplications = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const andCondition: Prisma.ApplicationWhereInput[] = [];
  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  if (searchTerm) {
    andCondition.push({
      OR: applicationSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const result = await prisma.application.findMany({
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
      job: {
        select: {
          id: true,
          title: true,
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

  const total = await prisma.application.count({
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

const getApplicationById = async (id: string) => {
  const result = await prisma.application.findUnique({
    where: { id },
    include: {
      job: {
        select: {
          id: true,
          title: true,
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
      comments: {
        include: {
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
      },
    },
  });
  if (!result)
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  return result;
};

const updateApplication = async (id: string, payload: any) => {
  const isExist = await prisma.application.findUnique({ where: { id } });
  if (!isExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");

  // Parse fields if they are strings (Booleans)
  if (typeof payload.isRead === "string")
    payload.isRead = payload.isRead === "true";
  if (typeof payload.status === "string")
    payload.status = payload.status === "true";
  if (typeof payload.isDeleted === "string")
    payload.isDeleted = payload.isDeleted === "true";

  try {
    const result = await prisma.application.update({
      where: { id },
      data: payload,
      include: {
        job: {
          select: {
            id: true,
            title: true,
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
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message || "Failed to update application status");
  }
};

const deleteApplication = async (id: string) => {
  const isExist = await prisma.application.findUnique({ where: { id } });
  if (!isExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");

  await prisma.application.update({
    where: { id },
    data: { isDeleted: true },
  });

  // Decrement applicants count
  await prisma.job.update({
    where: { id: isExist.jobId },
    data: {
      applicantsCount: {
        decrement: 1,
      },
    },
  });

  return { message: "Application deleted successfully" };
};

export const ApplicationServices = {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};
