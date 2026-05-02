import { Prisma } from "@prisma/client";
import prisma from "../../utils/prismaClient.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";

const gallerySearchableFields = ["title", "description", "number"];

const galleryInclude = {
  imageRel: true,
  createdBy: {
    select: {
      id: true,
      email: true,
      profile: {
        select: {
          name: true,
        },
      },
    },
  },
  updatedBy: {
    select: {
      id: true,
      email: true,
      profile: {
        select: {
          name: true,
        },
      },
    },
  },
};

const createGallery = async (payload: any, userId?: string) => {
  if (userId) {
    payload.createdById = userId;
    payload.updatedById = userId;
  }
  try {
    const result = await prisma.gallery.create({
      data: payload,
      include: galleryInclude,
    });
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create gallery item");
  }
};

const getAllGalleries = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const andCondition: Prisma.GalleryWhereInput[] = [];
  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  if (searchTerm) {
    andCondition.push({
      OR: gallerySearchableFields.map((field: string) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (queryFilter.status !== undefined) {
    queryFilter.status = queryFilter.status === "true";
  }

  const result = await prisma.gallery.findMany({
    where: {
      AND: andCondition,
      ...queryFilter,
    },
    include: galleryInclude,
    take: limitNumber,
    skip: skip,
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
  });

  const total = await prisma.gallery.count({
    where: {
      AND: andCondition,
      ...queryFilter,
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

const getSingleGallery = async (id: string) => {
  const result = await prisma.gallery.findUnique({
    where: { id },
    include: galleryInclude,
  });
  return result;
};

const updateGallery = async (id: string, payload: Partial<any>, userId?: string) => {
  if (userId) {
    payload.updatedById = userId;
  }
  try {
    const result = await prisma.gallery.update({
      where: { id },
      data: payload,
      include: galleryInclude,
    });
    return result;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update gallery item");
  }
};

const deleteGallery = async (id: string) => {
  const result = await prisma.gallery.delete({
    where: { id },
  });
  return result;
};

const updateStatus = async (id: string, status: boolean, userId?: string) => {
  const updateData: any = { status };
  if (userId) {
    updateData.updatedById = userId;
  }
  const result = await prisma.gallery.update({
    where: { id },
    data: updateData,
    include: galleryInclude,
  });
  return result;
};

export const GalleryServices = {
  createGallery,
  getAllGalleries,
  getSingleGallery,
  updateGallery,
  deleteGallery,
  updateStatus,
};
