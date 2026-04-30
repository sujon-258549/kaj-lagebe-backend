import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { JobServices } from "./job.service.ts";
import { pick } from "../../../shared/pick.ts";
import { jobFilterableFields } from "./job.constant.ts";

const createJob = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await JobServices.createJob(user?.id, req.body);
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Job created successfully!",
    data: result,
  });
});

const getAllJobs = catchAsync(async (req, res) => {
  const query = pick(req.query, jobFilterableFields);
  const result = await JobServices.getAllJobs(query);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Jobs retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getJobById = catchAsync(async (req, res) => {
  const result = await JobServices.getJobById(req.params.id as string);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job retrieved successfully!",
    data: result,
  });
});

const updateJob = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await JobServices.updateJob(req.params.id as string, req.body, user?.id);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job updated successfully!",
    data: result,
  });
});

const updateJobStatus = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await JobServices.updateJobStatus(req.params.id as string, req.body, user?.id);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job status updated successfully!",
    data: result,
  });
});

const deleteJob = catchAsync(async (req, res) => {
  const result = await JobServices.deleteJob(req.params.id as string);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job deleted successfully!",
    data: result,
  });
});

export const JobControllers = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  updateJobStatus,
  deleteJob,
};
