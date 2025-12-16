import ApiError from "../../middleware/apiError.ts";
import status from "http-status";
import prisma from "../../utils/prismaClient.ts";
import { JwtHelpers } from "../../utils/jwtHelpers.ts";
import config from "../../config/index.ts";
import argon2 from "argon2";
import { sendEmail, otpEmailTemplate } from "../../utils/sendEmail.ts";

const loginUser = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) {
    throw new ApiError(status.NOT_FOUND, "User not found");
  }

  const isPasswordCorrect = await argon2.verify(
    user.password,
    payload.password
  );

  if (!isPasswordCorrect) {
    throw new ApiError(status.UNAUTHORIZED, "🔍❓ Password is incorrect");
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

const forgotPassword = async (payload: { email: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: payload.email },
    include: { profile: true },
  });
  if (!user) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ User not Found");
  }

  const generateOtp = Math.floor(100000 + Math.random() * 900000);

  const emailData: { name?: string; otp: number } = {
    otp: generateOtp,
  };
  if (user.profile?.name) {
    emailData.name = user.profile.name;
  }

  const otpSent = await sendEmail(
    user.email,
    otpEmailTemplate(emailData),
    "Your OTP Code"
  );

  await prisma.otp.upsert({
    where: { email: user.email },
    update: {
      otpToken: generateOtp.toString(),
      updatedAt: new Date(),
    },
    create: {
      email: user.email,
      otpToken: generateOtp.toString(),
    },
  });
  return { message: "OTP sent to your email" };
};

const resetPassword = async (email: string, password: string, otp: string) => {
  console.log("email and password", email, password, otp);

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: email },
  });
  if (!user) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ User not Found");
  }

  const otpData = await prisma.otp.findUniqueOrThrow({
    where: { email: email },
  });
  if (!otp) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ OTP not Found");
  }

  const expireTime = new Date(otpData.updatedAt).getTime() + 1000 * 60 * 5;

  if (Date.now() > expireTime) {
    throw new Error("OTP expired");
  }

  if (otpData.otpToken !== otp) {
    throw new ApiError(status.BAD_REQUEST, "🔍❓ OTP is incorrect");
  }

  const hashedPassword = await argon2.hash(password);
  const updatedUser = await prisma.user.update({
    where: { email: email },
    data: {
      password: hashedPassword,
      passwordChanged: true,
      passwordChangeTime: new Date(),
    },
  });
  return updatedUser;
};
export const AuthServices = {
  loginUser,
  refreshToken,
  forgotPassword,
  resetPassword,
};
