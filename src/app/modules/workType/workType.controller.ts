import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { pick } from "../../../shared/pick.ts";
import { workTypeFilterableFields } from "./workType.const.ts";
import catchAsync from "../../shared/catchAsync.ts";
import { WorkTypeServices } from "./workType.services.ts";
import sendResponse from "../../utils/response.ts";

const createWorkType = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await WorkTypeServices.createWorkType(req.body, userId);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "WorkType created successfully",
    data: result,
  });
});

const getAllWorkType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = pick(req.query, workTypeFilterableFields);
    const result = await WorkTypeServices.getAllWorkType(query);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "WorkType retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getWorkTypeById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await WorkTypeServices.getWorkTypeById(id as string);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "WorkType retrieved successfully",
      data: result,
    });
  }
);

const updateWorkType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = (req as any).user.id;
  const result = await WorkTypeServices.updateWorkType(id as string, req.body, userId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "WorkType updated successfully",
    data: result,
  });
});

const deleteWorkType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await WorkTypeServices.deleteWorkType(id as string);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "WorkType deleted successfully",
      data: result,
    });
  }
);

const updateWorkTypeStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = (req as any).user.id;
  const result = await WorkTypeServices.updateWorkTypeStatus(id as string, userId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "WorkType status updated successfully",
    data: result,
  });
});

export const WorkTypeController = {
  createWorkType,
  getAllWorkType,
  getWorkTypeById,
  updateWorkType,
  deleteWorkType,
  updateWorkTypeStatus,
};
