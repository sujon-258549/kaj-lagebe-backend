import prisma from "../../utils/prismaClient.ts";
import slugCreate from "../../utils/slugCreate.ts";

const createTenant = async (payload: any) => {
  const slug = payload.slug || slugCreate(payload.name);
  const result = await prisma.tenant.create({
    data: {
      ...payload,
      slug,
    },
  });
  return result;
};

const getAllTenants = async (query: any) => {
  const { page = 1, limit = 10, searchTerm } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const whereCondition = searchTerm
    ? {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" as any } },
          { email: { contains: searchTerm, mode: "insensitive" as any } },
        ],
      }
    : {};

  const result = await prisma.tenant.findMany({
    where: whereCondition,
    skip,
    take: Number(limit),
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { users: true, jobs: true },
      },
    },
  });

  const total = await prisma.tenant.count({ where: whereCondition });

  return {
    data: result,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
  };
};

const getTenantById = async (id: string) => {
  return await prisma.tenant.findUnique({
    where: { id },
    include: {
      users: { select: { id: true, email: true, profile: true } },
      jobs: true,
    },
  });
};

const updateTenant = async (id: string, payload: any) => {
  if (payload.name) {
    payload.slug = payload.slug || slugCreate(payload.name);
  }
  return await prisma.tenant.update({
    where: { id },
    data: payload,
  });
};

const deleteTenant = async (id: string) => {
  return await prisma.tenant.delete({
    where: { id },
  });
};

export const TenantServices = {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
};
