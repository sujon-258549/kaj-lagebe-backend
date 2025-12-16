import ApiError from "../../middleware/apiError.ts";
import status from "http-status";
import prisma from "../../utils/prismaClient.ts";
import { JwtHelpers } from "../../utils/jwtHelpers.ts";
import config from "../../config/index.ts";

const loginUser = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found");
  }

  const payloadData = {
    id: user.id,
    email: user.email,
    role: user.role,
    mobile: user.mobile,
    isBlocked: user.isBlocked,
    isDeleted: user.isDeleted,
    isVerified: user.isVerified,
    isActive: user.isActive,
    passwordChanged: user.passwordChanged,
    passwordChangeTime: user.passwordChangeTime,
  };

  const accessToken = JwtHelpers.generateToken(
    payloadData,
    config.accessSecret,
    config.accessExpire
  );
  const refreshToken = JwtHelpers.generateToken(
    payloadData,
    config.refreshSecret,
    config.refreshExpire
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  const decoded = JwtHelpers.verifyToken(token, config.refreshSecret as string);

  const { email } = decoded?.data;
  console.log(email);

  //check if user is exist
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: email },
  });

  console.log(user);

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ User not Found");
  }

  const payloadData = {
    id: user.id,
    email: user.email,
    role: user.role,
    mobile: user.mobile,
    isBlocked: user.isBlocked,
    isDeleted: user.isDeleted,
    isVerified: user.isVerified,
    isActive: user.isActive,
    passwordChanged: user.passwordChanged,
    passwordChangeTime: user.passwordChangeTime,
  };

  const accessToken = JwtHelpers.generateToken(
    payloadData,
    config.accessSecret,
    config.accessExpire
  );
  return {
    accessToken,
  };
};




export const AuthServices = { loginUser, refreshToken };
