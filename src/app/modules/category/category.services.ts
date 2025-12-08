import prisma from "../../utils/prismaClient.js";

const createCategoryIntoDB = async (payload: any) => {
  const result = await prisma.category.create({
    data: {
      name: payload.name,
      icon: payload.icon,
      description: payload.description,
    },
  });
  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
};
