import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { SiteSettingService } from "./siteSetting.services.js";

const upsertSetting = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await SiteSettingService.upsertSetting(req.body, user?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Setting updated successfully",
    data: result,
  });
});

const bulkUpsertSettings = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await SiteSettingService.bulkUpsertSettings(req.body, user?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bulk settings updated successfully",
    data: result,
  });
});

const getSettingsByGroup = catchAsync(async (req: Request, res: Response) => {
  const result = await SiteSettingService.getSettingsByGroup(req.params.group as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Settings fetched successfully",
    data: result,
  });
});

const getSettingsMap = catchAsync(async (req: Request, res: Response) => {
  const result = await SiteSettingService.getSettingsMap(req.query.group as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Settings map fetched successfully",
    data: result,
  });
});

const getAllSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await SiteSettingService.getAllSettings(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All settings fetched successfully",
    data: result,
  });
});

const deleteSetting = catchAsync(async (req: Request, res: Response) => {
  const result = await SiteSettingService.deleteSetting(req.params.key as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Setting deleted successfully",
    data: result,
  });
});

const bulkDeleteSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await SiteSettingService.bulkDeleteSettings(req.body.keys);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bulk settings deleted successfully",
    data: result,
  });
});

export const SiteSettingController = {
  upsertSetting,
  bulkUpsertSettings,
  getSettingsByGroup,
  getSettingsMap,
  getAllSettings,
  deleteSetting,
  bulkDeleteSettings,
};
