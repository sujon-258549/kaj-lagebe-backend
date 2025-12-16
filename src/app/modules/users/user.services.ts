import * as argon2 from "argon2";
import prisma from "../../utils/prismaClient.js";
import type { Prisma } from "@prisma/client";
import ApiError from "../../middleware/apiError.ts";
import status from "http-status";

// create user

const createUserIntoDB = async (payload: any) => {
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
  console.log(hashedPassword);
  // console.log(payload);
  return payload;
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
  });
  return user?.password ? { ...user, password: undefined } : user;
};

// change password
const changePassword = async (id: string, payload: {oldPassword: string, newPassword: string}) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  if (!user) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ User not Found");
  }
  const isPasswordCorrect = await argon2.verify(user.password, payload.oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(status.UNAUTHORIZED, "🔍❓ Old Password is incorrect");
  }
  const hashedPassword = await argon2.hash(payload.newPassword);
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
  return updatedUser;
};

export const UserServices = {
  createUserIntoDB,
  getUserById,
  getAllUsers,
  updateUser,
  getMyData,
  changePassword,
};
