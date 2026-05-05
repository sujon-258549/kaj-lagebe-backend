import type { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.services.js";
import sendResponse from "../../utils/response.js";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.js";
import { pick } from "../../../shared/pick.ts";
import { userFilterableFields } from "./user.constant.ts";
import config from "../../config/index.js";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = {
      ...req.body,
      user: {
        ...req.body.user,
        createdById: req.user?.id,
      },
    };
    const result = await UserServices.createUserIntoDB(payload);

    // Set refreshToken in cookie for automatic login
    if (result && result.refreshToken) {
      res.cookie("refreshToken", result.refreshToken, {
        secure: config.nodeEnv === "production",
        httpOnly: true,
        sameSite: config.nodeEnv === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 365,
        ...(config.cookieDomain ? { domain: config.cookieDomain } : {}),
      });
    }

    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "User registered and logged in successfully",
      data: result,
      meta: undefined,
    });
  },
);

const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await UserServices.getUserById(id as string);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "User details retrieved successfully",
      data: result,
    });
  },
);

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const query = pick(req.query, userFilterableFields);
  const result = await UserServices.getAllUsers(query);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "All users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await UserServices.updateUser(id as string, payload);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User updated successfully",
    data: result,
  });
});

const getMyData = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getMyData(req.user?.id as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "My data fetched successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await UserServices.changePassword(
    payload,
    req.user?.id as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Password changed successfully",
    data: result,
  });
});

const varifyOtp = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await UserServices.varifyOtp(payload.email, payload.otp);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "OTP verified successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.deleteUser(id as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User deleted successfully",
    data: result,
  });
});

const softDeleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.softDeleteUser(id as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User soft deleted successfully",
    data: result,
  });
});

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.blockUser(id as string);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User blocked successfully",
    data: result,
  });
});

const getOnlineUsersCount = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getOnlineUsersCount();
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Online users count fetched successfully",
    data: result,
  });
});

export const UserController = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  getMyData,
  changePassword,
  varifyOtp,
  deleteUser,
  softDeleteUser,
  blockUser,
  getOnlineUsersCount,
};
