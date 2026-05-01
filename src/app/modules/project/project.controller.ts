import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { ProjectServices } from "./project.service.ts";
import { pick } from "../../../shared/pick.ts";

const projectFilterableFields = ["searchTerm", "page", "limit", "sortBy", "sortOrder", "status", "category"];

const createProject = catchAsync(async (req, res) => {
  const result = await ProjectServices.createProject(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project created successfully!",
    data: result,
  });
});

const getAllProjects = catchAsync(async (req, res) => {
  const query = pick(req.query, projectFilterableFields);
  const result = await ProjectServices.getAllProjects(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Projects retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleProject = catchAsync(async (req, res) => {
  const result = await ProjectServices.getSingleProject(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project retrieved successfully!",
    data: result,
  });
});

const getProjectBySlug = catchAsync(async (req, res) => {
  const result = await ProjectServices.getProjectBySlug(req.params.slug as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project retrieved successfully!",
    data: result,
  });
});

const updateProject = catchAsync(async (req, res) => {
  const result = await ProjectServices.updateProject(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project updated successfully!",
    data: result,
  });
});

const deleteProject = catchAsync(async (req, res) => {
  const result = await ProjectServices.deleteProject(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project deleted successfully!",
    data: result,
  });
});

const updateStatus = catchAsync(async (req, res) => {
  const result = await ProjectServices.updateStatus(req.params.id as string, req.body.status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Project status updated successfully!",
    data: result,
  });
});

export const ProjectControllers = {
  createProject,
  getAllProjects,
  getSingleProject,
  getProjectBySlug,
  updateProject,
  deleteProject,
  updateStatus,
};
