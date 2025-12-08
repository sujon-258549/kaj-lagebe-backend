import * as argon2 from "argon2";
import prisma from "../../utils/prismaClient.js";
import type { Prisma } from "@prisma/client";

const createUserIntoDB = async (payload: any) => {
  const hashedPassword = await argon2.hash(payload.password);
  const result = await prisma.$transaction(async (tc: Omit<Prisma.TransactionClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) => {
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
        bio: payload.bio,
      },
    });
    return { user, profile, address, workInfo };
  });
  console.log(hashedPassword);
  // console.log(payload);
  return payload;
};

export const UserServices = {
  createUserIntoDB,
};
