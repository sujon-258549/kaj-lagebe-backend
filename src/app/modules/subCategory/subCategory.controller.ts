import httpStatus from "http-status";
import { SubCategoryServices } from "./subCategory.service.ts";
import sendResponse from "../../utils/response.ts";
import catchAsync from "../../shared/catchAsync.ts";
import { pick } from "../../../shared/pick.ts";
import { subCategoryFilterableFields } from "./subCategory.constant.ts";

const createSubCategory = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await SubCategoryServices.createSubCategory(req.body, user?.id);
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "SubCategory created successfully!",
    data: result,
  });
});

const getAllSubCategory = catchAsync(async (req, res) => {

  const queryOptions = pick(req.query, subCategoryFilterableFields);

  const result = await SubCategoryServices.getAllSubCategory(queryOptions);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All sub-categories retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getSubCategoryByIdentifier = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await SubCategoryServices.getSubCategoryByIdentifier(id as string);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sub-category details retrieved successfully!",
    data: result,
  });
});



const updateSubCategory = catchAsync(async (req, res) => {
  const id = req.params.id;
  const user = (req as any).user;
  const result = await SubCategoryServices.updateSubCategory(
    id as string,
    req.body,
    user?.id
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

const updateSubCategoryStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const user = (req as any).user;
  const result = await SubCategoryServices.updateSubCategoryStatus(
    id as string,
    user?.id
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "SubCategory status updated successfully!",
    data: result,
  });
});

export const SubCategoryControllers = {
  createSubCategory,
  getAllSubCategory,
  getSubCategoryByIdentifier,
  updateSubCategory,
  deleteSubCategory,
  updateSubCategoryStatus,
};
