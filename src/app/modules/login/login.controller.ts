import sendResponse from "../../utils/response.ts";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.ts";
import type { NextFunction, Request, Response } from "express";
import { AuthServices } from "./login.services.ts";


const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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

export const AuthController = { loginUser };
