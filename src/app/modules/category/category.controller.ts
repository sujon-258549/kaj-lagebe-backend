import type { NextFunction, Request, Response } from "express";
import { CategoryServices } from "./category.services.js";
import sendResponse from "../../utils/response.js";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.js";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await CategoryServices.createCategoryIntoDB(payload);
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
    const result = await CategoryServices.getAllCategory();
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Category retrieved successfully",
      data: result,
    });
  }
);
const getCategoryById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await CategoryServices.getCategoryById(id as string);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Category retrieved successfully",
      data: result,
    });
  }
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await CategoryServices.updateCategory(
      id as string,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Category updated successfully",
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
  getCategoryById,
  updateCategory,
  deleteCategory,
};
