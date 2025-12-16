import type { NextFunction, Request, Response } from "express";

import { USER_ROLE } from "../modules/users/user.constant.ts";
import catchAsync from "../shared/catchAsync.ts";
import ApiError from "../middleware/apiError.ts";
import status from "http-status";
import { JwtHelpers } from "./jwtHelpers.ts";
import config from "../config/index.ts";
import prisma from "./prismaClient.ts";

type UserRoleValue = (typeof USER_ROLE)[keyof typeof USER_ROLE];

const auth = (...requiredRoles: UserRoleValue[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.headers?.authorization;
    if (!token) {
      throw new ApiError(status.UNAUTHORIZED, "🔍❓ Unauthorized");
    }
    const decoded = JwtHelpers.verifyToken(
      token,
      config.accessSecret as string
    );

    const { role, email } = decoded?.data;
    const { iat, exp } = decoded as { iat: number; exp: number };


    const existingUser = await prisma.user.findFirstOrThrow({
      where: {
        email,
      },
    });

    if(existingUser.isVerified === false) {
      throw new ApiError(status.UNAUTHORIZED, "🔍❓ User not verified");
    }

    if (existingUser.passwordChangeTime) {
      // Date → milliseconds → seconds → number
      const passwordChangeTimestamp: number = Math.floor(
        new Date(existingUser.passwordChangeTime).getTime() / 1000
      );

      if (Number(passwordChangeTimestamp) > Number(iat)) {
        throw new ApiError(
          status.UNAUTHORIZED,
          "User recently changed password. Please login again."
        );
      }
    }

    if (!email) {
      throw new ApiError(status.UNAUTHORIZED, "🔍❓ Unauthorized");
    }


    if (!requiredRoles.includes(role)) {
      throw new ApiError(status.FORBIDDEN, "🔍❓ Forbidden");
    }

    req.user = {
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
      mobile: existingUser.mobile,
    };

    next();
  });
};

export default auth;
