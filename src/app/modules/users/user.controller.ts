import type { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.services.js";
import sendResponse from "../../utils/response.js";
import status from "http-status";
import catchAsync from "../../shared/catchAsync.js";



const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const result = await UserServices.createUserIntoDB(payload);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "User created successfully",
    data: result,
    meta: undefined,
  });
});

export const UserController = { createUser };
