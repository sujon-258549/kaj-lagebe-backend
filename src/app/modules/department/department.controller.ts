import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { pick } from "../../../shared/pick.ts";
import { departmentFilterableFields } from "./department.const.ts";
import catchAsync from "../../shared/catchAsync.ts";
import { DepartmentServices } from "./department.services.ts";
import sendResponse from "../../utils/response.ts";

const createDepartment = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await DepartmentServices.createDepartment(req.body, user?.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Department created successfully",
    data: result,
  });
});

const getAllDepartment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = pick(req.query, departmentFilterableFields);
    const result = await DepartmentServices.getAllDepartment(query);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "All departments retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getDepartmentById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await DepartmentServices.getDepartmentById(id as string);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Department details retrieved successfully",
      data: result,
    });
  }
);

const updateDepartment = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await DepartmentServices.updateDepartment(
    req.params.id as string,
    req.body,
    user?.id as string
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Department updated successfully",
    data: result,
  });
});

const deleteDepartment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await DepartmentServices.deleteDepartment(id as string);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Department deleted successfully",
      data: result,
    });
  }
);

const updateDepartmentStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = (req as any).user;
    const result = await DepartmentServices.updateDepartmentStatus(
      id as string,
      user?.id as string
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Department status updated successfully",
      data: result,
    });
  }
);

export const DepartmentController = {
  createDepartment,
  getAllDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  updateDepartmentStatus,
};
