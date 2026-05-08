import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { DashboardServices } from "./dashboard.service.ts";
import type { DateRangeKey } from "../../shared/dateRange.ts";

const getOverview = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await DashboardServices.getOverview(user.id, user.role);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard overview retrieved successfully!",
    data: result,
  });
});

const getAdminKpis = catchAsync(async (req, res) => {
  const range = (req.query.range as DateRangeKey) || "this-week";
  const result = await DashboardServices.adminKpis(range);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin KPIs retrieved",
    data: result,
  });
});

const getGrowthTimeseries = catchAsync(async (req, res) => {
  const range = (req.query.range as DateRangeKey) || "this-week";
  const result = await DashboardServices.growthTimeseries(range);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Growth timeseries retrieved",
    data: result,
  });
});

const getConversionFunnel = catchAsync(async (req, res) => {
  const range = (req.query.range as DateRangeKey) || "this-week";
  const result = await DashboardServices.conversionFunnel(range);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Conversion funnel retrieved",
    data: result,
  });
});

const getRecentSignals = catchAsync(async (_req, res) => {
  const result = await DashboardServices.recentSignals();
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recent signals retrieved",
    data: result,
  });
});

const getOnlineUsers = catchAsync(async (_req, res) => {
  const result = await DashboardServices.onlineUsers();
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Online users retrieved",
    data: result,
  });
});

const getLiveActivityFeed = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 15;
  const result = await DashboardServices.liveActivityFeed(limit);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Live activity feed retrieved",
    data: result,
  });
});

export const DashboardControllers = {
  getOverview,
  getAdminKpis,
  getGrowthTimeseries,
  getConversionFunnel,
  getRecentSignals,
  getOnlineUsers,
  getLiveActivityFeed,
};
