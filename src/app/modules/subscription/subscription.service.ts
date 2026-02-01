import { Prisma, PrismaClient } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../middleware/apiError.ts";
import { subscriptionSearchableFields } from "./subscription.constant.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";


const prisma = new PrismaClient();

const createSubscription = async (payload: any) => {
  return await prisma.subscription.create({ data: payload });
};

const getAllSubscription = async (query: any) => {
  const {page,limit,searchTerm,sortBy,sortOrder , ...filter}= query

  const andCondition: Prisma.SubscriptionWhereInput[] = []

  if(searchTerm){
    andCondition.push({
      OR: subscriptionSearchableFields.map((text: string) => ({
        [text]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    })
  }

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const result = await prisma.subscription.findMany({
    where: {
      AND: andCondition,
      ...filter,
    },
    take: limitNumber,
    skip: skip,
    orderBy: {
      [sortByValue]: sortOrderValue,
    },
  });

  const total = await prisma.subscription.count({
    where: {
      AND: andCondition,
      ...filter,
    },
  });

  return {
    data: result,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total: total,
    },
  };
};

const getSubscriptionById = async (id: string) => {
  const result = await prisma.subscription.findFirst({ where: { OR: [{ id: id }, { slug: id }] } });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");
  return result;
};

const updateSubscription = async (id: string, payload: any) => {
  const result = await prisma.subscription.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteSubscription = async (id: string) => {
  await prisma.subscription.delete({ where: { id } });
  return { message: "Subscription deleted successfully" };
};

const updateSubscriptionStatus = async (id: string) => {
  const existingSubscription = await prisma.subscription.findUnique({ where: { id } });
  if (!existingSubscription) throw new ApiError(httpStatus.NOT_FOUND, "Subscription not found");

  const result = await prisma.subscription.update({ where: { id }, data: { status: !existingSubscription.status } });
  return result;
};

export const SubscriptionServices = {
  createSubscription,
  getAllSubscription,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  updateSubscriptionStatus,
};
