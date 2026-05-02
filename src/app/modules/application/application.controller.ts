import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { ApplicationServices } from "./application.service.ts";
import { pick } from "../../../shared/pick.ts";
import { applicationFilterableFields } from "./application.constant.ts";

const createApplication = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await ApplicationServices.createApplication(user?.id, req.body);
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Application submitted successfully!",
    data: result,
  });
});

const getAllApplications = catchAsync(async (req, res) => {
  const query = pick(req.query, applicationFilterableFields);
  const result = await ApplicationServices.getAllApplications(query);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All applications retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getApplicationById = catchAsync(async (req, res) => {
  const result = await ApplicationServices.getApplicationById(
    req.params.id as string,
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Application details retrieved successfully!",
    data: result,
  });
});

const updateApplication = catchAsync(async (req, res) => {
  const result = await ApplicationServices.updateApplication(
    req.params.id as string,
    req.body,
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Application updated successfully!",
    data: result,
  });
});

const deleteApplication = catchAsync(async (req, res) => {
  const result = await ApplicationServices.deleteApplication(
    req.params.id as string,
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Application deleted successfully!",
    data: result,
  });
});

export const ApplicationControllers = {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};
