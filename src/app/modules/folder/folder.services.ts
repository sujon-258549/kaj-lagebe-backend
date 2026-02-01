import type { Prisma } from "@prisma/client";
import ApiError from "../../middleware/apiError.ts";
import prisma from "../../utils/prismaClient.js";
import slugCreate from "../../utils/slugCreate.ts";
import httpStatus from "http-status";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { folderSearchableFields } from "./folder.const.ts";

const createFolder = async (payload: any) => {
  const slug = payload.slug || slugCreate(payload.name);
  const data: Prisma.FolderCreateInput = {
    ...payload,
    slug,
  };

  const result = await prisma.folder.create({
    data,
  });
  return result;
};

const getAllFolders = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...filter } = query;

  const andCondition: Prisma.FolderWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: folderSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (filter.status !== undefined) {
    filter.status = filter.status === "true";
  }

  // Handle parentId grouping logic
  const parentId = filter.parentId === "root" ? null : filter.parentId || null;
  delete filter.parentId;

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  // Get folders in this parent
  const folders = await prisma.folder.findMany({
    where: {
      AND: andCondition,
      ...filter,
      parentId: parentId,
    },
    include: {
      children: {
        select: {
          id: true,
          name: true,
          slug: true,
          parentId: true,
        },
      }, // গেট চাইল্ড ফোল্ডারস
      images: {
        select: {
          name: true,
          slug: true,
          folderId: true,
        },
      }, // গেট ফোল্ডার ইমেজ
    },
    take: limitNumber,
    skip: skip,
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
  });

  // Get images in this parent
  const images = await prisma.image.findMany({
    where: {
      folderId: parentId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.folder.count({
    where: {
      AND: andCondition,
      ...filter,
      parentId: parentId,
    },
  });

  return {
    data: {
      folders,
      images,
    },
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total: total,
    },
  };
};

const getFolderById = async (id: string) => {
  const result = await prisma.folder.findFirst({
    where: { OR: [{ id: id }, { slug: id }] },
    include: {
      children: true,
      images: true,
    },
  });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Folder not found");
  return result;
};

const updateFolder = async (id: string, payload: any) => {
  const existingFolder = await prisma.folder.findUnique({ where: { id } });
  if (!existingFolder)
    throw new ApiError(httpStatus.NOT_FOUND, "Folder not found");

  const updateData: Prisma.FolderUpdateInput = { ...payload };

  if (payload.name) {
    updateData.name = payload.name;
    updateData.slug = payload.slug || slugCreate(payload.name);
  }

  const result = await prisma.folder.update({
    where: { id },
    data: updateData,
  });
  return result;
};

const deleteFolder = async (id: string) => {
  const existingFolder = await prisma.folder.findUnique({ where: { id } });
  if (!existingFolder)
    throw new ApiError(httpStatus.NOT_FOUND, "Folder not found");

  const result = await prisma.folder.delete({ where: { id } });
  return result;
};

export const FolderServices = {
  createFolder,
  getAllFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
};
