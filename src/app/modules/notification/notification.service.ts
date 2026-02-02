import prisma from "../../utils/prismaClient.ts";
import type { Prisma } from "@prisma/client";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { notificationSearchableFields } from "./notification.constant.ts";
import httpStatus from "http-status";
import ApiError from "../../middleware/apiError.ts";

import { getIO } from "../../utils/socket.js";

const createNotification = async (payload: any) => {
  const result = await prisma.notification.create({
    data: payload,
  });

  // Send real-time notification using Socket.io
  try {
    const io = getIO();
    if (payload.userId) {
      io.to(payload.userId).emit("new-notification", result);
    }
  } catch (error) {
    console.error("Socket emit error:", error);
  }

  return result;
};

const getAllNotifications = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const andCondition: Prisma.NotificationWhereInput[] = [];
  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  if (searchTerm) {
    andCondition.push({
      OR: notificationSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (queryFilter.isRead !== undefined) {
    queryFilter.isRead = queryFilter.isRead === "true";
  }

  const result = await prisma.notification.findMany({
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
  });

  const total = await prisma.notification.count({
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

const getNotificationById = async (id: string) => {
  const result = await prisma.notification.findUnique({
    where: { id },
  });
  if (!result)
    throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");
  return result;
};

const updateNotification = async (id: string, payload: any) => {
  const isExist = await prisma.notification.findUnique({ where: { id } });
  if (!isExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");

  const result = await prisma.notification.update({
    where: { id },
    data: payload,
  });

  // Real-time update for a single notification
  try {
    const io = getIO();
    io.to(result.userId).emit("notification-updated", result);
  } catch (error) {
    console.error("Socket emit error:", error);
  }

  return result;
};

const deleteNotification = async (id: string) => {
  const isExist = await prisma.notification.findUnique({ where: { id } });
  if (!isExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");

  await prisma.notification.update({
    where: { id },
    data: { isDeleted: true },
  });

  return { message: "Notification deleted successfully" };
};

const markAsRead = async (userId: string) => {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  // Real-time update to sync all tabs/devices for the user
  try {
    const io = getIO();
    io.to(userId).emit("notifications-read-sync", { userId, isRead: true });
  } catch (error) {
    console.error("Socket emit error:", error);
  }

  return { message: "All notifications marked as read" };
};

export const NotificationServices = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  markAsRead,
};
