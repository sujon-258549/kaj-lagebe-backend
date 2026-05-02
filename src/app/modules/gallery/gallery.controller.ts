import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { GalleryServices } from "./gallery.service.ts";
import { pick } from "../../../shared/pick.ts";

const galleryFilterableFields = ["searchTerm", "page", "limit", "sortBy", "sortOrder", "status"];

const createGallery = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await GalleryServices.createGallery(req.body, user?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gallery item created successfully!",
    data: result,
  });
});

const getAllGalleries = catchAsync(async (req, res) => {
  const query = pick(req.query, galleryFilterableFields);
  const result = await GalleryServices.getAllGalleries(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All galleries retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleGallery = catchAsync(async (req, res) => {
  const result = await GalleryServices.getSingleGallery(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gallery item details retrieved successfully!",
    data: result,
  });
});

const updateGallery = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await GalleryServices.updateGallery(req.params.id as string, req.body, user?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gallery item updated successfully!",
    data: result,
  });
});

const deleteGallery = catchAsync(async (req, res) => {
  const result = await GalleryServices.deleteGallery(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gallery item deleted successfully!",
    data: result,
  });
});

const updateStatus = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await GalleryServices.updateStatus(req.params.id as string, req.body.status, user?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Gallery status updated successfully!",
    data: result,
  });
});

export const GalleryControllers = {
  createGallery,
  getAllGalleries,
  getSingleGallery,
  updateGallery,
  deleteGallery,
  updateStatus,
};
