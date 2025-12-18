import httpStatus from "http-status";
import ApiError from "../../middleware/apiError.ts";
import prisma from "../../utils/prismaClient.ts";


const createSubCategory = async (payload: any) => {
  const result = await prisma.subCategory.create({ data: payload });
      return result;
};

const getAllSubCategory = async () => {
  const result = await prisma.subCategory.findMany({  
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const getSubCategoryById = async (id: string) => {
  const result = await prisma.subCategory.findUnique({ where: { id } });
  if (!result)
    throw new ApiError(httpStatus.NOT_FOUND, "SubCategory not found");
  return result;
};

const updateSubCategory = async (id: string, payload: any) => {
  const result = await prisma.subCategory.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteSubCategory = async (id: string) => {
  await prisma.subCategory.delete({ where: { id } });
  return { message: "SubCategory deleted successfully" };
};

export const SubCategoryServices = {
  createSubCategory,
  getAllSubCategory,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
