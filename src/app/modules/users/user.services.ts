import * as argon2 from "argon2";
import prisma from "../../utils/prismaClient.js";
import type { Prisma } from "@prisma/client";
import ApiError from "../../middleware/apiError.ts";
import status from "http-status";
import { otpEmailTemplate, sendEmail } from "../../utils/sendEmail.ts";

// create user

const createUserIntoDB = async (payload: any) => {
  const existUser = await prisma.user.findUnique({
    where: { mobile: payload.mobile },
  });
  if (
    existUser &&
    existUser.mobile === payload.mobile &&
    existUser.email === payload.email
  ) {
    const generateOtp = Math.floor(100000 + Math.random() * 900000);

    await prisma.otp.upsert({
      where: { email: payload.email },
      update: {
        otpToken: generateOtp.toString(),
        updatedAt: new Date(),
      },
      create: {
        email: payload.email,
        otpToken: generateOtp.toString(),
      },
    });
    await sendEmail(
      payload.email,
      otpEmailTemplate({ otp: generateOtp }),
      "Your OTP Code"
    );
    return { message: "OTP sent to your email" };
  }

  const hashedPassword = await argon2.hash(payload.password);
  const result = await prisma.$transaction(
    async (
      tc: Omit<
        Prisma.TransactionClient,
        | "$connect"
        | "$disconnect"
        | "$on"
        | "$transaction"
        | "$use"
        | "$extends"
      >
    ) => {
      const user = await tc.user.create({
        data: {
          email: payload.email,
          password: hashedPassword,
          mobile: payload.mobile,
          role: payload.role,
        },
      });
      const profile = await tc.profile.create({
        data: {
          mobile: payload.mobile,
          name: payload.name,
          gender: payload.gender,
          age: payload.age,
          dob: payload.dob,
          bloodGroup: payload.bloodGroup,
          photo: payload.photo,
          nid: payload.nid,
          nidPhoto: payload.nidPhoto,
        },
      });
      const address = await tc.address.create({
        data: {
          mobile: payload.mobile,
          division: payload.division,
          district: payload.district,
          upazila: payload.upazila,
          address: payload.address,
        },
      });
      const workInfo = await tc.workInfo.create({
        data: {
          mobile: payload.mobile,
          categories: payload.categories,
          experience: payload.experience,
          workType: payload.workType,
          availableTime: payload.availableTime,
        },
      });
      return { user, profile, address, workInfo };
    }
  );

  const generateOtp = Math.floor(100000 + Math.random() * 900000);

  await prisma.otp.upsert({
    where: { email: payload.email },
    update: {
      otpToken: generateOtp.toString(),
      updatedAt: new Date(),
    },
    create: {
      email: payload.email,
      otpToken: generateOtp.toString(),
    },
  });
  await sendEmail(
    payload.email,
    otpEmailTemplate({ otp: generateOtp }),
    "Your OTP Code"
  );
  console.log(hashedPassword);
  // console.log(payload);
  return result;
};

// get user by id
const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      address: true,
      workInfo: true,
    },
  });
  return user?.password ? { ...user, password: undefined } : user;
};

// get all users
const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      profile: true,
      address: true,
      workInfo: true,
    },
  });

  return users.map(({ password, ...rest }) => rest);
};

// update user
const updateUser = async (id: string, payload: any) => {
  const user = await prisma.user.update({
    where: { id },
    data: payload,
  });
  return user;
};

// get my data

const getMyData = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    include: {
      profile: {
        select: {
          name: true,
          gender: true,
          age: true,
          dob: true,
          bloodGroup: true,
          photo: true,
          nid: true,
        },
      },
      address: true,
      workInfo: true,
    },
  });
  return user?.password ? { ...user, password: undefined } : user;
};

// change password
const changePassword = async (
  payload: { oldPassword: string; newPassword: string },
  id: string
) => {
  console.log(payload, id);

  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ User not Found");
  }

  if (payload.oldPassword === payload.newPassword) {
    throw new ApiError(
      status.BAD_REQUEST,
      "🔍❓ Old Password and New Password cannot be the same"
    );
  }

  const isPasswordCorrect = await argon2.verify(
    user.password,
    payload.oldPassword
  );
  if (!isPasswordCorrect) {
    throw new ApiError(status.UNAUTHORIZED, "🔍❓ Old Password is incorrect");
  }

  const hashedPassword = await argon2.hash(payload.newPassword);
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      password: hashedPassword,
      passwordChanged: true,
      passwordChangeTime: new Date(),
    },
  });
  return updatedUser;
};

const varifyOtp = async (email: string, otp: string) => {
  console.log("otpData", otp);

  const otpData = await prisma.otp.findUniqueOrThrow({
    where: { email: email },
  });
  if (!otpData) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ OTP not Found");
  }

  if (otpData.otpToken !== otp) {
    throw new ApiError(status.BAD_REQUEST, "🔍❓ OTP is incorrect");
  }

  const updatedUser = await prisma.user.update({
    where: { email: email },
    data: { isVerified: true },
  });
  return updatedUser;
};

const deleteUser = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  if (!user) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ User not Found");
  }

  // Delete related records using mobile (since they relate via mobile field)
  await prisma.otp.deleteMany({
    where: { email: user.email },
  });
  await prisma.profile.deleteMany({
    where: { mobile: user.mobile },
  });
  await prisma.address.deleteMany({
    where: { mobile: user.mobile },
  });
  await prisma.workInfo.deleteMany({
    where: { mobile: user.mobile },
  });

  // Finally delete the user by id
  const deletedUser = await prisma.user.delete({
    where: { id },
  });
  return [];
};

export const UserServices = {
  createUserIntoDB,
  getUserById,
  getAllUsers,
  updateUser,
  getMyData,
  changePassword,
  varifyOtp,
  deleteUser,
};
