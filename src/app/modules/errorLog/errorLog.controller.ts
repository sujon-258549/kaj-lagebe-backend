import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { ErrorLogServices } from "./errorLog.service.ts";
import { pick } from "../../../shared/pick.ts";
import { errorLogFilterableFields } from "./errorLog.constant.ts";

const getAllErrorLogs = catchAsync(async (req, res) => {
  const query = pick(req.query, errorLogFilterableFields);
  const result = await ErrorLogServices.getAllErrorLogs(query);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Error logs retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getErrorLogById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ErrorLogServices.getErrorLogById(id as string);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Error log retrieved successfully!",
    data: result,
  });
});

const markResolved = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { resolved } = req.body ?? {};
  const result = await ErrorLogServices.markResolved(
    id as string,
    resolved !== false,
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Error log status updated!",
    data: result,
  });
});

const deleteErrorLog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ErrorLogServices.deleteErrorLog(id as string);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Error log deleted!",
    data: result,
  });
});

const getErrorSummary = catchAsync(async (req, res) => {
  const result = await ErrorLogServices.getErrorSummary(req.query);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Error summary retrieved successfully!",
    data: result,
  });
});

export const ErrorLogControllers = {
  getAllErrorLogs,
  getErrorLogById,
  markResolved,
  deleteErrorLog,
  getErrorSummary,
};
