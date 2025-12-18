import prisma from "../../utils/prismaClient.js";
import slugCreate from "../../utils/slugCreate.ts";

const createCategoryIntoDB = async (payload: any) => {

  const slug = slugCreate(payload.name);

  const result = await prisma.category.create({
    data: {
      name: payload.name,
      icon: payload.icon,
      slug: slug,
      description: payload.description,
    },
  });
  return result;
};

const getAllCategory = async () => {
  const result = await prisma.category.findMany();
  return result;
};

const getCategoryById = async (id: string) => {
  const result = await prisma.category.findUnique({ where: { id } });
  return result;
  };

const updateCategory = async (id: string, payload: any) => {
  const result = await prisma.category.update({ where: { id }, data: payload });
  return result;
};

const deleteCategory = async (id: string) => {
  const result = await prisma.category.delete({ where: { id } });
  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
