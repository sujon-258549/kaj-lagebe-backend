import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { TenantServices } from "./tenant.service.ts";
import { pick } from "../../../shared/pick.ts";

const createTenant = catchAsync(async (req: Request, res: Response) => {
  const result = await TenantServices.createTenant(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Tenant created successfully",
    data: result,
  });
});

const getAllTenants = catchAsync(async (req: Request, res: Response) => {
  const query = pick(req.query, ["searchTerm", "page", "limit"]);
  const result = await TenantServices.getAllTenants(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tenants retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getTenantById = catchAsync(async (req: Request, res: Response) => {
  const result = await TenantServices.getTenantById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tenant details retrieved successfully",
    data: result,
  });
});

const updateTenant = catchAsync(async (req: Request, res: Response) => {
  const result = await TenantServices.updateTenant(req.params.id as string, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tenant updated successfully",
    data: result,
  });
});

const deleteTenant = catchAsync(async (req: Request, res: Response) => {
  const result = await TenantServices.deleteTenant(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tenant deleted successfully",
    data: result,
  });
});

export const TenantController = {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
};
