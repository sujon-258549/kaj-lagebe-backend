import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { setConfig, getConfig } from "../../utils/configProvider.js";
import sendResponse from "../../utils/response.js";
import status from "http-status";
import prisma from "../../utils/prismaClient.js";

const updateConfig = catchAsync(async (req: Request, res: Response) => {
  const { key, value, description } = req.body;
  const result = await setConfig(key, value, description);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Configuration updated successfully",
    data: result,
  });
});

const getAllConfigs = catchAsync(async (req: Request, res: Response) => {
  const result = await prisma.systemConfig.findMany();

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Configurations fetched successfully",
    data: result,
  });
});

export const SystemConfigController = {
  updateConfig,
  getAllConfigs,
};
