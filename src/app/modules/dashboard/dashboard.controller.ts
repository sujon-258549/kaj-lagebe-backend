import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { DashboardServices } from "./dashboard.service.ts";

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

export const DashboardControllers = {
  getOverview,
};
