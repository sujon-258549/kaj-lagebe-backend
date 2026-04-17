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

const buildFolderTree = (folders: any[], parentId: string | null = null): any[] => {
  return folders
    .filter((folder) => folder.parentId === parentId)
    .map((folder) => ({
      ...folder,
      children: buildFolderTree(folders, folder.id),
    }));
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
  const rootParentId = filter.parentId === "root" ? null : filter.parentId || null;
  delete filter.parentId;

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  // Fetch ALL folders matching the condition to build the tree
  const allFolders = await prisma.folder.findMany({
    where: {
      AND: andCondition.length > 0 ? andCondition : undefined,
      ...filter,
    },
    include: {
      images: {
        select: {
          name: true,
          slug: true,
          folderId: true,
        },
      },
    },
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
  });

  // Build the tree
  const folderTree = buildFolderTree(allFolders, rootParentId);

  // Apply pagination to the root level of the tree
  const paginatedFolders = folderTree.slice(skip, skip + limitNumber);

  // Get images in this parent
  const images = await prisma.image.findMany({
    where: {
      folderId: rootParentId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = folderTree.length;

  return {
    data: {
      folders: paginatedFolders,
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
      images: true,
    },
  });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Folder not found");

  // Fetch all folders to build the tree for this parent
  const allFolders = await prisma.folder.findMany({
    include: { images: true }
  });
  
  const folderWithTree = {
    ...result,
    children: buildFolderTree(allFolders, result.id)
  };

  return folderWithTree;
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
