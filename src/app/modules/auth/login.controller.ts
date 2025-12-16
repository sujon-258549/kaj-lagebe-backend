import sendResponse from "../../utils/response.ts";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import type { NextFunction, Request, Response } from "express";
import { AuthServices } from "./login.services.ts";
import ApiError from "../../middleware/apiError.ts";


const loginUser = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await AuthServices.loginUser(payload);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "User logged in successfully",
      data: result,
    });
  }
);
const createRefreshToken = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body.refreshToken;
    if (!payload) {
      throw new ApiError(status.BAD_REQUEST, "Refresh token is not provided");
    }
    const result = await AuthServices.refreshToken(payload);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Refresh token generated successfully",
      data: result,
    });
  }
);

export const AuthController = { loginUser, createRefreshToken };
