import * as argon2 from "argon2";
import prisma from "../../utils/prismaClient.js";
import type { Prisma } from "@prisma/client";
import ApiError from "../../middleware/apiError.js";
import status from "http-status";
import { otpEmailTemplate, sendEmail } from "../../utils/sendEmail.js";
import { JwtHelpers } from "../../utils/jwtHelpers.js";
import config from "../../config/index.js";
import { userSearchableFields } from "./user.constant.js";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.js";
import { MediaServices } from "../media/media.service.js";
import slugCreate from "../../utils/slugCreate.js";

// create user

/**
 * Create a new user with associated profile, address, and work information.
 * This function follows a professional enterprise pattern including:
 * 1. Transactional integrity
 * 2. Automatic role assignment
 * 3. Media library integration for profile and NID photos
 * 4. Automatic JWT generation for instant login after registration
 */
const createUserIntoDB = async (payload: any) => {
  const { user, profile, address, workInfo } = payload;

  // Hash password using argon2 for secure storage
  const hashedPassword = await argon2.hash(user.password);

  try {
    const result = await prisma.$transaction(async (tc) => {
      // 1. Role Management: Resolve Role ID
      let targetRoleId = user.roleId;

      if (!targetRoleId) {
        // Default to "USER" role if not explicitly provided
        const defaultRole = await tc.allRole.upsert({
          where: { role: "USER" },
          update: {},
          create: {
            role: "USER",
            description: "Default User Account",
          },
        });
        targetRoleId = defaultRole.id;
      }

      // 2. User Creation: Create base user record
      const newUser = await tc.user.create({
        data: {
          ...user,
          roleId: targetRoleId,
          password: hashedPassword,
          createdById: user.createdById,
        },
      });

      // 3. Media Folder Management: Ensure destination folder exists
      const mediaFolder = await tc.folder.upsert({
        where: { slug: "userimage" },
        update: {},
        create: {
          name: "User Images",
          slug: "userimage",
        },
      });

      // 4. Profile Management: Handle profile details and images
      if (profile) {
        const {
          dob,
          age,
          photo,
          profilePhoto,
          nidPhoto,
          nidPhotoUrls,
          nidPhotoIds,
          ...profileRest
        } = profile;

        // Extract image data from multiple possible payload structures
        const targetPhotoUrl = photo || profilePhoto;
        const targetNidUrls = nidPhoto || nidPhotoUrls || [];

        // Register Profile Photo in Media Library
        let finalPhotoId = undefined;
        if (targetPhotoUrl && typeof targetPhotoUrl === "string" && targetPhotoUrl.startsWith("http")) {
          const registeredImage = await tc.image.create({
            data: {
              name: `${profile.name || "User"}-profile`,
              url: targetPhotoUrl,
              slug: slugCreate(`${profile.name || "User"}-profile-${Date.now()}`),
              folderId: mediaFolder.id,
            },
          });
          finalPhotoId = registeredImage.id;
        }

        // Register NID Photos in Media Library
        const finalNidIds: string[] = nidPhotoIds || [];
        if (Array.isArray(targetNidUrls)) {
          for (const [index, url] of targetNidUrls.entries()) {
            if (typeof url === "string" && url.startsWith("http")) {
              const registeredNid = await tc.image.create({
                data: {
                  name: `${profile.name || "User"}-nid-${index + 1}`,
                  url: url,
                  slug: slugCreate(`${profile.name || "User"}-nid-${index + 1}-${Date.now()}`),
                  folderId: mediaFolder.id,
                },
              });
              finalNidIds.push(registeredNid.id);
            }
          }
        }

        // Create Profile record linked via mobile
        await tc.profile.create({
          data: {
            ...profileRest,
            dob: dob ? new Date(dob) : undefined,
            age: age ? Number(age) : undefined,
            mobile: user.mobile,
            photo: typeof targetPhotoUrl === "string" ? targetPhotoUrl : undefined,
            photoId: finalPhotoId,
            nidPhoto: targetNidUrls,
            nidPhotos: finalNidIds.length > 0 ? {
              connect: finalNidIds.map((id: string) => ({ id })),
            } : undefined,
          },
        });
      }

      // 5. Address Management
      if (address) {
        await tc.address.create({
          data: {
            ...address,
            mobile: user.mobile,
          },
        });
      }

      // 6. Work Information Management (Service Provider specific)
      if (workInfo) {
        const { subCategoryIds, workTypeIds, ...workInfoRest } = workInfo;
        await tc.workInfo.create({
          data: {
            ...workInfoRest,
            mobile: user.mobile,
            subCategories: subCategoryIds && subCategoryIds.length > 0 ? {
              connect: subCategoryIds.map((id: string) => ({ id })),
            } : undefined,
            workTypes: workTypeIds && workTypeIds.length > 0 ? {
              connect: workTypeIds.map((id: string) => ({ id })),
            } : undefined,
          },
        });
      }

      // 7. Final Data Retrieval: Fetch complete user object for response
      return await tc.user.findUnique({
        where: { id: newUser.id },
        include: {
          role: true,
          department: true,
          profile: {
            include: {
              profilePhoto: true,
              nidPhotos: true,
            },
          },
          address: true,
          workInfo: {
            include: {
              subCategories: true,
              workTypes: true,
            },
          },
        },
      });
    });

    if (result) {
      const { password, ...userWithoutPassword } = result as any;

      // 8. Automatic Post-Registration Login: Generate JWTs
      const tokenPayload = {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        role: userWithoutPassword.role?.role,
        mobile: userWithoutPassword.mobile,
        isActive: userWithoutPassword.isActive,
        isBlocked: userWithoutPassword.isBlocked,
        isDeleted: userWithoutPassword.isDeleted,
        isVerified: userWithoutPassword.isVerified,
      };

      const accessToken = JwtHelpers.generateToken(
        tokenPayload,
        config.accessSecret as string,
        config.accessExpire as string,
      );

      const refreshToken = JwtHelpers.generateToken(
        tokenPayload,
        config.refreshSecret as string,
        config.refreshExpire as string,
      );

      return {
        accessToken,
        refreshToken,
        user: userWithoutPassword,
      };
    }

    return result;
  } catch (error: any) {
    // Standardized Error Handling for Prisma Constraints
    if (error.code === "P2002") {
      const target = error.meta?.target;
      let fieldMessage = "";
      
      if (Array.isArray(target)) {
        fieldMessage = `(${target.join(", ")})`;
      } else if (typeof target === "string") {
        fieldMessage = `(${target})`;
      }

      // Check for common fields manually in the message if target is missing
      const errorMessage = error.message || "";
      if (errorMessage.includes("email")) {
        throw new ApiError(status.CONFLICT, "এই ইমেইলটি অলরেডি ব্যবহৃত হয়েছে।");
      }
      if (errorMessage.includes("mobile")) {
        throw new ApiError(status.CONFLICT, "এই মোবাইল নম্বরটি অলরেডি ব্যবহৃত হয়েছে।");
      }

      throw new ApiError(
        status.CONFLICT, 
        `Data Conflict: এই ডাটাটি অলরেডি ডাটাবেসে আছে। ${fieldMessage}`
      );
    }
    
    console.error("Critical User Creation Failure:", error);
    throw new ApiError(status.BAD_REQUEST, error.message || "An unexpected error occurred during user creation.");
  }
};

// get all users
const getAllUsers = async (query: any) => {
  const { searchTerm, page, limit, sortBy, sortOrder, ...queryFilter } = query;

  const andCondition: Prisma.UserWhereInput[] = [];
  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  if (query.searchTerm) {
    andCondition.push({
      OR: userSearchableFields.map((text: string) => ({
        [text]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  const booleanFields = ["isBlocked", "isDeleted", "isVerified", "isActive"];
  booleanFields.forEach((field) => {
    if (queryFilter[field]) {
      queryFilter[field] = queryFilter[field] === "true";
    }
  });

  // Role filtering logic
  if (queryFilter.role) {
    andCondition.push({
      role: {
        role: {
          equals: String(queryFilter.role),
          mode: "insensitive"
        }
      },
    });
  } else {
    // If NO role is specified, exclude USER role by default (e.g. for Employee List)
    andCondition.push({
      role: {
        role: {
          not: "USER",
        },
      },
    });
  }
  delete queryFilter.role;

  // Brand user filter logic
  if (queryFilter.isBrandUser) {
    andCondition.push({
      tenantId: {
        not: null,
      },
    });
    delete queryFilter.isBrandUser;
  }

  // queryFilter
  if (Object.keys(queryFilter).length > 0) {
    andCondition.push({
      AND: Object.keys(queryFilter).map((key: string) => ({
        [key]: {
          equals: queryFilter[key as keyof typeof queryFilter],
        },
      })),
    });
  }

  const whereCondition: Prisma.UserWhereInput = {
    AND: andCondition,
  };

  const total = await prisma.user.count({
    where: whereCondition,
  });

  const users = await prisma.user.findMany({
    where: whereCondition,
    ...(page ? { skip, take: limitNumber } : {}),
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
    // skip: (Number(query.page) - 1) * Number(query.limit),
    // take: Number(query.limit),
    include: {
      role: {
        select: {
          id: true,
          role: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          email: true,
          profile: {
            select: { name: true }
          }
        }
      },
      department: {
        select: {
          id: true,
          name: true,
        },
      },
      profile: {
        include: {
          profilePhoto: {
            select: {
              id: true,
              url: true,
            },
          },
          nidPhotos: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      },
      address: true,
      workInfo: {
        include: {
          subCategories: {
            select: {
              id: true,
              name: true,
            },
          },
          workTypes: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return {
    data: users.map(({ password, ...rest }) => rest),
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total: total,
    },
  };
};

// get user by id
const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      role: {
        include: {
          permissions: {
        select: {
              module: true,
              permissions: true,
            },
          },
        },
      },
      createdBy: {
        select: {
          id: true,
          email: true,
          profile: {
            select: { name: true }
          }
        }
      },
      department: {
        select: {
          id: true,
          name: true,
        },
      },
      profile: {
        include: {
          profilePhoto: {
            select: {
              id: true,
              url: true,
            },
          },
          nidPhotos: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      },
      address: true,
      workInfo: {
        include: {
          subCategories: {
            select: {
              id: true,
              name: true,
            },
          },
          workTypes: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  return user?.password ? { ...user, password: undefined } : user;
};

// get all users

// update user
const updateUser = async (id: string, payload: any) => {
  const { user, profile, address, workInfo } = payload;
  const { password, role, ...rest } = user || {};

  const updateData: Record<string, unknown> = {};
  const userScalarKeys = [
    "email",
    "mobile",
    "isActive",
    "isBlocked",
    "isDeleted",
    "isVerified",
    "departmentId",
    "subscriptionId",
    "tenantId",
  ] as const;
  for (const k of userScalarKeys) {
    if (rest[k] !== undefined) updateData[k] = rest[k];
  }
  if (rest.createdAt) updateData.createdAt = new Date(rest.createdAt);
  if (rest.updatedAt) updateData.updatedAt = new Date(rest.updatedAt);

  // Handle case where fields might be directly in payload instead of user object
  if (!user) {
    for (const k of userScalarKeys) {
      if (payload[k] !== undefined) updateData[k] = payload[k];
    }
  }

  if (password) {
    updateData.password = await argon2.hash(password);
    updateData.passwordChanged = true;
    updateData.passwordChangeTime = new Date();
  }

  if (role) {
    const r = await prisma.allRole.findFirst({
      where: { role: String(role).toUpperCase() },
    });
    if (r) updateData.roleId = r.id;
  }

  // Prepare workInfo update/create
  let workInfoUpdate = undefined;
  if (workInfo) {
    const { subCategoryIds, workTypeIds, ...workInfoRest } = workInfo;
    workInfoUpdate = {
      update: {
        ...workInfoRest,
        subCategories: subCategoryIds ? { set: subCategoryIds.map((id: string) => ({ id })) } : undefined,
        workTypes: workTypeIds ? { set: workTypeIds.map((id: string) => ({ id })) } : undefined,
      },
      create: {
        ...workInfoRest,
        subCategories: subCategoryIds ? { connect: subCategoryIds.map((id: string) => ({ id })) } : undefined,
        workTypes: workTypeIds ? { connect: workTypeIds.map((id: string) => ({ id })) } : undefined,
      }
    };
  }

  // Prepare profile update/create
  let profileUpdate = undefined;
  if (profile) {
    const { dob, age, photoId, nidPhotoIds, nidPhotoUrls, ...profileRest } = profile;
    
    const commonData = {
      ...profileRest,
      dob: dob ? new Date(dob) : undefined,
      age: age ? Number(age) : undefined,
      nidPhoto: nidPhotoUrls || [],
      profilePhoto: photoId ? { connect: { id: photoId } } : undefined,
    };

    profileUpdate = {
      update: {
        ...commonData,
        nidPhotos: nidPhotoIds ? { set: nidPhotoIds.map((id: string) => ({ id })) } : undefined,
      },
      create: {
        ...commonData,
        nidPhotos: nidPhotoIds ? { connect: nidPhotoIds.map((id: string) => ({ id })) } : undefined,
      }
    };
  }

  const finalUpdateData: any = {
    ...updateData,
    profile: profileUpdate
      ? {
          upsert: {
            update: profileUpdate.update,
            create: profileUpdate.create,
          },
        }
      : undefined,
    address: address
      ? {
          upsert: {
            update: address,
            create: address,
          },
        }
      : undefined,
    workInfo: workInfoUpdate
      ? {
          upsert: {
            update: workInfoUpdate.update,
            create: workInfoUpdate.create,
          },
        }
      : undefined,
  };

  // Remove undefined keys to satisfy exactOptionalPropertyTypes: true
  Object.keys(finalUpdateData).forEach(
    (key) => finalUpdateData[key] === undefined && delete finalUpdateData[key],
  );

  try {
    const result = await prisma.user.update({
      where: { id },
      data: finalUpdateData,
      include: {
        role: {
          select: {
            id: true,
            role: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        profile: {
          include: {
            profilePhoto: {
              select: {
                id: true,
                url: true,
              },
            },
            nidPhotos: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
        address: true,
        workInfo: {
          include: {
            subCategories: {
              select: {
                id: true,
                name: true,
              },
            },
            workTypes: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return result;
  } catch (error: any) {
    if (error.code === "P2002") {
      const target = error.meta?.target || [];
      if (target.includes("email")) {
        throw new ApiError(status.CONFLICT, "Email is already taken by another user.");
      }
      if (target.includes("mobile")) {
        throw new ApiError(status.CONFLICT, "Mobile number is already taken by another user.");
      }
    }
    throw new ApiError(status.BAD_REQUEST, error.message || "Failed to update user profile");
  }
};

// get my data

const getMyData = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    include: {
      role: {
        include: {
          permissions: {
            select: {
              module: true,
              permissions: true,
            },
          },
        },
      },
      department: {
        select: {
          id: true,
          name: true,
        },
      },
      profile: {
        include: {
          profilePhoto: {
            select: {
              id: true,
              url: true,
            },
          },
          nidPhotos: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      },
      address: true,
      workInfo: {
        include: {
          subCategories: {
            select: {
              id: true,
              name: true,
            },
          },
          workTypes: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  const result: any = user?.password ? { ...user, password: undefined } : user;

  if (result?.role?.permissions) {
    result.role.permissions = result.role.permissions.filter(
      (p: any) => p.permissions.length > 0,
    );
  }

  return result;
};

// change password
const changePassword = async (
  payload: { oldPassword: string; newPassword: string },
  id: string,
) => {
  console.log(payload, id);

  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    include: {
      role: true,
      profile: {
        include: {
          profilePhoto: true,
        },
      },
      workInfo: {
        include: {
          subCategories: true,
          workTypes: true,
        },
      },
      department: true,
      address: true,
    },
  });

  if (!user) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ User not Found");
  }

  if (payload.oldPassword === payload.newPassword) {
    throw new ApiError(
      status.BAD_REQUEST,
      "🔍❓ Old Password and New Password cannot be the same",
    );
  }

  const isPasswordCorrect = await argon2.verify(
    user.password,
    payload.oldPassword,
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
    include: {
      role: true,
      profile: {
        include: {
          profilePhoto: true,
        },
      },
      workInfo: {
        include: {
          subCategories: true,
          workTypes: true,
        },
      },
      department: true,
      address: true,
    },
  });

  const payloadData = {
    id: updatedUser.id,
    email: updatedUser.email,
    role: updatedUser.role?.role,
    mobile: updatedUser.mobile,
    isBlocked: updatedUser.isBlocked,
    isDeleted: updatedUser.isDeleted,
    isVerified: updatedUser.isVerified,
    isActive: updatedUser.isActive,
    passwordChanged: updatedUser.passwordChanged,
    passwordChangeTime: updatedUser.passwordChangeTime,
    lastLogin: updatedUser.lastLogin,
  };

  const accessToken = JwtHelpers.generateToken(
    payloadData,
    config.accessSecret as string,
    config.accessExpire as string,
  );
  const refreshToken = JwtHelpers.generateToken(
    payloadData,
    config.refreshSecret as string,
    config.refreshExpire as string,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      name: updatedUser.profile?.name,
      photo: updatedUser.profile?.profilePhoto?.url,
      role: updatedUser.role?.role,
      gender: updatedUser.profile?.gender,
      bloodGroup: updatedUser.profile?.bloodGroup,
      age: updatedUser.profile?.age,
      designation: updatedUser.workInfo?.experience,
      department: updatedUser.department?.name,
      address: updatedUser.address,
      workInfo: {
        ...updatedUser.workInfo,
        subCategories: updatedUser.workInfo?.subCategories?.map((s) => s.name),
        workTypes: updatedUser.workInfo?.workTypes?.map((w) => w.name),
      },
      isActive: updatedUser.isActive,
      isVerified: updatedUser.isVerified,
      isBlocked: updatedUser.isBlocked,
      isDeleted: updatedUser.isDeleted,
    },
    isLogin: true,
  };
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

const softDeleteUser = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  if (!user) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ User not Found");
  }

  const deletedUser = await prisma.user.update({
    where: { id },
    data: { isDeleted: true },
  });
  return deletedUser;
};

const blockUser = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });
  if (!user) {
    throw new ApiError(status.NOT_FOUND, "🔍❓ User not Found");
  }

  const deletedUser = await prisma.user.update({
    where: { id },
    data: { isBlocked: !user.isBlocked },
  });
  return deletedUser;
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
  softDeleteUser,
  blockUser,
};
