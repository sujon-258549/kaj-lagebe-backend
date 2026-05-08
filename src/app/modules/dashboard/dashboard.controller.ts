import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { DashboardServices } from "./dashboard.service.ts";
import type { DateRangeKey } from "../../shared/dateRange.ts";

const ok = (message: string) => (data: any) => ({ message, data });

const send = (res: any, message: string, data: any) =>
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message,
    data,
  });

const getRange = (req: any): DateRangeKey =>
  (req.query.range as DateRangeKey) || "this-week";

const getOverview = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await DashboardServices.getOverview(user.id, user.role);
  send(res, "Dashboard overview retrieved successfully!", result);
});

const getAdminKpis = catchAsync(async (req, res) => {
  const result = await DashboardServices.adminKpis(getRange(req));
  send(res, "Admin KPIs retrieved", result);
});

const getGrowthTimeseries = catchAsync(async (req, res) => {
  const result = await DashboardServices.growthTimeseries(getRange(req));
  send(res, "Growth timeseries retrieved", result);
});

const getConversionFunnel = catchAsync(async (req, res) => {
  const result = await DashboardServices.conversionFunnel(getRange(req));
  send(res, "Conversion funnel retrieved", result);
});

const getRecentSignals = catchAsync(async (_req, res) => {
  const result = await DashboardServices.recentSignals();
  send(res, "Recent signals retrieved", result);
});

const getOnlineUsers = catchAsync(async (_req, res) => {
  const result = await DashboardServices.onlineUsers();
  send(res, "Online users retrieved", result);
});

const getLiveActivityFeed = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 15;
  const result = await DashboardServices.liveActivityFeed(limit);
  send(res, "Live activity feed retrieved", result);
});

const getJobsByCategory = catchAsync(async (req, res) => {
  const result = await DashboardServices.jobsByCategory(getRange(req));
  send(res, "Jobs by category retrieved", result);
});

const getApplicationStatus = catchAsync(async (req, res) => {
  const result = await DashboardServices.applicationStatusBreakdown(
    getRange(req),
  );
  send(res, "Application status breakdown retrieved", result);
});

const getHiringRate = catchAsync(async (req, res) => {
  const result = await DashboardServices.hiringRate(getRange(req));
  send(res, "Hiring rate retrieved", result);
});

const getRecruitmentFunnel = catchAsync(async (req, res) => {
  const result = await DashboardServices.recruitmentFunnel(getRange(req));
  send(res, "Recruitment funnel retrieved", result);
});

const getSalaryBenchmarks = catchAsync(async (_req, res) => {
  const result = await DashboardServices.salaryBenchmarks();
  send(res, "Salary benchmarks retrieved", result);
});

const getRecentJobs = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const result = await DashboardServices.recentJobs(getRange(req), limit);
  send(res, "Recent jobs retrieved", result);
});

const getTopCandidates = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const result = await DashboardServices.topCandidates(getRange(req), limit);
  send(res, "Top candidates retrieved", result);
});

const getJobsWithApplicants = catchAsync(async (req, res) => {
  const limit = Number(req.query.limit) || 6;
  const result = await DashboardServices.jobsWithApplicants(
    getRange(req),
    limit,
  );
  send(res, "Jobs with applicants retrieved", result);
});

export const DashboardControllers = {
  getOverview,
  getAdminKpis,
  getGrowthTimeseries,
  getConversionFunnel,
  getRecentSignals,
  getOnlineUsers,
  getLiveActivityFeed,
  getJobsByCategory,
  getApplicationStatus,
  getHiringRate,
  getRecruitmentFunnel,
  getSalaryBenchmarks,
  getRecentJobs,
  getTopCandidates,
  getJobsWithApplicants,
};

export { ok };
