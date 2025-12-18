import httpStatus from "http-status";
import { SubCategoryServices } from "./subCategory.service.ts";
import sendResponse from "../../utils/response.ts";
import catchAsync from "../../shared/catchAsync.ts";

const createSubCategory = catchAsync(async (req, res) => {
  const result = await SubCategoryServices.createSubCategory(req.body);
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "SubCategory created successfully!",
    data: result,
  });
});

const getAllSubCategory = catchAsync(async (req, res) => {
  const result = await SubCategoryServices.getAllSubCategory();
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All SubCategorys retrieved successfully!",
    data: result,
  });
});

const getSubCategoryById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await SubCategoryServices.getSubCategoryById(id as string);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "SubCategory retrieved successfully!",
    data: result,
  });
});

const updateSubCategory = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await SubCategoryServices.updateSubCategory(
    id as string,
    req.body
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "SubCategory updated successfully!",
    data: result,
  });
});

const deleteSubCategory = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await SubCategoryServices.deleteSubCategory(id as string);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "SubCategory deleted successfully!",
    data: result,
  });
});

export const SubCategoryControllers = {
  createSubCategory,
  getAllSubCategory,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
