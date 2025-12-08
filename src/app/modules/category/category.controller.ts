import type { NextFunction, Request, Response } from "express";
import { CategoryServices } from "./category.services.js";
import sendResponse from "../../utils/response.js";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.js";

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const result = await CategoryServices.createCategoryIntoDB(payload);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Category created successfully",
    data: result,
    meta: undefined,
  });
});

export const CategoryController = { createCategory };
