import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { AnalyticsServices } from "./analytics.service.ts";
import type { DateRangeKey } from "../../shared/dateRange.ts";

const track = catchAsync(async (req, res) => {
  const result = await AnalyticsServices.track(req, req.body || {});
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Page view tracked",
    data: result,
  });
});

const getTrafficStats = catchAsync(async (req, res) => {
  const range = (req.query.range as DateRangeKey) || "this-week";
  const source = (req.query.source as string) || undefined;
  const result = await AnalyticsServices.trafficStats(range, source);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Traffic stats retrieved",
    data: result,
  });
});

const getTrafficTimeseries = catchAsync(async (req, res) => {
  const range = (req.query.range as DateRangeKey) || "this-week";
  const source = (req.query.source as string) || undefined;
  const result = await AnalyticsServices.trafficTimeseries(range, source);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Traffic timeseries retrieved",
    data: result,
  });
});

const getTopPages = catchAsync(async (req, res) => {
  const range = (req.query.range as DateRangeKey) || "this-week";
  const limit = Number(req.query.limit) || 10;
  const source = (req.query.source as string) || undefined;
  const result = await AnalyticsServices.topPages(range, limit, source);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Top pages retrieved",
    data: result,
  });
});

const getGeoBreakdown = catchAsync(async (req, res) => {
  const range = (req.query.range as DateRangeKey) || "this-week";
  const source = (req.query.source as string) || undefined;
  const limit = Number(req.query.limit) || 10;
  const result = await AnalyticsServices.groupBreakdown(
    "country",
    range,
    source,
    limit,
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Geo breakdown retrieved",
    data: result,
  });
});

const getDeviceBreakdown = catchAsync(async (req, res) => {
  const range = (req.query.range as DateRangeKey) || "this-week";
  const source = (req.query.source as string) || undefined;
  const result = await AnalyticsServices.groupBreakdown(
    "device",
    range,
    source,
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Device breakdown retrieved",
    data: result,
  });
});

const getBrowserBreakdown = catchAsync(async (req, res) => {
  const range = (req.query.range as DateRangeKey) || "this-week";
  const source = (req.query.source as string) || undefined;
  const result = await AnalyticsServices.groupBreakdown(
    "browser",
    range,
    source,
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Browser breakdown retrieved",
    data: result,
  });
});

const getOsBreakdown = catchAsync(async (req, res) => {
  const range = (req.query.range as DateRangeKey) || "this-week";
  const source = (req.query.source as string) || undefined;
  const result = await AnalyticsServices.groupBreakdown("os", range, source);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OS breakdown retrieved",
    data: result,
  });
});

const getReferrers = catchAsync(async (req, res) => {
  const range = (req.query.range as DateRangeKey) || "this-week";
  const source = (req.query.source as string) || undefined;
  const limit = Number(req.query.limit) || 10;
  const result = await AnalyticsServices.topReferrers(range, source, limit);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Top referrers retrieved",
    data: result,
  });
});

const getLiveVisitors = catchAsync(async (req, res) => {
  const result = await AnalyticsServices.liveVisitors();
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Live visitors retrieved",
    data: result,
  });
});

export const AnalyticsControllers = {
  track,
  getTrafficStats,
  getTrafficTimeseries,
  getTopPages,
  getGeoBreakdown,
  getDeviceBreakdown,
  getBrowserBreakdown,
  getOsBreakdown,
  getReferrers,
  getLiveVisitors,
};
