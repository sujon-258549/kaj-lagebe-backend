import httpStatus from "http-status";
import prisma from "../../utils/prismaClient.ts";
import ApiError from "../../middleware/apiError.ts";
import type { Prisma } from "@prisma/client";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { applicationSearchableFields } from "./application.constant.ts";
import { emitToUser } from "../../utils/socket.ts";
import { AgentService } from "../agent/agent.services.ts";
import {
  applicationDecisionTemplate,
  sendEmail,
} from "../../utils/sendEmail.ts";

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

const generateDecisionMessage = async (
  decision: "ACCEPTED" | "REJECTED",
  applicantName: string,
  jobTitle: string,
  reason?: string,
): Promise<string> => {
  const tone =
    decision === "ACCEPTED"
      ? "warm, congratulatory, encouraging"
      : "kind, respectful, encouraging despite the rejection";

  const prompt = `You are writing a single short paragraph (3-4 sentences) for an email to a job applicant.
Decision: ${decision === "ACCEPTED" ? "their application has been ACCEPTED" : "their application has been REJECTED"}.
Applicant name: ${applicantName || "the applicant"}
Job title: ${jobTitle}
${reason ? `Employer's note: ${reason}` : ""}
Tone: ${tone}.
Do NOT include a salutation (no "Dear ..."), do NOT include a sign-off (no "Best regards"), do NOT include any subject line.
Just return the paragraph text, plain English, no markdown, no quotes.`;

  try {
    const result = await AgentService.generateResponse(prompt);
    if (result && !result.startsWith("Service Error")) {
      return result.trim().replace(/^"|"$/g, "");
    }
  } catch (err) {
    console.error("AI message generation failed:", err);
  }

  // Fallback static message if AI fails
  if (decision === "ACCEPTED") {
    return `We are pleased to inform you that your application for "${jobTitle}" has been accepted. Thank you for your interest and effort — we look forward to the next steps and will be in touch shortly.`;
  }
  return `Thank you for taking the time to apply for "${jobTitle}". After careful consideration we have decided to move forward with other candidates at this time. We genuinely appreciate your interest and wish you the best in your job search.`;
};

const updateApplication = async (id: string, payload: any) => {
  const isExist = await prisma.application.findUnique({
    where: { id },
    include: {
      job: { select: { id: true, title: true, authorId: true } },
      user: {
        select: {
          id: true,
          email: true,
          profile: { select: { name: true } },
        },
      },
    },
  });
  if (!isExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");

  // Parse fields if they are strings (Booleans)
  if (typeof payload.isRead === "string")
    payload.isRead = payload.isRead === "true";
  if (typeof payload.status === "string")
    payload.status = payload.status === "true";
  if (typeof payload.isDeleted === "string")
    payload.isDeleted = payload.isDeleted === "true";

  // Lock decided applications (cannot be changed once ACCEPTED or REJECTED)
  const currentStatus = (isExist.applyStatus || "PENDING").toUpperCase();
  const nextStatus = payload.applyStatus
    ? String(payload.applyStatus).toUpperCase()
    : currentStatus;

  if (
    (currentStatus === "ACCEPTED" || currentStatus === "REJECTED") &&
    nextStatus !== currentStatus &&
    payload.applyStatus !== undefined
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This application has already been decided and cannot be changed.",
    );
  }

  if (payload.applyStatus) payload.applyStatus = nextStatus;

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

    // Side effects: only when transitioning to a final decision
    const isDecision =
      (nextStatus === "ACCEPTED" || nextStatus === "REJECTED") &&
      nextStatus !== currentStatus;

    if (isDecision) {
      const applicantName = isExist.user?.profile?.name || "there";
      const applicantEmail = isExist.user?.email;
      const applicantUserId = isExist.user?.id;
      const jobTitle = isExist.job?.title || "the job";
      const reason: string | undefined = payload.applyComment || undefined;

      // 1) AI message + email (fail-soft)
      try {
        const aiMessage = await generateDecisionMessage(
          nextStatus,
          applicantName,
          jobTitle,
          reason,
        );

        if (applicantEmail) {
          const html = applicationDecisionTemplate({
            name: applicantName,
            jobTitle,
            decision: nextStatus,
            aiMessage,
            reason,
          });
          const subject =
            nextStatus === "ACCEPTED"
              ? `🎉 Your application for "${jobTitle}" has been accepted`
              : `Update on your application for "${jobTitle}"`;
          await sendEmail(applicantEmail, html, subject).catch((err) => {
            console.error("Failed to send decision email:", err);
          });
        }
      } catch (err) {
        console.error("Decision email pipeline failed:", err);
      }

      // 2) In-app notification + socket (fail-soft)
      try {
        if (applicantUserId) {
          const notification = await prisma.notification.create({
            data: {
              userId: applicantUserId,
              type:
                nextStatus === "ACCEPTED"
                  ? "APPLICATION_ACCEPTED"
                  : "APPLICATION_REJECTED",
              message:
                nextStatus === "ACCEPTED"
                  ? `Your application for "${jobTitle}" has been accepted.`
                  : `Your application for "${jobTitle}" was not selected this time.`,
              jobId: isExist.job?.id,
              applicationId: id,
            },
          });
          emitToUser(applicantUserId, "new-notification", notification);
        }
      } catch (err) {
        console.error("Failed to create decision notification:", err);
      }
    }

    return result;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
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
