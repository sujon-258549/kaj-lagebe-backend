import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import sendResponse from "../../utils/response.ts";
import { BlogCommentServices } from "./blogComment.service.ts";
import { pick } from "../../../shared/pick.ts";
import { blogCommentFilterableFields } from "./blogComment.constant.ts";

const createBlogComment = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const result = await BlogCommentServices.createBlogComment(req.body, user?.id);
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Comment posted successfully!",
    data: result,
  });
});

const getAllBlogComments = catchAsync(async (req, res) => {
  const query = pick(req.query, blogCommentFilterableFields);
  const result = await BlogCommentServices.getAllBlogComments(query);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comments retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getBlogCommentById = catchAsync(async (req, res) => {
  const result = await BlogCommentServices.getBlogCommentById(req.params.id as string);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment retrieved successfully!",
    data: result,
  });
});

const updateBlogComment = catchAsync(async (req, res) => {
  const result = await BlogCommentServices.updateBlogComment(
    req.params.id as string,
    req.body
  );
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment updated successfully!",
    data: result,
  });
});

const deleteBlogComment = catchAsync(async (req, res) => {
  const result = await BlogCommentServices.deleteBlogComment(req.params.id as string);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment deleted successfully!",
    data: result,
  });
});

const getCommentsByBlogId = catchAsync(async (req, res) => {
  const result = await BlogCommentServices.getCommentsByBlogId(req.params.blogId as string);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog comments retrieved successfully!",
    data: result.data,
    meta: result.meta,
  });
});

export const BlogCommentControllers = {
  createBlogComment,
  getAllBlogComments,
  getBlogCommentById,
  updateBlogComment,
  deleteBlogComment,
  getCommentsByBlogId,
};
