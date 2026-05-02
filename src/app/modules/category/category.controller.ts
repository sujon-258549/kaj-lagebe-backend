import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { pick } from "../../../shared/pick.ts";
import { categoryFilterableFields } from "./category.const.ts";
import catchAsync from "../../shared/catchAsync.ts";
import { CategoryServices } from "./category.services.ts";
import sendResponse from "../../utils/response.ts";


const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = (req as any).user;
    const result = await CategoryServices.createCategoryIntoDB(payload, user?.id);
    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Category created successfully",
      data: result,
      meta: undefined,
    });
  }
);

const getAllCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = pick(req.query, categoryFilterableFields)
    const result = await CategoryServices.getAllCategory(query);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "All categories retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
const getCategoryByIdentifier = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await CategoryServices.getCategoryByIdentifier(id as string);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Category details retrieved successfully",
      data: result,
    });
  }
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("payload", req.body, req.params.id);
    const id = req.params.id;
    const user = (req as any).user;
    const result = await CategoryServices.updateCategory(
      id as string,
      req.body,
      user?.id
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Category updated successfully",
      data: result,
    });
  }
);

const updateCategoryStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = (req as any).user;
    const result = await CategoryServices.updateCategoryStatus(id as string, user?.id);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Category status updated successfully",
      data: result,
    });
  }
);
const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await CategoryServices.deleteCategory(id as string);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Category deleted successfully",
      data: result,
    });
  }
);
export const CategoryController = {
  createCategory,
  getAllCategory,
  getCategoryByIdentifier,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
};
