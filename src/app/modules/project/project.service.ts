import { Prisma } from "@prisma/client";
import prisma from "../../utils/prismaClient.ts";
import slugCreate from "../../utils/slugCreate.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";

const projectSearchableFields = ["title", "category", "description", "content"];

const createProject = async (payload: any) => {
  const { slug, title, ...rest } = payload;
  const projectSlug = slug || slugCreate(title);
  
  const result = await prisma.project.create({
    data: {
      ...rest,
      title,
      slug: projectSlug,
    },
    include: { imageRel: true },
  });
  return result;
};

const getAllProjects = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const andCondition: Prisma.ProjectWhereInput[] = [];
  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  if (searchTerm) {
    andCondition.push({
      OR: projectSearchableFields.map((field: string) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Handle status if passed as string
  if (queryFilter.status !== undefined) {
    queryFilter.status = queryFilter.status === "true";
  }

  const result = await prisma.project.findMany({
    where: {
      AND: andCondition,
      ...queryFilter,
    },
    include: { imageRel: true },
    take: limitNumber,
    skip: skip,
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
  });

  const total = await prisma.project.count({
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

const getSingleProject = async (id: string) => {
  const result = await prisma.project.findUnique({
    where: { id },
    include: { imageRel: true },
  });
  return result;
};

const getProjectBySlug = async (idOrSlug: string) => {
  const result = await prisma.project.findFirst({
    where: {
      OR: [
        { slug: idOrSlug },
        { id: idOrSlug }
      ]
    },
    include: { imageRel: true },
  });
  return result;
};

const updateProject = async (id: string, payload: Partial<any>) => {
  const { slug, title, ...rest } = payload;
  
  const updateData: any = { ...rest };
  if (title) {
    updateData.title = title;
    if (!slug) {
      updateData.slug = slugCreate(title);
    }
  }
  
  if (slug) {
    updateData.slug = slug;
  }

  const result = await prisma.project.update({
    where: { id },
    data: updateData,
    include: { imageRel: true },
  });
  return result;
};

const deleteProject = async (id: string) => {
  const result = await prisma.project.delete({
    where: { id },
  });
  return result;
};

const updateStatus = async (id: string, status: boolean) => {
  const result = await prisma.project.update({
    where: { id },
    data: { status },
    include: { imageRel: true },
  });
  return result;
};

export const ProjectServices = {
  createProject,
  getAllProjects,
  getSingleProject,
  getProjectBySlug,
  updateProject,
  deleteProject,
  updateStatus,
};
