import prisma from "../../utils/prismaClient.ts";
import slugCreate from "../../utils/slugCreate.ts";
import ApiError from "../../middleware/apiError.ts";
import httpStatus from "http-status";

const createFolder = async (payload: { name: string; parentId?: string }) => {
  const slug = slugCreate(payload.name);

  // Check if slug exists in the same level (optional but good practice)
  const existingFolder = await prisma.folder.findFirst({
    where: {
      slug,
      parentId: payload.parentId || null,
    },
  });

  if (existingFolder) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Folder with this name already exists in this directory",
    );
  }

  const result = await prisma.folder.create({
    data: {
      name: payload.name,
      slug: slug,
      parentId: payload.parentId || null,
    },
  });
  return result;
};

const getAllFolders = async (parentId: string | null = null) => {
  const result = await prisma.folder.findMany({
    where: {
      parentId: parentId === "root" ? null : parentId,
    },
    include: {
      _count: {
        select: {
          children: true,
          images: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
  return result;
};

const getFolderById = async (id: string) => {
  const result = await prisma.folder.findUnique({
    where: { id },
    include: {
      children: true,
      images: true,
      parent: true,
    },
  });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Folder not found");
  return result;
};

const updateFolder = async (id: string, payload: any) => {
  const existingFolder = await prisma.folder.findUnique({ where: { id } });
  if (!existingFolder)
    throw new ApiError(httpStatus.NOT_FOUND, "Folder not found");

  const updateData: any = { ...payload };
  if (payload.name) {
    updateData.slug = slugCreate(payload.name);
  }

  const result = await prisma.folder.update({
    where: { id },
    data: updateData,
  });
  return result;
};

const deleteFolder = async (id: string) => {
  // Check if folder has children or images
  const folder = await prisma.folder.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          children: true,
          images: true,
        },
      },
    },
  });

  if (!folder) throw new ApiError(httpStatus.NOT_FOUND, "Folder not found");

  if (folder._count.children > 0 || folder._count.images > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cannot delete folder that contains items. Please delete children first.",
    );
  }

  const result = await prisma.folder.delete({
    where: { id },
  });
  return result;
};

const createImage = async (payload: {
  name: string;
  url: string;
  folderId?: string;
}) => {
  const slug = slugCreate(payload.name);
  const result = await prisma.image.create({
    data: {
      name: payload.name,
      url: payload.url,
      slug: slug,
      folderId: payload.folderId || null,
    },
  });
  return result;
};

const getImagesByFolder = async (folderId: string | null = null) => {
  const result = await prisma.image.findMany({
    where: {
      folderId: folderId === "root" ? null : folderId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

export const MediaServices = {
  createFolder,
  getAllFolders,
  getFolderById,
  deleteFolder,
  updateFolder,
  createImage,
  getImagesByFolder,
};
