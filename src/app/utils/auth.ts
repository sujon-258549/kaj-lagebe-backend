import type { NextFunction, Request, Response } from "express";

import { USER_ROLE } from "../modules/users/user.constant.ts";
import catchAsync from "../shared/catchAsync.ts";

type UserRoleValue = typeof USER_ROLE[keyof typeof USER_ROLE];

const auth = (...requiredRoles: UserRoleValue[]) => {

    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        console.log("requiredRoles--------------------",requiredRoles);
        next();
    })

};

export default auth;
