import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { ActivityLogServices } from "./activityLog.service.ts";
import { pick } from "../../../shared/pick.ts";
import { activityLogFilterableFields } from "./activityLog.constant.ts";

const getAllActivityLogs = catchAsync(async (req, res) => {
  const query = pick(req.query, activityLogFilterableFields);
  const result = await ActivityLogServices.getAllActivityLogs(query);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Activity logs retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getActivityLogById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ActivityLogServices.getActivityLogById(id as string);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Activity log retrieved successfully!",
    data: result,
  });
});

const getActivitySummary = catchAsync(async (req, res) => {
  const result = await ActivityLogServices.getActivitySummary(req.query);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Activity summary retrieved successfully!",
    data: result,
  });
});

export const ActivityLogControllers = {
  getAllActivityLogs,
  getActivityLogById,
  getActivitySummary,
};
